export default function Footer() {
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
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: 22,
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
