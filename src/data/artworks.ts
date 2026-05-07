export interface ArtPiece {
  slug: string;
  title: string;
  medium: string;
  dimensions: string;
  year: number;
  description?: string;
  image: string;
  back?: string;
  frame: {
    type: 'thin-modern' | 'classic-wood' | 'ornate-gilt' | 'float-frame' | 'no-frame';
    color?: string;
    matBoard?: boolean;
    matColor?: string;
  };
  featured?: boolean;
  order?: number;
}

export const defaultArtworks: ArtPiece[] = [
  {
    slug: "untitled-no-4",
    title: "Untitled No. 4",
    medium: "Oil on canvas",
    dimensions: "36 × 48 inches",
    year: 2023,
    description: "Part of an ongoing study of light bleeding into negative space. Begun in early winter, finished in spring.",
    image: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=1200&q=85",
    frame: { type: "thin-modern", color: "#1a1a1a" },
  },
];
