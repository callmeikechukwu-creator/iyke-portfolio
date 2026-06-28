import { NextResponse } from "next/server";
import { getSessionAdminId } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const adminId = await getSessionAdminId();
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the File object to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using the upload stream API
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `portfolio/${folder}`, // upload inside the 'portfolio' subfolder
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Extract the clean path relative to the portfolio root (e.g. /profile/iyke.jpg)
    // Cloudinary secure_url looks like: https://res.cloudinary.com/cloudname/image/upload/v12345/portfolio/folder/filename.jpg
    const secureUrl = uploadResult.secure_url as string;
    const portfolioIndex = secureUrl.indexOf("/portfolio/");
    let relativePath = "";
    
    if (portfolioIndex !== -1) {
      // Strips off everything before and including '/portfolio' to return e.g. /profile/iyke.jpg
      relativePath = secureUrl.substring(portfolioIndex + "/portfolio".length);
    } else {
      // Fallback relative path construction
      relativePath = `/${folder}/${file.name}`;
    }

    return NextResponse.json({
      success: true,
      secureUrl,
      relativePath, // Stored in DB and accessed via cdn.iykevisualsdev.me${relativePath}
    });
  } catch (error) {
    console.error("Error in admin media upload API:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
