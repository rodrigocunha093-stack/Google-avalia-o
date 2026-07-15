import crypto from "node:crypto";

const algorithm = "aes-256-gcm";

export function encryptToken(token: string, secret = process.env.TOKEN_ENCRYPTION_KEY) {
  const key = getKey(secret);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function decryptToken(payload: string, secret = process.env.TOKEN_ENCRYPTION_KEY) {
  const key = getKey(secret);
  const [iv, tag, encrypted] = payload.split(".").map((part) => Buffer.from(part, "base64"));
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

function getKey(secret?: string) {
  if (!secret) {
    throw new Error("TOKEN_ENCRYPTION_KEY precisa estar configurada para criptografar tokens.");
  }
  return crypto.createHash("sha256").update(secret).digest();
}
