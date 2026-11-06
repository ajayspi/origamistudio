import React from 'react';
import type { MultiPartAssemblyProfile } from '../utils/assemblyGuide';

export interface AssemblyStageModalProps {
  profile: MultiPartAssemblyProfile;
  activeKitId?: string;
  onSelectPart: (kitId: string) => void;
  onClose: () => void;
}

export const AssemblyStageModal: React.FC<AssemblyStageModalProps> = ({
  profile,
  activeKitId,
  onSelectPart,
  onClose,
}) => {
  const completedCount = profile.parts.filter((p) => p.isCompleted).length;
  const progressPct = Math.round((completedCount / profile.totalParts) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assembly-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              🧩
            </span>
            <div>
              <h2 id="assembly-guide-title" className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                Multi-Part Assembly Stage
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                {profile.collectionTitle} · {completedCount} of {profile.totalParts} Parts Ready
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close assembly stage guide"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Progress Banner */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
              <span>Overall Sculpture Progress</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-400 mt-2">
              {profile.isComplete
                ? '🎉 All pieces folded! Now join them together following the connection guide below.'
                : 'Fold each piece first! Once they are folded, you can slot them together like a 3D puzzle.'}
            </p>
          </div>

          {/* Part Selection Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
              1. Parts in this Kit ({profile.totalParts})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.parts.map((part) => {
                const isActive = part.id === activeKitId;
                return (
                  <div
                    key={part.id}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          part.isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {part.isCompleted ? '✓' : part.partIndex + 1}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                          {part.title}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {part.isCompleted ? 'Folded & Ready' : isActive ? 'Currently In Studio' : 'Waiting to Fold'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectPart(part.id);
                        onClose();
                      }}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {isActive ? 'Current' : 'Fold Part'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sequential Slotting & Joining Instructions */}
          {profile.assemblySteps.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3">
                2. How to Slot & Combine Parts
              </h3>
              <div className="space-y-3">
                {profile.assemblySteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3.5"
                  >
                    <span className="text-xl p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                      {step.visualCue}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-0.5">
                        <span>Connection {idx + 1}:</span>
                        <span className="font-normal text-amber-700 dark:text-amber-300">
                          {step.fromTitle} ➔ {step.toTitle}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 leading-relaxed">
                        {step.slotDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
          >
            Got it! Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
};
