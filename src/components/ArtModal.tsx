"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import type { ArtPiece } from "@/data/artworks";
import Model3DView from "./Model3DView";

function shade(hex: string | undefined, pct: number): string {
  if (!hex) return "#5a3a20";
  const h = hex.replace("#", "");
  const num = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  let r = (num >> 16) + pct;
  let g = ((num >> 8) & 0xff) + pct;
  let b = (num & 0xff) + pct;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `rgb(${r}, ${g}, ${b})`;
}

function frameStyleFor(frame: ArtPiece["frame"]) {
  switch (frame.type) {
    case "thin-modern":
      return {
        padding: 14,
        background: frame.color || "#1a1a1a",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), 0 30px 60px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.12)",
        borderRadius: 1,
      };
    case "classic-wood":
      return {
        padding: 38,
        background: `repeating-linear-gradient(180deg, ${shade(frame.color, -8)} 0 2px, ${frame.color || "#5a3a20"} 2px 6px, ${shade(frame.color, 6)} 6px 9px), ${frame.color || "#5a3a20"}`,
        boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.4), inset 0 0 18px rgba(0,0,0,0.4), 0 30px 60px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.15)",
        borderRadius: 2,
      };
    case "ornate-gilt":
      return {
        padding: 46,
        background: `repeating-linear-gradient(45deg, ${shade(frame.color, 14)} 0 3px, ${frame.color || "#b89456"} 3px 7px, ${shade(frame.color, -10)} 7px 10px), ${frame.color || "#b89456"}`,
        boxShadow: "inset 0 0 0 3px rgba(255, 220, 150, 0.5), inset 0 0 24px rgba(120, 80, 20, 0.6), 0 30px 60px rgba(0,0,0,0.22)",
        borderRadius: 1,
      };
    case "float-frame":
      return {
        padding: 22,
        background: frame.color || "#e8e0d0",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08), 0 30px 60px rgba(0,0,0,0.18)",
        borderRadius: 1,
      };
    case "no-frame":
    default:
      return {
        padding: 0,
        background: "transparent",
        boxShadow: "0 30px 60px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.05)",
        borderRadius: 0,
      };
  }
}

function CanvasBack({ piece }: { piece: ArtPiece }) {
  // If the piece has a real generated back image (kraft paper + wire +
  // Lyndon signature + dimensions baked in), render it directly.
  if (piece.back) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
          overflow: "hidden",
        }}
      >
        <img
          src={piece.back}
          alt={`${piece.title} (verso)`}
          draggable="false"
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  // Fallback: procedural verso for pieces that don't have a back image yet.
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#e8dfcd",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(120,90,50,0.06) 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, rgba(120,90,50,0.06) 0 2px, transparent 2px 4px)",
        boxShadow: "inset 0 0 0 12px #b89968, inset 0 0 0 13px rgba(0,0,0,0.15), inset 0 0 60px rgba(80,60,30,0.18)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "8% 10%",
        overflow: "hidden",
        fontFamily: "var(--font-inter), 'Inter', sans-serif",
        color: "#3a2a18",
        transform: "rotateY(180deg)",
        backfaceVisibility: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: "8%", right: "8%", top: "50%", height: 14, background: "#c9a878", boxShadow: "0 1px 0 rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.08)", opacity: 0.7 }} />
      <div style={{ fontSize: "clamp(14px, 4vw, 28px)", fontStyle: "italic", letterSpacing: "0.01em", lineHeight: 1.3, position: "relative", zIndex: 1, wordBreak: "break-word" }}>
        {piece.title}
      </div>
      <div style={{ fontSize: "clamp(10px, 2.5vw, 16px)", color: "#5a4028", letterSpacing: "0.05em", textTransform: "uppercase", position: "relative", zIndex: 1, textAlign: "right" }}>
        <div style={{ marginBottom: 4 }}>{piece.medium}</div>
        <div style={{ marginBottom: 4 }}>{piece.dimensions}</div>
        <div>{piece.year}</div>
        <div style={{ marginTop: 12, fontFamily: "var(--font-display), 'Pinyon Script', cursive", fontSize: "clamp(18px, 5vw, 32px)", textTransform: "none", letterSpacing: "0", color: "#2a1a08" }}>
          Lyndon
        </div>
      </div>
    </div>
  );
}

function FramedView({ piece }: { piece: ArtPiece }) {
  const [yRot, setYRot] = useState(-12);
  const [xRot, setXRot] = useState(8);
  const [dragging, setDragging] = useState(false);
  const [auto, setAuto] = useState(true);
  const startRef = useRef<{ px: number; py: number; y: number; x: number } | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!auto || dragging) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setYRot((y) => y + dt * 0.012);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [auto, dragging]);

  const onDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    setAuto(false);
    const pt = "touches" in e ? e.touches[0] : e;
    startRef.current = { px: pt.clientX, py: pt.clientY, y: yRot, x: xRot };
  }, [yRot, xRot]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!startRef.current) return;
      const pt = "touches" in e ? e.touches[0] : e;
      const dx = pt.clientX - startRef.current.px;
      const dy = pt.clientY - startRef.current.py;
      setYRot(startRef.current.y + dx * 0.5);
      setXRot(Math.max(-30, Math.min(30, startRef.current.x - dy * 0.25)));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging]);

  const onDouble = () => {
    setYRot(0);
    setXRot(0);
    setAuto(false);
  };

  const fs = frameStyleFor(piece.frame);
  const matBoard = piece.frame.matBoard;
  const matColor = piece.frame.matColor || "#f1ecdf";
  const norm = ((yRot % 360) + 360) % 360;
  const isBack = norm > 90 && norm < 270;
  const lightX = -Math.sin((yRot * Math.PI) / 180) * 30;
  const lightY = -xRot * 0.6;

  return (
    <div
      style={{
        flex: 1,
        background: "#ffffff",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        userSelect: "none",
        cursor: dragging ? "grabbing" : "grab",
        perspective: 1600,
        perspectiveOrigin: "50% 50%",
      }}
      onMouseDown={onDown}
      onTouchStart={onDown}
      onDoubleClick={onDouble}
    >
      <div
        style={{
          position: "absolute",
          width: "55%",
          height: 26,
          bottom: "16%",
          left: "22.5%",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, transparent 70%)",
          filter: "blur(10px)",
          transform: `translateX(${Math.sin((yRot * Math.PI) / 180) * 30}px) scaleX(${0.7 + Math.abs(Math.cos((yRot * Math.PI) / 180)) * 0.5})`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          transform: `rotateY(${yRot}deg) rotateX(${xRot}deg)`,
          transformStyle: "preserve-3d",
          transition: dragging ? "none" : "transform 60ms linear",
          maxWidth: "85vw",
          maxHeight: "70vh",
        }}
      >
        <div
          style={{
            ...fs,
            position: "relative",
            display: "block",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: fs.borderRadius,
              background: `radial-gradient(circle at ${50 + lightX}% ${50 + lightY}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 55%)`,
              pointerEvents: "none",
              mixBlendMode: "screen",
            }}
          />
          <div
            style={{
              padding: matBoard ? 28 : 0,
              background: matBoard ? matColor : "transparent",
              boxShadow: matBoard ? "inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 2px 6px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <div
              style={{
                position: "relative",
                boxShadow: matBoard ? "0 0 0 1px rgba(0,0,0,0.1), inset 0 2px 8px rgba(0,0,0,0.15)" : "inset 0 2px 14px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={piece.image}
                alt={piece.title}
                style={{
                  display: "block",
                  width: "min(440px, 70vw)",
                  height: "auto",
                  maxHeight: "55vh",
                  objectFit: "contain",
                }}
                draggable="false"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(${110 + lightX * 0.8}deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.08) 100%)`,
                  pointerEvents: "none",
                  mixBlendMode: "screen",
                }}
              />
            </div>
          </div>
        </div>
        <CanvasBack piece={piece} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
          alignItems: "center",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#999",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: 3, background: !isBack ? "#1a1a1a" : "#ddd", transition: "background 200ms" }} />
        <span style={{ marginRight: 14 }}>front</span>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: isBack ? "#1a1a1a" : "#ddd", transition: "background 200ms" }} />
        <span>verso</span>
      </div>
    </div>
  );
}

function FlatView({ piece }: { piece: ArtPiece }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "min(6vw, 60px)",
        position: "relative",
      }}
    >
      <img
        src={piece.image}
        alt={piece.title}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          display: "block",
        }}
      />
    </div>
  );
}

export default function ArtModal({
  piece,
  onClose,
  onPrev,
  onNext,
}: {
  piece: ArtPiece;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [mode, setMode] = useState<"framed" | "flat">("framed");

  useEffect(() => {
    setMode("framed");
  }, [piece.slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setMode((m) => (m === "framed" ? "flat" : "framed"));
      if (e.key === "ArrowLeft") setMode((m) => (m === "flat" ? "framed" : "flat"));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    // Wire the browser Back button to close the modal: push a history entry
    // when the modal opens, then close on popstate. Pop our entry on cleanup
    // so close-via-X / Esc doesn't leave a stale entry behind.
    const stateKey = "lj-modal-open";
    history.pushState({ [stateKey]: true }, "");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      document.body.style.overflow = "";
      // If our pushed entry is still on top, remove it so the Back button
      // doesn't have a no-op step in the user's history.
      if (history.state && history.state[stateKey]) {
        history.back();
      }
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        animation: "lj-fade 280ms ease",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          flexShrink: 0,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <button
            onClick={onClose}
            aria-label="Back to gallery"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px 10px 8px 4px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#1a1a1a",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M12 3L6 9L12 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back</span>
          </button>
          <a
            href="/"
            style={{
              fontFamily: "var(--font-display), 'Pinyon Script', cursive",
              fontSize: 24,
              color: "#1a1a1a",
              whiteSpace: "nowrap",
              lineHeight: 1,
              textDecoration: "none",
            }}
          >
            Lyndon Johnson
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onPrev} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "8px 4px" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>prev</span>
          </button>
          <button onClick={onNext} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "8px 4px" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>next</span>
          </button>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#999",
              fontSize: 24,
              cursor: "pointer",
              marginLeft: 8,
              padding: "4px 8px",
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Stage */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", opacity: mode === "framed" ? 1 : 0, transition: "opacity 350ms ease", pointerEvents: mode === "framed" ? "auto" : "none" }}>
          {piece.model3d ? (
            <Model3DView piece={piece} key={piece.slug} />
          ) : (
            <FramedView piece={piece} key={piece.slug} />
          )}
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", opacity: mode === "flat" ? 1 : 0, transition: "opacity 350ms ease", pointerEvents: mode === "flat" ? "auto" : "none" }}>
          <FlatView piece={piece} />
        </div>

        {/* Mode toggle */}
        <div style={{ position: "absolute", top: 16, left: 16, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", display: "flex", gap: 12, zIndex: 5 }}>
          <button onClick={() => setMode("framed")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: mode === "framed" ? "#1a1a1a" : "#ccc", transition: "color 200ms", fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit" }}>3D</button>
          <span style={{ color: "#e0e0e0", pointerEvents: "none" }}>·</span>
          <button onClick={() => setMode("flat")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: mode === "flat" ? "#1a1a1a" : "#ccc", transition: "color 200ms", fontSize: "inherit", letterSpacing: "inherit", textTransform: "inherit" }}>2D</button>
        </div>

        {/* Right arrow */}
        <button
          onClick={() => setMode((m) => (m === "framed" ? "flat" : "framed"))}
          aria-label={mode === "framed" ? "View flat 2D image" : "View framed 3D"}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #ececec",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 200ms ease",
            zIndex: 5,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M6 3L12 9L6 15" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        {/* Left arrow (flat mode only) */}
        <button
          onClick={() => setMode("framed")}
          aria-label="Back to framed 3D"
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            border: "1px solid #ececec",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 250ms ease",
            opacity: mode === "flat" ? 1 : 0,
            pointerEvents: mode === "flat" ? "auto" : "none",
            zIndex: 5,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M12 3L6 9L12 15" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* Bottom info bar */}
      <div
        style={{
          background: "#ffffff",
          padding: "16px 16px 20px",
          borderTop: "1px solid #f0f0f0",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 16, color: "#1a1a1a", letterSpacing: "0.01em", fontWeight: 400 }}>{piece.title}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 4, letterSpacing: "0.02em", lineHeight: 1.6 }}>
          {piece.medium} · {piece.dimensions} · {piece.year}
        </div>
        {piece.description && (
          <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7, fontStyle: "italic", marginTop: 8 }}>
            {piece.description}
          </div>
        )}
      </div>
    </div>
  );
}
