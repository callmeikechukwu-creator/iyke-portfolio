import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: Request) {
  try {
    // 1. Determine the base URL (local development vs production)
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = request.headers.get("host") || "localhost:3000";
    const resumeUrl = `${protocol}://${host}/resume`;

    // 2. Launch headless Chrome via Puppeteer with standard production args
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // 3. Navigate to the resume page and wait until CSS and content loads
    await page.goto(resumeUrl, { waitUntil: "networkidle0" });

    // 4. Generate PDF buffer using specific print layout parameters
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Preserves branding color schemes and typography
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    await browser.close();

    // 5. Return the binary PDF stream as a download attachment
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="iyke_alaeto_resume.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating resume PDF via Puppeteer:", error);
    return NextResponse.json({ error: "Failed to generate resume PDF" }, { status: 500 });
  }
}
