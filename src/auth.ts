import { timingSafeEqual, createHmac, randomBytes } from "node:crypto";
import {
  DEFAULT_REST_URL,
  DEFAULT_ENGINE_WS_URL,
  DEFAULT_VIEWER_URL,
} from "./constants/network.js";

const hmacKey = randomBytes(32);
export const VIEWER_NONCE_PLACEHOLDER = "__AGENTMEMORY_VIEWER_NONCE__";

const restOrigin = new URL(DEFAULT_REST_URL).origin;
const viewerOrigin = new URL(DEFAULT_VIEWER_URL).origin;
const engineWsOrigin = new URL(DEFAULT_ENGINE_WS_URL).origin;
const engineWssOrigin = engineWsOrigin.replace(/^ws:/, "wss:");

const CONNECT_SRC_DIRECTIVE = [
  "'self'",
  restOrigin,
  viewerOrigin,
  engineWsOrigin,
  engineWssOrigin,
].join(" ");

export function timingSafeCompare(a: string, b: string): boolean {
  const hmacA = createHmac("sha256", hmacKey).update(a).digest();
  const hmacB = createHmac("sha256", hmacKey).update(b).digest();
  return timingSafeEqual(hmacA, hmacB);
}

export function createViewerNonce(): string {
  return randomBytes(16).toString("base64url");
}

export function buildViewerCsp(nonce: string): string {
  return [
    "default-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'none'",
    `script-src 'nonce-${nonce}'`,
    "script-src-attr 'none'",
    "style-src 'unsafe-inline'",
    `connect-src ${CONNECT_SRC_DIRECTIVE}`,
    "img-src 'self'",
    "font-src 'self'",
  ].join("; ");
}
