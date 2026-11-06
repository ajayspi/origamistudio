export type DifficultyLevel = 'Beginner' | 'Beginner-Intermediate' | 'Intermediate' | 'Intermediate-Advanced' | 'Advanced' | 'Master';

export type CulturalCollectionId = 
  | 'indian' 
  | 'japanese' 
  | 'chinese' 
  | 'american' 
  | 'lotus' 
  | 'butterfly' 
  | 'geometric' 
  | 'nativity' 
  | 'holiday'
  | 'custom';

export interface OrigamiStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
  warning?: string;
  foldType?: string;
  time?: string;
  landmark?: string;
}

export interface PaperSpec {
  size: string;
  color: string;
  frontColorHex?: string;
  backColorHex?: string;
  weightGsm?: number;
  texture?: string;
  count?: number;
}

export interface OrigamiKit {
  id: string;
  kitNumber?: number | string;
  title: string;
  name?: string;
  subtitle?: string;
  collection: CulturalCollectionId | string;
  collectionTitle?: string;
  category: string;
  difficulty: DifficultyLevel | string;
  time: string;
  paper: PaperSpec[];
  tools: string[];
  principles: string[];
  goal: string;
  description?: string;
  accent?: string;
  emoji?: string;
  culturalHeritage?: string;
  steps: OrigamiStep[];
}

export interface CulturalCollection {
  id: CulturalCollectionId;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  meta: string[];
  details: {
    includes: string[];
    colors: string[];
    difficulty: string;
  };
}

export type ViewMode = 'hub' | 'pavilions' | 'studio' | 'print-guide' | 'trophy-room';
