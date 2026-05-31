"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialGrid from "@/components/EditorialGrid";
import ArtModal from "@/components/ArtModal";
import IntentPopup from "@/components/IntentPopup";
import { defaultArtworks } from "@/data/artworks";

export default function GalleryPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const pieces = defaultArtworks;

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1a1a1a" }}>
      <IntentPopup />
      <Header />
      <main style={{ padding: "max(40px, 4vw) max(40px, 4vw) 0" }}>
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
