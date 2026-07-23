import { describe, expect, it } from "vitest";
import { getPublicSiteAssetUrl, isPublicSiteAssetKey } from "./publicSiteAssets";

describe("public site assets", () => {
  const supabaseUrl = "https://project.example.supabase.co";

  it("only allows the approved public homepage and social-sharing assets", () => {
    expect(isPublicSiteAssetKey("csnoel-clinicians-corridor.jpg")).toBe(true);
    expect(isPublicSiteAssetKey("csnoel-social-share-card.png")).toBe(true);
    expect(isPublicSiteAssetKey("applications/private-resume.pdf")).toBe(false);
  });

  it("constructs a public Supabase asset URL only for an allowlisted filename", () => {
    expect(getPublicSiteAssetUrl("csnoel-clinician-stethoscope.jpg", supabaseUrl)).toBe(
      "https://project.example.supabase.co/storage/v1/object/public/public-site-assets/csnoel-clinician-stethoscope.jpg",
    );
    expect(getPublicSiteAssetUrl("csnoel-social-share-card.png", supabaseUrl)).toBe(
      "https://project.example.supabase.co/storage/v1/object/public/public-site-assets/csnoel-social-share-card.png",
    );
    expect(getPublicSiteAssetUrl("not-an-approved-image.jpg", supabaseUrl)).toBeNull();
  });
});
