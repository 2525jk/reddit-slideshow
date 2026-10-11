# Reddit Slideshow

A single-page, no-build slideshow that shows full-resolution images, galleries and videos from any subreddit. It doesn't need a Reddit API key.

- **Feed:** Best, Top, Rising
- **Time range (Top only):** all time, 1 year, 1 month, 1 week
- Autoplay with adjustable timing, or step through manually
- Keyboard: `←`/`→` navigate, `Space` play/pause, `F` fullscreen, `Esc` exit. On touch screens, swipe or tap the left or right edge
- Settings are saved in the URL, so a slideshow can be bookmarked or shared, e.g. `?r=EarthPorn&sort=top&t=week&interval=6`

## How it loads posts

Reddit blocks most direct requests from web pages, so the page tries these sources in order and keeps using the first that works:

1. **Reddit's JSON, straight from the browser.** Works on some networks.
2. **Reddit's JSON through your proxy** (`worker.js`).
3. **Reddit's RSS feed through your proxy.** The feed keeps Reddit's own ranking and time ranges.
4. **The RSS feed converted by [feed2json.org](https://feed2json.org), through your proxy.** Reddit blocks Cloudflare's servers, including your worker, but not feed2json's, so this is usually the source that works.

RSS has no gallery, video or NSFW details, so for sources 3 and 4 the page looks each post up in the [Arctic Shift](https://arctic-shift.photon-reddit.com) archive, which mirrors Reddit's full post data and allows requests from web pages.

## Proxy setup (one time, free, about 5 minutes)

1. Sign up at <https://dash.cloudflare.com> (the free plan is enough).
2. Go to **Compute (Workers) → Workers & Pages → Create → Create Worker**, give it a name like `reddit-proxy`, and click **Deploy**.
3. Click **Edit code**, replace everything with the contents of [`worker.js`](worker.js), and click **Deploy** again.
4. Copy the worker's URL, which looks like `https://reddit-proxy.<your-account>.workers.dev/`.
5. In `index.html`, set it near the top of the script:
   ```js
   const PROXY_URL = 'https://reddit-proxy.<your-account>.workers.dev/';
   ```
6. Commit and push. GitHub Pages updates within a minute or two.

The worker only fetches `reddit.com` and `feed2json.org` URLs, and it caches each feed for 5 minutes so repeat visits don't run into Reddit's rate limits. The free plan allows 100,000 requests a day.

## Deploy to GitHub Pages

1. Push the files to the `main` branch of a GitHub repo.
2. In the repo, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
3. The page is live at `https://<username>.github.io/<repo>/`.

## Notes

- Images come from their original sources (`i.redd.it`, gallery source files, `i.imgur.com`), not Reddit's downscaled previews.
- Reddit-hosted videos play **muted**. Reddit serves the audio as a separate stream that a plain `<video>` element can't combine.
- "Best" uses the subreddit's default (hot) ranking, because Reddit has no separate "best" listing for subreddits.
- When loading through RSS with NSFW turned off, posts the archive hasn't picked up yet (usually under ~10 minutes old) are skipped, because the page can't tell whether they're NSFW.
- Imgur albums show only their first image.
