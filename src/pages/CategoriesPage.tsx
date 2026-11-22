import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcon';
import { useCourtroom } from '../context/CourtroomContext';
import { CASES } from '../data/cases';
import { CATEGORIES, getCategoryById } from '../data/categories';

export const CategoriesPage: React.FC = () => {
  const { state } = useCourtroom();

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#303B49]">
        <p className="text-xs font-mono text-[#E5B85C]">INVESTIGATE CASES</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9] mt-1">
          Choose a Case to Play
        </h1>
        <p className="text-sm sm:text-[15px] text-[#B7C2D0] mt-1">
          Jump straight into a playable mystery below, or explore all 6 cybercrime categories.
        </p>
      </div>

      {/* Playable Cases Ready Now */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[#F1F5F9]">Ready to Play Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CASES.map((c) => {
            const cat = getCategoryById(c.categoryId);
            const pastRecords = state.completedCases.filter((r) => r.caseId === c.id);
            const bestScore =
              pastRecords.length > 0 ? Math.max(...pastRecords.map((r) => r.score)) : null;

            return (
              <article
                key={c.id}
                className="rounded-2xl bg-[#171F29] border border-[#303B49] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video w-full bg-[#111720] overflow-hidden">
                    <img
                      src={c.heroImage}
                      alt={`Preview of ${c.title}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-[#E5B85C]">
                        {cat?.shortName} · {c.difficulty} · {c.evidence.length} Clues
                      </span>
                      {bestScore !== null && (
                        <span className="inline-flex items-center gap-1 text-[#4CC38A] font-medium">
                          <CheckCircle2 size={14} />
                          <span>Best {bestScore}/100</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#F1F5F9]">
                      {c.title}
                    </h3>
                    <p className="text-sm text-[#B7C2D0] leading-relaxed">{c.shortHook}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1">
                  <Link
                    to={`/case/${c.id}/investigate?step=story`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[46px] px-5 rounded-xl bg-[#E05252] text-white text-sm font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap"
                  >
                    <Play size={15} />
                    <span>{bestScore !== null ? 'Play Again' : 'Start Case'}</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* All 6 Case Categories */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[#F1F5F9]">All Case Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const completedInCat = new Set(
              state.completedCases.filter((c) => c.categoryId === cat.id).map((c) => c.caseId)
            ).size;
            const totalLevels = cat.levels.length;
            const playableLevels = cat.levels.filter((l) => Boolean(l.playableCaseId));

            return (
              <article
                key={cat.id}
                className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-[#111720] border border-[#303B49] flex items-center justify-center shrink-0"
                      style={{ color: cat.accentColor }}
                    >
                      <CategoryIcon categoryId={cat.id} size={20} />
                    </div>
                    <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
                      {completedInCat}/{totalLevels} solved
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[#F1F5F9]">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[#B7C2D0] leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-3 border-t border-[#303B49] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#4CC38A] font-medium">
                    {playableLevels.length > 0
                      ? `Playable: ${playableLevels[0].title}`
                      : '10 planned levels'}
                  </span>
                  <Link
                    to={`/cases/${cat.id}`}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-[#111720] border border-[#303B49] text-sm font-semibold text-[#F1F5F9] hover:border-[#E5B85C] transition-colors whitespace-nowrap"
                  >
                    <span>View Levels</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
