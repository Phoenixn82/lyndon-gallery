"use client";
import { useState, useEffect } from "react";
import { defaultArtworks, type ArtPiece } from "@/data/artworks";

const ADMIN_PASSWORD = "lyndon2024";

const FRAME_TYPES = [
  { value: "thin-modern", label: "Thin Modern" },
  { value: "classic-wood", label: "Classic Wood" },
  { value: "ornate-gilt", label: "Ornate Gilt" },
  { value: "float-frame", label: "Float Frame" },
  { value: "no-frame", label: "No Frame" },
] as const;

function loadArtworks(): ArtPiece[] {
  if (typeof window === "undefined") return defaultArtworks;
  const stored = localStorage.getItem("lj-artworks");
  if (stored) {
    try { return JSON.parse(stored); } catch { return defaultArtworks; }
  }
  return defaultArtworks;
}

function saveArtworks(pieces: ArtPiece[]) {
  localStorage.setItem("lj-artworks", JSON.stringify(pieces));
  window.dispatchEvent(new Event("artworks-updated"));
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  border: "1px solid #ddd",
  borderRadius: 4,
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 200ms",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#888",
  marginBottom: 6,
  display: "block",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [title, setTitle] = useState("");
  const [medium, setMedium] = useState("Oil on canvas");
  const [dimensions, setDimensions] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [frameType, setFrameType] = useState<ArtPiece["frame"]["type"]>("thin-modern");
  const [frameColor, setFrameColor] = useState("#1a1a1a");
  const [matBoard, setMatBoard] = useState(false);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    setPieces(loadArtworks());
    setMounted(true);
    if (typeof window !== "undefined" && sessionStorage.getItem("lj-admin-auth") === "true") {
      setAuthed(true);
    }
  }, []);

  if (!mounted) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("lj-admin-auth", "true");
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newPiece: ArtPiece = {
      slug,
      title: title.trim(),
      medium: medium.trim(),
      dimensions: dimensions.trim(),
      year,
      description: description.trim() || undefined,
      image: imageUrl.trim(),
      frame: {
        type: frameType,
        color: frameColor,
        matBoard,
      },
      featured,
    };

    const updated = [...pieces, newPiece];
    setPieces(updated);
    saveArtworks(updated);
    setShowForm(false);
    setTitle("");
    setMedium("Oil on canvas");
    setDimensions("");
    setYear(new Date().getFullYear());
    setDescription("");
    setImageUrl("");
    setFrameType("thin-modern");
    setFrameColor("#1a1a1a");
    setMatBoard(false);
    setFeatured(false);
  };

  const handleDelete = (slug: string) => {
    const updated = pieces.filter((p) => p.slug !== slug);
    setPieces(updated);
    saveArtworks(updated);
  };

  const handleReset = () => {
    setPieces(defaultArtworks);
    saveArtworks(defaultArtworks);
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <form onSubmit={handleLogin} style={{ textAlign: "center", maxWidth: 320 }}>
          <div style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontStyle: "italic", fontSize: 32, marginBottom: 40, color: "#1a1a1a" }}>
            Admin
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ ...inputStyle, textAlign: "center", marginBottom: 16 }}
            autoFocus
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1a1a1a" }}>
      <header style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 max(40px, 4vw)",
        borderBottom: "1px solid #efefef",
      }}>
        <div style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontStyle: "italic", fontSize: 28, color: "#1a1a1a" }}>
          Admin
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/" style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#666", textDecoration: "none" }}>
            gallery
          </a>
          <button
            onClick={() => { sessionStorage.removeItem("lj-admin-auth"); setAuthed(false); }}
            style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#999", background: "none", border: "none", cursor: "pointer" }}
          >
            logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px max(24px, 3vw)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: "#999", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            paintings · {pieces.length}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleReset}
              style={{
                padding: "8px 16px",
                background: "none",
                border: "1px solid #ddd",
                borderRadius: 4,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#999",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: "8px 20px",
                background: "#1a1a1a",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {showForm ? "Cancel" : "+ Add Painting"}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} style={{ marginBottom: 40, padding: 28, border: "1px solid #eee", borderRadius: 6 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Medium</label>
                <input style={inputStyle} value={medium} onChange={(e) => setMedium(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Dimensions</label>
                <input style={inputStyle} value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="36 × 48 inches" />
              </div>
              <div>
                <label style={labelStyle}>Year</label>
                <input style={inputStyle} type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Image URL *</label>
                <input style={inputStyle} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." required />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Description (optional)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Frame Type</label>
                <select style={inputStyle} value={frameType} onChange={(e) => setFrameType(e.target.value as ArtPiece["frame"]["type"])}>
                  {FRAME_TYPES.map((ft) => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Frame Color</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="color" value={frameColor} onChange={(e) => setFrameColor(e.target.value)} style={{ width: 40, height: 38, border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }} />
                  <input style={inputStyle} value={frameColor} onChange={(e) => setFrameColor(e.target.value)} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#555", cursor: "pointer" }}>
                  <input type="checkbox" checked={matBoard} onChange={(e) => setMatBoard(e.target.checked)} />
                  Mat board
                </label>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#555", cursor: "pointer" }}>
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                  Featured (larger card)
                </label>
              </div>
            </div>
            <button
              type="submit"
              style={{
                marginTop: 24,
                padding: "12px 32px",
                background: "#1a1a1a",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Add Painting
            </button>
          </form>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {pieces.map((p) => (
            <div
              key={p.slug}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "16px 0",
                borderBottom: "1px solid #f5f5f5",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "#f0ede8",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: "#333", fontWeight: 400 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{p.medium}, {p.year}</div>
              </div>
              <div style={{ fontSize: 11, color: "#bbb", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {p.frame.type}
              </div>
              <button
                onClick={() => handleDelete(p.slug)}
                style={{
                  padding: "6px 14px",
                  background: "none",
                  border: "1px solid #eee",
                  borderRadius: 4,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#c44",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 200ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fee"; e.currentTarget.style.borderColor = "#fcc"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "#eee"; }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
