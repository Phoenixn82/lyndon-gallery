// Slim sticky bar that sits directly under the (64px) sticky header on the
// gallery + about pages, inviting people who own Lyndon's paintings to reach
// out. Relocated here from the bottom of the About page so it's always visible.
export default function ContactBar() {
  return (
    <div
      style={{
        position: "sticky",
        top: 64,
        zIndex: 40,
        background: "#f5efe4",
        borderBottom: "1px solid #e8e1d3",
        padding: "9px max(20px, 4vw)",
        textAlign: "center",
        fontSize: 12.5,
        color: "#5b5346",
        letterSpacing: "0.015em",
        lineHeight: 1.5,
      }}
    >
      If you own or have come across one of Lyndon&rsquo;s paintings, share a
      photo or connect with the family —{" "}
      <a
        href="mailto:jessicalynn11@yahoo.com"
        style={{
          color: "#1a1a1a",
          textDecoration: "underline",
          textUnderlineOffset: 2,
          whiteSpace: "nowrap",
        }}
      >
        jessicalynn11@yahoo.com
      </a>
    </div>
  );
}
