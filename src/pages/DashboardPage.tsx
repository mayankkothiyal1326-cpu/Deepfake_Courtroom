import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CalendarClock,
  Camera,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcon';
import { JudgeAvatar } from '../components/JudgeAvatar';
import { ProfilePhotoModal } from '../components/ProfilePhotoModal';
import { useCourtroom } from '../context/CourtroomContext';
import { CASES, getCaseById } from '../data/cases';
import { CATEGORIES } from '../data/categories';
import { computeProgressAnalytics, getEvidenceProgress } from '../logic/gameLogic';

export const DashboardPage: React.FC = () => {
  const { state, rankProgress, dailyCase, isDailyCompletedToday, updateProfilePhoto } =
    useCourtroom();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const judgeName = state.profile?.name ?? 'Judge';
  const judgeAvatar = state.profile?.avatar ?? 'scales';
  const judgePhoto = state.profile?.photoDataUrl ?? null;
  const analytics = computeProgressAnalytics(state.completedCases);

  const activeIds = Object.keys(state.activeInvestigations);
  const nextCase =
    activeIds
      .map((id) => getCaseById(id))
      .find((c) => c && !state.completedCases.some((rec) => rec.caseId === c.id)) ??
    CASES.find((c) => !state.completedCases.some((rec) => rec.caseId === c.id)) ??
    CASES[0];

  const nextCaseProgress = getEvidenceProgress(
    nextCase,
    state.activeInvestigations[nextCase.id]
  );

  return (
    <div className="space-y-7">
      {/* Clean Welcome Header with Tappable Circular Judge Avatar */}
      <section className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setPhotoModalOpen(true)}
              aria-label={judgePhoto ? 'Change judge profile photo' : 'Upload judge profile photo'}
              title="Tap to upload or change profile photo"
              className="relative rounded-full shrink-0 group focus-visible:outline-2 focus-visible:outline-[#E5B85C]"
            >
              <JudgeAvatar
                avatar={judgeAvatar}
                photoDataUrl={judgePhoto}
                alt={`Judge ${judgeName} avatar`}
                size="lg"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#1C2632] border border-[#E5B85C] flex items-center justify-center text-[#E5B85C] group-hover:bg-[#E5B85C] group-hover:text-[#0B0F14] transition-colors"
                aria-hidden="true"
              >
                <Camera size={12} />
              </span>
            </button>
            <div className="min-w-0">
              <p className="text-xs font-mono text-[#E5B85C]">{rankProgress.currentRank.name}</p>
              <h1 className="font-display text-xl sm:text-3xl font-semibold text-[#F1F5F9] mt-0.5 leading-snug break-words">
                Welcome back, Judge {judgeName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-5 text-sm font-mono tabular-nums shrink-0">
            <div>
              <span className="block text-xs font-sans text-[#94A3B8]">Solved</span>
              <span className="text-lg font-semibold text-[#F1F5F9]">
                {analytics.distinctCasesSolved}
              </span>
            </div>
            <div className="h-8 w-px bg-[#303B49]" />
            <div>
              <span className="block text-xs font-sans text-[#94A3B8]">XP</span>
              <span className="text-lg font-semibold text-[#E5B85C]">{state.xp}</span>
            </div>
          </div>
        </div>

        {/* Simple XP Progress Line */}
        <div>
          <div className="flex items-center justify-between text-xs text-[#B7C2D0] mb-1.5">
            <span>Rank Progress</span>
            <span className="font-mono tabular-nums">
              {rankProgress.nextRank
                ? `${rankProgress.xpNeededForNext} XP to ${rankProgress.nextRank.name}`
                : 'Max Rank Reached'}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#0B0F14] overflow-hidden">
            <div
              className="h-full bg-[#E5B85C] rounded-full transition-all duration-300"
              style={{ width: `${Math.max(rankProgress.percent, state.xp > 0 ? 5 : 0)}%` }}
            />
          </div>
        </div>
      </section>

      {/* Primary Play Card (Explicit button only — no accidental card taps) */}
      <section className="rounded-2xl bg-[#171F29] border border-[#303B49] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="md:col-span-5 min-h-[190px] bg-[#111720]">
            <img
              src={nextCase.heroImage}
              alt={`Preview for ${nextCase.title}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-mono text-[#E5B85C]">
                {nextCaseProgress.reviewedCount > 0 ? 'CONTINUE CASE' : 'RECOMMENDED NEXT CASE'} ·{' '}
                {nextCase.difficulty.toUpperCase()}
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#F1F5F9]">
                {nextCase.title}
              </h2>
              <p className="text-sm sm:text-[15px] text-[#B7C2D0] leading-relaxed">
                {nextCase.shortHook}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
                {nextCaseProgress.reviewedCount > 0
                  ? `${nextCaseProgress.reviewedCount}/${nextCaseProgress.totalCount} clues checked`
                  : `${nextCase.evidence.length} short clues · ~${nextCase.estimatedMinutes} min`}
              </span>
              <Link
                to={
                  nextCaseProgress.reviewedCount > 0
                    ? `/case/${nextCase.id}/investigate?step=evidence`
                    : `/case/${nextCase.id}/investigate?step=story`
                }
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 rounded-xl bg-[#E05252] text-white text-sm font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap"
              >
                <Play size={15} />
                <span>{nextCaseProgress.reviewedCount > 0 ? 'Continue Case' : 'Start Case'}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Simple Quick Access Cards (Static cards with explicit buttons) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <Briefcase size={20} className="text-[#E5B85C]" />
            <h2 className="text-base font-semibold text-[#F1F5F9]">Investigate Cases</h2>
            <p className="text-sm text-[#B7C2D0]">
              Choose from all 6 cybercrime categories and playable mysteries.
            </p>
          </div>
          <div>
            <Link
              to="/cases"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-[#111720] border border-[#303B49] text-sm font-semibold text-[#F1F5F9] hover:border-[#E5B85C] transition-colors"
            >
              <span>Browse Cases</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </article>

        <article className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <CalendarClock size={20} className="text-[#4CC38A]" />
            <h2 className="text-base font-semibold text-[#F1F5F9]">Daily Case</h2>
            <p className="text-sm text-[#B7C2D0]">
              Today: <strong className="text-[#F1F5F9]">{dailyCase.title}</strong>
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Link
              to="/daily"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-[#111720] border border-[#303B49] text-sm font-semibold text-[#F1F5F9] hover:border-[#E5B85C] transition-colors"
            >
              <span>Open Daily Case</span>
              <ArrowRight size={15} />
            </Link>
            {isDailyCompletedToday && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#4CC38A]">
                <CheckCircle2 size={14} />
                <span>Done</span>
              </span>
            )}
          </div>
        </article>

        <article className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <BarChart3 size={20} className="text-[#60A5FA]" />
            <h2 className="text-base font-semibold text-[#F1F5F9]">My Progress</h2>
            <p className="text-sm text-[#B7C2D0]">
              See your solved cases, past reveals, and earned badges.
            </p>
          </div>
          <div>
            <Link
              to="/progress"
              className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-[#111720] border border-[#303B49] text-sm font-semibold text-[#F1F5F9] hover:border-[#E5B85C] transition-colors"
            >
              <span>View Progress</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </article>
      </section>

      {/* Clean Case Categories List (Static cards with explicit Open buttons) */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[#F1F5F9]">Case Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const completed = new Set(
              state.completedCases.filter((c) => c.categoryId === cat.id).map((c) => c.caseId)
            ).size;
            const liveCount = cat.levels.filter((l) => l.playableCaseId).length;

            return (
              <article
                key={cat.id}
                className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="w-9 h-9 rounded-xl bg-[#111720] border border-[#303B49] flex items-center justify-center"
                      style={{ color: cat.accentColor }}
                    >
                      <CategoryIcon categoryId={cat.id} size={18} />
                    </div>
                    <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
                      {completed}/{cat.levels.length} solved
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#F1F5F9]">{cat.name}</h3>
                  <p className="text-xs text-[#94A3B8]">
                    {liveCount > 0 ? `${liveCount} playable case ready` : 'Planned track (10 levels)'}
                  </p>
                </div>

                <div>
                  <Link
                    to={`/cases/${cat.id}`}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 rounded-xl bg-[#111720] border border-[#303B49] text-sm font-medium text-[#F1F5F9] hover:border-[#E5B85C] transition-colors"
                  >
                    <span>Open Category</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <ProfilePhotoModal
        open={photoModalOpen}
        currentPhoto={judgePhoto}
        fallbackAvatar={judgeAvatar}
        judgeName={judgeName}
        onSavePhoto={(dataUrl) => updateProfilePhoto(dataUrl)}
        onClose={() => setPhotoModalOpen(false)}
      />
    </div>
  );
};
