import { NextResponse } from "next/server";
import { getSessionAdminId } from "@/lib/auth";

const STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL ||
  "https://iyke-storage-gateway.iyke-storage-gateway.workers.dev";

const STORAGE_API_KEY = process.env.STORAGE_API_KEY || "ik_live_portfolio_master";

/**
 * GET /api/admin/media
 * List files stored in Cloudflare R2 under the portfolio project
 */
export async function GET(request: Request) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "";
    const limit = searchParams.get("limit") || "60";
    const cursor = searchParams.get("cursor") || "";

    const gatewayUrl = new URL(`${STORAGE_GATEWAY_URL}/v1/files`);
    if (folder && folder !== "all") gatewayUrl.searchParams.set("folder", folder);
    gatewayUrl.searchParams.set("limit", limit);
    if (cursor) gatewayUrl.searchParams.set("cursor", cursor);

    const res = await fetch(gatewayUrl.toString(), {
      headers: {
        Authorization: `Bearer ${STORAGE_API_KEY}`,
      },
      next: { revalidate: 0 },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Failed to fetch media" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching admin media:", error);
    return NextResponse.json({ error: "Failed to list media assets" }, { status: 500 });
  }
}

/**
 * POST /api/admin/media
 * Upload a media asset to Cloudflare R2 via the Iyke Storage Gateway
 */
export async function POST(request: Request) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";
    const tags = (formData.get("tags") as string) || "";
    const alt = (formData.get("alt") as string) || "";
    const width = (formData.get("width") as string) || "";
    const height = (formData.get("height") as string) || "";
    const blurDataURL = (formData.get("blurDataURL") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    const headers: Record<string, string> = {
      Authorization: `Bearer ${STORAGE_API_KEY}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-filename": file.name,
      "x-folder": folder,
      "x-tags": tags,
      "x-alt": alt,
    };

    if (width) headers["x-width"] = width;
    if (height) headers["x-height"] = height;
    if (blurDataURL) headers["x-blur"] = blurDataURL;

    const res = await fetch(`${STORAGE_GATEWAY_URL}/v1/upload`, {
      method: "POST",
      headers,
      body: arrayBuffer,
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return NextResponse.json(
        { error: result.error || "Upload rejected by storage gateway" },
        { status: res.status || 500 }
      );
    }

    const cdnUrl = result.data.cdnUrl;
    // Relative path e.g. /projects/filename.webp or /brand/...
    const projectPrefix = "iyke-portfolio/";
    const relativePath = result.data.key.startsWith(projectPrefix)
      ? `/${result.data.key.substring(projectPrefix.length)}`
      : `/${result.data.key}`;

    return NextResponse.json({
      success: true,
      cdnUrl,
      relativePath,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in admin media upload API:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/media
 * Delete a media asset from Cloudflare R2
 */
export async function DELETE(request: Request) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Key parameter is required" }, { status: 400 });
    }

    const res = await fetch(`${STORAGE_GATEWAY_URL}/v1/files/${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${STORAGE_API_KEY}`,
      },
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to delete asset" },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedKey: key,
    });
  } catch (error) {
    console.error("Error deleting admin media:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
