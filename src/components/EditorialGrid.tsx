"use client";
import type { ArtPiece } from "@/data/artworks";
import ArtCard from "./ArtCard";

export default function EditorialGrid({
  pieces,
  onPieceClick,
}: {
  pieces: ArtPiece[];
  onPieceClick: (piece: ArtPiece) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridAutoRows: "minmax(0, auto)",
        gap: "42px 28px",
      }}
      className="editorial-grid"
    >
      <style>{`
        @media (max-width: 1023px) {
          .editorial-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 767px) {
          .editorial-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .editorial-grid .span-2 { grid-column: span 1 !important; }
        }
        @media (max-width: 479px) {
          .editorial-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {pieces.map((p) => {
        const featured = !!p.featured;
        return (
          <div
            key={p.slug}
            className={featured ? "span-2" : ""}
            style={{ gridColumn: featured ? "span 2" : "span 1" }}
          >
            {/* No forced aspectRatio — each piece carries its own natural aspect
                (artworks.ts) so portrait paintings render full-height instead
                of being chopped to a square. */}
            <ArtCard piece={p} onClick={onPieceClick} />
          </div>
        );
      })}
    </div>
  );
}
