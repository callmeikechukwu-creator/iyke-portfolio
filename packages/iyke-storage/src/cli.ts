#!/usr/bin/env node

/**
 * iyke-storage CLI
 * ============================================================
 * Official Command Line Interface for iyke-storage
 * ============================================================
 */

import fs from "fs";
import path from "path";

const DEFAULT_GATEWAY = "https://iyke-storage-gateway.iyke-storage-gateway.workers.dev";
const GATEWAY_URL = process.env.STORAGE_GATEWAY_URL || DEFAULT_GATEWAY;
const ROOT_SECRET = process.env.STORAGE_ROOT_SECRET || "ik_root_master_7f8e9a2b1c4d";
const DEV_MASTER_KEY = process.env.STORAGE_API_KEY || "ik_live_portfolio_master";

const ARGS = process.argv.slice(2);
const COMMAND = ARGS[0];
const SUBCOMMAND = ARGS[1];

function parseFlags(args: string[]): Record<string, any> {
  const flags: Record<string, any> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.substring(2);
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return flags;
}

function printBanner() {
  console.log(`
┌─────────────────────────────────────────────────────────────┐
│  ⚡ IYKE STORAGE PLATFORM CLI                                │
│  Gateway: ${GATEWAY_URL.padEnd(49)}│
└─────────────────────────────────────────────────────────────┘`);
}

function printHelp() {
  printBanner();
  console.log(`
Usage:
  npx iyke-storage <command> [subcommand] [options]

Commands:
  keys list
    List all active project API keys in Cloudflare KV

  keys create --project <slug> --name "<label>" [--permissions read,write,delete]
    Generate a new scoped API key for a project

  keys revoke <keyId>
    Instantly revoke and invalidate an API key worldwide

  upload <filePath> [--project <slug>] [--folder <name>] [--key <key>]
    Upload any file directly to Cloudflare R2 via the gateway

Examples:
  npx iyke-storage keys create --project iyke-saas --name "SaaS Mobile App"
  npx iyke-storage keys list
  npx iyke-storage keys revoke key_7a9f1234
  npx iyke-storage upload ./screenshot.png --folder projects
`);
}

async function listKeys() {
  printBanner();
  console.log("🔍 Fetching active keys from Cloudflare KV edge...\n");

  try {
    const res = await fetch(`${GATEWAY_URL}/v1/admin/keys`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ROOT_SECRET}`,
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error("❌ Failed to list keys:", data.error || res.statusText);
      process.exit(1);
    }

    console.log(`Found ${data.count} active key(s):\n`);
    console.table(
      data.keys.map((k: any) => ({
        ID: k.id,
        Name: k.name,
        Project: k.project,
        Prefix: k.prefix,
        Permissions: (k.permissions || []).join(", "),
        "Last Used": k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : "Never",
      }))
    );
  } catch (err: any) {
    console.error("❌ Network error connecting to gateway:", err.message);
    process.exit(1);
  }
}

async function createKey(flags: Record<string, any>) {
  const project = flags.project;
  const name = flags.name;
  const permissions = flags.permissions
    ? flags.permissions.split(",").map((p: string) => p.trim())
    : ["read", "write", "delete"];
  const allowedFolders = flags.folders ? flags.folders.split(",").map((f: string) => f.trim()) : ["*"];
  const cdnHost = flags.cdn;

  if (!project) {
    console.error("❌ Error: --project <slug> is required (e.g. --project iyke-saas)");
    process.exit(1);
  }
  if (!name) {
    console.error('❌ Error: --name "<description>" is required (e.g. --name "SaaS App Client")');
    process.exit(1);
  }

  printBanner();
  console.log(`🔑 Generating dynamic API key for project '${project}'...\n`);

  try {
    const res = await fetch(`${GATEWAY_URL}/v1/admin/keys`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ROOT_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project,
        name,
        permissions,
        allowedFolders,
        cdnHost,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error("❌ Failed to create key:", data.error || res.statusText);
      process.exit(1);
    }

    console.log("✨ SUCCESS! New API Key generated:\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`🔑 Secret Key : \x1b[32m${data.apiKey}\x1b[0m`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(
      "\x1b[33m⚠️  IMPORTANT: Store this key securely now. For security reasons, it will NEVER be displayed again.\x1b[0m\n"
    );
    console.log(`• Key ID         : ${data.key.id}`);
    console.log(`• Project Scope  : ${data.key.project}`);
    console.log(`• Display Prefix : ${data.key.prefix}`);
    console.log(`• Permissions    : ${data.key.permissions.join(", ")}`);
    console.log(`• Folders        : ${data.key.allowedFolders.join(", ")}`);
    console.log(`• Created At     : ${data.key.createdAt}\n`);
  } catch (err: any) {
    console.error("❌ Network error connecting to gateway:", err.message);
    process.exit(1);
  }
}

async function revokeKey(keyId: string) {
  if (!keyId) {
    console.error("❌ Error: Key ID is required (e.g. npx iyke-storage keys revoke key_12345)");
    process.exit(1);
  }

  printBanner();
  console.log(`🗑️  Revoking key '${keyId}' from Cloudflare KV...\n`);

  try {
    const res = await fetch(`${GATEWAY_URL}/v1/admin/keys/${encodeURIComponent(keyId)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${ROOT_SECRET}`,
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error("❌ Failed to revoke key:", data.error || res.statusText);
      process.exit(1);
    }

    console.log(`✅ \x1b[32m${data.message}\x1b[0m\n`);
  } catch (err: any) {
    console.error("❌ Network error connecting to gateway:", err.message);
    process.exit(1);
  }
}

async function uploadFile(filePath: string, flags: Record<string, any>) {
  if (!filePath || !fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found at path '${filePath}'`);
    process.exit(1);
  }

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    console.error(`❌ Error: '${filePath}' is a directory. Please specify a file path.`);
    process.exit(1);
  }

  const filename = path.basename(filePath);
  const folder = flags.folder || "general";
  const apiKey = flags.key || DEV_MASTER_KEY;
  const tags = flags.tags || "";
  const alt = flags.alt || `Asset ${filename}`;

  printBanner();
  console.log(`📤 Uploading '${filename}' (${(stat.size / 1024).toFixed(1)} KB) to folder '${folder}'...\n`);

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();

  const MIME_MAP: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".pdf": "application/pdf",
    ".json": "application/json",
  };

  const contentType = MIME_MAP[ext] || "application/octet-stream";

  try {
    const res = await fetch(`${GATEWAY_URL}/v1/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": contentType,
        "x-filename": filename,
        "x-folder": folder,
        "x-tags": tags,
        "x-alt": alt,
      },
      body: fileBuffer,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error("❌ Upload failed:", data.error || res.statusText);
      process.exit(1);
    }

    console.log("✅ \x1b[32mUpload Successful!\x1b[0m\n");
    console.log(`• Object Key : ${data.data.key}`);
    console.log(`• CDN URL    : \x1b[36m${data.data.cdnUrl}\x1b[0m`);
    console.log(`• Size       : ${(data.data.size / 1024).toFixed(1)} KB`);
    console.log(`• Mime Type  : ${data.data.contentType}\n`);
  } catch (err: any) {
    console.error("❌ Network error during upload:", err.message);
    process.exit(1);
  }
}

async function main() {
  const flags = parseFlags(ARGS);

  if (COMMAND === "keys") {
    if (SUBCOMMAND === "list") {
      await listKeys();
    } else if (SUBCOMMAND === "create") {
      await createKey(flags);
    } else if (SUBCOMMAND === "revoke") {
      const keyId = ARGS[2];
      await revokeKey(keyId);
    } else {
      printHelp();
    }
  } else if (COMMAND === "upload") {
    const fileTarget = ARGS[1];
    await uploadFile(fileTarget, flags);
  } else {
    printHelp();
  }
}

main().catch(console.error);
