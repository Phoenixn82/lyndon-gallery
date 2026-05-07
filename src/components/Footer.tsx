export default function Footer() {
  return (
    <footer
      style={{
        padding: "60px max(40px, 4vw)",
        display: "flex",
        justifyContent: "center",
        borderTop: "1px solid #efefef",
        marginTop: 80,
      }}
    >
      <a
        href="mailto:jessicalynn11@yahoo.com"
        style={{
          fontSize: 12,
          color: "#999",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        jessicalynn11@yahoo.com
      </a>
    </footer>
  );
}
