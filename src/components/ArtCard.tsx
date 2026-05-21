"use client";
import { useState, useEffect, useRef } from "react";
import type { ArtPiece } from "@/data/artworks";

export default function ArtCard({
  piece,
  onClick,
  aspectRatio,
}: {
  piece: ArtPiece;
  onClick: (piece: ArtPiece) => void;
  aspectRatio?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => onClick(piece)}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        opacity: inView ? 1 : 0,
        transition: "opacity 600ms ease, transform 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        const img = e.currentTarget.querySelector<HTMLElement>(".lj-card-img");
        if (img) img.style.boxShadow = "0 8px 30px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        const img = e.currentTarget.querySelector<HTMLElement>(".lj-card-img");
        if (img) img.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
      }}
    >
      <div
        className="lj-card-img"
        style={{
          position: "relative",
          background: "#faf8f4",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          transition: "box-shadow 300ms ease",
          // Container is sized to the painting's natural aspect; padding gives
          // the frame breathing room so edges never touch the card boundary.
          aspectRatio: piece.aspect || aspectRatio,
          minHeight: piece.aspect || aspectRatio ? undefined : 220,
          padding: "3.5%",
        }}
      >
        {inView && (
          <img
            src={piece.image}
            alt={piece.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: loaded ? 1 : 0,
              transition: "opacity 500ms ease",
            }}
          />
        )}
        {!loaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(110deg, #f0ede8 25%, #e8e4dd 50%, #f0ede8 75%)",
              backgroundSize: "200% 100%",
              animation: "lj-shimmer 1.6s infinite",
            }}
          />
        )}
      </div>
      <div style={{ paddingTop: 12, paddingLeft: 2 }}>
        <div style={{ fontSize: 14, color: "#333", letterSpacing: "0.01em", fontWeight: 400 }}>
          {piece.title}
        </div>
        <div style={{ fontSize: 12.5, color: "#999", letterSpacing: "0.02em", marginTop: 3 }}>
          {piece.medium}, {piece.year}
        </div>
      </div>
    </div>
  );
}
