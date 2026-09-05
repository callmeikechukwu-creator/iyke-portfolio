/**
 * Iyke Storage Gateway
 * ============================================================
 * Centralized Edge Media Storage & CDN API built on Cloudflare R2 & KV.
 * Provides project isolation, dynamic SHA-256 API key management,
 * metadata storage, and edge CDN delivery.
 * ============================================================
 */

export interface Env {
  STORAGE_BUCKET: R2Bucket;
  STORAGE_KEYS_KV?: KVNamespace;
  ROOT_ADMIN_SECRET?: string;
  IYKE_STORAGE_KEYS?: string;
  DEFAULT_CDN_HOST?: string;
}

export interface ProjectScope {
  id?: string;
  project: string;
  name: string;
  permissions: string[]; // ["read", "write", "delete"]
  allowedFolders: string[]; // ["*"] or ["brand", "projects"]
  cdnHost?: string; // Optional custom CDN domain for this specific project
}

export interface StoredKeyRecord {
  id: string;
  name: string;
  project: string;
  prefix: string;
  permissions: string[];
  allowedFolders: string[];
  cdnHost?: string;
  createdAt: string;
  lastUsedAt?: string;
  hash: string;
}

// Default development key if no KV or env is configured yet
const DEFAULT_DEV_KEYS: Record<string, ProjectScope> = {
  "ik_live_portfolio_master": {
    id: "key_dev_master",
    project: "iyke-portfolio",
    name: "Portfolio Master",
    permissions: ["read", "write", "delete"],
    allowedFolders: ["*"],
  },
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, x-project, x-folder, x-tags, x-alt, x-width, x-height, x-blur, x-root-secret",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

/**
 * SHA-256 key hashing utility
 */
async function hashKey(rawKey: string): Promise<string> {
  const data = new TextEncoder().encode(rawKey);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isRootAdmin(request: Request, env: Env): boolean {
  const authHeader = request.headers.get("Authorization");
  const xRootSecret = request.headers.get("x-root-secret");
  const configuredSecret = env.ROOT_ADMIN_SECRET || "ik_root_master_7f8e9a2b1c4d";

  if (xRootSecret && xRootSecret.trim() === configuredSecret) {
    return true;
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === configuredSecret) {
      return true;
    }
  }

  return false;
}

/**
 * Authenticate incoming request dynamically against Cloudflare KV or fallback
 */
async function authenticate(
  request: Request,
  env: Env,
  ctx?: ExecutionContext
): Promise<{ authorized: boolean; scope?: ProjectScope; error?: string }> {
  const authHeader = request.headers.get("Authorization");
  const apiKeyHeader = request.headers.get("x-api-key");
  const url = new URL(request.url);
  const queryKey = url.searchParams.get("key");

  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else if (apiKeyHeader) {
    token = apiKeyHeader.trim();
  } else if (queryKey) {
    token = queryKey.trim();
  }

  if (!token) {
    return { authorized: false, error: "Missing API key in Authorization header or x-api-key" };
  }

  // 1. Check legacy dev master key for backward compatibility
  if (token === "ik_live_portfolio_master") {
    return {
      authorized: true,
      scope: {
        id: "key_dev_master",
        project: "iyke-portfolio",
        name: "Portfolio Master (Default)",
        permissions: ["read", "write", "delete"],
        allowedFolders: ["*"],
      },
    };
  }

  // 2. Check dynamic keys in Cloudflare KV via SHA-256 hash
  if (env.STORAGE_KEYS_KV) {
    const hashed = await hashKey(token);
    const keyDataStr = await env.STORAGE_KEYS_KV.get(`key:${hashed}`);

    if (keyDataStr) {
      try {
        const record = JSON.parse(keyDataStr) as StoredKeyRecord;

        // Async update lastUsedAt without blocking response
        if (ctx) {
          ctx.waitUntil(
            (async () => {
              record.lastUsedAt = new Date().toISOString();
              await env.STORAGE_KEYS_KV!.put(`key:${hashed}`, JSON.stringify(record));
            })()
          );
        }

        return {
          authorized: true,
          scope: {
            id: record.id,
            project: record.project,
            name: record.name,
            permissions: record.permissions || ["read", "write"],
            allowedFolders: record.allowedFolders || ["*"],
            cdnHost: record.cdnHost,
          },
        };
      } catch (err) {
        console.error("Failed to parse key record from KV", err);
      }
    }
  }

  // 3. Fallback: Check environment JSON if provided
  if (env.IYKE_STORAGE_KEYS) {
    try {
      const keys = JSON.parse(env.IYKE_STORAGE_KEYS);
      if (keys[token]) {
        return {
          authorized: true,
          scope: {
            ...keys[token],
            permissions: keys[token].permissions || ["read", "write"],
            allowedFolders: keys[token].allowedFolders || ["*"],
          },
        };
      }
    } catch {}
  }

  return { authorized: false, error: "Invalid or revoked API key" };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // 2. Health check
    if (pathname === "/" || pathname === "/health") {
      return jsonResponse({
        status: "ok",
        service: "iyke-storage-gateway",
        version: "2.0.0",
        engine: "Cloudflare Workers + R2 + KV",
        bucket: "iyke-cloud",
        dynamicKeysSupported: !!env.STORAGE_KEYS_KV,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Public Edge CDN Delivery (/cdn/*) - Zero Auth required for public assets
    if (pathname.startsWith("/cdn/")) {
      return handleCdnDelivery(request, env, pathname.replace(/^\/cdn\//, ""));
    }

    // 4. Root Admin API Endpoints for Dynamic Key Management (/v1/admin/keys)
    if (pathname.startsWith("/v1/admin/keys")) {
      if (!isRootAdmin(request, env)) {
        return jsonResponse({ success: false, error: "Unauthorized: Invalid root administrator secret" }, 401);
      }

      if (pathname === "/v1/admin/keys" && request.method === "POST") {
        return handleAdminCreateKey(request, env);
      }

      if (pathname === "/v1/admin/keys" && request.method === "GET") {
        return handleAdminListKeys(env);
      }

      if (pathname.startsWith("/v1/admin/keys/") && request.method === "DELETE") {
        const keyId = decodeURIComponent(pathname.replace(/^\/v1\/admin\/keys\//, ""));
        return handleAdminRevokeKey(env, keyId);
      }

      return jsonResponse({ success: false, error: "Method not allowed for admin keys" }, 405);
    }

    // 5. Project-Authenticated Storage Endpoints
    const auth = await authenticate(request, env, ctx);
    if (!auth.authorized || !auth.scope) {
      return jsonResponse({ success: false, error: auth.error }, 401);
    }
    const scope = auth.scope;

    // --- Endpoint: POST /v1/upload ---
    if (pathname === "/v1/upload" && request.method === "POST") {
      if (!scope.permissions.includes("write")) {
        return jsonResponse({ success: false, error: "Forbidden: API key does not have write permission" }, 403);
      }
      return handleUpload(request, env, scope);
    }

    // --- Endpoint: GET /v1/files ---
    if (pathname === "/v1/files" && request.method === "GET") {
      if (!scope.permissions.includes("read")) {
        return jsonResponse({ success: false, error: "Forbidden: API key does not have read permission" }, 403);
      }
      return handleListFiles(request, env, scope);
    }

    // --- Endpoint: DELETE /v1/files/* ---
    if (pathname.startsWith("/v1/files/") && request.method === "DELETE") {
      if (!scope.permissions.includes("delete")) {
        return jsonResponse({ success: false, error: "Forbidden: API key does not have delete permission" }, 403);
      }
      const keyToDelete = decodeURIComponent(pathname.replace(/^\/v1\/files\//, ""));
      return handleDeleteFile(env, scope, keyToDelete);
    }

    return jsonResponse({ success: false, error: "Route not found" }, 404);
  },
};

/**
 * Admin: Issue a new dynamic API key
 */
async function handleAdminCreateKey(request: Request, env: Env): Promise<Response> {
  if (!env.STORAGE_KEYS_KV) {
    return jsonResponse({ success: false, error: "STORAGE_KEYS_KV namespace not bound" }, 500);
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: "Invalid JSON body" }, 400);
  }

  const project = (body.project || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const name = (body.name || "").trim();
  const permissions = Array.isArray(body.permissions) && body.permissions.length > 0
    ? body.permissions
    : ["read", "write", "delete"];
  const allowedFolders = Array.isArray(body.allowedFolders) && body.allowedFolders.length > 0
    ? body.allowedFolders
    : ["*"];
  const cdnHost = body.cdnHost ? String(body.cdnHost).trim() : undefined;

  if (!project) {
    return jsonResponse({ success: false, error: "Project name is required (alphanumeric, dashes, underscores)" }, 400);
  }
  if (!name) {
    return jsonResponse({ success: false, error: "Key descriptive name is required" }, 400);
  }

  // Generate a cryptographically random raw API key
  const randomEntropy = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").substring(0, 8);
  const rawKey = `ik_live_${project}_${randomEntropy}`;

  const keyId = `key_${crypto.randomUUID().replace(/-/g, "").substring(0, 12)}`;
  const hashed = await hashKey(rawKey);

  // Safe display prefix: e.g. ik_live_saas_...3f8a
  const prefix = `${rawKey.substring(0, Math.min(rawKey.indexOf("_", 8) + 5, rawKey.length - 6))}...${rawKey.slice(-4)}`;

  const record: StoredKeyRecord = {
    id: keyId,
    name,
    project,
    prefix,
    permissions,
    allowedFolders,
    cdnHost,
    createdAt: new Date().toISOString(),
    hash: hashed,
  };

  // 1. Store hashed key record
  await env.STORAGE_KEYS_KV.put(`key:${hashed}`, JSON.stringify(record));

  // 2. Add to key index list
  const indexStr = await env.STORAGE_KEYS_KV.get("keys:index");
  let indexList: StoredKeyRecord[] = [];
  if (indexStr) {
    try {
      indexList = JSON.parse(indexStr);
    } catch {}
  }
  indexList.unshift(record);
  await env.STORAGE_KEYS_KV.put("keys:index", JSON.stringify(indexList));

  // Return the raw key ONLY ONCE
  return jsonResponse({
    success: true,
    message: "Dynamic API key successfully generated. Copy and store this secret safely; it will never be displayed again.",
    apiKey: rawKey,
    key: {
      id: record.id,
      name: record.name,
      project: record.project,
      prefix: record.prefix,
      permissions: record.permissions,
      allowedFolders: record.allowedFolders,
      cdnHost: record.cdnHost,
      createdAt: record.createdAt,
    },
  }, 201);
}

/**
 * Admin: List all active keys (safe view without revealing raw secrets)
 */
async function handleAdminListKeys(env: Env): Promise<Response> {
  if (!env.STORAGE_KEYS_KV) {
    return jsonResponse({ success: false, error: "STORAGE_KEYS_KV namespace not bound" }, 500);
  }

  const indexStr = await env.STORAGE_KEYS_KV.get("keys:index");
  let indexList: StoredKeyRecord[] = [];
  if (indexStr) {
    try {
      indexList = JSON.parse(indexStr);
    } catch {}
  }

  // Include dev master key in the list representation
  const devKeyEntry = {
    id: "key_dev_master",
    name: "Portfolio Master (Default)",
    project: "iyke-portfolio",
    prefix: "ik_live_portfolio_master",
    permissions: ["read", "write", "delete"],
    allowedFolders: ["*"],
    createdAt: "2026-09-01T00:00:00.000Z",
    isDevDefault: true,
  };

  const safeKeys = [
    devKeyEntry,
    ...indexList.map((k) => ({
      id: k.id,
      name: k.name,
      project: k.project,
      prefix: k.prefix,
      permissions: k.permissions,
      allowedFolders: k.allowedFolders,
      cdnHost: k.cdnHost,
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
    })),
  ];

  return jsonResponse({
    success: true,
    count: safeKeys.length,
    keys: safeKeys,
  });
}

/**
 * Admin: Revoke an API key
 */
async function handleAdminRevokeKey(env: Env, keyId: string): Promise<Response> {
  if (!env.STORAGE_KEYS_KV) {
    return jsonResponse({ success: false, error: "STORAGE_KEYS_KV namespace not bound" }, 500);
  }

  const indexStr = await env.STORAGE_KEYS_KV.get("keys:index");
  let indexList: StoredKeyRecord[] = [];
  if (indexStr) {
    try {
      indexList = JSON.parse(indexStr);
    } catch {}
  }

  const targetIndex = indexList.findIndex((k) => k.id === keyId);
  if (targetIndex === -1) {
    return jsonResponse({ success: false, error: "Key not found" }, 404);
  }

  const target = indexList[targetIndex];

  // 1. Delete key from KV lookup
  await env.STORAGE_KEYS_KV.delete(`key:${target.hash}`);

  // 2. Remove from index list
  indexList.splice(targetIndex, 1);
  await env.STORAGE_KEYS_KV.put("keys:index", JSON.stringify(indexList));

  return jsonResponse({
    success: true,
    message: `API key '${target.name}' (${target.id}) has been permanently revoked.`,
    revokedId: keyId,
  });
}

/**
 * Handle direct file upload with dynamic metadata
 */
async function handleUpload(request: Request, env: Env, scope: ProjectScope): Promise<Response> {
  const contentType = request.headers.get("content-type") || "";
  let fileBuffer: ArrayBuffer | null = null;
  let filename = "";
  let folder = "general";
  let mime = "application/octet-stream";
  let tags = "";
  let alt = "";
  let width = "";
  let height = "";
  let blurDataURL = "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return jsonResponse({ success: false, error: "No file provided in form-data ('file' field)" }, 400);
    }

    fileBuffer = await file.arrayBuffer();
    filename = file.name;
    mime = file.type || mime;
    folder = (formData.get("folder") as string) || folder;
    tags = (formData.get("tags") as string) || "";
    alt = (formData.get("alt") as string) || "";
    width = (formData.get("width") as string) || "";
    height = (formData.get("height") as string) || "";
    blurDataURL = (formData.get("blurDataURL") as string) || "";
  } else {
    // Binary stream upload via headers
    fileBuffer = await request.arrayBuffer();
    filename = request.headers.get("x-filename") || `file_${Date.now()}`;
    mime = request.headers.get("content-type") || mime;
    folder = request.headers.get("x-folder") || folder;
    tags = request.headers.get("x-tags") || "";
    alt = request.headers.get("x-alt") || "";
    width = request.headers.get("x-width") || "";
    height = request.headers.get("x-height") || "";
    blurDataURL = request.headers.get("x-blur") || "";
  }

  if (!fileBuffer || fileBuffer.byteLength === 0) {
    return jsonResponse({ success: false, error: "Empty file received" }, 400);
  }

  // Validate folder permission
  const sanitizedFolder = folder.replace(/^\/+|\/+$/g, "").toLowerCase();
  const rootFolder = sanitizedFolder.split("/")[0];
  const allowsAll = scope.allowedFolders.includes("*");
  if (!allowsAll && !scope.allowedFolders.includes(rootFolder)) {
    return jsonResponse(
      {
        success: false,
        error: `Folder '${rootFolder}' is not permitted for project '${scope.project}'. Allowed: ${scope.allowedFolders.join(", ")}`,
      },
      403
    );
  }

  // Sanitize filename
  const cleanFilename = filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");

  // Canonical storage key: <project>/<folder>/<cleanFilename>
  const objectKey = `${scope.project}/${sanitizedFolder}/${cleanFilename}`;

  // Custom HTTP Metadata for R2
  const customMetadata: Record<string, string> = {
    project: scope.project,
    folder: sanitizedFolder,
    filename: cleanFilename,
    uploadedAt: new Date().toISOString(),
    size: fileBuffer.byteLength.toString(),
  };

  if (tags) customMetadata.tags = tags;
  if (alt) customMetadata.alt = alt;
  if (width) customMetadata.width = width;
  if (height) customMetadata.height = height;
  if (blurDataURL) customMetadata.blurDataURL = blurDataURL;

  // Upload to R2
  await env.STORAGE_BUCKET.put(objectKey, fileBuffer, {
    httpMetadata: {
      contentType: mime,
      cacheControl: "public, max-age=31536000, immutable",
    },
    customMetadata,
  });

  // Dynamically determine CDN host (Project-specific > Env override > Request origin)
  const requestOrigin = new URL(request.url).origin;
  const cdnHost = (scope.cdnHost || env.DEFAULT_CDN_HOST || requestOrigin).replace(/\/+$/, "");
  const directCdnUrl = `${cdnHost}/cdn/${objectKey}`;

  return jsonResponse(
    {
      success: true,
      data: {
        key: objectKey,
        cdnUrl: directCdnUrl,
        gatewayUrl: `/cdn/${objectKey}`,
        filename: cleanFilename,
        size: fileBuffer.byteLength,
        contentType: mime,
        metadata: customMetadata,
        uploadedAt: customMetadata.uploadedAt,
      },
    },
    201
  );
}

/**
 * List files scoped to the authorized project
 */
async function handleListFiles(request: Request, env: Env, scope: ProjectScope): Promise<Response> {
  const url = new URL(request.url);
  const folder = url.searchParams.get("folder") || "";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 100);
  const cursor = url.searchParams.get("cursor") || undefined;
  const tagFilter = url.searchParams.get("tag")?.toLowerCase();

  // Prefix constraint: always scoped to the project!
  const prefix = folder
    ? `${scope.project}/${folder.replace(/^\/+|\/+$/g, "")}/`
    : `${scope.project}/`;

  const listed = await env.STORAGE_BUCKET.list({
    prefix,
    limit,
    cursor,
    include: ["customMetadata", "httpMetadata"],
  });

  const requestOrigin = new URL(request.url).origin;
  const cdnHost = (scope.cdnHost || env.DEFAULT_CDN_HOST || requestOrigin).replace(/\/+$/, "");

  let files = listed.objects.map((obj) => ({
    key: obj.key,
    cdnUrl: `${cdnHost}/cdn/${obj.key}`,
    gatewayUrl: `/cdn/${obj.key}`,
    size: obj.size,
    etag: obj.etag,
    uploadedAt: obj.uploaded.toISOString(),
    contentType: obj.httpMetadata?.contentType || "application/octet-stream",
    metadata: obj.customMetadata || {},
  }));

  // Optional tag filter
  if (tagFilter) {
    files = files.filter((f) => {
      const tags = (f.metadata.tags || "").toLowerCase().split(",");
      return tags.some((t: string) => t.trim() === tagFilter);
    });
  }

  return jsonResponse({
    success: true,
    project: scope.project,
    count: files.length,
    cursor: listed.cursor,
    truncated: listed.truncated,
    files,
  });
}

/**
 * Delete a file safely with project isolation
 */
async function handleDeleteFile(env: Env, scope: ProjectScope, key: string): Promise<Response> {
  // Security check: Must start with the caller's project namespace!
  if (!key.startsWith(`${scope.project}/`)) {
    return jsonResponse(
      {
        success: false,
        error: `Forbidden: Cannot delete assets outside of project '${scope.project}'`,
      },
      403
    );
  }

  const existing = await env.STORAGE_BUCKET.head(key);
  if (!existing) {
    return jsonResponse({ success: false, error: "File not found" }, 404);
  }

  await env.STORAGE_BUCKET.delete(key);

  return jsonResponse({
    success: true,
    deletedKey: key,
  });
}

/**
 * Fast Public Edge CDN Delivery with Cache-Control and ETag
 */
async function handleCdnDelivery(request: Request, env: Env, key: string): Promise<Response> {
  const ifNoneMatch = request.headers.get("If-None-Match");
  const object = await env.STORAGE_BUCKET.get(key);

  if (!object) {
    return new Response("Asset Not Found", { status: 404, headers: CORS_HEADERS });
  }

  // 304 Not Modified check
  if (ifNoneMatch && object.httpEtag === ifNoneMatch) {
    return new Response(null, { status: 304, headers: CORS_HEADERS });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Access-Control-Allow-Origin", "*");

  return new Response(object.body, {
    status: 200,
    headers,
  });
}
