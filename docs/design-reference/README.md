# Handoff: Lyndon Johnson Art Gallery

## Overview

A single-artist personal art gallery website for the painter Lyndon Johnson. One artist, one collection, no commerce, no blog, no social. The entire experience is: a quiet wall of work + a detail view that opens into a 3D-framed painting you can spin a full 360° (front + verso/back-of-canvas), with a flip to a flat 2D image. Plus a one-page about.

The vibe is a private gallery in a converted warehouse — white walls, white floors, the art is the only thing that talks.

## About the Design Files

The files in `reference/` are **design references created in HTML** (a React-via-Babel prototype). They demonstrate intended look, layout, copy, and behavior. **They are not production code to copy directly.**

Your task is to **recreate these designs in the target codebase's environment** — for this project, the brief specifies Next.js 15 (App Router) + Tailwind CSS 4 + Three.js / React Three Fiber + Drei + Framer Motion. Use those libraries and the codebase's established patterns. The HTML prototype simulates the 3D framed view with CSS perspective; in production, replace that with real Three.js geometry as described in the original brief.

If you discover the codebase has different conventions or libraries already in place, prefer those over the suggested stack — match the project, don't fight it.

## Fidelity

**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are settled. Recreate the UI pixel-perfectly. The only thing intentionally placeholder is the imagery (Unsplash painting photos stand in for Lyndon's actual work) and the back-of-canvas verso (a stylized SVG block stands in for what will eventually be a real photograph of each canvas's back).

## Pages / Views

There are **three** views:

1. **Gallery (home)** — `/` — the wall of paintings.
2. **Piece detail** — `/[slug]` — opens as a full-screen overlay on top of the gallery; the URL updates so each piece is shareable. Direct navigation to `/[slug]` should also work.
3. **About** — `/about` — a single full page.

Header and footer are present on every view (the detail overlay covers them).

---

### 1. Gallery (Home)

**Purpose:** Present the entire collection as a wall of work. The art is the interface.

**Layout — Editorial grid:**

This project uses **only the editorial grid layout** (the masonry and uniform variants from the prototype have been dropped). Editorial = a CSS grid where most cards occupy one column, but selected pieces — those flagged `featured: true`, plus every 7th piece (index `i % 7 === 3`) — span 2 columns. Each card's aspect ratio also varies by position to create rhythm:

- Featured cards: `aspect-ratio: 5 / 4`, span 2 columns
- Every 3rd card (`i % 3 === 0`): `aspect-ratio: 4 / 5` (portrait)
- All others: `aspect-ratio: 1 / 1` (square)

**Grid configuration:**
- Container padding: `max(40px, 4vw)` left/right, same top, no bottom (footer handles it)
- `display: grid`
- `grid-template-columns: repeat(4, 1fr)` on desktop (default 4 columns)
- `gap: 42px 28px` (calc: 1.5× row gap, 1× column gap, where base gap = 28px "breathing")
- Responsive columns: 4 on desktop ≥ 1024px, 3 on tablet 768–1023px, 2 on mobile 480–767px, 1 on small mobile < 480px. (When < 3 columns, featured pieces should NOT span — drop the span override below 3 columns to avoid awkward stretching.)

**Section label** (above the grid):
- Copy: `paintings · {count}` (lowercase, e.g. "paintings · 30")
- Font: Inter 13px, color `#999`, `letter-spacing: 0.22em`, `text-transform: uppercase`
- Margin-bottom: 36px, padding-left: 2px

**Art card:**
```
┌─────────────────────────┐
│                         │
│       [artwork]         │  ← image fills card via object-fit: cover
│                         │
└─────────────────────────┘
  Untitled No. 4              ← 14px Inter, #333, letter-spacing 0.01em
  Oil on canvas, 2023         ← 12.5px Inter, #999, letter-spacing 0.02em, mt 3px
```

- Image container: `background: #f0ede8` (placeholder while loading), `overflow: hidden`, `box-shadow: 0 1px 3px rgba(0,0,0,0.04)`
- Image: `object-fit: cover`, `width: 100%`, `height: 100%`, `display: block`
- Image fade-in on load (opacity 0 → 1, 500ms ease) — use `loading="lazy"` and an Intersection Observer or Next/Image
- Padding above text labels: 12px
- Cards have NO border, NO border-radius, NO outer container — they float on the white background

**Card hover state:**
- `transform: translateY(-2px)`
- `box-shadow: 0 8px 30px rgba(0,0,0,0.10)`
- `transition: transform 200ms ease, box-shadow 300ms ease`
- Cursor: pointer

**Click behavior:** Open detail overlay for that piece; URL updates to `/{slug}`.

---

### 2. Piece Detail (Overlay)

**Purpose:** Let a visitor inspect a single painting. Opens straight into the 3D framed view (the painting as a physical object). They can spin it 360° to see the verso (back of canvas) where Lyndon writes notes. A right arrow flips to the flat 2D image.

**Layout — full-screen overlay:**
- `position: fixed; inset: 0; z-index: 1000; background: #ffffff`
- Three rows: top bar (64px), stage (flex: 1), bottom info bar (auto)
- Cross-fade between the framed view and flat view (350ms ease) — both rendered, opacity-toggled, pointer-events disabled on the inactive one

**Top bar (64px):**
- `padding: 0 32px`, `border-bottom: 1px solid #f0f0f0`
- Left: cursive logo "Lyndon Johnson" — `font-family: 'Cormorant Garamond'`, `font-style: italic`, `font-weight: 300`, `font-size: 26px`, `color: #1a1a1a`, `white-space: nowrap`
- Right: prev / next text buttons + close (×). Each is 11px Inter, `letter-spacing: 0.18em`, uppercase, `color: #999`. Close is 24px ×, no border, transparent background.

**Stage modes:**

The stage is one of two modes at any time: `framed` (default on open) or `flat`. Mode also toggles via `←` and `→` keys.

**Mode label (top-left of stage, 11px Inter `letter-spacing: 0.22em` uppercase):**
```
3D · framed   ·   2D · flat
```
The active mode is `#1a1a1a`, inactive is `#ccc` (200ms color transition).

#### Framed view (3D, the headline experience)

This is the **default view when the modal opens**. It must be a real Three.js / React Three Fiber scene in production — the prototype uses CSS perspective.

**Production approach** (from the original brief):

- **Library:** `three` + `@react-three/fiber` + `@react-three/drei` (`OrbitControls`, `Environment`, `ContactShadows`)
- **Frame:** `BoxGeometry` with beveled edges for the molding, `MeshStandardMaterial` with a wood / gilt / matte texture appropriate to the per-piece `frame.type` (the user will be supplying the **actual** frame model/texture for each painting via Claude Code uploads later — leave the frame mesh as a configurable component that accepts a model or texture set per piece)
- **Painting front:** `PlaneGeometry` with `MeshBasicMaterial` (or `MeshStandardMaterial` with low roughness) using the art image as map. Optional canvas weave bump map for realism.
- **Painting back (verso):** another `PlaneGeometry` on the opposite face of the painting plane, using a back-of-canvas photograph (also user-supplied per piece). Stretcher bars visible.
- **Mat board:** if `frame.matBoard === true`, an additional `PlaneGeometry` slightly larger than the art, slightly recessed, with `frame.matColor` (default `#f1ecdf`)
- **OrbitControls:** drag to rotate, scroll to zoom, right-drag to pan. `enableDamping: true`, `dampingFactor: 0.05`. **Allow full 360° Y rotation** (do NOT clamp `minAzimuthAngle`/`maxAzimuthAngle`) so the visitor can see the verso. Clamp X (polar) to roughly ±30° from horizontal so the painting can't go upside-down.
- **Auto-rotate:** on first load, rotate at ~4.3 deg/sec around Y. Stop the moment the user grabs it (`OrbitControls` `autoRotate` + a listener on `start`).
- **Double-click:** snap rotation back to `(0, 0, 0)` (front-facing) and disable auto-rotate.
- **Lighting:**
  - `ambientLight` warm, intensity `0.3`
  - `directionalLight` from above-left, intensity `0.8` (gallery track lighting)
  - Optional rim light from behind for drama, intensity `0.2`
  - `Environment` preset (e.g. `"studio"`) for subtle reflections on glass/gilt
- **ContactShadows** below the painting for grounding, opacity ~0.4, blur ~2.5
- **Background:** solid `#ffffff`. (The prototype uses white; do not use the dark gallery-wall background described in the original brief — the user explicitly chose all-white throughout.)
- **Performance:** lazy-load the entire 3D module so the gallery page doesn't pay for it. Show a 1-second shimmer placeholder while the canvas mounts.

**Front/Back indicator (bottom-center of stage, 10px Inter uppercase `letter-spacing: 0.22em`):**
```
●  front     ○  verso       drag · double-click resets
```
- Two 6×6 dots ahead of "front" and "verso" — the active one is `#1a1a1a`, inactive is `#ddd`
- "Active" is determined by current Y rotation: if `((rotY % 360) + 360) % 360` is in `(90, 270)`, verso is showing.
- Helper text "drag · double-click resets" is `#bbb`

#### Flat view (2D)

- Background: `#ffffff`
- Image centered, `max-width: 100%`, `max-height: 100%`, `box-shadow: 0 20px 50px rgba(0,0,0,0.08)`
- Padding around image: `min(8vw, 80px)`

#### Mode-switching arrows

- **Right arrow** (always visible, right edge of stage, vertically centered):
  - 56×56 circle, `background: rgba(255,255,255,0.9)`, `border: 1px solid #ececec`, `box-shadow: 0 4px 16px rgba(0,0,0,0.06)`
  - Chevron-right SVG, 18×18, stroke `#1a1a1a`, `stroke-width: 1.2`, rounded caps
  - Hover: `translateX(2px)`, deeper shadow `0 8px 24px rgba(0,0,0,0.10)`
  - Position: `right: 28px`, `top: 50%`, `transform: translateY(-50%)`, `z-index: 5`
  - Click: toggles between `framed` and `flat`
- **Left arrow** (only visible in `flat` mode, fades out when in `framed`):
  - Same styling, mirrored chevron (chevron-left)
  - Position: `left: 28px`
  - Click: returns to `framed`
  - Use opacity 0 / pointer-events none to hide rather than removing from DOM

**Bottom info bar** (auto-height, padding `22px 40px 26px`, border-top `1px solid #f0f0f0`):
- Three columns separated by 60px gap, `align-items: flex-start`
- Column 1 (`min-width: 280px`):
  - Title: 17px Inter, `#1a1a1a`, `letter-spacing: 0.01em`, `font-weight: 400`
  - Below title (margin-top 6px), 13px Inter, `#888`, `letter-spacing: 0.02em`, `line-height: 1.7`:
    ```
    Oil on canvas
    36 × 48 inches
    2023
    ```
- Column 2 (`flex: 1`, `max-width: 560px`): description (italic), 13.5px Inter, `#666`, `line-height: 1.85`. Hidden if no description.
- Column 3 (`margin-left: auto`): slug, 11px Inter, `#bbb`, uppercase, `letter-spacing: 0.18em`. Format: `/{slug}` e.g. `/UNTITLED-NO-4`

**Keyboard:**
- `Esc` → close modal
- `←` → switch to framed
- `→` → switch to flat
- (Optional) `n` / `p` → next / previous piece

**On open:**
- `document.body.style.overflow = "hidden"` to lock scroll
- Mode resets to `framed` whenever the displayed `piece.slug` changes
- Animate in: `lj-fade` (opacity 0 → 1, 280ms ease)

---

### 3. About Page

**Purpose:** A one-screen biography. Photo of Lyndon centered at the top, name in cursive, blurb beneath, contact strip at the bottom.

**Layout:**
- `max-width: 720px`, `margin: 0 auto`
- Padding: `max(60px, 6vw)` top, `max(40px, 4vw)` left/right, `80px` bottom

**Portrait (top, centered):**
- 280×340 px container, margin `0 auto 56px`
- Background: `#f5f5f5`
- Inside: SVG placeholder until the real photograph is provided (a stylized abstract figure on `#f0f0f0` — see `app.jsx` `AboutPage` for the exact SVG paths). When the real photo arrives, swap the SVG for an `<img>` with `object-fit: cover`.
- Below the placeholder image, in the bottom 12px area: caption "photograph forthcoming" — 9px Inter, `#bbb`, `letter-spacing: 0.25em`, uppercase, centered. Remove this caption once the real photo is wired in.

**Name** (centered, beneath portrait):
- Font: `'Cormorant Garamond'`, italic, weight 300, 56px, `color: #1a1a1a`, `letter-spacing: -0.01em`, `line-height: 1`, margin-bottom 14px

**Subtitle** (centered):
- Copy: `painter · b. 1962`
- 11px Inter, `#999`, `letter-spacing: 0.3em`, uppercase, margin-bottom 56px

**Body paragraphs** (left-aligned within the 720px column, `text-wrap: pretty`):
- Para 1: 16px Inter, `#333`, `line-height: 1.85`, `letter-spacing: 0.005em`, margin-bottom 28px
  > "Lyndon Johnson is a painter living in upstate New York. His work concerns interior light, slow attention, and the small weather of a given afternoon. Recent paintings have been shown in Hudson, Marfa, and a converted hayloft outside Ghent."
- Para 2: 15px Inter, `#555`, otherwise same, margin-bottom 28px
  > "He paints almost entirely in oil, often on linen, and prefers the studio cold. Each finished canvas is signed and inscribed on the verso — the back of the canvas — with the date the painting was considered finished and, occasionally, a line about the day."
- Para 3: 15px Inter, `#555`, margin-bottom 56px
  > "He does not keep social media. Studio visits and inquiries may be sent to the address below; replies tend to be slow but considered."

**Contact strip** (bottom):
- `padding-top: 28px`, `border-top: 1px solid #efefef`
- Two-column grid (`1fr 1fr`), gap 32px, 12px Inter, `letter-spacing: 0.16em`, uppercase
- Column 1:
  - Label "contact" — 10px, `#bbb`, margin-bottom 6px
  - Value (mailto link): `studio@lyndonjohnson.art` — `#1a1a1a`, no underline
- Column 2:
  - Label "studio visits" — 10px, `#bbb`, margin-bottom 6px
  - Value: `by appointment` — `#1a1a1a`

---

### Header (every page)

- `position: sticky; top: 0; z-index: 50; height: 64px`
- Background: `rgba(255,255,255,0.85)`, `backdrop-filter: blur(14px)`
- Border-bottom: `1px solid #efefef`
- Padding: `0 max(40px, 4vw)`, `display: flex`, `align-items: center`, `justify-content: space-between`
- Left — clickable logo (returns to gallery): `'Cormorant Garamond'`, italic, weight 300, 28px, `#1a1a1a`, `letter-spacing: -0.01em`, `line-height: 1`, `white-space: nowrap` (critical — the cursive descenders cause wrap otherwise)
- Right — single nav button: `about` (or `gallery` when on the about page). 12.5px Inter, `letter-spacing: 0.18em`, uppercase, `color: #666` (hover/active `#1a1a1a`, 200ms color transition). No background, no border. Padding `8px 4px`.

### Footer (every page)

- `padding: 80px max(40px, 4vw) 60px`, margin-top 80px
- `border-top: 1px solid #efefef`
- `display: flex`, `justify-content: space-between`, `align-items: baseline`
- Left — small cursive name: `'Cormorant Garamond'` italic 300, 22px, `color: #999`, `white-space: nowrap`
- Right — email: `studio@lyndonjohnson.art`, 12px Inter, `#999`, `letter-spacing: 0.18em`, uppercase

---

## Interactions & Behavior

### Page load
- Cards fade in as they enter viewport via Intersection Observer (rootMargin 200px). Fade is opacity 0 → 1, 600ms ease.
- Images use `loading="lazy"`, fade in on `onLoad` (opacity 0 → 1, 500ms ease).
- While loading: shimmer placeholder using a moving linear gradient (1.6s loop). Background 110deg gradient `#f0ede8 25%` → `#e8e4dd 50%` → `#f0ede8 75%`, `background-size: 200% 100%`, animated via `@keyframes lj-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`.

### Scroll
- Plain native scroll. No parallax, no scroll-jacking.
- Custom scrollbar styling (10px width, thumb `#d8d6d2`, hover `#b8b6b2`, transparent track).

### Modal open/close
- Overlay fades in (opacity 0 → 1, 280ms ease) — `@keyframes lj-fade`
- Body scroll locks while open
- Closes on: × button, Esc, click on a backdrop region (not the content)

### Routing
- Use the App Router file system: `/page.tsx` for gallery, `/[slug]/page.tsx` for piece detail (server-rendered for SEO + sharing), `/about/page.tsx` for about.
- For the modal-overlay-on-grid behavior (Instagram-style), use Next.js **parallel routes + intercepted routes** (`@modal/(.)[slug]/page.tsx`) so `/[slug]` opens as an overlay when navigated from the grid, but renders as a standalone full page on direct load.
- Browser back closes the overlay.

---

## State Management

Per page, this is small enough for local React state. No global store needed.

- **Gallery page:** none beyond per-card image-loaded state.
- **Detail overlay:** `mode: "framed" | "flat"`, plus internal Three.js / OrbitControls state.
- **3D viewer:** rotation, auto-rotate flag, dragging flag (handled by `OrbitControls`).

If you later add the Tweaks-style controls (column count, gap, label visibility), they'd belong in URL search params or a small `zustand` store.

---

## Design Tokens

### Colors
| Token | Hex | Usage |
|---|---|---|
| `bg` | `#ffffff` | Entire site background. Always white. |
| `surface` | `#ffffff` | Cards, modals (same as bg) |
| `text-primary` | `#1a1a1a` | Titles, logo, body emphasis |
| `text-secondary` | `#333333` | Body paragraphs |
| `text-muted` | `#555555` | Secondary paragraphs |
| `text-tertiary` | `#666666` / `#888888` / `#999999` | Captions, labels, navigation |
| `text-faint` | `#bbb` / `#ccc` | Slug labels, inactive states |
| `border` | `#efefef` | Header / footer dividers |
| `border-soft` | `#f0f0f0` | Modal internal dividers |
| `placeholder-bg` | `#f0ede8` | Image loading background |
| `shimmer` | linear-gradient `#f0ede8` ↔ `#e8e4dd` | Loading shimmer |
| `card-shadow` | `0 1px 3px rgba(0,0,0,0.04)` | Resting card |
| `card-shadow-hover` | `0 8px 30px rgba(0,0,0,0.10)` | Hover card |
| `art-flat-shadow` | `0 20px 50px rgba(0,0,0,0.08)` | Image in flat view |
| `arrow-shadow` | `0 4px 16px rgba(0,0,0,0.06)` | Mode-toggle arrows |
| `arrow-shadow-hover` | `0 8px 24px rgba(0,0,0,0.10)` | Hover |

**There is no accent color.** The artwork is the only color in the site.

### Typography

Two families. Both via Google Fonts.

**Logo / display:** `Cormorant Garamond`, italic, weight `300`. Import: `family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400`. Also import `Playfair Display`, `Pinyon Script`, `Italianno`, and `Great Vibes` if you want to keep the logo-font-swap capability — otherwise just Cormorant.

**Body:** `Inter`, weights `300; 400; 500`. Import: `family=Inter:wght@300;400;500`. Fallback stack: `'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif`.

| Use | Font | Size | Weight | Style | Letter-spacing | Line-height |
|---|---|---|---|---|---|---|
| Header logo | Cormorant Garamond | 28 | 300 | italic | -0.01em | 1 |
| Footer name | Cormorant Garamond | 22 | 300 | italic | — | — |
| Modal logo | Cormorant Garamond | 26 | 300 | italic | -0.01em | 1 |
| About name | Cormorant Garamond | 56 | 300 | italic | -0.01em | 1 |
| About subtitle | Inter | 11 | 400 | — | 0.3em uppercase | — |
| About body p1 | Inter | 16 | 400 | — | 0.005em | 1.85 |
| About body p2/3 | Inter | 15 | 400 | — | 0.005em | 1.85 |
| About contact | Inter | 12 | 400 | — | 0.16em uppercase | — |
| About contact label | Inter | 10 | 400 | — | 0.16em uppercase | — |
| Section label | Inter | 13 | 400 | — | 0.22em uppercase | — |
| Card title | Inter | 14 | 400 | — | 0.01em | — |
| Card meta | Inter | 12.5 | 400 | — | 0.02em | — |
| Header nav | Inter | 12.5 | 400 | — | 0.18em uppercase | — |
| Modal mode label | Inter | 11 | 400 | — | 0.22em uppercase | — |
| Front/verso indicator | Inter | 10 | 400 | — | 0.22em uppercase | — |
| Modal title | Inter | 17 | 400 | — | 0.01em | — |
| Modal meta | Inter | 13 | 400 | — | 0.02em | 1.7 |
| Modal description | Inter | 13.5 | 400 | italic | 0.01em | 1.85 |
| Modal slug | Inter | 11 | 400 | — | 0.18em uppercase | — |

Body text rendering: `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`. Body should use `text-wrap: pretty` where supported.

### Selection
`::selection { background: #1a1a1a; color: #fafafa; }`

### Spacing scale (informal — match the values above directly)
The design doesn't use a strict scale. Use the literal values above. The grid gap defaults to `28px` ("breathing").

### Border radius
Effectively zero throughout (cards, images, info bar). The two **mode-toggle arrow buttons** are full circles (`border-radius: 50%`).

### Shadows
See color table above.

### Animations / Easings
- `lj-fade`: opacity 0 → 1, 280ms ease (modal overlay)
- `lj-shimmer`: 1.6s linear infinite (loading)
- Card hover: 200ms ease (transform), 300ms ease (shadow)
- Image fade-in on load: 500ms ease
- Card fade-in on enter viewport: 600ms ease
- Mode cross-fade: 350ms ease
- Arrow hover: 200ms ease
- Header nav color: 200ms ease

---

## Content Model

Each art piece:

```ts
interface ArtPiece {
  slug: string;              // url-friendly id
  title: string;             // "Untitled No. 4"
  medium: string;            // "Oil on canvas"
  dimensions: string;        // "36 × 48 inches" (note: × is U+00D7, not "x")
  year: number;              // 2023
  description?: string;      // optional italic blurb in detail view
  image: string;             // high-res flat image path/URL
  thumbnail?: string;        // optional optimized grid image
  back?: string;             // verso photograph (back of canvas) — populated per piece
  frame: {
    type: 'thin-modern' | 'classic-wood' | 'ornate-gilt' | 'float-frame' | 'no-frame';
    color?: string;          // hex string for finish
    matBoard?: boolean;      // has mat board
    matColor?: string;       // mat color (default '#f1ecdf')
    model?: string;          // optional path to a per-piece 3D frame asset
  };
  featured?: boolean;        // if true, card spans 2 columns + uses 5/4 aspect
  order?: number;            // optional manual sort order
}
```

Store as a JSON or TS array to start. The data file in `reference/data.jsx` has 30 sample pieces with slugs, titles, mediums, dimensions, years, frame metadata, and Unsplash placeholder images — use these as the seed list and let the user replace the image/back fields with the real artwork as they're prepared.

The **frame.type** values are placeholders for the prototype's CSS-perspective frames. In production, each piece's actual frame will be supplied by the user (likely as a model file or texture set). Treat `frame.type` as a coarse fallback category; let `frame.model` (added above) point at a per-piece asset when one exists.

The **back** field is currently absent in the prototype data — add it to the type and let it default to a generic stretcher-bar texture until each piece's actual verso photograph is provided.

---

## Assets

- **Fonts:** Google Fonts — Cormorant Garamond + Inter (and optionally Playfair Display, Pinyon Script, Italianno, Great Vibes if you want to keep logo-font flexibility).
- **Images:** All artwork images in `reference/data.jsx` are Unsplash placeholders. Replace with the real high-resolution painting photographs and back-of-canvas photographs.
- **3D frame models / textures:** TBD — the user is preparing these per-piece (oak, walnut, gilt, etc.) and will supply them to be wired into the Three.js scene.
- **No icon library** — the only icons are inline SVG chevrons (`M6 3L12 9L6 15` for right, `M12 3L6 9L12 15` for left, both `stroke-width="1.2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`).

---

## What this site is NOT

(From the original brief — keep saying no to these.)
- Not a store. No buy buttons. No cart.
- Not a blog. No posts, dates, categories.
- Not a social hub. No Instagram embed, no Twitter feed.
- Not flashy. No video backgrounds. No particle effects. No WebGL on the landing.
- Not cluttered. If you're adding something, you're probably removing something.

---

## Files

In this handoff package:

- `README.md` — this document
- `reference/Lyndon Johnson Gallery.html` — the working HTML prototype. Open it in a browser to see the design live (it loads React + Babel + the JSX files via CDN).
- `reference/app.jsx` — top-level App component, header, footer, About page, routing logic, Tweaks panel wiring (Tweaks panel is prototype-only — drop it from production).
- `reference/gallery.jsx` — `EditorialGrid` is the layout to use. (`MasonryGrid` and `UniformGrid` also exist but the user has chosen editorial only — you can ignore or delete them.)
- `reference/modal.jsx` — detail overlay: `FramedView3D` (CSS-perspective stand-in for the real Three.js scene), `FlatView`, `CanvasBack` (verso placeholder), mode-toggle arrows, info bar.
- `reference/data.jsx` — 30 sample art pieces with slugs, titles, dimensions, years, frame metadata.
- `reference/tweaks-panel.jsx` — prototype-only design controls (skip in production).

The reference files use React via inline Babel — they are NOT production-ready. They demonstrate exactly what to build.
