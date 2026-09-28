export const ADMIN_SESSION_COOKIE = "admin_session";

const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64url) {
  const b64 = b64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(b64url.length / 4) * 4, "=");
  const str = atob(b64);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function getHmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(secret, maxAgeSeconds) {
  const expiresAt = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const payload = `admin.${expiresAt}`;
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token, secret) {
  if (!token || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [tag, expiresAtStr, signatureB64] = parts;
  if (tag !== "admin") return false;

  const expiresAt = Number(expiresAtStr);
  if (
    !Number.isFinite(expiresAt) ||
    expiresAt < Math.floor(Date.now() / 1000)
  ) {
    return false;
  }

  let signatureBytes;
  try {
    signatureBytes = fromBase64Url(signatureB64);
  } catch {
    return false;
  }

  const key = await getHmacKey(secret);
  const payload = `${tag}.${expiresAtStr}`;
  return crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    encoder.encode(payload),
  );
}

// Constant-time-ish comparison for the submitted password, so a login
// attempt doesn't leak how many leading characters matched via timing.
export function safeStringEqual(a, b) {
  const bytesA = encoder.encode(String(a ?? ""));
  const bytesB = encoder.encode(String(b ?? ""));
  const maxLen = Math.max(bytesA.length, bytesB.length);
  let diff = bytesA.length ^ bytesB.length;
  for (let i = 0; i < maxLen; i++) {
    diff |= (bytesA[i] ?? 0) ^ (bytesB[i] ?? 0);
  }
  return diff === 0;
}
