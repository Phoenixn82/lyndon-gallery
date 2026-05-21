"use client";
import { useEffect } from "react";
import type { ArtPiece } from "@/data/artworks";

const MV_SCRIPT_SRC =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";

function ensureModelViewerLoaded() {
  if (typeof window === "undefined") return;
  if (document.getElementById("model-viewer-script")) return;
  const s = document.createElement("script");
  s.id = "model-viewer-script";
  s.type = "module";
  s.src = MV_SCRIPT_SRC;
  s.async = true;
  document.head.appendChild(s);
}

type ModelViewerProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement> & {
    src?: string;
    poster?: string;
    alt?: string;
    "camera-controls"?: boolean;
    "auto-rotate"?: boolean;
    "auto-rotate-delay"?: string | number;
    "rotation-per-second"?: string;
    "camera-orbit"?: string;
    "min-camera-orbit"?: string;
    "max-camera-orbit"?: string;
    "field-of-view"?: string;
    "min-field-of-view"?: string;
    "max-field-of-view"?: string;
    "environment-image"?: string;
    "skybox-image"?: string;
    "tone-mapping"?: string;
    exposure?: string | number;
    "shadow-intensity"?: string | number;
    "shadow-softness"?: string | number;
    "interaction-prompt"?: string;
    loading?: string;
  },
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerProps;
    }
  }
}

export default function Model3DView({ piece }: { piece: ArtPiece }) {
  useEffect(() => {
    ensureModelViewerLoaded();
  }, []);

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
      }}
    >
      <model-viewer
        src={piece.model3d}
        poster={piece.image}
        alt={piece.title}
        camera-controls
        auto-rotate
        auto-rotate-delay="2200"
        rotation-per-second="20deg"
        camera-orbit="-22deg 78deg auto"
        min-camera-orbit="auto auto auto"
        max-camera-orbit="auto auto auto"
        field-of-view="24deg"
        min-field-of-view="10deg"
        max-field-of-view="45deg"
        environment-image="neutral"
        tone-mapping="commerce"
        exposure="1.05"
        shadow-intensity="0.7"
        shadow-softness="0.95"
        interaction-prompt="auto"
        loading="lazy"
        style={{
          width: "min(88vw, 820px)",
          height: "min(72vh, 820px)",
          background: "#ffffff",
          // @ts-expect-error custom property
          "--poster-color": "transparent",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#999",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        drag to rotate · scroll to zoom
      </div>
    </div>
  );
}
