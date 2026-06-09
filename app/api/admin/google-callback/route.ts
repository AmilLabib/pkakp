import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const json = await res.json();
  return json;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code)
      return NextResponse.redirect(
        new URL("/login?error=missing_code", req.url),
      );

    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!redirectUri)
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 },
      );

    let tokenRes: any;
    try {
      tokenRes = await exchangeCodeForTokens(code, redirectUri);
    } catch (e) {
      console.error("token exchange exception", e);
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_exception", req.url),
      );
    }

    if (tokenRes?.error) {
      console.error("token exchange failed", tokenRes);
      // In dev return details to help debugging, otherwise redirect
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json(
          { error: "token_exchange_failed", details: tokenRes },
          { status: 500 },
        );
      }
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", req.url),
      );
    }

    const idToken = tokenRes.id_token;
    if (!idToken) {
      console.error("no id_token in token response", tokenRes);
      return NextResponse.redirect(
        new URL("/login?error=invalid_token", req.url),
      );
    }

    // verify id_token and fetch user info
    let info: any;
    try {
      const infoRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
      );
      info = await infoRes.json();
    } catch (e) {
      console.error("failed to fetch tokeninfo", e);
      return NextResponse.redirect(
        new URL("/login?error=tokeninfo_failed", req.url),
      );
    }

    const email = info.email as string | undefined;
    const name = info.name as string | undefined;
    const picture = info.picture as string | undefined;

    const allowedDomain = process.env.PKN_STAF_DOMAIN || "pknstan.ac.id";
    if (!email || !email.endsWith(`@${allowedDomain}`)) {
      return NextResponse.redirect(
        new URL("/login?error=unauthorized_email", req.url),
      );
    }

    const jwtSecret = process.env.ADMIN_JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 },
      );
    }

    const token = jwt.sign({ role: "staf", email, name, picture }, jwtSecret, {
      expiresIn: "1d",
    });

    const res = NextResponse.redirect(new URL("/admin", req.url));
    res.cookies.set("pkakp_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (err) {
    console.error("callback handler error", err);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: "callback_exception", message: String(err), details: err },
        { status: 500 },
      );
    }
    return NextResponse.redirect(
      new URL("/login?error=callback_error", req.url),
    );
  }
}
