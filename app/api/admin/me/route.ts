import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("pkakp_admin_token")?.value;
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!token || !secret)
      return NextResponse.json({ ok: false }, { status: 401 });

    try {
      const payload = jwt.verify(token, secret) as Record<string, any>;
      return NextResponse.json({ ok: true, payload });
    } catch (err) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
