# Lunch Uncle 45-second promo: creative brief

Source of truth: `docs/requirements.md` (the requirements spec). Voice reference: `src/prompt.js`.

**Dependency to relay:** the headline claims rest on requirements the spec marks *(pending)*: search centred on CT Hub 2 (FR-41) and open-now plus distance from CT Hub 2 (FR-43). Limitation 1 also says the LLM endpoint constants are still `"TODO"`. The video should not be released before those are merged and configured.

## 1. Idea and insight

**Idea:** At 12 noon nobody in the group chat can decide, so ask the one uncle who will: he checks real places, the rain and the bus, then tells you where to go.

**Insight:** The daily "where to eat ah?" is not a shortage of options. It is twenty minutes of "anything lor" and "up to you" because nobody wants to choose. People want one confident opinion, not another list.

## 2. Audience, tone, what to avoid

- **Audience:** people working at or visiting CT Hub 2, Lavender, who see this in office chat groups or on a lobby or pantry screen just before lunch.
- **Tone:** dry, brisk, affectionate. Uncle is grumpy about indecision, never about people. The humour comes from the contrast between the dithering chat and his short answers.
- **Avoid:**
  - Any uncle illustration, face, singlet, kopi-cup mascot or other stereotype visual. Uncle exists only as chat bubbles and a name.
  - Mock-accent spelling, insults, slurs.
  - Superlatives the app cannot back ("best", "always right", "fastest").
  - Anything the spec excludes: walking directions or walking times, prices, menus, cuisine filters, bookings, photos, maps, saved history, other locations, personalisation.
  - The word "AI" as the selling point. The selling point is the decision.

## 3. Format

**Primary: 9:16 vertical, 1080 x 1920, 45.0 s, 30 fps timing grid.**

- The piece is a phone chat, and office chat groups are watched on phones, which is where a tap-through to the app happens.
- For the landscape lobby or pantry screen, build the stage as a centred 9:16 column and let the background colour and rain or clock motifs fill the sides. No content sits outside the column.
- Keep copy inside a safe area of 80 px at the sides and 160 px at top and bottom.

## 4. Visual language

**Palette**

| Role | Hex |
|---|---|
| Kopi ink (background, body text on light) | `#1F1A17` |
| Cream (Uncle bubbles, light backgrounds) | `#FFF6E5` |
| Chilli red (brand accent, hook, CTA) | `#E03A1E` |
| Kaya yellow (highlights, bus beat) | `#FFC533` |
| Pandan green ("open now", payoff tick) | `#0F8B6C` |
| Rain blue (rain beat) | `#2F6FDE` |
| Warm grey (user bubbles in the group chat, secondary text) | `#8A7F76` |

**Type (system fonts only)**

- Headlines: `-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`, weight 800 to 900, tight tracking, sentence case.
- Chat text: same stack, weight 400 to 500.
- Data (clock, stop code, minutes, metres, rating): `ui-monospace, "SF Mono", Menlo, Consolas, monospace`, weight 700.
- Minimum 44 px for anything that must be read on the lobby screen at 1080 x 1920.

**Motion principles**

- Indecision is slow and wobbly: bubbles drift in, overlap, the clock ticks.
- Uncle is fast and square: his bubbles snap in with a hard ease-out (about 180 ms) and no bounce.
- One idea per screen. Each capability beat has the same three-step rhythm: user asks, "Uncle thinking..." for a few frames, Uncle answers, then one caption lands outside the phone.
- Colour-wipe transitions between beats (red, then blue for rain, yellow for bus). No 3D, no parallax clutter.
- Every word stays on screen long enough to read twice.

**Chat UI depiction**

- A stylised flat phone frame (rounded rectangle, no brand hardware details) with a header reading "Lunch Uncle".
- User bubbles right-aligned in chilli red with cream text. Uncle bubbles left-aligned in cream with ink text.
- Replies are plain text only, as in the real app (FR-8). No cards, thumbnails, maps, links, star icons or buttons inside the chat.
- Data emphasis happens outside the phone: a caption or a monospace callout that repeats the numbers from the bubble.
- Placeholder place names are shown in square brackets inside the bubble, for example `[fish soup place]`, so they read as illustrative.
- A small persistent footnote during beats 4 to 6: "Illustrative chat. Real answers use live data."
- Simple inline-SVG icons only: clock, raindrops, umbrella, bus-stop pole, tick.

## 5. Narrative arc (45 s)

| # | Time | Beat | What happens | Requirement IDs |
|---|---|---|---|---|
| 1 | 0–3 s | Hook | Red full-bleed. Monospace clock "12:01 PM" slams in, then the headline "Where to eat ah?" | Purpose (section 1) |
| 2 | 3–8 s | Problem | A generic office group chat fills with dithering bubbles while the clock rolls to 12:24. Caption lands. | Purpose (section 1) |
| 3 | 8–11 s | Meet Uncle | Hard cut to the Lunch Uncle phone. His greeting bubble snaps in. | FR-1, FR-2, FR-28 |
| 4 | 11–20 s | Capability 1: real places, one or two picks | User asks in plain language. "Uncle thinking..." flashes. Uncle answers with one pick plus a second option. Rating, metres and "open now" pulse in a monospace callout outside the phone. | FR-3, FR-4, FR-31, FR-33, FR-36, FR-38, FR-40, FR-41, FR-43 |
| 5 | 20–28 s | Capability 2: rain before you walk | Blue wipe, raindrops outside the phone. User asks about rain. Uncle gives the two-hour forecast. Umbrella icon opens. | FR-34, FR-45, FR-46 |
| 6 | 28–36 s | Capability 3: live bus arrivals | Yellow wipe, bus-stop pole icon. User gives a five-digit stop code. Uncle gives minutes. | FR-35, FR-48, FR-49, FR-50 |
| 7 | 36–41 s | Payoff | Back to the group chat from beat 2. One new bubble, "Settled.", with a green tick, and the dithering bubbles collapse. Three short lines stack. | FR-36, FR-38, FR-32 |
| 8 | 41–45 s | End card and CTA | Ink background. Wordmark "Lunch Uncle" in cream, tagline, CTA in red, location line. Hold the last 1.5 s completely still. | Purpose and target users (section 1), FR-1 |

Timings: 3 + 5 + 3 + 9 + 8 + 8 + 5 + 4 = 45 s.

## 6. Final copy, word for word

VO and captions are the same words, so the piece works muted. Uncle's lines appear as chat bubbles and are not narrated in this draft.

**Beat 1 (0–3 s)**
- On screen: `12:01 PM`
- Headline and VO: "Where to eat ah?"

**Beat 2 (3–8 s)**
- Group chat bubbles, in order: "Anything lor." / "Up to you." / "You choose leh." / "Dunno." / "Anything, but not that."
- Clock: `12:24 PM`
- Caption and VO: "Every day, same question. Nobody decides."

**Beat 3 (8–11 s)**
- Phone header: "Lunch Uncle"
- Uncle bubble (exact app greeting, FR-2): "Eh, what you want to eat? Don't waste my time."
- Caption and VO: "So ask Uncle."

**Beat 4 (11–20 s)**
- User bubble: "Something soupy, not too far."
- Placeholder bubble (FR-4): "Uncle thinking..."
- Uncle bubble (20 words): "Go [fish soup place]. 4.4 stars, 250 m, open now. Hot soup, near enough. Or Berseh Food Centre, more choice."
- Callout outside phone (monospace): `4.4 ★ · 250 m · open now`
- Caption and VO: "Real places near CT Hub 2. One or two picks, not ten."

**Beat 5 (20–28 s)**
- User bubble: "Raining or not? Can walk?"
- Uncle bubble (16 words): "Kallang side, next two hours: showers. Bring umbrella lah. Or just take the nearer one."
- Caption and VO: "Checks the two-hour rain forecast before you walk."

**Beat 6 (28–36 s)**
- User bubble: "Stop 12345, bus coming or not?"
- Uncle bubble (13 words): "Stop 12345. Next bus 3 min, the one after 11 min. Walk faster lah."
- Callout outside phone (monospace): `3 min · 11 min`
- Caption and VO: "Live bus arrivals. Just give the five-digit stop code."

**Beat 7 (36–41 s)**
- Group chat bubble: "Settled."
- Stacked lines and VO: "Real places. Live rain. Live buses. One opinion."

**Beat 8 (41–45 s)**
- Wordmark: "Lunch Uncle"
- Tagline and VO: "Don't think so much. Ask Uncle."
- CTA: "Open [APP_URL]"
- Location line: "For lunch around CT Hub 2, Lavender."

**Full VO script, about 60 words:**
"Where to eat ah? Every day, same question. Nobody decides. So ask Uncle. Real places near CT Hub 2. One or two picks, not ten. Checks the two-hour rain forecast before you walk. Live bus arrivals. Just give the five-digit stop code. Real places. Live rain. Live buses. One opinion. Don't think so much. Ask Uncle."

## 7. Sound direction (for a later edit, not built now)

- **Music:** light, dry percussion with a walking bass at about 100 bpm. It is sparse and hesitant in beats 1 to 2, locks into a groove when Uncle arrives at 8 s, and ends on a single clean hit at the end card.
- **SFX:** soft clock tick under the problem beat; a short, woody "tok" on each Uncle bubble; light rain bed in beat 5; a bus-door chime or air hiss in beat 6; one small "ding" on "Settled."
- **Voice:** warm, natural Singaporean narrator at an unhurried pace. If Uncle's lines are ever voiced, cast an older Singaporean speaker reading naturally, with no exaggerated accent or comic delivery.
- **Mix:** VO always sits above the music, and nothing depends on sound to be understood.

## 8. Guardrails for the storyboard artist

1. Do not draw Uncle. No face, body, avatar or mascot. He is the bubbles and the name.
2. Inside the phone, plain text bubbles only. No maps, photos, cards, menus, prices, links, star widgets or buttons.
3. Do not name any real business. The only real place name allowed is "Berseh Food Centre", and it must never carry a rating, distance or open status. Everything else is a bracketed generic such as `[fish soup place]`.
4. Distances are shown as metres only. Never "X min walk", never a route line or a pin on a map.
5. The stop code `12345`, the minutes, the rating and the forecast are illustrative. Keep the footnote "Illustrative chat. Real answers use live data." visible in beats 4 to 6, and do not show bus service numbers.
6. Rain is described as "two-hour forecast" and "Kallang side". Do not imply street-level or minute-by-minute precision.
7. Do not show conversation history, saved favourites, a profile, a login or a location picker. The app has none.
8. Do not show replies streaming word by word. The real app shows "Uncle thinking..." and then the whole reply.
9. The group chat in beats 2 and 7 is a generic messaging look. Do not imitate any real messaging app's branding, colours or icons.
10. Uncle's wording is fixed as written in section 6. Do not add particles, re-spell words or lengthen replies. The greeting must match FR-2 exactly.
11. No absolute promises ("always", "best", "guaranteed"). The reply-style behaviours are prompt-requested, not enforced.
12. The CTA carries the token `[APP_URL]` exactly, and no invented URL or QR code.
13. Every frame must work muted and be readable at lobby-screen distance.
14. The total runtime is exactly 45.0 s, with the last 1.5 s a static end card.
