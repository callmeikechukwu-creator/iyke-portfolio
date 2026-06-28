import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Check if we are hitting the cdn subdomain (e.g. cdn.iykevisualsdev.me or cdn.localhost:3000)
  if (hostname.startsWith("cdn.")) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      console.error("Missing CLOUDINARY_CLOUD_NAME environment variable in middleware");
      return new NextResponse("CDN Configuration Error", { status: 500 });
    }
    
    const path = url.pathname; // e.g. /profile/iyke.jpg
    
    // Construct the destination Cloudinary URL inside the 'portfolio' root folder
    const destinationUrl = `https://res.cloudinary.com/${cloudName}/image/upload/portfolio${path}`;
    
    // Perform a transparent rewrite (reverse proxy) to the destination URL
    return NextResponse.rewrite(new URL(destinationUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
