"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialGrid from "@/components/EditorialGrid";
import ArtModal from "@/components/ArtModal";
import { defaultArtworks } from "@/data/artworks";

export default function GalleryPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const pieces = defaultArtworks;

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
