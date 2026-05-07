// Modal — opens with 3D framed view, full 360° rotation showing back of canvas
// Right arrow flips to 2D flat view.
const { useState: useStateM, useEffect: useEffectM, useRef: useRefM } = React;

function frameStyleFor(frame) {
  switch (frame.type) {
    case "thin-modern":
      return {
        padding: 14,
        background: frame.color || "#1a1a1a",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.05), 0 30px 60px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.12)",
        borderRadius: 1,
      };
    case "classic-wood":
      return {
        padding: 38,
        background: `
          repeating-linear-gradient(180deg, ${shade(frame.color, -8)} 0 2px, ${frame.color || "#5a3a20"} 2px 6px, ${shade(frame.color, 6)} 6px 9px),
          ${frame.color || "#5a3a20"}
        `,
        boxShadow:
          "inset 0 0 0 2px rgba(0,0,0,0.4), inset 0 0 18px rgba(0,0,0,0.4), 0 30px 60px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.15)",
        borderRadius: 2,
      };
    case "ornate-gilt":
      return {
        padding: 46,
        background: `
          repeating-linear-gradient(45deg, ${shade(frame.color, 14)} 0 3px, ${frame.color || "#b89456"} 3px 7px, ${shade(frame.color, -10)} 7px 10px),
          ${frame.color || "#b89456"}
        `,
        boxShadow:
          "inset 0 0 0 3px rgba(255, 220, 150, 0.5), inset 0 0 24px rgba(120, 80, 20, 0.6), 0 30px 60px rgba(0,0,0,0.22)",
        borderRadius: 1,
      };
    case "float-frame":
      return {
        padding: 22,
        background: frame.color || "#e8e0d0",
        boxShadow:
          "inset 0 0 0 1px rgba(0,0,0,0.08), 0 30px 60px rgba(0,0,0,0.18)",
        borderRadius: 1,
      };
    case "no-frame":
    default:
      return {
        padding: 0,
        background: "transparent",
        boxShadow:
          "0 30px 60px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.05)",
        borderRadius: 0,
      };
  }
}

function shade(hex, pct) {
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

// Painting back-of-canvas placeholder. Stretcher bars, canvas weave hint,
// and a handwritten signature/notes area to suggest where the real photo will go.
function CanvasBack({ piece }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#e8dfcd",
        backgroundImage: `
          repeating-linear-gradient(0deg, rgba(120,90,50,0.06) 0 2px, transparent 2px 4px),
          repeating-linear-gradient(90deg, rgba(120,90,50,0.06) 0 2px, transparent 2px 4px)
        `,
        boxShadow: "inset 0 0 0 12px #b89968, inset 0 0 0 13px rgba(0,0,0,0.15), inset 0 0 60px rgba(80,60,30,0.18)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "10% 12%",
        fontFamily: "var(--lj-script)",
        color: "#3a2a18",
        transform: "rotateY(180deg)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* horizontal stretcher crossbar suggestion */}
      <div style={{
        position: "absolute",
        left: "8%", right: "8%",
        top: "50%", height: 14,
        background: "#c9a878",
        boxShadow: "0 1px 0 rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.08)",
        opacity: 0.7,
      }} />
      <div style={{ fontSize: 28, fontStyle: "italic", letterSpacing: "0.01em", lineHeight: 1.3, position: "relative", zIndex: 1 }}>
        {piece.title}
      </div>
      <div style={{
        fontSize: 16,
        fontFamily: "'Inter', sans-serif",
        color: "#5a4028",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        position: "relative",
        zIndex: 1,
        textAlign: "right",
      }}>
        <div style={{ marginBottom: 4 }}>{piece.medium}</div>
        <div style={{ marginBottom: 4 }}>{piece.dimensions}</div>
        <div>{piece.year}</div>
        <div style={{ marginTop: 18, fontFamily: "var(--lj-script)", fontSize: 32, textTransform: "none", letterSpacing: 0, fontStyle: "italic", color: "#2a1a08" }}>
          Lyndon
        </div>
      </div>
      <div style={{
        position: "absolute",
        bottom: "6%",
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 9,
        fontFamily: "'Inter', sans-serif",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: "rgba(58,42,24,0.5)",
      }}>
        verso · placeholder for the artist's actual back-of-canvas photograph
      </div>
    </div>
  );
}

function FramedView3D({ piece, frameTypeOverride, autoSpin }) {
  // Y rotation in degrees, 0..360 (free-running, can grow). Modulo 360 for back/front.
  const [yRot, setYRot] = useStateM(-12);
  const [xRot, setXRot] = useStateM(8);
  const [dragging, setDragging] = useStateM(false);
  const [auto, setAuto] = useStateM(autoSpin !== false);
  const startRef = useRefM(null);
  const rafRef = useRefM(null);

  useEffectM(() => {
    if (!auto || dragging) return;
    let last = performance.now();
    const tick = (now) => {
      const dt = now - last;
      last = now;
      setYRot((y) => y + dt * 0.012); // ~4.3 deg/sec
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [auto, dragging]);

  const onDown = (e) => {
    setDragging(true);
    setAuto(false);
    const pt = e.touches ? e.touches[0] : e;
    startRef.current = { px: pt.clientX, py: pt.clientY, y: yRot, x: xRot };
  };
  const onMove = (e) => {
    if (!dragging) return;
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - startRef.current.px;
    const dy = pt.clientY - startRef.current.py;
    setYRot(startRef.current.y + dx * 0.5); // free 360
    setXRot(Math.max(-30, Math.min(30, startRef.current.x - dy * 0.25)));
  };
  const onUp = () => setDragging(false);
  const onDouble = () => {
    setYRot(0);
    setXRot(0);
    setAuto(false);
  };

  useEffectM(() => {
    if (!dragging) return;
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

  const frame = { ...piece.frame, type: frameTypeOverride || piece.frame.type };
  const fs = frameStyleFor(frame);
  const matBoard = frame.matBoard;
  const matColor = frame.matColor || "#f1ecdf";

  // Lighting follows rotation
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
      {/* soft floor shadow */}
      <div
        style={{
          position: "absolute",
          width: "55%",
          height: 26,
          bottom: "16%",
          left: "22.5%",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, transparent 70%)",
          filter: "blur(10px)",
          transform: `translateX(${Math.sin((yRot * Math.PI) / 180) * 30}px) scaleX(${0.7 + Math.abs(Math.cos((yRot * Math.PI) / 180)) * 0.5})`,
          pointerEvents: "none",
        }}
      />

      {/* The painting — front and back via preserve-3d backface-visibility */}
      <div
        style={{
          position: "relative",
          transform: `rotateY(${yRot}deg) rotateX(${xRot}deg)`,
          transformStyle: "preserve-3d",
          transition: dragging ? "none" : "transform 60ms linear",
        }}
      >
        {/* FRONT */}
        <div
          style={{
            ...fs,
            position: "relative",
            display: "block",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {/* light wash on frame */}
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
              boxShadow: matBoard
                ? "inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 2px 6px rgba(0,0,0,0.08)"
                : "none",
            }}
          >
            <div
              style={{
                position: "relative",
                boxShadow: matBoard
                  ? "0 0 0 1px rgba(0,0,0,0.1), inset 0 2px 8px rgba(0,0,0,0.15)"
                  : "inset 0 2px 14px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={piece.image}
                alt={piece.title}
                style={{
                  display: "block",
                  width: "min(440px, 50vw)",
                  height: "auto",
                  maxHeight: "55vh",
                  objectFit: "contain",
                }}
                draggable="false"
              />
              {/* glass reflection */}
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
        {/* BACK */}
        <CanvasBack piece={piece} />
      </div>

      {/* status pill: front/back indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
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
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: 3, background: !isBack ? "#1a1a1a" : "#ddd", transition: "background 200ms" }} />
        <span style={{ marginRight: 14 }}>front</span>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: isBack ? "#1a1a1a" : "#ddd", transition: "background 200ms" }} />
        <span>verso</span>
        <span style={{ marginLeft: 28, color: "#bbb" }}>drag · double-click resets</span>
      </div>
    </div>
  );
}

// 2D flat view
function FlatView({ piece }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "min(8vw, 80px)",
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

function ArtModal({ piece, onClose, onPrev, onNext, frameTypeOverride }) {
  // mode: "framed" (3D, default), "flat" (2D)
  const [mode, setMode] = useStateM("framed");

  // reset to framed when piece changes
  useEffectM(() => { setMode("framed"); }, [piece && piece.slug]);

  useEffectM(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setMode((m) => (m === "framed" ? "flat" : "framed"));
      if (e.key === "ArrowLeft") setMode((m) => (m === "flat" ? "framed" : "flat"));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!piece) return null;

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
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          color: "#999",
          flexShrink: 0,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            fontFamily: "var(--lj-script)",
            fontSize: 26,
            color: "#1a1a1a",
            fontStyle: "italic",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          Lyndon Johnson
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <button onClick={onPrev} style={navBtn} title="Previous piece (P)">
            <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999" }}>prev</span>
          </button>
          <button onClick={onNext} style={navBtn} title="Next piece (N)">
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
              marginLeft: 18,
              padding: "4px 8px",
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Stage — single view at a time, with mode toggle */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {/* The two views, cross-faded */}
        <div
          style={{
            position: "absolute", inset: 0, display: "flex",
            opacity: mode === "framed" ? 1 : 0,
            transition: "opacity 350ms ease",
            pointerEvents: mode === "framed" ? "auto" : "none",
          }}
        >
          <FramedView3D piece={piece} frameTypeOverride={frameTypeOverride} autoSpin={mode === "framed"} key={piece.slug} />
        </div>
        <div
          style={{
            position: "absolute", inset: 0, display: "flex",
            opacity: mode === "flat" ? 1 : 0,
            transition: "opacity 350ms ease",
            pointerEvents: mode === "flat" ? "auto" : "none",
          }}
        >
          <FlatView piece={piece} />
        </div>

        {/* Mode label top-left */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 32,
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#bbb",
            display: "flex",
            gap: 18,
            pointerEvents: "none",
          }}
        >
          <span style={{ color: mode === "framed" ? "#1a1a1a" : "#ccc", transition: "color 200ms" }}>3D · framed</span>
          <span style={{ color: "#e0e0e0" }}>·</span>
          <span style={{ color: mode === "flat" ? "#1a1a1a" : "#ccc", transition: "color 200ms" }}>2D · flat</span>
        </div>

        {/* Right arrow — toggles between framed and flat */}
        <button
          onClick={() => setMode((m) => (m === "framed" ? "flat" : "framed"))}
          aria-label={mode === "framed" ? "View flat 2D image" : "View framed 3D"}
          style={{
            position: "absolute",
            right: 28,
            top: "50%",
            transform: "translateY(-50%)",
            width: 56,
            height: 56,
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
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) translateX(2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-50%)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6 3L12 9L6 15" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Left arrow — appears when on flat */}
        <button
          onClick={() => setMode("framed")}
          aria-label="Back to framed 3D"
          style={{
            position: "absolute",
            left: 28,
            top: "50%",
            transform: "translateY(-50%)",
            width: 56,
            height: 56,
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
          onMouseEnter={(e) => {
            if (mode !== "flat") return;
            e.currentTarget.style.transform = "translateY(-50%) translateX(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-50%)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M12 3L6 9L12 15" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Bottom info bar — neutral white */}
      <div
        style={{
          background: "#ffffff",
          color: "#444",
          padding: "22px 40px 26px",
          display: "flex",
          gap: 60,
          alignItems: "flex-start",
          borderTop: "1px solid #f0f0f0",
          flexShrink: 0,
        }}
      >
        <div style={{ flex: "0 0 auto", minWidth: 280 }}>
          <div style={{ fontSize: 17, color: "#1a1a1a", letterSpacing: "0.01em", fontWeight: 400 }}>
            {piece.title}
          </div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 6, letterSpacing: "0.02em", lineHeight: 1.7 }}>
            {piece.medium}
            <br />
            {piece.dimensions}
            <br />
            {piece.year}
          </div>
        </div>
        {piece.description && (
          <div
            style={{
              flex: 1,
              fontSize: 13.5,
              color: "#666",
              lineHeight: 1.85,
              maxWidth: 560,
              letterSpacing: "0.01em",
              fontStyle: "italic",
              paddingTop: 4,
            }}
          >
            {piece.description}
          </div>
        )}
        <div
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "#bbb",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            paddingTop: 4,
          }}
        >
          /{piece.slug}
        </div>
      </div>
    </div>
  );
}

const navBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "8px 4px",
};

window.ArtModal = ArtModal;
