import type { Request, Response } from "express";
import { CSNOEL_CONFIG } from "./csnoelConfig";

const PUBLIC_SITE_ASSET_FILES = {
  "csnoel-clinicians-corridor.jpg": "csnoel-clinicians-corridor.jpg",
  "csnoel-clinician-stethoscope.jpg": "csnoel-clinician-stethoscope.jpg",
} as const;

export type PublicSiteAssetKey = keyof typeof PUBLIC_SITE_ASSET_FILES;

export function isPublicSiteAssetKey(key: string): key is PublicSiteAssetKey {
  return key in PUBLIC_SITE_ASSET_FILES;
}

export function getPublicSiteAssetUrl(key: string, supabaseUrl = CSNOEL_CONFIG.supabaseUrl): string | null {
  if (!isPublicSiteAssetKey(key)) return null;

  const baseUrl = supabaseUrl.replace(/\/+$/, "");
  const filename = encodeURIComponent(PUBLIC_SITE_ASSET_FILES[key]);
  return `${baseUrl}/storage/v1/object/public/public-site-assets/${filename}`;
}

export function publicSiteAssetRedirect(req: Request, res: Response) {
  const assetUrl = getPublicSiteAssetUrl(req.params.key);
  if (!assetUrl) {
    res.status(404).json({ error: "The requested public site asset was not found." });
    return;
  }

  res.set("Cache-Control", "public, max-age=86400, s-maxage=604800");
  res.redirect(302, assetUrl);
}
