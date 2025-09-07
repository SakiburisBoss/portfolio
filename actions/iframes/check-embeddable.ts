// actions/iframes/check-embeddable.ts
"use server";

export type Probe = {
  embeddable: boolean;
  reason?: string;
  finalUrl?: string;
  headers?: Record<string, string>;
};

/**
 * Server Action to probe whether a URL is likely embeddable.
 * - Checks X-Frame-Options and Content-Security-Policy (frame-ancestors).
 * - Returns a Probe object you can use to decide whether to render an iframe
 *   or show a fallback (open-in-new-tab).
 */
export async function checkEmbeddable(url: string): Promise<Probe> {
  try {
    if (!url) return { embeddable: false, reason: "No URL provided" };

    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        // Make the request look like a real browser (helps some hosts).
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const headers = Object.fromEntries(res.headers.entries());
    const xfo = res.headers.get("x-frame-options")?.toUpperCase() ?? null;
    const csp = res.headers.get("content-security-policy") ?? null;

    // 1) X-Frame-Options explicit block
    if (xfo && (xfo.includes("DENY") || xfo.includes("SAMEORIGIN"))) {
      return {
        embeddable: false,
        reason: `Blocked by X-Frame-Options: ${xfo}`,
        finalUrl: res.url,
        headers,
      };
    }

    // 2) CSP frame-ancestors checks
    if (csp) {
      const dir = csp
        .split(";")
        .map((s) => s.trim())
        .find((s) => s.toLowerCase().startsWith("frame-ancestors"));
      if (dir) {
        const value = dir.replace(/frame-ancestors\s*/i, "").trim();
        if (/\b'none'\b/i.test(value)) {
          return {
            embeddable: false,
            reason: `Blocked by CSP frame-ancestors: ${value}`,
            finalUrl: res.url,
            headers,
          };
        }

        // Heuristic: if frame-ancestors exists and doesn't allow '*' or 'self' or our app origin, assume blocked.
        const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN || "";
        const allowsAll = value.includes("*");
        const allowsSelf = /\b'self'\b/i.test(value);
        const allowsApp =
          appOrigin && value.toLowerCase().includes(appOrigin.toLowerCase());

        if (!allowsAll && !allowsSelf && appOrigin && !allowsApp) {
          return {
            embeddable: false,
            reason: `Likely blocked by CSP frame-ancestors: ${value}`,
            finalUrl: res.url,
            headers,
          };
        }
      }
    }

    // No obvious blocking headers — assume embeddable.
    return { embeddable: true, finalUrl: res.url, headers };
  } catch (err) {
    return {
      embeddable: false,
      reason: err instanceof Error ? err.message : "Probe failed",
    };
  }
}
