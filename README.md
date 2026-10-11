# Reddit Slideshow

A single-page, no-build slideshow that shows full-resolution images, galleries and videos from any subreddit.

- **Feed:** Best, Top, Rising
- **Time range (Top only):** all time, 1 year, 1 month, 1 week
- Autoplay with adjustable timing, or step through manually
- Keyboard: `←`/`→` navigate, `Space` play/pause, `F` fullscreen, `Esc` exit. On touch screens, swipe or tap the left or right edge
- Settings are saved in the URL, so a slideshow can be bookmarked or shared, e.g. `?r=EarthPorn&sort=top&t=week&interval=6`

## Deploy to GitHub Pages

1. Create a new repo and push `index.html` to the `main` branch.
2. In the repo, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
3. After a minute or so, the page is live at `https://<username>.github.io/<repo>/`.

## If loading fails

Reddit sometimes blocks requests from browsers that aren't logged in. The page can use Reddit's official API instead, which needs a free app ID:

1. Go to <https://www.reddit.com/prefs/apps> and click **create another app**.
2. Choose **installed app**. Enter any name, and use `http://localhost` as the redirect URI.
3. Copy the ID shown under the app name and paste it into **Reddit API key** on the page.

The ID is stored only in the viewer's browser (`localStorage`). An installed-app ID isn't a secret.

## Notes

- Images come from their original sources (`i.redd.it`, gallery source files, `i.imgur.com`), not Reddit's downscaled previews.
- Reddit-hosted videos play **muted**. Reddit serves the audio as a separate stream that a plain `<video>` element can't combine.
- "Best" uses the subreddit's default (hot) ranking, because Reddit has no separate "best" listing for subreddits.
- Imgur albums show only their first image.
