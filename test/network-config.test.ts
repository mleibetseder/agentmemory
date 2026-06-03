import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DEFAULT_REST_URL, DEFAULT_ENGINE_WS_URL, DEFAULT_VIEWER_URL } from "../src/constants/network.js";

describe("network configuration", () => {
  it("exports correct default values", () => {
    expect(DEFAULT_REST_URL).toBe("http://localhost:3111");
    expect(DEFAULT_ENGINE_WS_URL).toBe("ws://localhost:49134");
    expect(DEFAULT_VIEWER_URL).toBe("http://localhost:3113");
  });
});

describe("config fallback logic", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env["III_ENGINE_URL"];
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("uses default engine URL when III_ENGINE_URL is not set", async () => {
    const { loadConfig } = await import("../src/config.js");
    const config = loadConfig();
    expect(config.engineUrl).toBe(DEFAULT_ENGINE_WS_URL);
  });

  it("uses overridden engine URL when III_ENGINE_URL is set", async () => {
    process.env["III_ENGINE_URL"] = "ws://custom-host:9999";
    const { loadConfig } = await import("../src/config.js");
    const config = loadConfig();
    expect(config.engineUrl).toBe("ws://custom-host:9999");
  });
});
