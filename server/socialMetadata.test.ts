import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("public social metadata", () => {
  const documentHead = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
  const canonicalUrl = "https://csnoelhealthcarestaffing.com/";
  const socialImage = `${canonicalUrl}site-assets/csnoel-social-share-card.png`;

  it("publishes canonical and Open Graph metadata for the production domain", () => {
    expect(documentHead).toContain(`<link rel="canonical" href="${canonicalUrl}"`);
    expect(documentHead).toContain('<meta property="og:type" content="website"');
    expect(documentHead).toContain(`<meta property="og:url" content="${canonicalUrl}"`);
    expect(documentHead).toContain(`<meta property="og:image" content="${socialImage}"`);
    expect(documentHead).toContain('<meta property="og:image:width" content="1200"');
    expect(documentHead).toContain('<meta property="og:image:height" content="630"');
  });

  it("publishes a large X card that uses the same hosted social image", () => {
    expect(documentHead).toContain('<meta name="twitter:card" content="summary_large_image"');
    expect(documentHead).toContain(`<meta name="twitter:image" content="${socialImage}"`);
  });
});
