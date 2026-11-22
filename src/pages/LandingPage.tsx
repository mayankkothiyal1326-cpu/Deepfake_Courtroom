import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  FileSearch,
  Gavel,
  ShieldCheck,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { CategoryIcon } from '../components/CategoryIcon';
import { useCourtroom } from '../context/CourtroomContext';
import { CASES } from '../data/cases';
import { CATEGORIES } from '../data/categories';

const HERO_IMAGE = '/src/assets/images/hero_courtroom_desk_1795245123880.jpg';

const STEPS = [
  {
    num: '1',
    title: 'Read the Story',
    text: 'Get the quick facts in under a minute.',
    icon: BookOpen,
  },
  {
    num: '2',
    title: 'Check 5 Clues',
    text: 'Tap simple evidence cards to spot what doesn’t match.',
    icon: FileSearch,
  },
  {
    num: '3',
    title: 'Make Your Verdict',
    text: 'Decide if it is Authentic, Manipulated, or Not Enough Evidence.',
    icon: Gavel,
  },
  {
    num: '4',
    title: 'Learn the Truth',
    text: 'See what really happened and take away one safety tip.',
    icon: ShieldCheck,
  },
];

export const LandingPage: React.FC = () => {
  const { state } = useCourtroom();
  const navigate = useNavigate();
  const featuredCase = CASES[0];

  const handleEnter = () => {
    navigate(state.profile ? '/dashboard' : '/setup');
  };

  const handleExplore = () => {
    navigate(state.profile ? '/cases' : '/setup?next=/cases');
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F1F5F9] overflow-x-clip">
      {/* Strict 3-zone top bar */}
      <header className="sticky top-0 z-30 bg-[#0B0F14]/95 backdrop-blur border-b border-[#303B49]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
          <div className="whitespace-nowrap shrink-0">
            <BrandLogo />
          </div>

          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#B7C2D0]"
            aria-label="Landing navigation"
          >
            <a href="#how-it-works" className="hover:text-[#F1F5F9] whitespace-nowrap shrink-0">
              How It Works
            </a>
            <a href="#featured-case" className="hover:text-[#F1F5F9] whitespace-nowrap shrink-0">
              Featured Case
            </a>
            <a href="#categories" className="hover:text-[#F1F5F9] whitespace-nowrap shrink-0">
              Categories
            </a>
            <button
              type="button"
              onClick={() => navigate(state.profile ? '/daily' : '/setup?next=/daily')}
              className="hover:text-[#F1F5F9] whitespace-nowrap shrink-0"
            >
              Daily Case
            </button>
          </nav>

          <button
            type="button"
            onClick={handleEnter}
            className="min-h-[40px] px-4 rounded-xl bg-[#E05252] text-white text-sm font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap shrink-0"
          >
            Enter Courtroom
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-16 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
              <p className="text-sm font-medium text-[#E5B85C]">
                Interactive Cybercrime Mystery Game
              </p>

              <h1 className="font-display text-3xl sm:text-5xl font-bold leading-[1.14] text-[#F1F5F9]">
                Every Evidence Matters. Every Verdict Counts.
              </h1>

              <p className="text-base sm:text-lg text-[#B7C2D0] leading-relaxed">
                Play as a digital judge. Read short fictional mysteries about deepfakes and online
                scams, check the clues, and spot what is real before sharing or trusting.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleEnter}
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-[#E05252] text-white text-base font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap"
                >
                  <span>Enter Courtroom</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleExplore}
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-[#171F29] border border-[#303B49] text-[#F1F5F9] text-base font-semibold hover:border-[#E5B85C] transition-colors whitespace-nowrap"
                >
                  <span>Explore Cases</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[240px] rounded-2xl overflow-hidden border border-[#303B49] bg-[#111720] relative">
                <img
                  src={HERO_IMAGE}
                  alt="Digital courtroom bench with brass scales and forensic display"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0F14]/95 via-[#0B0F14]/50 to-transparent p-5">
                  <p className="text-sm text-[#F1F5F9]">
                    Simple clues. Real-world digital safety lessons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t border-[#303B49] bg-[#111720]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9]">
              How Each Case Works
            </h2>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.num}
                    className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[#E5B85C]">
                      <span className="font-mono text-sm font-semibold">Step {item.num}</span>
                      <Icon size={19} />
                    </div>
                    <h3 className="text-base font-semibold text-[#F1F5F9]">{item.title}</h3>
                    <p className="text-sm text-[#B7C2D0] leading-relaxed">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Case */}
        <section id="featured-case" className="border-t border-[#303B49]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl bg-[#171F29] border border-[#303B49] overflow-hidden">
              <div className="lg:col-span-5 min-h-[220px] bg-[#111720]">
                <img
                  src={featuredCase.heroImage}
                  alt="Preview of The Viral Confession case"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4">
                <p className="text-xs font-mono text-[#E5B85C]">
                  FEATURED CASE · CAMPUS · BEGINNER · 5 CLUES
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9]">
                  {featuredCase.title}
                </h2>
                <p className="text-[15px] text-[#B7C2D0] leading-relaxed">
                  {featuredCase.shortHook}
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        state.profile
                          ? `/case/${featuredCase.id}/investigate?step=story`
                          : `/setup?next=/case/${featuredCase.id}/investigate?step=story`
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 rounded-xl bg-[#E5B85C] text-[#0B0F14] text-sm font-semibold hover:bg-[#d8ab4f] transition-colors whitespace-nowrap"
                  >
                    <span>Play This Case</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Categories */}
        <section id="categories" className="border-t border-[#303B49] bg-[#111720]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9]">
                6 Cybercrime Categories
              </h2>
              <button
                type="button"
                onClick={handleExplore}
                className="min-h-[40px] text-sm font-semibold text-[#E5B85C] hover:underline inline-flex items-center gap-1.5"
              >
                <span>See All Categories</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => {
                const live = cat.levels.filter((l) => l.playableCaseId).length;
                return (
                  <article
                    key={cat.id}
                    className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-10 h-10 rounded-xl bg-[#111720] border border-[#303B49] flex items-center justify-center"
                          style={{ color: cat.accentColor }}
                        >
                          <CategoryIcon categoryId={cat.id} size={20} />
                        </div>
                        <span className="text-xs font-mono text-[#94A3B8]">
                          {live > 0 ? `${live} Ready to Play` : 'Coming Soon'}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[#F1F5F9]">{cat.name}</h3>
                      <p className="text-sm text-[#B7C2D0] leading-relaxed">{cat.description}</p>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            state.profile ? `/cases/${cat.id}` : `/setup?next=/cases/${cat.id}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 min-h-[40px] text-sm font-semibold text-[#E5B85C] hover:underline"
                      >
                        <span>Open Track</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#303B49] bg-[#0B0F14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <BrandLogo />
          <p className="text-xs text-[#94A3B8]">
            All cases and characters are fictional and designed for digital safety education.
          </p>
        </div>
      </footer>
    </div>
  );
};
