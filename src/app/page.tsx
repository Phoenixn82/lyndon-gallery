"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialGrid from "@/components/EditorialGrid";
import ArtModal from "@/components/ArtModal";
import { defaultArtworks, type ArtPiece } from "@/data/artworks";

function loadArtworks(): ArtPiece[] {
  if (typeof window === "undefined") return defaultArtworks;
  const stored = localStorage.getItem("lj-artworks");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultArtworks;
    }
  }
  return defaultArtworks;
}

export default function GalleryPage() {
  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPieces(loadArtworks());
    setMounted(true);
  }, []);

  useEffect(() => {
    const onStorage = () => setPieces(loadArtworks());
    window.addEventListener("storage", onStorage);
    window.addEventListener("artworks-updated", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("artworks-updated", onStorage);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1a1a1a" }}>
      <Header />
      <main style={{ padding: "max(40px, 4vw) max(40px, 4vw) 0" }}>
        <div
          style={{
            fontSize: 13,
            color: "#999",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 36,
            paddingLeft: 2,
          }}
        >
          paintings · {pieces.length}
        </div>
        {pieces.length > 0 ? (
          <EditorialGrid
            pieces={pieces}
            onPieceClick={(p) => setActiveIdx(pieces.findIndex((x) => x.slug === p.slug))}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "120px 0", color: "#999", fontSize: 14 }}>
            No paintings yet.
          </div>
        )}
      </main>
      <Footer />
      {activeIdx !== null && pieces[activeIdx] && (
        <ArtModal
          piece={pieces[activeIdx]}
          onClose={() => setActiveIdx(null)}
          onPrev={() => setActiveIdx((i) => (i! - 1 + pieces.length) % pieces.length)}
          onNext={() => setActiveIdx((i) => (i! + 1) % pieces.length)}
        />
      )}
    </div>
  );
}
