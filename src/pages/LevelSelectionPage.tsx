import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Play,
} from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcon';
import { useCourtroom } from '../context/CourtroomContext';
import { getCategoryById } from '../data/categories';
import { isLevelUnlocked } from '../logic/gameLogic';

export const LevelSelectionPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { state } = useCourtroom();
  const category = categoryId ? getCategoryById(categoryId) : undefined;

  if (!category) {
    return (
      <div className="rounded-2xl bg-[#171F29] border border-[#303B49] p-8 text-center space-y-4">
        <h1 className="font-display text-2xl font-semibold text-[#F1F5F9]">Category Not Found</h1>
        <p className="text-sm text-[#B7C2D0]">
          The investigation track you requested does not exist.
        </p>
        <Link
          to="/cases"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5B85C] text-[#0B0F14] text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Return to Categories</span>
        </Link>
      </div>
    );
  }

  const completedInCat = new Set(
    state.completedCases.filter((c) => c.categoryId === category.id).map((c) => c.caseId)
  ).size;

  const progressPct = Math.round((completedInCat / category.levels.length) * 100);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Back Link */}
      <div>
        <Link
          to="/cases"
          className="inline-flex items-center gap-2 text-sm text-[#B7C2D0] hover:text-[#F1F5F9] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>All Case Categories</span>
        </Link>
      </div>

      {/* Category Header */}
      <section className="rounded-2xl bg-[#171F29] border border-[#303B49] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl bg-[#111720] border border-[#303B49] flex items-center justify-center shrink-0"
              style={{ color: category.accentColor }}
            >
              <CategoryIcon categoryId={category.id} size={24} />
            </div>
            <div>
              <p className="text-xs font-mono text-[#E5B85C]">
                {category.badgeLabel.toUpperCase()} · 10 LEVELS
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9] mt-1">
                {category.name}
              </h1>
              <p className="text-sm text-[#B7C2D0] mt-1.5 max-w-2xl">
                {category.description}
              </p>
            </div>
          </div>

          <div className="md:w-56 shrink-0">
            <div className="flex items-center justify-between text-xs text-[#B7C2D0] tabular-nums mb-1.5">
              <span>Track Progress</span>
              <span className="font-mono">
                {completedInCat}/{category.levels.length} ({progressPct}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#0B0F14] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${completedInCat > 0 ? Math.max(10, progressPct) : 0}%`,
                  backgroundColor: category.accentColor,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Difficulty Key */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#94A3B8]">
        <span>Difficulty Ladder:</span>
        <span>Levels 1–3 Beginner</span>
        <span aria-hidden="true">·</span>
        <span>Levels 4–5 Intermediate</span>
        <span aria-hidden="true">·</span>
        <span>Levels 6–7 Advanced</span>
        <span aria-hidden="true">·</span>
        <span>Levels 8–9 Expert</span>
        <span aria-hidden="true">·</span>
        <span className="text-[#E5B85C]">Level 10 Final Case</span>
      </div>

      {/* Levels List (1–10) */}
      <div className="space-y-3">
        {category.levels.map((slot) => {
          const unlocked = isLevelUnlocked(category.id, slot.levelNumber, state.completedCases);
          const recordsForLevel = slot.playableCaseId
            ? state.completedCases.filter((r) => r.caseId === slot.playableCaseId)
            : [];
          const bestScore =
            recordsForLevel.length > 0
              ? Math.max(...recordsForLevel.map((r) => r.score))
              : null;
          const isCompleted = bestScore !== null;
          const isPlayable = Boolean(slot.playableCaseId);

          return (
            <div
              key={slot.levelNumber}
              className={`rounded-2xl border p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                unlocked && isPlayable
                  ? 'bg-[#171F29] border-[#303B49] hover:border-[#E5B85C]'
                  : 'bg-[#111720] border-[#303B49]/80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center font-mono text-sm font-semibold shrink-0 tabular-nums ${
                    isCompleted
                      ? 'bg-[#4CC38A]/15 border-[#4CC38A]/50 text-[#4CC38A]'
                      : unlocked && isPlayable
                      ? 'bg-[#E5B85C]/15 border-[#E5B85C]/50 text-[#E5B85C]'
                      : 'bg-[#171F29] border-[#303B49] text-[#B7C2D0]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} />
                  ) : unlocked && isPlayable ? (
                    `0${slot.levelNumber}`.slice(-2)
                  ) : (
                    <Lock size={17} />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-[#94A3B8]">
                    <span className="font-mono text-[#E5B85C]">Level {slot.levelNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{slot.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        isCompleted
                          ? 'text-[#4CC38A] font-medium'
                          : unlocked && isPlayable
                          ? 'text-[#F1F5F9] font-medium'
                          : 'text-[#B7C2D0]'
                      }
                    >
                      {isCompleted
                        ? 'Completed'
                        : unlocked && isPlayable
                        ? 'Unlocked & Playable'
                        : unlocked && !isPlayable
                        ? 'Unlocked — Case File In Preparation'
                        : `Locked — Complete Level ${slot.levelNumber - 1} to unlock`}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-semibold text-[#F1F5F9]">
                    {slot.title}
                  </h2>
                  <p className="text-sm text-[#B7C2D0]">{slot.teaser}</p>
                </div>
              </div>

              <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                {bestScore !== null && (
                  <span className="font-mono text-sm font-semibold text-[#4CC38A] tabular-nums">
                    Best Score: {bestScore}/100
                  </span>
                )}

                {unlocked && isPlayable && slot.playableCaseId ? (
                  <Link
                    to={`/case/${slot.playableCaseId}/investigate?step=story`}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-[#E05252] text-white text-sm font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap"
                  >
                    <Play size={15} />
                    <span>{isCompleted ? 'Play Again' : 'Start Case'}</span>
                    <ArrowRight size={15} />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#B7C2D0] px-3 py-2 rounded-xl bg-[#171F29] border border-[#303B49] whitespace-nowrap">
                    {unlocked ? <Clock size={14} className="text-[#E5B85C]" /> : <Lock size={14} />}
                    <span>
                      {unlocked ? 'Coming Soon' : `Unlock after Level ${slot.levelNumber - 1}`}
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
