import { describe, expect, it, vi } from "vitest";
import { getPublicSiteAssetUrl, isPublicSiteAssetKey } from "./publicAssetProxy";

describe("public site asset proxy", () => {
  it("only exposes the approved public image keys", () => {
    expect(isPublicSiteAssetKey("csnoel-clinicians-corridor_31a9a5ed.jpg")).toBe(true);
    expect(isPublicSiteAssetKey("applications/private-resume.pdf")).toBe(false);
  });

  it("creates a Forge presign request only for an allowed asset", async () => {
    const fetchImplementation = vi.fn(async () => new Response(JSON.stringify({ url: "https://signed.example/image.jpg" }), { status: 200 }));

    await expect(
      getPublicSiteAssetUrl(
        "csnoel-clinician-stethoscope_10219176.jpg",
        { forgeApiUrl: "https://forge.example", forgeApiKey: "test-key" },
        fetchImplementation as typeof fetch,
      ),
    ).resolves.toBe("https://signed.example/image.jpg");

    expect(fetchImplementation).toHaveBeenCalledWith(
      expect.objectContaining({ href: "https://forge.example/v1/storage/presign/get?path=csnoel-clinician-stethoscope_10219176.jpg" }),
      expect.objectContaining({ headers: { Authorization: "Bearer test-key" } }),
    );
  });
});
