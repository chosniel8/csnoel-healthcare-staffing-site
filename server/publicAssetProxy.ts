import type { Request, Response } from "express";
import { ENV } from "./_core/env";

const PUBLIC_SITE_ASSET_KEYS = new Set([
  "csnoel-clinicians-corridor_31a9a5ed.jpg",
  "csnoel-clinician-stethoscope_10219176.jpg",
]);

type ForgeConfig = {
  forgeApiUrl: string;
  forgeApiKey: string;
};

type FetchImplementation = typeof fetch;

export function isPublicSiteAssetKey(key: string) {
  return PUBLIC_SITE_ASSET_KEYS.has(key);
}

export async function getPublicSiteAssetUrl(
  key: string,
  config: ForgeConfig = ENV,
  fetchImplementation: FetchImplementation = fetch,
): Promise<string | null> {
  if (!isPublicSiteAssetKey(key)) return null;

  if (!config.forgeApiUrl || !config.forgeApiKey) {
    throw new Error("Storage configuration is unavailable");
  }

  const presignUrl = new URL("v1/storage/presign/get", `${config.forgeApiUrl.replace(/\/+$/, "")}/`);
  presignUrl.searchParams.set("path", key);

  const response = await fetchImplementation(presignUrl, {
    headers: { Authorization: `Bearer ${config.forgeApiKey}` },
  });

  if (!response.ok) {
    throw new Error(`Storage presign failed (${response.status})`);
  }

  const body = (await response.json()) as { url?: string };
  if (!body.url) throw new Error("Storage presign response did not include a URL");

  return body.url;
}

export async function publicSiteAssetProxy(req: Request, res: Response) {
  const assetUrl = await getPublicSiteAssetUrl(req.params.key);

  if (!assetUrl) {
    res.status(404).end();
    return;
  }

  res.set("Cache-Control", "public, max-age=300, s-maxage=300");
  res.redirect(307, assetUrl);
}
