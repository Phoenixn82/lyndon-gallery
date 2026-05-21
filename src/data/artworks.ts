export interface ArtPiece {
  slug: string;
  title: string;
  medium: string;
  dimensions: string;
  year: number;
  description?: string;
  image: string;
  back?: string;
  model3d?: string;
  /** CSS aspect-ratio of the cropped front image, e.g. "4 / 5" or "3278 / 4104". */
  aspect?: string;
  frame: {
    type: 'thin-modern' | 'classic-wood' | 'ornate-gilt' | 'float-frame' | 'no-frame';
    color?: string;
    matBoard?: boolean;
    matColor?: string;
  };
  featured?: boolean;
  order?: number;
}

const noFrame = { type: 'no-frame' as const };

export const defaultArtworks: ArtPiece[] = [
  {
    slug: '01-woman-with-red-hair-and-two-cats',
    title: 'Woman with Red Hair and Two Cats',
    medium: 'Oil on canvas',
    dimensions: '65 × 57 cm',
    year: 1978,
    description:
      'A red-haired woman in a white blouse holds a calico, a tortoiseshell asleep at her side. Lamp and a pitcher of pinks for company.',
    image: '/paintings/01_woman_with_red_hair_and_two_cats.jpg',
    back: '/paintings/01_woman_with_red_hair_and_two_cats_back.jpg',
    model3d: '/models/01_woman_with_red_hair_and_two_cats.glb',
    aspect: '4693 / 4104',
    frame: noFrame,
    featured: true,
  },
  {
    slug: '02-young-man-in-the-white-shirt',
    title: 'Young Man in the White Shirt',
    medium: 'Oil on canvas',
    dimensions: '50 × 60 cm',
    year: 1979,
    description:
      'Seated portrait, soft amber light. White shirt loose at the collar, a tapestry burning behind him.',
    image: '/paintings/02_young_man_in_the_white_shirt.jpg',
    back: '/paintings/02_young_man_in_the_white_shirt_back.jpg',
    model3d: '/models/02_young_man_in_the_white_shirt.glb',
    aspect: '3066 / 3604',
    frame: noFrame,
  },
  {
    slug: '03-pomegranates-beneath-the-green-wreath',
    title: 'Pomegranates Beneath the Green Wreath',
    medium: 'Oil on canvas',
    dimensions: '50 × 60 cm',
    year: 1981,
    description:
      'A wreath of foliage arches over a tumble of split pomegranates and a small white bird at the threshold.',
    image: '/paintings/03_pomegranates_beneath_the_green_wreath.jpg',
    back: '/paintings/03_pomegranates_beneath_the_green_wreath_back.jpg',
    model3d: '/models/03_pomegranates_beneath_the_green_wreath.glb',
    aspect: '1110 / 1417',
    frame: noFrame,
  },
  {
    slug: '04-tulips-and-the-lady-in-red',
    title: 'Tulips and the Lady in Red',
    medium: 'Oil on canvas',
    dimensions: '50 × 60 cm',
    year: 1982,
    description:
      'Yellow and red tulips lean from a glass jar; a porcelain lady in a scarlet robe keeps watch from the corner.',
    image: '/paintings/04_tulips_and_the_lady_in_red.jpg',
    back: '/paintings/04_tulips_and_the_lady_in_red_back.jpg',
    model3d: '/models/04_tulips_and_the_lady_in_red.glb',
    aspect: '1140 / 1380',
    frame: noFrame,
  },
  {
    slug: '05-bouquet-with-the-little-black-hare',
    title: 'Bouquet with the Little Black Hare',
    medium: 'Oil on canvas',
    dimensions: '45 × 60 cm',
    year: 1983,
    description:
      'A mixed bouquet — pinks, daisies, yellow lilies — beside a small framed sketch on an easel; a black ceramic hare crouching at the cloth.',
    image: '/paintings/05_bouquet_with_the_little_black_hare.jpg',
    back: '/paintings/05_bouquet_with_the_little_black_hare_back.jpg',
    model3d: '/models/05_bouquet_with_the_little_black_hare.glb',
    aspect: '1147 / 1371',
    frame: noFrame,
  },
  {
    slug: '06-lilies-above-the-painted-vase',
    title: 'Lilies Above the Painted Vase',
    medium: 'Oil on canvas',
    dimensions: '50 × 60 cm',
    year: 1984,
    description:
      'Stargazer lilies erupt from an Imari-style vase painted with two figures; the cloth at its foot a wash of carnival color.',
    image: '/paintings/06_lilies_above_the_painted_vase.jpg',
    back: '/paintings/06_lilies_above_the_painted_vase_back.jpg',
    model3d: '/models/06_lilies_above_the_painted_vase.glb',
    aspect: '1165 / 1350',
    frame: noFrame,
  },
  {
    slug: '07-the-pond-garden-in-bloom',
    title: 'The Pond Garden in Bloom',
    medium: 'Oil on canvas',
    dimensions: '50 × 60 cm',
    year: 1985,
    description:
      'A canna lily blazing among reeds, water lilies opening on the still pond, the day past noon.',
    image: '/paintings/07_the_pond_garden_in_bloom.jpg',
    back: '/paintings/07_the_pond_garden_in_bloom_back.jpg',
    model3d: '/models/07_the_pond_garden_in_bloom.glb',
    aspect: '1160 / 1356',
    frame: noFrame,
  },
  {
    slug: '08-wisteria-with-the-bowl-of-oranges',
    title: 'Wisteria with the Bowl of Oranges',
    medium: 'Oil on canvas',
    dimensions: '65 × 50 cm',
    year: 1986,
    description:
      'A cascade of wisteria over a blue-and-white bowl of oranges; the cloth beneath them a furnace of orange and rust.',
    image: '/paintings/08_wisteria_with_the_bowl_of_oranges.jpg',
    back: '/paintings/08_wisteria_with_the_bowl_of_oranges_back.jpg',
    model3d: '/models/08_wisteria_with_the_bowl_of_oranges.glb',
    aspect: '1396 / 1127',
    frame: noFrame,
    featured: true,
  },
];
