/**
 * Iyke Storage Gateway
 * ============================================================
 * Centralized Edge Media Storage & CDN API built on Cloudflare R2.
 * Provides project isolation, API key authentication, dynamic
 * metadata storage, and edge CDN delivery.
 * ============================================================
 */

export interface Env {
  STORAGE_BUCKET: R2Bucket;
  IYKE_STORAGE_KEYS?: string;
  DEFAULT_CDN_HOST?: string;
}

interface ProjectScope {
  project: string;
  name: string;
  allowedFolders: string[];
  cdnHost?: string; // Optional custom CDN domain for this specific project
}

// Default development key if no environment secret is configured yet
const DEFAULT_DEV_KEYS: Record<string, ProjectScope> = {
  "ik_live_portfolio_master": {
    project: "iyke-portfolio",
    name: "Portfolio Master",
    allowedFolders: ["projects", "blog", "brand", "resume", "general"],
  },
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, x-project, x-folder, x-tags, x-alt, x-width, x-height, x-blur",
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

function parseApiKeys(env: Env): Record<string, ProjectScope> {
  if (!env.IYKE_STORAGE_KEYS) {
    return DEFAULT_DEV_KEYS;
  }
  try {
    return JSON.parse(env.IYKE_STORAGE_KEYS);
  } catch {
    return DEFAULT_DEV_KEYS;
  }
}

function authenticate(request: Request, env: Env): { authorized: boolean; scope?: ProjectScope; error?: string } {
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

  const keys = parseApiKeys(env);
  const scope = keys[token];

  if (!scope) {
    return { authorized: false, error: "Invalid API key" };
  }

  return { authorized: true, scope };
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
        version: "1.0.0",
        engine: "Cloudflare Workers + R2",
        bucket: "iyke-cloud",
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Public Edge CDN Delivery (/cdn/*)
    if (pathname.startsWith("/cdn/")) {
      return handleCdnDelivery(request, env, pathname.replace(/^\/cdn\//, ""));
    }

    // 4. Authenticated API Endpoints
    const auth = authenticate(request, env);
    if (!auth.authorized || !auth.scope) {
      return jsonResponse({ success: false, error: auth.error }, 401);
    }
    const scope = auth.scope;

    // --- Endpoint: POST /v1/upload ---
    if (pathname === "/v1/upload" && request.method === "POST") {
      return handleUpload(request, env, scope);
    }

    // --- Endpoint: GET /v1/files ---
    if (pathname === "/v1/files" && request.method === "GET") {
      return handleListFiles(request, env, scope);
    }

    // --- Endpoint: DELETE /v1/files/* ---
    if (pathname.startsWith("/v1/files/") && request.method === "DELETE") {
      const keyToDelete = decodeURIComponent(pathname.replace(/^\/v1\/files\//, ""));
      return handleDeleteFile(env, scope, keyToDelete);
    }

    return jsonResponse({ success: false, error: "Route not found" }, 404);
  },
};

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
  if (scope.allowedFolders.length > 0 && !scope.allowedFolders.includes(rootFolder)) {
    return jsonResponse({
      success: false,
      error: `Folder '${rootFolder}' is not permitted for project '${scope.project}'. Allowed: ${scope.allowedFolders.join(", ")}`,
    }, 403);
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

  return jsonResponse({
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
  }, 201);
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
    return jsonResponse({
      success: false,
      error: `Forbidden: Cannot delete assets outside of project '${scope.project}'`,
    }, 403);
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
