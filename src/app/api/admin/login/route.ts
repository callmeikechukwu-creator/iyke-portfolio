import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if database has any admins. If empty, auto-seed the initial admin from environment variables.
    const adminCount = await db.admin.count();
    if (adminCount === 0) {
      const initialEmail = process.env.ADMIN_INITIAL_EMAIL;
      const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;

      if (
        initialEmail &&
        initialPassword &&
        normalizedEmail === initialEmail.toLowerCase().trim() &&
        password === initialPassword
      ) {
        const passwordHash = await hashPassword(password);
        const newAdmin = await db.admin.create({
          data: {
            email: normalizedEmail,
            passwordHash,
          },
        });
        
        await createSession(newAdmin.id);
        return NextResponse.json({ success: true, seeded: true });
      }
    }

    // 2. Standard login lookup
    const admin = await db.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 3. Verify Password
    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 4. Create session and set cookie
    await createSession(admin.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in admin login API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
