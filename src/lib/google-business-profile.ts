import { encryptToken } from "./crypto";

const scopes = [
  "https://www.googleapis.com/auth/business.manage",
];

export function buildGoogleBusinessProfileAuthUrl(state: string) {
  const clientId = requireEnv("GOOGLE_OAUTH_CLIENT_ID");
  const redirectUri = requireEnv("GOOGLE_OAUTH_REDIRECT_URI");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForEncryptedTokens(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: requireEnv("GOOGLE_OAUTH_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
      redirect_uri: requireEnv("GOOGLE_OAUTH_REDIRECT_URI"),
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) throw new Error(`Falha na troca OAuth: ${response.status}`);
  const body = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  };

  return {
    encryptedAccessToken: encryptToken(body.access_token),
    encryptedRefreshToken: body.refresh_token ? encryptToken(body.refresh_token) : null,
    tokenExpiresAt: body.expires_in ? new Date(Date.now() + body.expires_in * 1000) : null,
    scopes: body.scope ?? scopes.join(" "),
  };
}

export async function listBusinessAccounts(accessToken: string) {
  return gbpFetch<{ accounts?: unknown[] }>("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", accessToken);
}

export async function listBusinessLocations(accessToken: string, accountName: string, pageToken?: string) {
  const params = new URLSearchParams({ readMask: "name,title,storeCode,metadata" });
  if (pageToken) params.set("pageToken", pageToken);
  return gbpFetch<{ locations?: unknown[]; nextPageToken?: string }>(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?${params.toString()}`,
    accessToken,
  );
}

export async function listLocationReviews(accessToken: string, accountName: string, locationName: string, pageToken?: string) {
  const params = new URLSearchParams({ pageSize: "50" });
  if (pageToken) params.set("pageToken", pageToken);
  return gbpFetch<{ reviews?: unknown[]; nextPageToken?: string }>(
    `https://mybusiness.googleapis.com/v4/${accountName}/${locationName}/reviews?${params.toString()}`,
    accessToken,
  );
}

async function gbpFetch<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`Google Business Profile API falhou: ${response.status}`);
  return response.json() as Promise<T>;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} precisa estar configurado.`);
  return value;
}
