// Cloudflare Worker: a tiny CORS proxy that only fetches reddit.com pages.
// Reddit's feeds don't send the header that lets a web page read them, so the slideshow
// fetches them through this worker instead. Deploy steps are in the README.
//
// Usage: https://<your-worker>.workers.dev/?url=https://www.reddit.com/r/EarthPorn/top.rss?t=week

const CORS = { 'Access-Control-Allow-Origin': '*' };

export default {
  async fetch(request) {
    const target = new URL(request.url).searchParams.get('url');
    let url;
    try {
      url = new URL(target);
    } catch {
      return new Response('Pass a reddit.com URL as ?url=', { status: 400, headers: CORS });
    }
    if (url.protocol !== 'https:' || !/(^|\.)reddit\.com$/.test(url.hostname)) {
      return new Response('Only reddit.com URLs are allowed', { status: 403, headers: CORS });
    }

    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'web:reddit-slideshow:v1.0 (GitHub Pages slideshow)' },
      // Cache each feed for 5 minutes so repeat visits don't hit Reddit's rate limits.
      cf: { cacheTtl: 300, cacheEverything: true },
    });

    const headers = new Headers(CORS);
    headers.set('Content-Type', upstream.headers.get('Content-Type') || 'text/plain');
    headers.set('Cache-Control', 'public, max-age=300');
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
