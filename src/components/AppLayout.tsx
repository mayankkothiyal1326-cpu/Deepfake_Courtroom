import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Briefcase,
  CalendarClock,
  Camera,
  Home,
  LayoutDashboard,
  Menu,
  User,
  Users,
  X,
} from 'lucide-react';
import { useCourtroom } from '../context/CourtroomContext';
import { BrandLogo } from './BrandLogo';
import { JudgeAvatar } from './JudgeAvatar';
import { ProfilePhotoModal } from './ProfilePhotoModal';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cases', label: 'Investigate Cases', icon: Briefcase },
  { to: '/daily', label: 'Daily Case', icon: CalendarClock },
  { to: '/jury', label: 'Jury Mode', icon: Users },
  { to: '/progress', label: 'My Progress', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
];

export const AppLayout: React.FC = () => {
  const { state, rankProgress, updateProfilePhoto } = useCourtroom();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const location = useLocation();

  const judgeName = state.profile?.name ?? 'Guest';
  const judgeAvatar = state.profile?.avatar ?? 'scales';
  const judgePhoto = state.profile?.photoDataUrl ?? null;

  // Close mobile menu whenever route changes (including Android/browser Back)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const isNavActive = (to: string, active: boolean) => {
    if (to === '/cases' && location.pathname.startsWith('/case/')) return true;
    return active;
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F1F5F9] flex flex-col lg:flex-row overflow-x-clip">
      {/* Compact Mobile Header: Brand + Home Button + Menu Button */}
      <header className="lg:hidden sticky top-0 z-30 h-14 px-3 bg-[#111720] border-b border-[#303B49] flex items-center justify-between gap-2">
        <div className="pointer-events-none select-none min-w-0 overflow-hidden">
          <BrandLogo />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            to="/"
            aria-label="Go to Home page"
            className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 rounded-xl bg-[#171F29] border border-[#303B49] text-xs sm:text-sm font-medium text-[#F1F5F9] hover:border-[#E5B85C] active:bg-[#1C2632] transition-colors whitespace-nowrap shrink-0"
          >
            <Home size={16} className="text-[#E5B85C]" />
            <span>Home</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 rounded-xl bg-[#171F29] border border-[#303B49] text-xs sm:text-sm font-medium text-[#F1F5F9] active:bg-[#1C2632] transition-colors whitespace-nowrap shrink-0"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </header>

      {/* Clean Mobile Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 cursor-default"
          />
          <aside
            aria-label="Mobile navigation menu"
            className="relative z-10 w-72 max-w-[85vw] h-full bg-[#111720] border-l border-[#303B49] flex flex-col justify-between p-5 pt-16 overflow-y-auto"
          >
            <div>
              {/* Judge Profile Card with Intentional Avatar Photo Button */}
              <div className="p-3.5 rounded-xl bg-[#171F29] border border-[#303B49] mb-5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setPhotoModalOpen(true);
                    }}
                    aria-label="Upload or change judge profile photo"
                    className="relative rounded-full shrink-0 group focus-visible:outline-2 focus-visible:outline-[#E5B85C]"
                  >
                    <JudgeAvatar
                      avatar={judgeAvatar}
                      photoDataUrl={judgePhoto}
                      alt={`Judge ${judgeName} avatar`}
                      size="md"
                    />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#1C2632] border border-[#E5B85C] flex items-center justify-center text-[#E5B85C]"
                      aria-hidden="true"
                    >
                      <Camera size={11} />
                    </span>
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#F1F5F9] truncate">
                      Judge {judgeName}
                    </p>
                    <p className="text-xs font-medium text-[#E5B85C] truncate">
                      {rankProgress.currentRank.name}
                    </p>
                  </div>
                </div>
                <p className="mt-2.5 text-xs font-mono text-[#94A3B8] tabular-nums">
                  {state.xp} XP
                  {rankProgress.nextRank
                    ? ` · ${rankProgress.xpNeededForNext} XP to ${rankProgress.nextRank.name}`
                    : ' · Max Rank'}
                </p>
              </div>

              <nav className="space-y-1.5" aria-label="Main navigation">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 min-h-[48px] px-4 rounded-xl text-[15px] font-medium text-[#B7C2D0] hover:text-[#F1F5F9] hover:bg-[#171F29] border border-transparent transition-colors whitespace-nowrap"
                >
                  <Home size={19} className="shrink-0 text-[#E5B85C]" />
                  <span>Home</span>
                </Link>

                <div className="my-2 border-t border-[#303B49]" />

                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => {
                        const active = isNavActive(item.to, isActive);
                        return `flex items-center gap-3 min-h-[48px] px-4 rounded-xl text-[15px] font-medium transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-[#1C2632] text-[#F1F5F9] border border-[#E5B85C]/70'
                            : 'text-[#B7C2D0] hover:text-[#F1F5F9] hover:bg-[#171F29] border border-transparent'
                        }`;
                      }}
                    >
                      {({ isActive }) => {
                        const active = isNavActive(item.to, isActive);
                        return (
                          <>
                            <Icon
                              size={19}
                              className={`shrink-0 ${active ? 'text-[#E5B85C]' : 'text-[#94A3B8]'}`}
                            />
                            <span>{item.label}</span>
                          </>
                        );
                      }}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-[#111720] border-r border-[#303B49] sticky top-0 h-screen justify-between p-5">
        <div className="overflow-y-auto">
          <div className="pb-5 border-b border-[#303B49]">
            <BrandLogo />
          </div>

          {/* Judge Standing Card with Intentional Avatar Photo Trigger */}
          <div className="mt-5 p-3.5 rounded-xl bg-[#171F29] border border-[#303B49]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                aria-label="Upload or change judge profile photo"
                title="Change profile photo"
                className="relative rounded-full shrink-0 group focus-visible:outline-2 focus-visible:outline-[#E5B85C]"
              >
                <JudgeAvatar
                  avatar={judgeAvatar}
                  photoDataUrl={judgePhoto}
                  alt={`Judge ${judgeName} avatar`}
                  size="md"
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#1C2632] border border-[#303B49] group-hover:border-[#E5B85C] flex items-center justify-center text-[#E5B85C] transition-colors"
                  aria-hidden="true"
                >
                  <Camera size={11} />
                </span>
              </button>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#F1F5F9] truncate">
                  Judge {judgeName}
                </p>
                <p className="text-xs font-medium text-[#E5B85C] truncate">
                  {rankProgress.currentRank.name}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-[#94A3B8] tabular-nums mb-1.5">
                <span className="font-mono">{state.xp} XP</span>
                <span>{rankProgress.nextRank ? `${rankProgress.percent}%` : 'Max'}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#0B0F14] overflow-hidden">
                <div
                  className="h-full bg-[#E5B85C] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(rankProgress.percent, state.xp > 0 ? 5 : 0)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Primary Navigation with Prominent Home Button */}
          <nav className="mt-5 space-y-1.5" aria-label="Main navigation">
            <Link
              to="/"
              className="flex items-center gap-3 min-h-[44px] px-3.5 rounded-xl text-sm font-semibold text-[#F1F5F9] bg-[#171F29] border border-[#303B49] hover:border-[#E5B85C] transition-colors whitespace-nowrap"
            >
              <Home size={18} className="shrink-0 text-[#E5B85C]" />
              <span>Home</span>
            </Link>

            <div className="my-2.5 border-t border-[#303B49]" />

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => {
                    const active = isNavActive(item.to, isActive);
                    return `flex items-center gap-3 min-h-[44px] px-3.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-[#1C2632] text-[#F1F5F9] border border-[#303B49]'
                        : 'text-[#B7C2D0] hover:text-[#F1F5F9] hover:bg-[#171F29] border border-transparent'
                    }`;
                  }}
                >
                  {({ isActive }) => {
                    const active = isNavActive(item.to, isActive);
                    return (
                      <>
                        <Icon
                          size={18}
                          className={`shrink-0 ${active ? 'text-[#E5B85C]' : 'text-[#94A3B8]'}`}
                        />
                        <span>{item.label}</span>
                      </>
                    );
                  }}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#303B49] flex items-center justify-between text-xs text-[#94A3B8]">
          <span>Local Profile</span>
          <span className="font-mono tabular-nums">{state.completedCases.length} solved</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>

      {/* Shared Photo Upload / Crop Modal */}
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
