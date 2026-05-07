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
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: 28,
          color: "#1a1a1a",
          letterSpacing: "-0.01em",
          lineHeight: 1,
          whiteSpace: "nowrap",
          textDecoration: "none",
        }}
      >
        Lyndon Johnson
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
