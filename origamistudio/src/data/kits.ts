import type { CulturalCollection, OrigamiKit } from '../types/origami';
import kitsJson from './kits.json';

export const ORIGAMI_KITS: Record<string, OrigamiKit> = kitsJson as unknown as Record<string, OrigamiKit>;

export const ALL_KITS_ARRAY: OrigamiKit[] = Object.values(ORIGAMI_KITS);

export const COLLECTIONS: CulturalCollection[] = [
  {
    id: 'indian',
    emoji: '🦚',
    title: 'Royal Indian Origami Heritage',
    subtitle: 'Sacred Kagaz-Kala & Royal Courtyard Masterworks',
    description: 'Monumental cultural origami celebrating Indian heritage: Imperial Peacock with 18-pleat fan tail, Mysore procession elephant, Bengal tiger, marigold garlands, and Diwali diyas.',
    meta: ['8 KITS', '18 PIECES', '4-5 HRS'],
    details: {
      includes: ['Mayura (Imperial Peacock)', 'Gajendra (Mysore Elephant)', 'Royal Bengal Tiger', 'Genda Phool Garland', 'Deepavali Diya', 'Kathakali Crown', 'Sacred Kamalam Lotus', 'The Royal Durbar Assembly'],
      colors: ['Peacock Turquoise', 'Emerald Green', 'Saffron Yellow', 'Terracotta Brown', 'Padmaraga Pink', 'Mirror Gold Foil'],
      difficulty: 'Intermediate to Advanced'
    }
  },
  {
    id: 'japanese',
    emoji: '⛩️',
    title: 'Japanese Master Origami',
    subtitle: 'Edo Period & Classical Zen Heritage',
    description: 'Authentic Japanese masterworks: Sacred Orizuru Peace Crane with volumetric chest, Samurai Kabuto helmet, Hanami Sakura blossom, Minogame longevity tortoise, and Koinobori carp.',
    meta: ['6 KITS', '14 PIECES', '3-4 HRS'],
    details: {
      includes: ['Orizuru (Peace Crane)', 'Kabuto (Samurai Helmet)', 'Sakura (5-Petal Blossom)', 'Minogame (Sacred Tortoise)', 'Koinobori (Flying Carp)', 'Nihon-Ryu (Rising Dragon)'],
      colors: ['Cherry Blossom Pink', 'Cherry Red', 'Pure White', 'Navy Blue', 'Olive Jade', 'Gold Leaf'],
      difficulty: 'Beginner to Advanced'
    }
  },
  {
    id: 'chinese',
    emoji: '🏮',
    title: 'Chinese Heritage & Lunar Festivals',
    subtitle: 'Ancient Zhezhi & Spring Festival Auspicious Icons',
    description: 'Auspicious Lunar New Year and festival designs: Yuanbao golden wealth ingot, ribbed red palace lantern, celestial Loong dragon, Empress Fenghuang phoenix, and Mid-Autumn Jade Rabbit.',
    meta: ['6 KITS', '16 PIECES', '3-4.5 HRS'],
    details: {
      includes: ['Yuanbao (Golden Ingot)', 'Denglong (Palace Lantern)', 'Loong (Imperial Dragon)', 'Fenghuang (Empress Phoenix)', 'Mid-Autumn Jade Rabbit', 'Fu Chuan (Junk Ship)'],
      colors: ['Imperial Vermillion', 'Mirror Gold Foil', 'Jade Green', 'Ruby Red', 'Pearl White', 'Teak Kraft'],
      difficulty: 'Beginner to Advanced'
    }
  },
  {
    id: 'american',
    emoji: '🦅',
    title: 'American Modern Computational',
    subtitle: 'Action Origami & Modern Engineering Innovations',
    description: 'Cutting-edge Western origami: American Bald Eagle with duo color-change cowl, Prairie Bison, Robert Lang-inspired 32-grid Hercules beetle, kinetic jumping frog, and Golden Gate Bridge.',
    meta: ['6 KITS', '15 PIECES', '3-4.5 HRS'],
    details: {
      includes: ['American Bald Eagle', 'American Prairie Bison', 'Kinetic Jumping Frog', 'Hercules Beetle (32-Grid)', 'July 4th Starburst', 'Golden Gate Suspension Span'],
      colors: ['International Orange', 'Eagle Blue', 'Chocolate Brown', 'Spring Green', 'Patriotic Red & White'],
      difficulty: 'Beginner to Master'
    }
  },
  {
    id: 'lotus',
    emoji: '🪷',
    title: 'Lotus Garden & Water Pavilion',
    subtitle: 'Multi-layered blooms in botanical harmony',
    description: 'Modular lotus flowers with graduated petal layers, buoyant lily pads, S-curve swimming koi fish, and rippled water pavilion staging.',
    meta: ['6 KITS', '12 PIECES', '2.5-3.5 HRS'],
    details: {
      includes: ['Lotus Base & Calyx', 'Blooming Lotus (12-Petal)', 'Inner Core & Gold Stamen', 'Multi-Layered Lily Pads', 'Sculptural 3D Koi Fish', 'Aquatic Water Setting'],
      colors: ['Lotus Magenta', 'Soft Blush', 'Forest Jade', 'Saffron Yellow', 'Aquamarine Cyan', 'Deep Indigo'],
      difficulty: 'Intermediate'
    }
  },
  {
    id: 'butterfly',
    emoji: '🦋',
    title: 'Butterfly Mandala Wall Installation',
    subtitle: 'High-dihedral soaring wings & geometric armature',
    description: 'Intricately detailed butterflies with patterned multi-layered wings, elevation standoffs, and a tiered octagonal mandala frame for museum wall displays.',
    meta: ['7 KITS', '16 PIECES', '2.5-3.5 HRS'],
    details: {
      includes: ['Swallowtail Monarch', 'Emerald Morpho', 'Golden Birdwing (6-Inch)', 'Pygmy Azure Trio', 'Radial Mandala Armature', 'Concentric Petal Ring', 'Grand Mandala Wall Mount'],
      colors: ['Tangerine Orange', 'Emerald Foil', 'Jet Black & Mirror Gold', 'Turquoise Cyan', 'Deep Plum Violet'],
      difficulty: 'Intermediate to Advanced'
    }
  },
  {
    id: 'geometric',
    emoji: '🏺',
    title: 'Geometric Modular Polyhedral Vase',
    subtitle: 'Isometric interlocking prisms & Miura-ori skin',
    description: 'Thirty interlocking modular diamond units create striking faceted architectural vases. Reinforced with copper corner brackets and a weighted plinth.',
    meta: ['8 KITS', '30 PIECES', '3.5-4.5 HRS'],
    details: {
      includes: ['Tri-Faceted Base Unit', 'Diamond Honeycomb Module', 'Fluted Neck Collar', 'Hexagonal Waist Ring', 'Metallic Corner Brackets', 'Miura-Ori Spiral Skin', 'Weighted Plinth', '30-Piece Master Assembly'],
      colors: ['Architectural Navy', 'Brushed Copper Foil', 'Matte Charcoal', 'Deep Cobalt', 'Mirror Gold'],
      difficulty: 'Advanced'
    }
  },
  {
    id: 'nativity',
    emoji: '🏛️',
    title: '3D Architectural Nativity',
    subtitle: 'Rich jewel-toned sculptural holiday diorama',
    description: 'Complete nativity scene with 105-degree angled stable, recessed manger alcove, layered robes, soaring 3D angel wings, and royal Wise Men.',
    meta: ['10 KITS', '14 PIECES', '4-6 HRS'],
    details: {
      includes: ['Architectural Stable', 'Holy Family (Mary, Joseph, Jesus)', 'Angel with 3D Wings', 'Star of Bethlehem', 'Shepherd & Sheep', 'Wise Man 1 (Melchior)', 'Wise Man 2 (Balthazar)', 'Wise Man 3 (Gaspar)', 'Donkey & Ox', 'Complete Scene Assembly'],
      colors: ['Royal Blue', 'Burgundy Wine', 'Imperial Purple', 'Deep Crimson', 'Emerald Green', 'Gold Foil'],
      difficulty: 'Intermediate to Advanced'
    }
  },
  {
    id: 'holiday',
    emoji: '🎃',
    title: 'World Festival Traditions',
    subtitle: 'Halloween, Hanami, and Día de los Muertos Celebrations',
    description: 'Iconic holiday folk traditions: 3D box-pleated Jack-o\'-Lantern with color-change grin, vampire bat, Hanami cherry blossom lantern, and Mexican sugar skull.',
    meta: ['5 KITS', '10 PIECES', '2-3 HRS'],
    details: {
      includes: ['Halloween Jack-o\'-Lantern', 'Halloween Vampire Bat', 'Hanami Chochin Lantern', 'Día de los Muertos Calavera', 'Lunar New Year Hongbao'],
      colors: ['Pumpkin Orange', 'Midnight Black', 'Cherry Pink', 'Sugar White & Lilac', 'Festive Red'],
      difficulty: 'Beginner to Advanced'
    }
  }
];

export function getKitById(id: string): OrigamiKit | undefined {
  if (id === 'custom') {
    try {
      const custom = sessionStorage.getItem('origami_custom_kit');
      if (custom) return JSON.parse(custom);
    } catch (e) {
      console.error(e);
    }
  }
  if (id === 'magic-boat' || id === 'boat') {
    return ORIGAMI_KITS['chinese-06'] || ORIGAMI_KITS['chinese-03'];
  }
  return ORIGAMI_KITS[id];
}

export function getDailyFeaturedKit(): OrigamiKit {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const dailyIdx = (now.getFullYear() * 37 + dayOfYear) % ALL_KITS_ARRAY.length;
  return ALL_KITS_ARRAY[dailyIdx] || ALL_KITS_ARRAY[0];
}
