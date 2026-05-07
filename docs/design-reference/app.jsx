// Main gallery app — all white, with full About page route
const { useState: useStateA, useEffect: useEffectA } = React;

const LOGO_FONTS = [
  { id: "cormorant", name: "Cormorant", family: "'Cormorant Garamond', serif", weight: 300, italic: true, size: 1.0 },
  { id: "playfair", name: "Playfair", family: "'Playfair Display', serif", weight: 400, italic: true, size: 0.95 },
  { id: "pinyon", name: "Pinyon", family: "'Pinyon Script', cursive", weight: 400, italic: false, size: 1.4 },
  { id: "italianno", name: "Italianno", family: "'Italianno', cursive", weight: 400, italic: false, size: 1.7 },
  { id: "great-vibes", name: "Great Vibes", family: "'Great Vibes', cursive", weight: 400, italic: false, size: 1.5 },
];

const FRAME_OVERRIDE_OPTIONS = [
  { value: "", label: "As original" },
  { value: "thin-modern", label: "Thin modern" },
  { value: "classic-wood", label: "Classic wood" },
  { value: "ornate-gilt", label: "Ornate gilt" },
  { value: "float-frame", label: "Float frame" },
  { value: "no-frame", label: "No frame" },
];

const GAP_OPTIONS = {
  tight: 14,
  breathing: 28,
  spacious: 48,
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "columns": 4,
  "gap": "breathing",
  "logoFont": "cormorant",
  "showLabels": true,
  "frameOverride": "",
  "layout": "masonry"
}/*EDITMODE-END*/;

function Header({ logoFont, onNav, route }) {
  const f = LOGO_FONTS.find((x) => x.id === logoFont) || LOGO_FONTS[0];
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 max(40px, 4vw)",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid #efefef",
      }}
    >
      <div
        onClick={() => onNav("gallery")}
        style={{
          fontFamily: f.family,
          fontWeight: f.weight,
          fontStyle: f.italic ? "italic" : "normal",
          fontSize: 28 * f.size,
          color: "#1a1a1a",
          letterSpacing: "-0.01em",
          lineHeight: 1,
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
      >
        Lyndon Johnson
      </div>
      <button
        onClick={() => onNav(route === "about" ? "gallery" : "about")}
        style={{
          background: "transparent",
          border: "none",
          color: route === "about" ? "#1a1a1a" : "#666",
          fontSize: 12.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
          padding: "8px 4px",
          transition: "color 200ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a1a")}
        onMouseLeave={(e) => (e.currentTarget.style.color = route === "about" ? "#1a1a1a" : "#666")}
      >
        {route === "about" ? "gallery" : "about"}
      </button>
    </header>
  );
}

function Footer({ logoFont }) {
  const f = LOGO_FONTS.find((x) => x.id === logoFont) || LOGO_FONTS[0];
  return (
    <footer
      style={{
        padding: "80px max(40px, 4vw) 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        borderTop: "1px solid #efefef",
        marginTop: 80,
      }}
    >
      <div
        style={{
          fontFamily: f.family,
          fontWeight: f.weight,
          fontStyle: f.italic ? "italic" : "normal",
          fontSize: 22 * f.size,
          color: "#999",
          whiteSpace: "nowrap",
        }}
      >
        Lyndon Johnson
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#999",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        studio@lyndonjohnson.art
      </div>
    </footer>
  );
}

function GalleryPage({ pieces, t, onPieceClick }) {
  const Grid =
    t.layout === "uniform" ? window.UniformGrid :
    t.layout === "editorial" ? window.EditorialGrid :
    window.MasonryGrid;
  return (
    <main style={{ padding: "max(40px, 4vw) max(40px, 4vw) 0" }}>
      <div
        style={{
          fontSize: 13,
          color: "#999",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 36,
          paddingLeft: 2,
        }}
      >
        paintings · {pieces.length}
      </div>
      <Grid
        pieces={pieces}
        columns={t.columns}
        onPieceClick={onPieceClick}
        showLabels={t.showLabels}
      />
    </main>
  );
}

function AboutPage({ logoFont }) {
  const f = LOGO_FONTS.find((x) => x.id === logoFont) || LOGO_FONTS[0];
  return (
    <main style={{ padding: "max(60px, 6vw) max(40px, 4vw) 80px", maxWidth: 720, margin: "0 auto" }}>
      {/* Photo of Lyndon — placeholder, centered top */}
      <div
        style={{
          width: 280,
          height: 340,
          margin: "0 auto 56px",
          background: "#f5f5f5",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Placeholder portrait — neutral grey block with a subtle sketch silhouette */}
        <svg viewBox="0 0 280 340" width="100%" height="100%" style={{ display: "block" }}>
          <rect width="280" height="340" fill="#f0f0f0" />
          {/* abstract figure suggestion */}
          <ellipse cx="140" cy="135" rx="44" ry="52" fill="#dcdcdc" />
          <path d="M 60 340 Q 60 230 140 220 Q 220 230 220 340 Z" fill="#dcdcdc" />
          <rect x="0" y="0" width="280" height="340" fill="none" stroke="#e8e8e8" strokeWidth="1" />
        </svg>
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 9,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#bbb",
          }}
        >
          photograph forthcoming
        </div>
      </div>

      {/* Name in script, centered */}
      <div
        style={{
          fontFamily: f.family,
          fontWeight: f.weight,
          fontStyle: f.italic ? "italic" : "normal",
          fontSize: 56 * f.size,
          color: "#1a1a1a",
          textAlign: "center",
          letterSpacing: "-0.01em",
          lineHeight: 1,
          marginBottom: 14,
        }}
      >
        Lyndon Johnson
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#999",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 56,
        }}
      >
        painter · b. 1962
      </div>

      {/* Blurb */}
      <div
        style={{
          fontSize: 16,
          color: "#333",
          lineHeight: 1.85,
          letterSpacing: "0.005em",
          marginBottom: 28,
          textWrap: "pretty",
        }}
      >
        Lyndon Johnson is a painter living in upstate New York. His work
        concerns interior light, slow attention, and the small weather of a
        given afternoon. Recent paintings have been shown in Hudson, Marfa,
        and a converted hayloft outside Ghent.
      </div>
      <div
        style={{
          fontSize: 15,
          color: "#555",
          lineHeight: 1.85,
          letterSpacing: "0.005em",
          marginBottom: 28,
          textWrap: "pretty",
        }}
      >
        He paints almost entirely in oil, often on linen, and prefers the
        studio cold. Each finished canvas is signed and inscribed on the
        verso — the back of the canvas — with the date the painting was
        considered finished and, occasionally, a line about the day.
      </div>
      <div
        style={{
          fontSize: 15,
          color: "#555",
          lineHeight: 1.85,
          letterSpacing: "0.005em",
          marginBottom: 56,
          textWrap: "pretty",
        }}
      >
        He does not keep social media. Studio visits and inquiries may be sent
        to the address below; replies tend to be slow but considered.
      </div>

      {/* Contact strip */}
      <div
        style={{
          paddingTop: 28,
          borderTop: "1px solid #efefef",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          fontSize: 12,
          color: "#888",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        <div>
          <div style={{ color: "#bbb", marginBottom: 6, fontSize: 10 }}>contact</div>
          <a href="mailto:studio@lyndonjohnson.art" style={{ color: "#1a1a1a", textDecoration: "none" }}>studio@lyndonjohnson.art</a>
        </div>
        <div>
          <div style={{ color: "#bbb", marginBottom: 6, fontSize: 10 }}>studio visits</div>
          <span style={{ color: "#1a1a1a" }}>by appointment</span>
        </div>
      </div>
    </main>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeIdx, setActiveIdx] = useStateA(null);
  const [route, setRoute] = useStateA("gallery"); // "gallery" | "about"

  const pieces = window.ARTWORKS;
  const gap = GAP_OPTIONS[t.gap] || GAP_OPTIONS.breathing;
  const logoF = LOGO_FONTS.find((x) => x.id === t.logoFont) || LOGO_FONTS[0];

  // CSS variables
  useEffectA(() => {
    document.documentElement.style.setProperty("--lj-bg", "#ffffff");
    document.documentElement.style.setProperty("--lj-surface", "#ffffff");
    document.documentElement.style.setProperty("--lj-border", "#efefef");
    document.documentElement.style.setProperty("--lj-gap", gap + "px");
    document.documentElement.style.setProperty("--lj-script", logoF.family);
  }, [gap, logoF]);

  // URL sync — supports /#/about and /#/<slug>
  useEffectA(() => {
    const apply = () => {
      const h = window.location.hash;
      if (h === "#/about" || h === "#about") {
        setRoute("about");
        setActiveIdx(null);
        return;
      }
      const m = h.match(/^#\/(.+)$/);
      if (m) {
        const idx = pieces.findIndex((p) => p.slug === m[1]);
        if (idx >= 0) {
          setRoute("gallery");
          setActiveIdx(idx);
          return;
        }
      }
      setRoute("gallery");
      setActiveIdx(null);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  // Push hash on changes
  useEffectA(() => {
    let target = "";
    if (route === "about") target = "#/about";
    else if (activeIdx != null) target = `#/${pieces[activeIdx].slug}`;
    if (window.location.hash !== target) {
      history.replaceState(null, "", target || window.location.pathname);
    }
  }, [route, activeIdx]);

  // Scroll to top on route change
  useEffectA(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [route]);

  const handleNav = (r) => {
    setActiveIdx(null);
    setRoute(r);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1a1a1a" }}>
      <Header logoFont={t.logoFont} onNav={handleNav} route={route} />

      {route === "gallery" && (
        <GalleryPage
          pieces={pieces}
          t={t}
          onPieceClick={(p) => setActiveIdx(pieces.findIndex((x) => x.slug === p.slug))}
        />
      )}
      {route === "about" && <AboutPage logoFont={t.logoFont} />}

      <Footer logoFont={t.logoFont} />

      {activeIdx != null && (
        <window.ArtModal
          piece={pieces[activeIdx]}
          frameTypeOverride={t.frameOverride || undefined}
          onClose={() => setActiveIdx(null)}
          onPrev={() => setActiveIdx((i) => (i - 1 + pieces.length) % pieces.length)}
          onNext={() => setActiveIdx((i) => (i + 1) % pieces.length)}
        />
      )}

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Layout">
          <TweakRadio
            label="Style"
            value={t.layout}
            onChange={(v) => setTweak("layout", v)}
            options={[
              { label: "Masonry", value: "masonry" },
              { label: "Uniform", value: "uniform" },
              { label: "Editorial", value: "editorial" },
            ]}
          />
          <TweakRadio
            label="Columns"
            value={String(t.columns)}
            onChange={(v) => setTweak("columns", Number(v))}
            options={[
              { label: "3", value: "3" },
              { label: "4", value: "4" },
              { label: "5", value: "5" },
            ]}
          />
          <TweakRadio
            label="Gap"
            value={t.gap}
            onChange={(v) => setTweak("gap", v)}
            options={[
              { label: "Tight", value: "tight" },
              { label: "Breathing", value: "breathing" },
              { label: "Spacious", value: "spacious" },
            ]}
          />
          <TweakToggle
            label="Show labels"
            value={t.showLabels}
            onChange={(v) => setTweak("showLabels", v)}
          />
        </TweakSection>
        <TweakSection title="Typography">
          <TweakSelect
            label="Logo font"
            value={t.logoFont}
            onChange={(v) => setTweak("logoFont", v)}
            options={LOGO_FONTS.map((f) => ({ label: f.name, value: f.id }))}
          />
        </TweakSection>
        <TweakSection title="3D viewer">
          <TweakSelect
            label="Frame override"
            value={t.frameOverride}
            onChange={(v) => setTweak("frameOverride", v)}
            options={FRAME_OVERRIDE_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
          />
          <div style={{ fontSize: 11, color: "#888", lineHeight: 1.6, marginTop: 6 }}>
            Click any piece to open the 3D framed view. Drag to spin 360° — the verso (back of canvas) is on the other side. Tap → to flip to the flat 2D image.
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
