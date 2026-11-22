import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileSearch,
  Sparkles,
} from 'lucide-react';
import { useCourtroom } from '../context/CourtroomContext';
import { getCategoryById } from '../data/categories';
import { DAILY_BONUS_XP } from '../logic/gameLogic';

export const DailyCasePage: React.FC = () => {
  const { dailyCase, todayKey, isDailyCompletedToday } = useCourtroom();
  const category = getCategoryById(dailyCase.categoryId);

  const formattedDate = new Date(`${todayKey}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="pb-4 border-b border-[#303B49]">
        <p className="text-xs font-mono text-[#E5B85C]">DAILY CASE</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9] mt-1">
          Today’s Featured Mystery
        </h1>
        <p className="text-sm sm:text-[15px] text-[#B7C2D0] mt-1">
          Solve today’s featured case once to earn{' '}
          <strong className="text-[#E5B85C]">+{DAILY_BONUS_XP} Bonus XP</strong>.
        </p>
      </div>

      <article className="rounded-2xl bg-[#171F29] border border-[#303B49] overflow-hidden">
        <div className="aspect-video sm:aspect-[21/9] w-full bg-[#111720] relative overflow-hidden">
          <img
            src={dailyCase.heroImage}
            alt={`Daily case: ${dailyCase.title}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0F14]/90 via-[#0B0F14]/45 to-transparent p-4">
            <p className="text-xs font-mono text-[#E5B85C] inline-flex items-center gap-1.5">
              <CalendarClock size={14} />
              <span>{formattedDate}</span>
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-mono text-[#94A3B8]">
              {category?.name} · {dailyCase.difficulty}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9]">
              {dailyCase.title}
            </h2>
            <p className="text-[15px] text-[#B7C2D0] leading-relaxed">{dailyCase.shortHook}</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-[#B7C2D0]">
            <span className="inline-flex items-center gap-1.5">
              <FileSearch size={15} className="text-[#E5B85C]" />
              <span>{dailyCase.evidence.length} Short Clues</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} className="text-[#E5B85C]" />
              <span>~{dailyCase.estimatedMinutes} min</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#4CC38A]">
              <Sparkles size={15} />
              <span>+{DAILY_BONUS_XP} Bonus XP</span>
            </span>
          </div>

          <div className="pt-4 border-t border-[#303B49] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {isDailyCompletedToday ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#4CC38A]">
                <CheckCircle2 size={18} />
                <span>Bonus already claimed today</span>
              </span>
            ) : (
              <span className="text-sm text-[#E5B85C] font-medium">Available today</span>
            )}

            <Link
              to={`/case/${dailyCase.id}/investigate?step=story`}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-[#E05252] text-white text-sm sm:text-base font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap"
            >
              <span>{isDailyCompletedToday ? 'Play Again' : 'Start Daily Case'}</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};
