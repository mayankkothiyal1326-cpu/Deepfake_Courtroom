import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Archive,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react';
import { useCourtroom } from '../context/CourtroomContext';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { DifficultyLevel } from '../types/courtroom';

const DIFFICULTY_FILTERS: ('All' | DifficultyLevel)[] = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
  'Final Case',
];

export const CaseArchivePage: React.FC = () => {
  const { state, startOrResumeCase } = useCourtroom();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | DifficultyLevel>('All');

  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.completedCases.filter((rec) => {
      if (categoryFilter !== 'all' && rec.categoryId !== categoryFilter) return false;
      if (difficultyFilter !== 'All' && rec.difficulty !== difficultyFilter) return false;
      if (q && !rec.caseTitle.toLowerCase().includes(q) && !rec.verdict.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [state.completedCases, query, categoryFilter, difficultyFilter]);

  const handleReplay = (caseId: string) => {
    startOrResumeCase(caseId, true);
    navigate(`/case/${caseId}/investigate?step=story`);
  };

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-[#303B49]">
        <p className="text-xs font-mono text-[#E5B85C]">COMPLETED INVESTIGATIONS LOG</p>
        <h1 className="font-display text-3xl font-semibold text-[#F1F5F9] mt-1">
          Case Archive
        </h1>
        <p className="text-sm text-[#B7C2D0] mt-1.5">
          Revisit past verdicts, inspect full truth reveals, review digital safety lessons, or
          replay any case to improve your score.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by case title or verdict..."
            aria-label="Search completed cases"
            className="w-full rounded-xl bg-[#171F29] border border-[#303B49] pl-10 pr-4 py-2.5 text-sm text-[#F1F5F9] placeholder-[#94A3B8] focus:border-[#E5B85C] focus:outline-none"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="w-full rounded-xl bg-[#171F29] border border-[#303B49] px-3.5 py-2.5 text-sm text-[#F1F5F9] focus:border-[#E5B85C] focus:outline-none"
          >
            <option value="all" className="bg-[#171F29]">
              All Categories
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#171F29]">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as 'All' | DifficultyLevel)}
            aria-label="Filter by difficulty"
            className="w-full rounded-xl bg-[#171F29] border border-[#303B49] px-3.5 py-2.5 text-sm text-[#F1F5F9] focus:border-[#E5B85C] focus:outline-none"
          >
            {DIFFICULTY_FILTERS.map((d) => (
              <option key={d} value={d} className="bg-[#171F29]">
                {d === 'All' ? 'All Difficulties' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results List */}
      {state.completedCases.length === 0 ? (
        <div className="rounded-2xl bg-[#171F29] border border-dashed border-[#303B49] p-12 text-center space-y-3">
          <Archive size={30} className="mx-auto text-[#94A3B8]" />
          <h2 className="font-display text-xl font-semibold text-[#F1F5F9]">
            Your Archive Is Empty
          </h2>
          <p className="text-sm text-[#B7C2D0] max-w-md mx-auto">
            Completed investigations will be filed here automatically with your verdict, score
            breakdown, and safety lessons.
          </p>
          <div className="pt-2">
            <Link
              to="/cases"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5B85C] text-[#0B0F14] text-sm font-semibold hover:bg-[#d8ab4f]"
            >
              <span>Browse Playable Cases</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-2xl bg-[#171F29] border border-[#303B49] p-10 text-center space-y-2">
          <p className="text-base font-semibold text-[#F1F5F9]">No matching archive records</p>
          <p className="text-sm text-[#94A3B8]">
            Try clearing your search term or selecting "All Categories".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((rec) => {
            const category = getCategoryById(rec.categoryId);
            return (
              <article
                key={`${rec.caseId}-${rec.completedAt}`}
                className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#94A3B8]">
                    <span>{category?.name ?? rec.categoryId}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rec.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {new Date(rec.completedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-semibold text-[#F1F5F9]">
                    {rec.caseTitle}
                  </h2>

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
                      <span>
                        {rec.isCorrect ? 'Correct' : `Actual: ${rec.correctVerdict}`}
                      </span>
                    </span>
                    <span className="font-mono font-semibold text-[#E5B85C] tabular-nums">
                      Score: {rec.score}/100
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Link
                    to={`/case/${rec.caseId}/investigate?step=reveal`}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-[#111720] border border-[#303B49] text-xs sm:text-sm font-medium text-[#F1F5F9] hover:border-[#E5B85C] transition-colors whitespace-nowrap"
                  >
                    <BookOpen size={15} className="text-[#E5B85C]" />
                    <span>Review Truth & Lesson</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleReplay(rec.caseId)}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-[#1C2632] border border-[#303B49] text-xs sm:text-sm font-medium text-[#F1F5F9] hover:border-[#E5B85C] transition-colors whitespace-nowrap"
                  >
                    <RotateCcw size={15} />
                    <span>Replay</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
