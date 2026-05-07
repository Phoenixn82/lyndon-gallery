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
      {pieces.map((p, i) => {
        const featured = p.featured || i % 7 === 3;
        const aspect = featured ? "5 / 4" : i % 3 === 0 ? "4 / 5" : "1 / 1";
        return (
          <div
            key={p.slug}
            className={featured ? "span-2" : ""}
            style={{ gridColumn: featured ? "span 2" : "span 1" }}
          >
            <ArtCard piece={p} onClick={onPieceClick} aspectRatio={aspect} />
          </div>
        );
      })}
    </div>
  );
}
