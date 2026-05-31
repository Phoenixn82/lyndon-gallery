"use client";
import { useState, useEffect } from "react";

// Shown once per visitor on landing — invites people who own Lyndon's
// paintings to get in touch. Dismissal is remembered in localStorage so
// returning visitors aren't nagged.
const SEEN_KEY = "lj-intent-popup-seen";

export default function IntentPopup() {
  const [open, setOpen] = useState(false);

  const close = () => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setOpen(false);
  };

  // Decide whether to show (first visit only), with a gentle delay after landing.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 650);
    return () => clearTimeout(t);
  }, []);

  // Lock scroll + wire Esc while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="A note about this gallery"
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(20,18,16,0.38)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        animation: "lj-fade 260ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(92vw, 460px)",
          background: "#ffffff",
          border: "1px solid #efefef",
          boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
          padding: "clamp(30px, 6vw, 46px)",
          borderRadius: 2,
          animation: "lj-fade 340ms ease",
        }}
      >
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            background: "none",
            border: "none",
            color: "#bbb",
            fontSize: 24,
            lineHeight: 1,
            cursor: "pointer",
            padding: 6,
          }}
        >
          ×
        </button>

        <div
          style={{
            fontSize: 10,
            color: "#999",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          A note
        </div>

        <p
          style={{
            fontSize: 15,
            color: "#3a3a3a",
            lineHeight: 1.75,
            letterSpacing: "0.005em",
            textAlign: "center",
            margin: "0 0 26px",
          }}
        >
          The intent of the site is to honor the work of Lyndon Johnson and
          connect with those who may own his original pieces. If you have a
          painting and would like to share a photo or would be interested in
          selling, please contact us.
        </p>

        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            paddingTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <a
            href="mailto:jessicalynn11@yahoo.com"
            style={{ fontSize: 14, color: "#1a1a1a", letterSpacing: "0.04em", textDecoration: "none" }}
          >
            jessicalynn11@yahoo.com
          </a>
          <a
            href="tel:+19798486868"
            style={{ fontSize: 14, color: "#1a1a1a", letterSpacing: "0.08em", textDecoration: "none" }}
          >
            979-848-6868
          </a>
        </div>

        <button
          onClick={close}
          style={{
            marginTop: 28,
            width: "100%",
            background: "#1a1a1a",
            color: "#ffffff",
            border: "none",
            padding: "12px 0",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
