import { NextRequest, NextResponse } from "next/server";

// Cache en memoria: igUrl → { directUrl, expiresAt }
// Las URLs de fbcdn.net expiran ~1h, renovamos al pedido siguiente.
const cache = new Map<string, { url: string; expiresAt: number }>();

async function extractVideoUrl(igUrl: string): Promise<string | null> {
  const cached = cache.get(igUrl);
  if (cached && cached.expiresAt > Date.now()) return cached.url;

  const match = igUrl.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) return null;
  const shortcode = match[1];

  try {
    // Paso 1: GET instagram.com para obtener el csrftoken
    const homeRes = await fetch("https://www.instagram.com/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const rawCookies = homeRes.headers.get("set-cookie") ?? "";
    const csrfToken = rawCookies.match(/csrftoken=([^;,\s]+)/)?.[1];
    if (!csrfToken) {
      console.error("[video-proxy] No se obtuvo csrftoken");
      return null;
    }

    // Extraer todas las cookies útiles para mandarlas en el siguiente pedido
    const cookieHeader = rawCookies
      .split(/,(?=[^ ])/)
      .map((c) => c.split(";")[0].trim())
      .filter((c) => c.includes("="))
      .join("; ");

    // Paso 2: POST al endpoint GraphQL interno de Instagram
    const body = new URLSearchParams({
      variables: JSON.stringify({
        shortcode,
        fetch_tagged_user_count: null,
        hoisted_comment_id: null,
        hoisted_reply_id: null,
      }),
      doc_id: "9510064595728286", // ID del query compilado — puede cambiar con updates de IG
    });

    const gqlRes = await fetch("https://www.instagram.com/graphql/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrfToken,
        "X-IG-App-ID": "936619743392459",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://www.instagram.com/",
        Cookie: cookieHeader,
      },
      body: body.toString(),
    });

    const json = await gqlRes.json();
    const videoUrl: string | undefined =
      json?.data?.xdt_shortcode_media?.video_url;

    if (videoUrl) {
      cache.set(igUrl, { url: videoUrl, expiresAt: Date.now() + 55 * 60 * 1000 }); // 55 min
      return videoUrl;
    }

    console.error("[video-proxy] video_url no encontrada en respuesta:", JSON.stringify(json).slice(0, 300));
  } catch (err) {
    console.error("[video-proxy] Error extrayendo video:", err);
  }

  return null;
}

export async function GET(req: NextRequest) {
  const igUrl = req.nextUrl.searchParams.get("url");
  if (!igUrl) {
    return NextResponse.json({ error: "Falta parámetro ?url=" }, { status: 400 });
  }

  const videoUrl = await extractVideoUrl(decodeURIComponent(igUrl));
  if (!videoUrl) {
    return NextResponse.json(
      { error: "No se pudo obtener el video de Instagram" },
      { status: 404 }
    );
  }

  // Hacer streaming del video a través de nuestro servidor.
  // Soportamos Range para que el <video> pueda hacer seeking.
  const rangeHeader = req.headers.get("range");

  const upstream = await fetch(videoUrl, {
    headers: {
      ...(rangeHeader ? { Range: rangeHeader } : {}),
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Referer: "https://www.instagram.com/",
    },
  });

  const resHeaders = new Headers({
    "Content-Type": upstream.headers.get("Content-Type") ?? "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=3300", // cacheamos ~55 min
  });

  const contentLength = upstream.headers.get("Content-Length");
  const contentRange  = upstream.headers.get("Content-Range");
  if (contentLength) resHeaders.set("Content-Length", contentLength);
  if (contentRange)  resHeaders.set("Content-Range", contentRange);

  return new NextResponse(upstream.body, {
    status: upstream.status, // 200 o 206 (partial content para Range)
    headers: resHeaders,
  });
}
