import { describe, expect, it } from "vitest";
import { decryptToken, encryptToken } from "./crypto";

describe("token crypto", () => {
  it("criptografa e descriptografa sem expor o token puro", () => {
    const secret = "segredo-de-teste";
    const token = "ya29.token-sensivel";
    const encrypted = encryptToken(token, secret);

    expect(encrypted).not.toContain(token);
    expect(decryptToken(encrypted, secret)).toBe(token);
  });
});
