import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { buildGoogleBusinessProfileAuthUrl } from "@/lib/google-business-profile";

export async function GET() {
  try {
    const state = crypto.randomBytes(24).toString("hex");
    const cookieStore = await cookies();
    cookieStore.set("gbp_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
    return NextResponse.redirect(buildGoogleBusinessProfileAuthUrl(state));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
