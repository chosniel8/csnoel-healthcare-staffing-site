import { describe, expect, it } from "vitest";
import { getPublicSiteAssetUrl, isPublicSiteAssetKey } from "./publicSiteAssets";

describe("public site assets", () => {
  const supabaseUrl = "https://project.example.supabase.co";

  it("only allows the two approved homepage photographs", () => {
    expect(isPublicSiteAssetKey("csnoel-clinicians-corridor.jpg")).toBe(true);
    expect(isPublicSiteAssetKey("applications/private-resume.pdf")).toBe(false);
  });

  it("constructs a public Supabase asset URL only for an allowlisted filename", () => {
    expect(getPublicSiteAssetUrl("csnoel-clinician-stethoscope.jpg", supabaseUrl)).toBe(
      "https://project.example.supabase.co/storage/v1/object/public/public-site-assets/csnoel-clinician-stethoscope.jpg",
    );
    expect(getPublicSiteAssetUrl("not-an-approved-image.jpg", supabaseUrl)).toBeNull();
  });
});
