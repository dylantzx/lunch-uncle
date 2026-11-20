# Lunch Uncle 45-second promo (draft)

`lunch-uncle-promo.html` is the whole video: one self-contained file with a 1080 x 1920 stage, 45.0 s long, no audio, no external assets. It implements [storyboard.md](storyboard.md), which executes [creative-brief.md](creative-brief.md). `frames/beat-1.png` to `beat-8.png` are one still per beat.

This is a draft. Do not release it until the dependencies below are met.

## Play it

Open `lunch-uncle-promo.html` in a browser. It plays once and holds on the end card. The stage scales to fit the window; on a landscape screen it stays a centred 9:16 column and the background colour fills the sides.

Controls appear at the bottom when the pointer moves and hide again after about two seconds.

| Key | Action |
|---|---|
| Space | Play or pause (restarts if it has ended) |
| R | Restart |
| Left / Right | Step one frame (1/30 s) |

## URL parameters

| Parameter | Effect |
|---|---|
| `?t=12.5` | Render that time in seconds, paused. For stills and checks. |
| `?autoplay=0` | Start paused at 0. |
| `?loop=1` | Loop instead of holding on the end card. |
| `?controls=0` | Never show the controls. Use for screen recording. |

Parameters combine, for example `?loop=1&controls=0`. Every frame is computed from one time value by `render(t)`, so the same `t` always gives the same picture.

## Make an MP4

No MP4 is included, because ffmpeg is not installed on the machine that built this.

**QuickTime (works now):**

1. Open `lunch-uncle-promo.html?autoplay=0&controls=0` in Chrome and make the window tall, so the stage is as large as possible.
2. Press Cmd+Shift+5, choose "Record Selected Portion" and drag the selection to the edges of the 9:16 stage.
3. Start recording, click the page once, then press Space to play. Stop after the end card has held.
4. Trim the head and tail in QuickTime (Cmd+T) to 45.0 s and export.

The recording is at screen resolution, not exactly 1080 x 1920, unless the stage is shown at that size.

**ffmpeg (if installed later):** render exact frames with headless Chrome, then encode them.

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PAGE="file://$PWD/lunch-uncle-promo.html"
mkdir -p out
for i in $(seq 0 1349); do
  t=$(echo "scale=5; $i/30" | bc)
  "$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1080,1920 --screenshot="out/$(printf %04d $i).png" \
    "$PAGE?t=$t&controls=0"
done
ffmpeg -framerate 30 -i out/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 16 lunch-uncle-promo.mp4
```

That is 1350 frames at 30 fps. It is slow, because Chrome starts once per frame, but each frame is exact. This script has not been run end to end.

## Release dependencies

From the brief. The video shows answers the app cannot give yet.

- **FR-41 (pending):** search centred on CT Hub 2. Gates "Real places near CT Hub 2."
- **FR-43 (pending):** open-now and distance from CT Hub 2. Gates the "4.4 stars, 250 m, open now" reply and callout.
- **Limitation 1:** `LLM_BASE_URL` and `LLM_MODEL` are still `"TODO"`, so the app does not answer at all until they are configured.
- **`[APP_URL]`** on the end card is a placeholder. Replace it with the real address when there is one. Do not invent one.

## Open items

Resolved since the storyboard: beat 7 "Live rain." is now "Rain forecast." in the brief, the storyboard and the video.

Still open, from storyboard section 6:

- **Phone colours differ from the real page.** `src/ui.html` uses yellow Uncle bubbles and blue user bubbles on a light page, and a redesign is in progress. Reconcile before a final edit.
- **The bus reply is generic.** A real reply would name bus services, which guardrail 5 forbids showing. The footnote covers it, but it is the least true-to-life exchange.
- **The footnote is 32 px**, below the brief's 44 px minimum for lobby-readable text. It is treated as a disclaimer.
- **Underlines inside the bubbles** (on "4.4 stars", "250 m", "open now", "3 min", "11 min") are video annotations. Drop them if guardrail 2 is read as forbidding them.
- **Beat 3 is tight at 3 s.** It works only because the phone has no entrance animation.
- **Word counts in the brief** are off by one for the rain and bus replies. No effect on the video.
- **Sound** (music, SFX, VO) is specified in the brief and not built.

## Where the build differs from the storyboard

- **Bus-stop pole** is drawn behind the phone, not above it. It is ink on an ink phone, so drawn above it would only cut through the phone's outline.
- **Group-chat bubble 5** sits at y 940, not 980. The storyboard gives 980 but also says it overlaps bubble 4's row, which needs about 940.
- **Raindrops in the column** are kept to x 8 to 70 and x 1010 to 1070 (storyboard: 0 to 130 and 950 to 1080), so they never cross the caption or footnote.
- **Beat 6 caption** breaks as "Live bus arrivals. / Just give the five-digit / stop code." The storyboard only says "up to three lines".
- **Highlighted numbers do not wrap** mid-phrase, so the places and bus replies break before "4.4 stars", "open now", "3 min" and "11 min".
- **The star** in the callout is inline SVG, in yellow. The storyboard does not give it a colour.
