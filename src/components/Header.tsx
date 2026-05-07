"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isAbout = pathname === "/about";

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
      <Link
        href="/"
        style={{
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display), 'Pinyon Script', cursive",
            fontWeight: 400,
            fontSize: 32,
            color: "#1a1a1a",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          Lyndon Johnson
        </span>
        <span
          style={{
            fontSize: 9,
            color: "#999",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginTop: 2,
          }}
        >
          art gallery
        </span>
      </Link>
      <Link
        href={isAbout ? "/" : "/about"}
        style={{
          background: "transparent",
          border: "none",
          color: "#666",
          fontSize: 12.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          textDecoration: "none",
          padding: "8px 4px",
          transition: "color 200ms ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a1a")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
      >
        {isAbout ? "gallery" : "about"}
      </Link>
    </header>
  );
}
