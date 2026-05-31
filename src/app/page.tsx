"use client";
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialGrid from "@/components/EditorialGrid";
import ArtModal from "@/components/ArtModal";
import IntentPopup from "@/components/IntentPopup";
import ContactBar from "@/components/ContactBar";
import { defaultArtworks } from "@/data/artworks";

export default function GalleryPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const pieces = defaultArtworks;

  // Stable identities so ArtModal's history (browser-back) effect — keyed on
  // onClose — doesn't tear down + re-run on every prev/next. The re-run fired
  // history.back(), whose deferred popstate slammed the modal shut, so prev/next
  // appeared to "do nothing." See ArtModal's open effect.
  const handleClose = useCallback(() => setActiveIdx(null), []);
  const handlePrev = useCallback(
    () => setActiveIdx((i) => (i! - 1 + pieces.length) % pieces.length),
    [pieces.length]
  );
  const handleNext = useCallback(
    () => setActiveIdx((i) => (i! + 1) % pieces.length),
    [pieces.length]
  );

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1a1a1a" }}>
      <IntentPopup />
      <Header />
      <ContactBar />
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
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
