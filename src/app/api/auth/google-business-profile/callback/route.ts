import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForEncryptedTokens } from "@/lib/google-business-profile";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("gbp_oauth_state")?.value;

  if (!code || !state || state !== expectedState) {
    return NextResponse.json({ error: "Estado OAuth invalido ou codigo ausente." }, { status: 400 });
  }

  try {
    const encryptedTokens = await exchangeCodeForEncryptedTokens(code);
    cookieStore.delete("gbp_oauth_state");
    return NextResponse.json({
      status: "ready_to_persist",
      message: "Tokens criptografados gerados no servidor. Persistencia depende da sessao/autenticacao de producao.",
      tokenExpiresAt: encryptedTokens.tokenExpiresAt,
      scopes: encryptedTokens.scopes,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
