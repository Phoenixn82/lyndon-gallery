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
          artist · hairstylist · 1941–1995
        </div>

        <div style={{ fontSize: 16, color: "#333", lineHeight: 1.85, letterSpacing: "0.005em", marginBottom: 28 }}>
          Lyndon Duane Johnson (October 17, 1941 – January 13, 1995) was a celebrated Houston artist, hairstylist, and entrepreneur whose life was defined by beauty, creativity, and a remarkable ability to transform the world around him. Known throughout Houston as the &ldquo;hairdresser to the stars,&rdquo; Lyndon built a reputation not only for exceptional style, but for his larger-than-life personality, artistic vision, and deep influence within the city&rsquo;s social and cultural circles.
        </div>
        <div style={{ fontSize: 15, color: "#555", lineHeight: 1.85, letterSpacing: "0.005em", marginBottom: 28 }}>
          A graduate of Angleton High School and Stevens College of Cosmetology, Lyndon began his career in Houston at Sakowitz Beauty Salon before founding the internationally recognized Michaeljohnson Beauty Salon alongside Michael and Lyndon Johnson Beauty Salon. His celebrity clientele included Louise Cooley, Ivana Trump, Carol Channing, Barbara Walters, and Rosemary Clooney, and he traveled with Houston clients to prestigious events such as the wedding of Prince Charles and Princess Diana and the Bal de la Rose hosted by Lynn Wyatt in Monte Carlo.
        </div>
        <div style={{ fontSize: 15, color: "#555", lineHeight: 1.85, letterSpacing: "0.005em", marginBottom: 28 }}>
          His prominence extended beyond the salon. Lyndon was featured in publications including Texas Monthly, Vogue, Harper&rsquo;s Bazaar, and the London Sunday Mail. In addition to his beauty career, he was a talented visual artist whose paintings and landscapes, especially his impressionist work, were widely sought after. In 1992, he began painting in earnest, and his artwork quickly gained recognition, with pieces selling for as much as $1,200.
        </div>
        <div style={{ fontSize: 15, color: "#555", lineHeight: 1.85, letterSpacing: "0.005em", marginBottom: 28 }}>
          Lyndon believed beauty was both an art and a form of confidence. Whether through hairstyling, makeup, fashion guidance, or painting, he helped people see themselves and the world around them, with greater elegance and possibility. His legacy remains one of style, artistry, and unforgettable presence.
        </div>
        <div style={{ fontSize: 15, color: "#555", lineHeight: 1.85, letterSpacing: "0.005em", marginBottom: 56, fontStyle: "italic" }}>
          This website is dedicated to preserving and celebrating his life, his work, and the lasting mark he left on Houston&rsquo;s artistic and cultural community.
        </div>

        <div
          style={{
            paddingTop: 28,
            borderTop: "1px solid #efefef",
            fontSize: 14,
            color: "#666",
            lineHeight: 1.75,
            marginBottom: 32,
          }}
        >
          If you own or have come across one of Lyndon&rsquo;s paintings and would like to share information or connect with the family, please reach out to his niece Jessica at the address below.
        </div>

        <div
          style={{
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
            <a href="mailto:jessicalynn11@yahoo.com" style={{ color: "#1a1a1a", textDecoration: "none" }}>jessicalynn11@yahoo.com</a>
          </div>
          <div>
            <div style={{ color: "#bbb", marginBottom: 6, fontSize: 10 }}>in memory</div>
            <span style={{ color: "#1a1a1a" }}>Houston, TX · 1941–1995</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
