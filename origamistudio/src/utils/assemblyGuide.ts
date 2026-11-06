import type { OrigamiKit } from '../types/origami';

export interface AssemblyConnection {
  fromPart: string;
  toPart: string;
  fromTitle: string;
  toTitle: string;
  slotDescription: string;
  visualCue: string;
  stepIndex: number;
}

export interface MultiPartAssemblyProfile {
  collectionId: string;
  collectionTitle: string;
  totalParts: number;
  completedParts: string[];
  parts: Array<{
    id: string;
    title: string;
    partIndex: number;
    isCompleted: boolean;
    isFinalAssembly: boolean;
  }>;
  assemblySteps: AssemblyConnection[];
  isComplete: boolean;
}

/**
 * Computes the multi-part assembly profile and sequential joining steps for a kit
 * within a collection. Returns null if the kit is standalone (no siblings).
 */
export function getMultiPartAssemblyProfile(
  kit: OrigamiKit,
  allKits: OrigamiKit[],
  completedKitIds: string[] = []
): MultiPartAssemblyProfile | null {
  if (!kit.collection) return null;

  const siblingKits = allKits.filter((k) => k.collection === kit.collection);
  if (siblingKits.length <= 1) return null;

  const completedSet = new Set(completedKitIds);
  const parts = siblingKits.map((k, idx) => ({
    id: k.id,
    title: k.title,
    partIndex: idx,
    isCompleted: completedSet.has(k.id),
    isFinalAssembly: idx === siblingKits.length - 1,
  }));

  // Build sequential connection steps between parts
  const assemblySteps: AssemblyConnection[] = [];
  for (let i = 0; i < siblingKits.length - 1; i++) {
    const current = siblingKits[i];
    const next = siblingKits[i + 1];
    assemblySteps.push({
      fromPart: current.id,
      toPart: next.id,
      fromTitle: current.title,
      toTitle: next.title,
      slotDescription: `Slot tab of Part ${i + 1} (${current.title}) into the locking pocket of Part ${i + 2} (${next.title}).`,
      visualCue: `🧩 Step ${i + 1}: Connect Part ${i + 1} ➔ Part ${i + 2}`,
      stepIndex: i + 1,
    });
  }

  const completedParts = parts.filter((p) => p.isCompleted).map((p) => p.id);
  const isComplete = parts.every((p) => p.isCompleted);

  return {
    collectionId: kit.collection,
    collectionTitle: kit.collectionTitle || kit.category || 'Origami Collection',
    totalParts: siblingKits.length,
    completedParts,
    parts,
    assemblySteps,
    isComplete,
  };
}

/**
 * Returns the next pending physical assembly connection for the user to complete.
 */
export function getNextAssemblyStep(
  profile: MultiPartAssemblyProfile
): AssemblyConnection | null {
  if (profile.assemblySteps.length === 0) return null;

  // Find the first step where the preceding part is complete but target assembly is not done
  for (const step of profile.assemblySteps) {
    if (profile.completedParts.includes(step.fromPart)) {
      return step;
    }
  }

  // Default to step 1
  return profile.assemblySteps[0] || null;
}
