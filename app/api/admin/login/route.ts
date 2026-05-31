import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { timingSafeEqual } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || "");
    const password = String(body.password || "");

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.ADMIN_JWT_SECRET;

    if (!adminUsername || !adminPassword || !jwtSecret) {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 },
      );
    }

    // Simple check for username first
    if (username !== adminUsername) {
      // Small delay to reduce username probing speed
      await new Promise((r) => setTimeout(r, 250));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Timing-safe comparison to avoid leaking info via timing attacks
    let match = false;
    try {
      const a = Buffer.from(password);
      const b = Buffer.from(adminPassword);
      if (a.length === b.length) {
        match = timingSafeEqual(a, b);
      }
    } catch {
      match = false;
    }

    if (!match) {
      await new Promise((r) => setTimeout(r, 250));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { role: "admin", username: adminUsername },
      jwtSecret,
      {
        expiresIn: "1d",
      },
    );

    const res = NextResponse.json({ ok: true });
    // Set HttpOnly cookie with token
    res.cookies.set("pkakp_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
