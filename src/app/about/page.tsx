import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1a1a1a" }}>
      <Header />
      <main style={{ padding: "max(60px, 6vw) max(40px, 4vw) 80px", maxWidth: 720, margin: "0 auto" }}>
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
          <svg viewBox="0 0 280 340" width="100%" height="100%" style={{ display: "block" }}>
            <rect width="280" height="340" fill="#f0f0f0" />
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

        <div
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: 56,
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

        <div style={{ fontSize: 16, color: "#333", lineHeight: 1.85, letterSpacing: "0.005em", marginBottom: 28 }}>
          Lyndon Johnson is a painter living in upstate New York. His work concerns interior light, slow attention, and the small weather of a given afternoon. Recent paintings have been shown in Hudson, Marfa, and a converted hayloft outside Ghent.
        </div>
        <div style={{ fontSize: 15, color: "#555", lineHeight: 1.85, letterSpacing: "0.005em", marginBottom: 28 }}>
          He paints almost entirely in oil, often on linen, and prefers the studio cold. Each finished canvas is signed and inscribed on the verso — the back of the canvas — with the date the painting was considered finished and, occasionally, a line about the day.
        </div>
        <div style={{ fontSize: 15, color: "#555", lineHeight: 1.85, letterSpacing: "0.005em", marginBottom: 56 }}>
          He does not keep social media. Studio visits and inquiries may be sent to the address below; replies tend to be slow but considered.
        </div>

        <div
          style={{
            paddingTop: 28,
            borderTop: "1px solid #efefef",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            fontSize: 12,
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
      <Footer />
    </div>
  );
}
