import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FolderOpen,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { AchievementIcon } from '../components/AchievementIcon';
import { useCourtroom } from '../context/CourtroomContext';
import { ACHIEVEMENTS } from '../data/achievements';
import { getCategoryById } from '../data/categories';
import { computeProgressAnalytics } from '../logic/gameLogic';

export const ProgressPage: React.FC = () => {
  const { state, rankProgress, startOrResumeCase } = useCourtroom();
  const navigate = useNavigate();
  const analytics = computeProgressAnalytics(state.completedCases);

  const handleReplay = (caseId: string) => {
    startOrResumeCase(caseId, true);
    navigate(`/case/${caseId}/investigate?step=story`);
  };

  return (
    <div className="space-y-7">
      <div className="pb-4 border-b border-[#303B49]">
        <p className="text-xs font-mono text-[#E5B85C]">MY PROGRESS</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9] mt-1">
          Your Courtroom Record
        </h1>
        <p className="text-sm sm:text-[15px] text-[#B7C2D0] mt-1">
          Track your solved cases, revisit past reveals, and see your rank progress.
        </p>
      </div>

      {/* 3 Simple Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5">
          <p className="text-xs text-[#94A3B8]">Cases Solved</p>
          <p className="font-mono text-3xl font-semibold text-[#F1F5F9] tabular-nums mt-1">
            {analytics.distinctCasesSolved}
          </p>
          <p className="text-xs text-[#B7C2D0] mt-1">
            {analytics.totalCompleted > 0
              ? `${analytics.accuracyPercent}% correct verdicts`
              : 'Solve your first case to begin'}
          </p>
        </div>

        <div className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5">
          <p className="text-xs text-[#94A3B8]">Average Score</p>
          <p className="font-mono text-3xl font-semibold text-[#F1F5F9] tabular-nums mt-1">
            {analytics.totalCompleted > 0 ? `${analytics.averageScore}/100` : '—'}
          </p>
          <p className="text-xs text-[#B7C2D0] mt-1">Based on accuracy & clues checked</p>
        </div>

        <div className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5">
          <p className="text-xs text-[#94A3B8]">Current Rank</p>
          <p className="font-display text-xl font-semibold text-[#E5B85C] mt-1">
            {rankProgress.currentRank.name}
          </p>
          <p className="text-xs font-mono text-[#B7C2D0] mt-1 tabular-nums">
            {state.xp} XP
            {rankProgress.nextRank
              ? ` · ${rankProgress.xpNeededForNext} XP to next`
              : ' · Max Rank'}
          </p>
        </div>
      </section>

      {/* Completed Cases History */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[#F1F5F9]">Completed Cases</h2>

        {state.completedCases.length === 0 ? (
          <div className="rounded-2xl bg-[#171F29] border border-dashed border-[#303B49] p-8 text-center space-y-3">
            <FolderOpen size={28} className="mx-auto text-[#94A3B8]" />
            <p className="text-base font-semibold text-[#F1F5F9]">No completed cases yet</p>
            <p className="text-sm text-[#B7C2D0] max-w-sm mx-auto">
              Once you finish a case, it will appear here so you can re-read the lesson anytime.
            </p>
            <div className="pt-1">
              <Link
                to="/cases"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-[#E5B85C] text-[#0B0F14] text-sm font-semibold"
              >
                <span>Start a Case</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {state.completedCases.map((rec) => {
              const cat = getCategoryById(rec.categoryId);
              return (
                <article
                  key={`${rec.caseId}-${rec.completedAt}`}
                  className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <p className="text-xs text-[#94A3B8]">
                      {cat?.name ?? rec.categoryId} ·{' '}
                      {new Date(rec.completedAt).toLocaleDateString()}
                    </p>
                    <h3 className="text-lg font-semibold text-[#F1F5F9]">{rec.caseTitle}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="text-[#B7C2D0]">
                        Your Verdict: <strong className="text-[#F1F5F9]">{rec.verdict}</strong>
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          rec.isCorrect ? 'text-[#4CC38A]' : 'text-[#E05252]'
                        }`}
                      >
                        {rec.isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                        <span>{rec.isCorrect ? 'Correct' : `Truth: ${rec.correctVerdict}`}</span>
                      </span>
                      <span className="font-mono text-[#E5B85C] tabular-nums">
                        {rec.score}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <Link
                      to={`/case/${rec.caseId}/investigate?step=reveal`}
                      className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-[#111720] border border-[#303B49] text-sm font-medium text-[#F1F5F9] hover:border-[#E5B85C]"
                    >
                      <BookOpen size={15} className="text-[#E5B85C]" />
                      <span>View Reveal</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleReplay(rec.caseId)}
                      className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-[#1C2632] border border-[#303B49] text-sm font-medium text-[#F1F5F9] hover:border-[#E5B85C]"
                    >
                      <RotateCcw size={15} />
                      <span>Play Again</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Simple Badges List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#F1F5F9]">Badges</h2>
          <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
            {state.unlockedAchievements.length}/{ACHIEVEMENTS.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = state.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-2xl border p-4 space-y-2 ${
                  unlocked
                    ? 'bg-[#171F29] border-[#E5B85C]/50'
                    : 'bg-[#111720] border-[#303B49]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                      unlocked
                        ? 'bg-[#E5B85C]/15 border-[#E5B85C]/40 text-[#E5B85C]'
                        : 'bg-[#171F29] border-[#303B49] text-[#94A3B8]'
                    }`}
                  >
                    <AchievementIcon iconName={ach.iconName} size={18} />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      unlocked ? 'text-[#4CC38A]' : 'text-[#94A3B8]'
                    }`}
                  >
                    {unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#F1F5F9]">{ach.title}</h3>
                <p className="text-xs text-[#B7C2D0] leading-relaxed">{ach.conditionLabel}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
