# Lyndon Johnson Art Gallery

A personal art gallery website for the artist Lyndon Johnson. One artist. One collection. Nothing else.

---

## The Vibe

Think private gallery in a converted warehouse. White walls, concrete floors, natural light. The art is the only thing that talks. Everything else whispers.

The site should feel like walking into a room where someone quietly hung extraordinary work and then left you alone with it. No sales pitch, no artist statement on the landing page, no social media icons fighting for attention. Just the work.

**Reference:** The Art Institute of Chicago collection page (artic.edu/collection) ... that grid energy, that breathing room between pieces, that "the art is the interface" philosophy. But stripped down even further. One artist means we don't need search bars, category chips, or filters. Just a wall of work.

---

## Typography

### Logo: "Lyndon Johnson"
- Thin, floaty cursive. Think Playfair Display Italic at 300 weight, or Cormorant Garamond Italic, or a proper script like Pinyon Script / Great Vibes
- Whisper-weight. The kind of font that looks like someone signed their name with a very fine pen
- Sits in the top-left corner, small. Not a hero banner. Not shouting. Just a quiet signature
- Color: near-black (#1a1a1a) or warm charcoal (#2c2c2c)

### Body & Descriptions
- Clean sans-serif. Inter, Helvetica Neue, or system-ui at 400 weight
- Small. 13-14px for descriptions. Let the art be big and the text be small
- Color: medium gray (#666) for descriptions, darker (#333) for titles
- Letter-spacing: slightly tracked out (0.02em) for an airy, gallery-label feel

### Headings (h2)
- Same sans-serif as body but lighter weight (300) and slightly larger (18-20px)
- All lowercase or small-caps. Understated. "paintings" not "PAINTINGS" not "Our Paintings Collection"

---

## Color Palette

```
Background:    #fafafa (warm white, not sterile)
Surface:       #ffffff (cards, modals)
Text Primary:  #1a1a1a
Text Secondary:#666666
Text Tertiary: #999999
Accent:        none. The art IS the color.
Border:        #e8e8e8 (barely there dividers)
Shadow:        rgba(0,0,0,0.04) (subtle card lift)
```

No accent color. No brand color. The palette is intentionally empty so the artwork fills that role.

---

## Layout: The Grid

### Gallery Page (Home)
- Full-width grid, edge to edge with generous padding (40-60px sides)
- 4 columns on desktop, 3 on tablet, 2 on mobile, 1 on small mobile
- Masonry layout (variable height, like artic.edu) ... paintings are different aspect ratios and that's beautiful
- Gap: 24-32px between items. Breathing room.
- Each grid item is just:
  - The artwork image (fills the card width, natural aspect ratio)
  - Title in small sans-serif below
  - Medium and year in even smaller gray text
  - That's it. Nothing else.

### Header
- Fixed, transparent background that gets a subtle white blur on scroll
- Left: Logo in cursive script, small
- Right: Nothing. Maybe a tiny hamburger on mobile. Maybe nothing at all.
- Height: 60px max. Get out of the way.

### Footer
- Almost invisible. One line at the bottom.
- "Lyndon Johnson" ... and maybe a contact email
- That's it.

---

## The Art Card

Each piece in the grid:

```
┌─────────────────────────┐
│                         │
│                         │
│       [artwork]         │
│                         │
│                         │
├─────────────────────────┤
│ Untitled No. 4          │  ← 14px, #333, sans-serif
│ Oil on canvas, 2023     │  ← 13px, #999, sans-serif
└─────────────────────────┘
```

- No border on the card. Just the image and text floating on the warm white background
- Subtle hover: image lifts slightly (translateY -2px), shadow deepens just a touch
- Cursor changes to pointer. That's the only hint it's clickable.
- Image loads with a gentle fade-in (opacity 0 → 1, 400ms ease)

---

## The Detail View (Modal / Lightbox)

When you click a piece, a full-screen overlay opens with two experiences side by side:

### Left: 2D Flat Image
- The artwork displayed flat, high resolution
- Clean white background
- No frame decoration here ... just the pure image
- Pinch/scroll to zoom on mobile

### Right: 3D Framed View
- A Three.js canvas showing the artwork mounted inside a 3D picture frame
- The frame should closely match the real-life frame:
  - Wood grain texture (oak, walnut, gilt ... depends on the actual frame)
  - Proper depth and molding profile
  - Glass/acrylic reflection (subtle, not distracting)
  - Mat board if the real piece has one
- User can grab and rotate the framed piece with mouse/touch
- OrbitControls: drag to rotate, scroll to zoom, right-drag to pan
- Subtle environment lighting ... soft directional light like gallery track lighting
- Background: solid dark (#111) or very subtle gradient to feel like a dark gallery wall

### Detail Info Panel (below or beside)
```
Untitled No. 4
Oil on canvas
36 × 48 inches
2023

[Brief description if provided]
```
- Same minimal typography as the grid
- Close button: simple × in top-right, or click outside to close
- ESC key closes
- URL updates so pieces are shareable (/gallery/untitled-no-4)

### Mobile Detail View
- Stack vertically: 2D image on top, 3D viewer below, info at bottom
- Full-screen takeover, swipe down to close
- 3D viewer gets at least 50vh so there's room to manipulate

---

## 3D Frame Technical Approach

### Library: Three.js + React Three Fiber
- React Three Fiber for declarative 3D in React components
- @react-three/drei for OrbitControls, Environment, ContactShadows
- @react-three/postprocessing for subtle bloom on frame highlights (optional)

### Frame Construction
- BoxGeometry with beveled edges for the frame molding
- MeshStandardMaterial with wood/gilt textures
- The artwork itself is a PlaneGeometry with MeshBasicMaterial using the art image as texture
- Optional: slight canvas texture bump map on the artwork surface for realism
- Mat board: another PlaneGeometry, slightly larger than the art, slightly recessed

### Frame Profiles (configurable per piece)
```
thin-modern:     Simple flat frame, 1" depth, matte black or natural wood
classic-wood:    Traditional molding profile, 2" depth, oak/walnut
ornate-gilt:     Baroque-style carved frame, gold leaf texture
float-frame:     Canvas floats inside a thin shadow box frame
no-frame:        Canvas on stretcher bars, visible edges (3D shows the wrapped canvas)
```

### Lighting
- Ambient light: soft, warm (intensity 0.3)
- Directional light from above-left: simulating gallery track lighting (intensity 0.8)
- Optional rim light from behind for drama
- Environment map: subtle studio HDRI for realistic reflections on glass/gilt

### Performance
- Lazy load the 3D viewer ... don't load Three.js until someone clicks a piece
- Show a loading shimmer while the 3D scene initializes
- Compressed textures (WebP for art images, KTX2 for frame textures)
- Target: 3D scene interactive within 1-2 seconds on mid-range devices

---

## Interactions & Animations

### Page Load
- Art cards fade in with a stagger (50ms between each, 400ms duration)
- Masonry layout calculates after images load (use onLoad or IntersectionObserver)

### Scroll
- Smooth, natural. No parallax. No scroll-jacking. Just scroll.
- Lazy load images as they enter viewport (native loading="lazy" or Intersection Observer)

### Hover (Art Cards)
- Lift: translateY(-2px)
- Shadow: 0 4px 20px rgba(0,0,0,0.08)
- Transition: 200ms ease
- That's it. Subtle.

### Modal Open/Close
- Backdrop fades in (opacity 0 → 0.9, 300ms)
- Content scales up slightly (0.95 → 1) and fades in
- Close: reverse. Quick and clean.

### 3D Viewer
- Auto-rotates slowly when first loaded (0.5 deg/sec)
- Stops auto-rotation when user grabs it
- Smooth damping on orbit controls (damping factor 0.05)
- Snap back to front-facing on double-click

---

## Tech Stack

```
Framework:       Next.js 15 (App Router)
Styling:         Tailwind CSS 4
3D:              Three.js + React Three Fiber + Drei
Images:          Next/Image with sharp, WebP optimization
Layout:          CSS Grid with masonry behavior (or react-masonry-css)
Animations:      Framer Motion (page transitions, modal, stagger)
Fonts:           Google Fonts (cursive logo + Inter for body)
Deployment:      Vercel
```

---

## Pages

### / (Home / Gallery)
The grid. That's the whole site. One page of art.
- Header with logo
- Optional: small "about" link in header that opens a minimal sidebar or modal
- The masonry grid of all pieces
- Footer whisper

### /[slug] (Individual Piece)
- Can also work as a modal overlay on the grid (like Instagram)
- Direct URL works too for sharing
- 2D + 3D side by side
- Piece details
- Previous / Next navigation (subtle arrows)

### /about (Optional)
- One paragraph about Lyndon
- A photo maybe
- Contact info
- Keep it to one screen. No scrolling biography.

---

## Content Model

Each art piece needs:
```typescript
interface ArtPiece {
  slug: string;              // url-friendly name
  title: string;             // "Untitled No. 4"
  medium: string;            // "Oil on canvas"
  dimensions: string;        // "36 × 48 inches"
  year: number;              // 2023
  description?: string;      // optional blurb
  image: string;             // high-res flat image path
  thumbnail?: string;        // optimized grid image (auto-generated if not provided)
  frame: {
    type: 'thin-modern' | 'classic-wood' | 'ornate-gilt' | 'float-frame' | 'no-frame';
    color?: string;          // frame finish color/material
    matBoard?: boolean;      // has mat board
    matColor?: string;       // mat board color (default: off-white)
  };
  order?: number;            // manual sort order
  featured?: boolean;        // larger card in grid
}
```

Store as a simple JSON or TypeScript array to start. No database needed for a single-artist portfolio. Add a CMS later if Lyndon wants to manage it himself.

---

## What This Site Is NOT

- Not a store. No buy buttons. No cart. (Maybe later, but not in v1)
- Not a blog. No posts. No dates. No categories.
- Not a social media hub. No Instagram feed embed. No Twitter timeline.
- Not flashy. No video backgrounds. No particle effects. No WebGL landing page.
- Not cluttered. If you're adding something, you're probably removing something.

The site is a white room with great lighting and beautiful art on the walls. That's it. That's the whole thing.
