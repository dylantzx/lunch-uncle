# Lunch Uncle 45-second promo: storyboard

Executes [creative-brief.md](creative-brief.md). Copy is fixed by the brief (section 6) and is reproduced here exactly. Requirement IDs refer to `docs/requirements.md`.

Build target: one self-contained HTML/CSS/JS file, a 1080 x 1920 stage scaled to fit the viewport and centred, 45.0 s, no external assets, no audio.

## 0. Global setup

### Stage and zones

All coordinates are stage pixels, origin top-left. Safe area: x 80 to 1000, y 160 to 1760.

| Zone | Box (x, y, w, h) | Used for |
|---|---|---|
| Icon slot | 800, 170, 150, 150 | Umbrella (beat 5), bus-stop pole (beat 6). Overlaps the phone's top-right corner, drawn above it. |
| Phone | 140, 260, 800, 980 | Phone frame, beats 3 to 6 |
| Phone header | 140, 260, 800, 120 | "Lunch Uncle" |
| Chat area | 172, 400, 736, 820 | Bubbles, clipped to this box |
| Callout | centred on x 540, y 1280 to 1370 | Monospace data pill, beats 4 and 6 |
| Caption | 80, 1420, 920, 220 | Caption and VO line, centred, up to 3 lines |
| Footnote | 80, 1700, 920, 44 | Disclaimer, beats 4 to 6 |

When the viewport is wider than 9:16 (lobby screen), the stage stays a centred column. Only the current background colour, the wipe, and the beat 5 raindrops extend to the full viewport width. Nothing else leaves the column.

### Colour roles

| Token | Hex | Role |
|---|---|---|
| `ink` | `#1F1A17` | Backgrounds (beats 2, 7, 8), phone screen, text on cream and yellow |
| `cream` | `#FFF6E5` | Uncle bubbles, text on ink, red and blue |
| `red` | `#E03A1E` | Beat 1 and beats 3 to 4 background, user bubbles in the phone, CTA |
| `yellow` | `#FFC533` | Beat 6 background, highlights |
| `green` | `#0F8B6C` | "open now" dot, payoff tick |
| `blue` | `#2F6FDE` | Beat 5 background |
| `grey` | `#8A7F76` | Group-chat bubbles, phone frame stroke, secondary text |

### Type

| Style | Font stack | Size / weight | Used for |
|---|---|---|---|
| Headline | system sans (brief section 4) | 120 px / 900, letter-spacing -0.02em, line-height 1.0 | Beat 1 headline, beat 8 wordmark |
| Caption | system sans | 64 px / 800, letter-spacing -0.01em, line-height 1.15, centred | Captions, beat 7 stacked lines (88 px there) |
| Chat | system sans | 44 px / 500, line-height 1.3 | All bubbles |
| Data | system monospace | 700; 150 px for the clock, 56 px for callouts | Clock, callouts |
| Footnote | system sans | 32 px / 500 | Disclaimer only (see adjustments) |

### Easings and reusable motions

| Name | Definition | Used for |
|---|---|---|
| `snap` | 180 ms, `cubic-bezier(0.2, 0.9, 0.2, 1)`, no overshoot | Everything Uncle does, captions, callouts |
| `drift` | 700 ms, `cubic-bezier(0.4, 0, 0.6, 1)` | Group-chat bubbles |
| `wipe` | 500 ms, `cubic-bezier(0.7, 0, 0.2, 1)` | Colour wipes |
| `slam` | 220 ms, `cubic-bezier(0.1, 0.9, 0.2, 1)`, scale 1.6 to 1.0 plus opacity 0 to 1 | Beat 1 clock |

- **Bubble-in (Uncle or user in the phone):** translateY 24 px to 0 and opacity 0 to 1, `snap`.
- **Caption-in:** translateY 30 px to 0 and opacity 0 to 1, `snap`. **Caption-out:** opacity 1 to 0, 150 ms linear.
- **Colour wipe:** a full-viewport rectangle of the new colour sweeps bottom to top (translateY 100% to 0), `wipe`. The phone stays put above it. During the wipe the chat area scrolls its content up and out (translateY 0 to -820 px, `wipe`), as an auto-scroll (FR-9), so each capability beat starts with an empty chat area.
- **Thinking swap:** "Uncle thinking..." and the reply are the same bubble element, as in the real app. At swap time the text is replaced in one frame and the bubble's size changes with `snap`. No typewriter effect, no per-word reveal.

### Phone frame (beats 3 to 6)

- Rounded rectangle 800 x 980, corner radius 64, fill `ink`, stroke `grey` 6 px. No notch, camera, buttons or brand detail.
- Header: 120 px tall, fill `ink`, bottom border 2 px `grey` at 40% opacity. Text "Lunch Uncle", sans 48 px / 800, `cream`, left-aligned at x 188, vertically centred.
- Uncle bubbles: left-aligned at x 172, max width 600, fill `cream`, text `ink`, padding 26 x 32, radius 36 with the bottom-left corner 10.
- User bubbles: right-aligned to x 908, max width 600, fill `red`, text `cream`, same padding, radius 36 with the bottom-right corner 10.
- Vertical gap between bubbles 20 px. First bubble top at y 420.
- No input bar, send button, avatars, timestamps or status bar.

### Group chat (beats 2 and 7)

- No phone frame. Bubbles float directly on the `ink` background, in a generic look: fill `grey`, text `cream`, chat type, padding 26 x 32, radius 36, max width 620.
- Each bubble has a plain 56 px circle beside it (the sender dot), alternating fills `yellow`, `blue`, `cream`, `red`, `green`. No names, timestamps, ticks or app chrome.

## 1. Shot list

| Shot | Time (s) | Beat | Content |
|---|---|---|---|
| 1A | 0.0–1.2 | 1 Hook | Clock slams in on red |
| 1B | 1.2–3.0 | 1 Hook | Headline "Where to eat ah?" |
| 2A | 3.0–5.8 | 2 Problem | Group chat fills, clock rolls |
| 2B | 5.8–8.0 | 2 Problem | Clock lands on 12:24 PM, caption |
| 3 | 8.0–11.0 | 3 Meet Uncle | Phone, greeting, "So ask Uncle." |
| 4A | 11.0–13.1 | 4 Places | User asks, "Uncle thinking..." |
| 4B | 13.1–15.6 | 4 Places | Reply, data callout |
| 4C | 15.6–20.0 | 4 Places | Caption, hold |
| 5A | 20.0–22.5 | 5 Rain | Blue wipe, rain, user asks, thinking |
| 5B | 22.5–28.0 | 5 Rain | Reply, umbrella, caption |
| 6A | 28.0–30.5 | 6 Bus | Yellow wipe, pole, user asks, thinking |
| 6B | 30.5–36.0 | 6 Bus | Reply, callout, caption |
| 7A | 36.0–37.2 | 7 Payoff | Group chat returns, "Settled.", collapse |
| 7B | 37.2–41.0 | 7 Payoff | Four stacked lines |
| 8A | 41.0–43.5 | 8 End card | End card builds |
| 8B | 43.5–45.0 | 8 End card | Static hold |

Shots tile 0.0 to 45.0 s with no gaps. Beat boundaries are at 3, 8, 11, 20, 28, 36 and 41 s, as in the brief.

## 2. Shots

### Beat 1: Hook (0.0–3.0 s)

Requirement IDs: Purpose (spec section 1).

```
+----------------------------+
|        (red full-bleed)    |
|                            |
|         12:01 PM           |   clock, mono 150, cream
|                            |
|      Where to              |   headline 120/900, cream
|      eat ah?               |
|                            |
|                            |
+----------------------------+
```

**Shot 1A, 0.0–1.2 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Background | | full viewport, `red` | 0.0 (already on) | 3.0 | none |
| Clock | `12:01 PM` | centred, baseline y 760, data 150 px, `cream` | 0.2 | 3.0 | `slam`. The colon blinks (opacity 1 to 0.25 to 1) once at 0.9 s, 300 ms. |

**Shot 1B, 1.2–3.0 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Headline | "Where to eat ah?" | centred, two lines ("Where to" / "eat ah?"), block top y 900, headline 120 px, `cream` | 1.2 | 3.0 | Caption-in, but 60 px travel. Holds 1.6 s. |

- Caption/VO: "Where to eat ah?" (the headline is the caption).
- Transition out at 3.0 s: hard cut to `ink`. The clock does not cut: it shrinks and moves to the beat 2 clock position (see 2A) over 300 ms, `snap`, so it reads as the same clock.

### Beat 2: Problem (3.0–8.0 s)

Requirement IDs: Purpose (spec section 1).

```
+----------------------------+
|         12:24 PM           |   clock, mono 96, yellow
|                            |
| o [Anything lor.]          |
|          [Up to you.] o    |
| o [You choose leh.]        |   grey bubbles, slightly
|             [Dunno.] o     |   rotated, overlapping
| o [Anything, but not that.]|
|                            |
|   Every day, same question.|   caption 64/800, cream
|      Nobody decides.       |
+----------------------------+
```

**Shot 2A, 3.0–5.8 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Background | | full viewport, `ink` | 3.0 | 8.0 | hard cut in |
| Clock | `12:01 PM` rolling to `12:24 PM` | centred, baseline y 300, data 96 px, `yellow` | 3.0 | 8.0 | Arrives from its beat 1 position (300 ms `snap`). From 3.4 to 5.8 s the minutes count 01 to 24, one step every 100 ms, each digit change a 60 ms vertical flip. Lands exactly on `12:24 PM` at 5.8 s. |
| Bubble 1 | "Anything lor." | left, x 170, y 440, rotate -2° | 3.3 | 8.0 | `drift` from x -40 px and opacity 0. After landing, all group bubbles bob ±6 px vertically on a 2.4 s sine loop, phases offset by 0.4 s. |
| Bubble 2 | "Up to you." | right edge x 910, y 580, rotate 1.5° | 3.8 | 8.0 | `drift` from x +40 px |
| Bubble 3 | "You choose leh." | left, x 170, y 720, rotate 1° | 4.3 | 8.0 | `drift` from x -40 px |
| Bubble 4 | "Dunno." | right edge x 910, y 850, rotate -2.5° | 4.8 | 8.0 | `drift` from x +40 px |
| Bubble 5 | "Anything, but not that." | left, x 170, y 980, rotate 2° | 5.2 | 8.0 | `drift` from x -40 px. Sits 20 px over the bottom edge of bubble 4's row so the bubbles overlap. |

Sender dots sit on the outer side of each bubble and move with it.

**Shot 2B, 5.8–8.0 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Clock | `12:24 PM` | as above | holds | 8.0 | One pulse at 5.8 s: scale 1.0 to 1.12 to 1.0, 300 ms. |
| Caption | "Every day, same question. Nobody decides." | caption zone, two lines ("Every day, same question." / "Nobody decides."), `cream` | 5.8 | 8.0 | Caption-in. On screen 2.2 s. |

- Caption/VO: "Every day, same question. Nobody decides."
- Transition out at 8.0 s: hard cut (the brief's "hard cut to the Lunch Uncle phone"). Everything from beat 2 is removed in one frame.

### Beat 3: Meet Uncle (8.0–11.0 s)

Requirement IDs: FR-1, FR-2, FR-28.

```
+----------------------------+
|      (red background)      |
|   .--------------------.   |
|   | Lunch Uncle        |   |   header, cream on ink
|   |--------------------|   |
|   | [Eh, what you want |   |   Uncle bubble, cream
|   |  to eat? Don't     |   |
|   |  waste my time.]   |   |
|   |                    |   |
|   '--------------------'   |
|        So ask Uncle.       |   caption, cream
+----------------------------+
```

**Shot 3, 8.0–11.0 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Background | | full viewport, `red` | 8.0 | 20.0 | hard cut in |
| Phone frame + header | "Lunch Uncle" | phone zone | 8.0 | 36.0 | On from the first frame of the cut. A single settle: scale 1.04 to 1.0, `snap`. |
| Uncle greeting bubble | "Eh, what you want to eat? Don't waste my time." | chat area, first bubble, y 420 | 8.4 | scrolls out at 20.0 | Bubble-in. On screen 2.6 s in this beat and stays through beat 4. |
| Caption | "So ask Uncle." | caption zone, one line, `cream` | 8.8 | 11.0 | Caption-in. On screen 2.2 s. Caption-out starting 10.85 s. |

- Caption/VO: "So ask Uncle."
- Transition out at 11.0 s: none. The phone and greeting stay; beat 4 continues in the same frame.

### Beat 4: Capability 1, real places (11.0–20.0 s)

Requirement IDs: FR-3, FR-4, FR-31, FR-33, FR-36, FR-38, FR-40, FR-41, FR-43.

```
+----------------------------+
|   .--------------------.   |
|   | Lunch Uncle        |   |
|   |--------------------|   |
|   | [Eh, what you ...] |   |
|   |  [Something soupy, |   |   user bubble, red, right
|   |    not too far.]   |   |
|   | [Go [fish soup     |   |   Uncle reply, cream, left
|   |  place]. 4.4 stars,|   |
|   |  250 m, open now...|   |
|   '--------------------'   |
|  ( 4.4 * . 250 m . open now ) |  callout pill, ink/cream
|  Real places near CT Hub 2.|   caption, cream
|  One or two picks, not ten.|
|  Illustrative chat. Real answers use live data. |
+----------------------------+
```

**Shot 4A, 11.0–13.1 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Footnote | "Illustrative chat. Real answers use live data." | footnote zone, centred, footnote 32 px, `cream` at 85% opacity | 11.0 | 36.0 | Fade in 200 ms. Stays through beats 4 to 6; its colour switches to `ink` at 85% during the yellow wipe (28.0 to 28.5 s). |
| User bubble | "Something soupy, not too far." | chat area, below the greeting, right-aligned | 11.3 | scrolls out at 20.0 | Bubble-in |
| Thinking bubble | "Uncle thinking..." | chat area, below the user bubble, left-aligned, Uncle style | 12.3 | becomes the reply at 13.1 | Bubble-in. The three dots pulse opacity in sequence, 600 ms loop. |

**Shot 4B, 13.1–15.6 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Uncle reply | "Go [fish soup place]. 4.4 stars, 250 m, open now. Hot soup, near enough. Or Berseh Food Centre, more choice." | same bubble as the thinking bubble | 13.1 | scrolls out at 20.0 | Thinking swap. On screen 6.9 s. If the three bubbles exceed the chat area, the chat content scrolls up just enough (`snap`) to show the whole reply; the greeting may clip at the top. |
| Callout pill | `4.4 ★ · 250 m · open now` | callout zone, pill 110 px tall, fill `ink`, text `cream`, data 56 px; a 22 px `green` dot precedes "open now" | 14.6 | 20.0 | Caption-in, then the three segments pulse one after another (scale 1.0 to 1.1 to 1.0, 250 ms each, at 14.9, 15.15 and 15.4 s). At the same times the matching words in the bubble ("4.4 stars", "250 m", "open now") get a `yellow` underline highlight that stays. |

**Shot 4C, 15.6–20.0 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Caption | "Real places near CT Hub 2. One or two picks, not ten." | caption zone, two lines (break after "CT Hub 2."), `cream` | 15.6 | 20.0 | Caption-in. On screen 4.4 s. Caption-out starting 19.85 s. |

- Caption/VO: "Real places near CT Hub 2. One or two picks, not ten."
- Transition out at 20.0 s: blue colour wipe (20.0 to 20.5 s). The callout fades with the caption at 19.85 s. Chat content scrolls up and out during the wipe.

### Beat 5: Capability 2, rain (20.0–28.0 s)

Requirement IDs: FR-34, FR-45, FR-46.

```
+----------------------------+
| ' ' (blue, raindrops) ' [U]|   umbrella icon, top right
|   .--------------------.   |
| ' | Lunch Uncle        | ' |
|   |--------------------|   |
| ' |   [Raining or not? |   |   user bubble
|   |      Can walk?]    | ' |
|   | [Kallang side, next|   |   Uncle reply
| ' |  two hours:        |   |
|   |  showers. ...]     | ' |
|   '--------------------'   |
|  Checks the two-hour rain  |   caption, cream
|  forecast before you walk. |
|  Illustrative chat. ...    |
+----------------------------+
```

**Shot 5A, 20.0–22.5 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Background | | full viewport, `blue` | 20.0–20.5 | 28.0 | Colour wipe, bottom to top |
| Raindrops | | 14 inline-SVG drops (cream, 35% opacity, 10 x 34 px, tilted 12°) in the side margins (x 0 to 130 and x 950 to 1080) and above the phone (y < 250); on wide viewports also across the side bands. Never over the phone. | 20.4 | 28.0 | Each falls top to bottom, 900 to 1300 ms linear loop, staggered starts. Fade in over 300 ms. |
| User bubble | "Raining or not? Can walk?" | chat area, first bubble, y 420, right-aligned | 20.8 | scrolls out at 28.0 | Bubble-in |
| Thinking bubble | "Uncle thinking..." | below the user bubble | 21.8 | becomes the reply at 22.5 | Bubble-in, dots pulse |

**Shot 5B, 22.5–28.0 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Uncle reply | "Kallang side, next two hours: showers. Bring umbrella lah. Or just take the nearer one." | same bubble | 22.5 | scrolls out at 28.0 | Thinking swap. On screen 5.5 s. |
| Umbrella icon | | icon slot, inline SVG, `cream` canopy with `yellow` handle, 150 px | 23.5 | 28.0 | Opens: canopy scaleX 0.15 to 1.0 from its centre, 260 ms `snap`. Then still. |
| Caption | "Checks the two-hour rain forecast before you walk." | caption zone, two lines (break after "rain"), `cream` | 24.0 | 28.0 | Caption-in. On screen 4.0 s. Caption-out starting 27.85 s. |

- Caption/VO: "Checks the two-hour rain forecast before you walk."
- No callout in this beat (the brief gives none).
- Transition out at 28.0 s: yellow colour wipe (28.0 to 28.5 s). Raindrops and umbrella fade out over the first 200 ms. Chat content scrolls up and out.

### Beat 6: Capability 3, bus arrivals (28.0–36.0 s)

Requirement IDs: FR-35, FR-48, FR-49, FR-50.

```
+----------------------------+
|   (yellow background)   [P]|   bus-stop pole icon
|   .--------------------.   |
|   | Lunch Uncle        |   |
|   |--------------------|   |
|   |  [Stop 12345, bus  |   |   user bubble
|   |   coming or not?]  |   |
|   | [Stop 12345. Next  |   |   Uncle reply
|   |  bus 3 min, the one|   |
|   |  after 11 min. ...]|   |
|   '--------------------'   |
|     ( 3 min . 11 min )     |   callout pill, ink/cream
|  Live bus arrivals. Just   |   caption, ink
|  give the five-digit stop  |
|  code.                     |
|  Illustrative chat. ...    |
+----------------------------+
```

**Shot 6A, 28.0–30.5 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Background | | full viewport, `yellow` | 28.0–28.5 | 36.0 | Colour wipe, bottom to top |
| Bus-stop pole icon | | icon slot, inline SVG: a vertical `ink` pole with a blank rounded `ink` sign plate carrying a simple `cream` bus glyph. No service numbers, no operator colours. | 28.5 | 36.0 | Rises from 60 px below with opacity 0 to 1, `snap` |
| User bubble | "Stop 12345, bus coming or not?" | chat area, first bubble, y 420, right-aligned | 28.8 | 36.0 | Bubble-in |
| Thinking bubble | "Uncle thinking..." | below the user bubble | 29.8 | becomes the reply at 30.5 | Bubble-in, dots pulse |

**Shot 6B, 30.5–36.0 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Uncle reply | "Stop 12345. Next bus 3 min, the one after 11 min. Walk faster lah." | same bubble | 30.5 | 36.0 | Thinking swap. On screen 5.5 s. |
| Callout pill | `3 min · 11 min` | callout zone, pill fill `ink`, text `cream`, data 56 px | 31.8 | 36.0 | Caption-in, then the two segments pulse at 32.0 and 32.25 s (250 ms each). "3 min" and "11 min" in the bubble get an `ink` underline at the same times. |
| Caption | "Live bus arrivals. Just give the five-digit stop code." | caption zone, up to three lines, `ink` | 32.5 | 36.0 | Caption-in. On screen 3.5 s. Caption-out starting 35.85 s. |

- Caption/VO: "Live bus arrivals. Just give the five-digit stop code."
- Transition out at 36.0 s: `ink` colour wipe (36.0 to 36.4 s, same motion, 400 ms). The phone, icon, callout and footnote fade out in the first 150 ms.

### Beat 7: Payoff (36.0–41.0 s)

Requirement IDs: FR-36, FR-38, FR-32.

```
+----------------------------+
|       (ink background)     |
|                            |
|        [Settled.] (v)      |   cream bubble, green tick
|                            |
|       Real places.         |   88/800, cream
|       Rain forecast.       |
|       Live buses.          |
|       One opinion.         |   yellow
|                            |
+----------------------------+
```

**Shot 7A, 36.0–37.2 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Background | | full viewport, `ink` | 36.0–36.4 | 45.0 | Colour wipe |
| Dithering bubbles | the five beat 2 bubbles, same text and positions, no clock | as in beat 2 | 36.2 (fade in 200 ms, already in place, still bobbing) | 37.2 | At 36.7 s they collapse: each scales to 0 and moves towards the "Settled." bubble, 450 ms `snap`, staggered 40 ms. Gone by 37.2 s. |
| "Settled." bubble | "Settled." | centred, y 460, fill `cream`, text `ink`, chat type at 56 px / 700, no rotation | 36.5 | 41.0 | Bubble-in (`snap`). It is the only square, still thing on screen. |
| Tick | | 72 px `green` circle with a `cream` tick, touching the bubble's right edge | 36.7 | 41.0 | Scale 0 to 1, `snap`; tick stroke draws in 200 ms. |

**Shot 7B, 37.2–41.0 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Line 1 | "Real places." | centred, y 760, caption 88 px, `cream` | 37.2 | 41.0 | Caption-in |
| Line 2 | "Rain forecast." | centred, y 880, `cream` | 37.7 | 41.0 | Caption-in |
| Line 3 | "Live buses." | centred, y 1000, `cream` | 38.2 | 41.0 | Caption-in |
| Line 4 | "One opinion." | centred, y 1120, `yellow` | 38.7 | 41.0 | Caption-in. On screen 2.3 s. |

- Caption/VO: "Real places. Rain forecast. Live buses. One opinion." (the stacked lines are the caption).
- Transition out at 41.0 s: the bubble, tick and four lines slide up 40 px and fade, 250 ms, while the end card starts building. Background stays `ink`.

### Beat 8: End card (41.0–45.0 s)

Requirement IDs: Purpose and target users (spec section 1), FR-1.

```
+----------------------------+
|       (ink background)     |
|                            |
|        Lunch Uncle         |   wordmark 120/900, cream
|                            |
|   Don't think so much.     |   64/800, cream
|        Ask Uncle.          |
|                            |
|     [ Open [APP_URL] ]     |   red pill, cream text
|                            |
| For lunch around CT Hub 2, |   44/500, grey
|         Lavender.          |
+----------------------------+
```

**Shot 8A, 41.0–43.5 s**

| Element | Text | Position | In | Out | Motion |
|---|---|---|---|---|---|
| Wordmark | "Lunch Uncle" | centred, y 620, headline 120 px, `cream` | 41.3 | 45.0 | Caption-in |
| Tagline | "Don't think so much. Ask Uncle." | centred, two lines (break after "much."), top y 860, caption 64 px, `cream` | 41.9 | 45.0 | Caption-in. On screen 3.1 s. |
| CTA | "Open [APP_URL]" | centred pill, top y 1140, 120 px tall, fill `red`, text `cream`, sans 56 px / 800; `[APP_URL]` in the data font. The token is replaced by the real address only at build time, never invented. | 42.5 | 45.0 | Caption-in |
| Location line | "For lunch around CT Hub 2, Lavender." | centred, top y 1340, sans 44 px / 500, `grey` | 42.9 | 45.0 | Fade in 200 ms. All motion finished by 43.1 s. |

**Shot 8B, 43.5–45.0 s**

- Completely static. No motion, loops or pulses of any kind for the last 1.5 s.
- At 45.0 s the animation stops on this frame (no loop by default; a replay control may sit outside the stage).

- Caption/VO: "Don't think so much. Ask Uncle."

## 3. Reading-time check

| Text | On screen | Verdict |
|---|---|---|
| "Where to eat ah?" (4 words) | 1.8 s | Short for a caption, fine for 4 words at 120 px. Fixed by the 3 s hook. |
| "Every day, same question. Nobody decides." | 2.2 s | OK |
| Greeting bubble | 2.6 s in beat 3, then stays through beat 4 | OK |
| "So ask Uncle." | 2.2 s | OK |
| Places reply (20 words) | 6.9 s | OK |
| "Real places near CT Hub 2. One or two picks, not ten." | 4.4 s | OK |
| Rain reply (15 words) | 5.5 s | OK |
| "Checks the two-hour rain forecast before you walk." | 4.0 s | OK |
| Bus reply (14 words) | 5.5 s | OK |
| "Live bus arrivals. Just give the five-digit stop code." | 3.5 s | OK |
| Stacked lines | 3.8 s for the first, 2.3 s for the last | OK |
| Tagline | 3.1 s | OK |
| CTA and location line | 2.5 s and 2.1 s | OK |

## 4. Adjustments made within beats

No copy and no beat boundary was changed by the storyboard. One line was changed afterwards by the director: beat 7 "Live rain." became "Rain forecast." (see section 6, problem 1).

1. **Beat 2:** the caption enters at 5.8 s, together with the clock landing, not after the last bubble has settled, so it gets 2.2 s on screen.
2. **Beat 3:** the phone is on from the first frame of the cut (no entrance animation) so the greeting and the caption both fit in 3 s. The caption is on for 2.2 s.
3. **Beat 7:** the brief says "three short lines stack", but its copy has four ("Real places. Rain forecast. Live buses. One opinion."). All four are shown. The stack starts at 37.2 s with a 0.5 s stagger so the last line holds 2.3 s.
4. **Thinking state:** held for 0.7 to 0.8 s, not "a few frames", so it is noticed and matches FR-4, while leaving the reply at least 5.5 s.
5. **Chat scroll:** the previous exchange scrolls out during each colour wipe, so each capability beat shows one exchange. This follows the brief's "one idea per screen" and reads as the real page's auto-scroll (FR-9).
6. **Footnote size:** 32 px, below the brief's 44 px minimum. It is a disclaimer, not a selling line, and at 44 px it would not fit on one line or would compete with the caption. Flagged below.
7. **Highlights in the bubble:** an underline on the numbers inside the bubble ties them to the callout. It is a video annotation drawn over plain text, not a UI element; drop it if the director reads guardrail 2 as forbidding it.

## 5. Claims-to-requirements checklist

IDs were checked against the text of `docs/requirements.md`. "[prompt]" means the spec says the behaviour is requested of the model and not enforced.

| # | On-screen claim | Where | Requirement IDs | Supported? |
|---|---|---|---|---|
| 1 | The app is for deciding where to eat lunch | Beats 1, 2, 8 | Purpose (section 1) | Yes |
| 2 | Uncle greets with "Eh, what you want to eat? Don't waste my time." | Beat 3 | FR-2 | Yes, exact text |
| 3 | You ask in plain language in a chat | Beat 4 | FR-3, FR-5, FR-33 [prompt] | Yes |
| 4 | "Uncle thinking..." shows, then the whole reply | Beats 4 to 6 | FR-4, FR-6 | Yes. No streaming, per the out-of-scope list |
| 5 | Replies are plain text | Beats 3 to 6 | FR-8 | Yes |
| 6 | "Real places" | Beats 4, 7 | FR-40, FR-32 [prompt] | Yes: results come from Google Places. Not inventing places is [prompt] only |
| 7 | "near CT Hub 2" | Beat 4 | FR-41 (pending), FR-31 [prompt] | Yes once the pending fix is merged. The search is biased to 800 m, not restricted (limitation 4) |
| 8 | Rating, distance in metres, open now | Beat 4 bubble and callout | FR-43 (`open_now` and origin pending) | Yes once merged. Distance is straight-line (limitation 5); shown as metres only |
| 9 | "One or two picks, not ten." | Beat 4 | FR-36 [prompt] | Requested of the model, not enforced (limitation 24) |
| 10 | Short replies | All Uncle bubbles | FR-38 [prompt] | Requested, not enforced |
| 11 | "Checks the two-hour rain forecast before you walk." | Beat 5 | FR-34 [prompt], FR-45 | Yes: it checks when asked about rain, weather or walking |
| 12 | "Kallang side, next two hours: showers." | Beat 5 bubble | FR-46 | Yes: output is area "Kallang", a forecast and a valid period |
| 13 | "Live bus arrivals." | Beats 6, 7 | FR-49, FR-50 | Yes |
| 14 | "Just give the five-digit stop code." | Beat 6 | FR-35 [prompt], FR-48 | Yes. The code is required from the user (limitation 8) |
| 15 | Next and following arrival in minutes | Beat 6 bubble and callout | FR-50 (`next_min`, `subsequent_min`) | Yes |
| 16 | "Rain forecast." | Beat 7 | FR-45, FR-46 | Yes: the source is a two-hour area forecast. Changed from "Live rain." (problem 1) |
| 17 | "One opinion." | Beat 7 | FR-28 [prompt], FR-36 [prompt] | Requested, not enforced |
| 18 | Opens in a browser at an address | Beat 8 | FR-1, target users (section 1) | Yes. Address unknown: `[APP_URL]` |
| 19 | "For lunch around CT Hub 2, Lavender." | Beat 8 | Purpose (section 1), FR-31, FR-41 | Yes |

## 6. Problems found with the brief

1. **"Live rain." overclaimed (beat 7). Resolved.** FR-45 and FR-46 give a two-hour forecast for the Kallang area, and guardrail 6 itself says not to imply more precision than that. The director changed the line to "Rain forecast." after this storyboard was written; the brief, this storyboard and the video now all use it.
2. **"Three short lines stack" against four lines of copy (beat 7).** Resolved by showing all four.
3. **Word counts in the brief are off by one** for two Uncle lines: the rain reply is 15 words (brief says 16) and the bus reply is 14 (brief says 13). No effect on the video.
4. **The bus reply is less specific than a real one.** The tool returns arrivals per service (FR-50), so a real reply would normally name service numbers. Guardrail 5 forbids showing them, so "Next bus 3 min" stays generic. Covered by the footnote, but it is the least true-to-life exchange.
5. **`★` in the callout.** It is outside the phone, so guardrail 2 allows it, but the glyph may be missing from a system monospace font and fall back to another face. The builder should draw the star as inline SVG or set that one character in the sans stack.
6. **Footnote against the 44 px minimum.** The brief asks for a "small" footnote and also a 44 px minimum for lobby-readable text. Storyboarded at 32 px as a disclaimer.
7. **Phone colours differ from the real page.** The current `src/ui.html` uses yellow Uncle bubbles and blue user bubbles on a light page, and a UI redesign is in progress on another branch. The video's phone should be reconciled with the redesigned colours before a final edit, or it will not match what people see when they open the app.
8. **Release dependencies (from the brief, repeated here because they gate claims 7 and 8):** FR-41 and FR-43 are pending, and `LLM_BASE_URL` / `LLM_MODEL` are still `"TODO"` (limitation 1), so the app cannot yet give the answers shown.
9. **A 3-second beat 3 is tight.** It works only because the phone appears without an entrance animation. If a later edit adds one, take the time from beat 4, which has slack.
