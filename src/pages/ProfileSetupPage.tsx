import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Camera, Check, Home, Trash2, Upload } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { AVATAR_OPTIONS, JudgeAvatar } from '../components/JudgeAvatar';
import { ProfilePhotoModal } from '../components/ProfilePhotoModal';
import { useCourtroom } from '../context/CourtroomContext';
import { AvatarId, PreferredDifficulty } from '../types/courtroom';

const DIFFICULTIES: { value: PreferredDifficulty; label: string; hint: string }[] = [
  { value: 'Any', label: 'All Levels', hint: 'Recommended progression' },
  { value: 'Beginner', label: 'Beginner', hint: 'Guided clues & clear anomalies' },
  { value: 'Intermediate', label: 'Intermediate', hint: 'Subtle inconsistencies' },
  { value: 'Advanced', label: 'Advanced', hint: 'Multi-source cross-checking' },
];

export const ProfileSetupPage: React.FC = () => {
  const { state, saveProfile } = useCourtroom();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get('next') || '/dashboard';

  const [name, setName] = useState(state.profile?.name ?? '');
  const [avatar, setAvatar] = useState<AvatarId>(state.profile?.avatar ?? 'scales');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(
    state.profile?.photoDataUrl ?? null
  );
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<PreferredDifficulty>(
    state.profile?.preferredDifficulty ?? 'Any'
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = name.trim();
    if (cleaned.length < 2) {
      setError('Please enter a judge name with at least 2 characters.');
      return;
    }
    setError('');
    saveProfile({
      name: cleaned,
      avatar,
      photoDataUrl,
      preferredDifficulty: difficulty,
    });
    // Replace /setup in history so Android/browser Back from Dashboard lands on Home (/)
    navigate(nextPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F1F5F9] flex flex-col overflow-x-clip">
      <header className="h-16 px-4 sm:px-8 border-b border-[#303B49] bg-[#111720] flex items-center justify-between gap-3">
        <div className="pointer-events-none select-none min-w-0 truncate">
          <BrandLogo />
        </div>
        <Link
          to="/"
          aria-label="Go to Home page"
          className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3.5 rounded-xl bg-[#171F29] border border-[#303B49] text-sm font-medium text-[#F1F5F9] hover:border-[#E5B85C] transition-colors whitespace-nowrap shrink-0"
        >
          <Home size={16} className="text-[#E5B85C]" />
          <span>Home</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-xl rounded-2xl bg-[#171F29] border border-[#303B49] p-6 sm:p-8">
          <div className="space-y-2 pb-6 border-b border-[#303B49]">
            <p className="text-xs font-mono text-[#E5B85C]">JUDGE CREDENTIALS · LOCAL PROFILE</p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9]">
              Set Up Your Judge Profile
            </h1>
            <p className="text-sm text-[#B7C2D0]">
              Your profile starts at <strong className="text-[#F1F5F9]">Rookie Judge</strong> with{' '}
              <span className="font-mono">0 XP</span> and saves automatically on your device.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
            {/* Optional Profile Photo */}
            <div className="rounded-xl bg-[#111720] border border-[#303B49] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(true)}
                  aria-label="Upload optional judge profile photo"
                  className="relative rounded-full shrink-0 group focus-visible:outline-2 focus-visible:outline-[#E5B85C]"
                >
                  <JudgeAvatar
                    avatar={avatar}
                    photoDataUrl={photoDataUrl}
                    alt="Judge avatar preview"
                    size="lg"
                  />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#1C2632] border border-[#E5B85C] flex items-center justify-center text-[#E5B85C]"
                    aria-hidden="true"
                  >
                    <Camera size={12} />
                  </span>
                </button>
                <div>
                  <p className="text-sm font-semibold text-[#F1F5F9]">
                    Profile Photo <span className="text-xs font-normal text-[#94A3B8]">(Optional)</span>
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Upload from your gallery or keep the default emblem.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-3.5 rounded-xl bg-[#171F29] border border-[#303B49] text-xs font-semibold text-[#F1F5F9] hover:border-[#E5B85C] whitespace-nowrap"
                >
                  <Upload size={14} className="text-[#E5B85C]" />
                  <span>{photoDataUrl ? 'Change' : 'Upload Photo'}</span>
                </button>
                {photoDataUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoDataUrl(null)}
                    aria-label="Remove uploaded photo"
                    className="inline-flex items-center justify-center min-w-[42px] min-h-[42px] rounded-xl bg-[#E05252]/15 border border-[#E05252]/40 text-[#E05252] hover:bg-[#E05252] hover:text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Judge Name */}
            <div>
              <label
                htmlFor="judge-name-input"
                className="block text-sm font-semibold text-[#F1F5F9] mb-2"
              >
                Judge Name
              </label>
              <input
                id="judge-name-input"
                type="text"
                maxLength={32}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Maya Patel"
                autoFocus
                className="w-full rounded-xl bg-[#111720] border border-[#303B49] px-4 py-3 text-base text-[#F1F5F9] placeholder-[#94A3B8] focus:border-[#E5B85C] focus:outline-none transition-colors"
              />
              {error && (
                <p role="alert" className="mt-2 text-xs font-medium text-[#E05252]">
                  {error}
                </p>
              )}
            </div>

            {/* Default Emblem Selector */}
            <div>
              <span className="block text-sm font-semibold text-[#F1F5F9] mb-2.5">
                Select Default Emblem
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AVATAR_OPTIONS.map((opt) => {
                  const selected = avatar === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAvatar(opt.id)}
                      aria-pressed={selected}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors min-h-[52px] ${
                        selected
                          ? 'bg-[#1C2632] border-[#E5B85C] text-[#F1F5F9]'
                          : 'bg-[#111720] border-[#303B49] text-[#B7C2D0] hover:bg-[#1C2632]'
                      }`}
                    >
                      <JudgeAvatar avatar={opt.id} size="sm" />
                      <span className="text-xs font-medium truncate flex-1">{opt.label}</span>
                      {selected && <Check size={15} className="text-[#E5B85C] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Preferred Difficulty */}
            <div>
              <label
                htmlFor="difficulty-select"
                className="block text-sm font-semibold text-[#F1F5F9] mb-2"
              >
                Preferred Difficulty <span className="text-xs font-normal text-[#94A3B8]">(Optional)</span>
              </label>
              <select
                id="difficulty-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as PreferredDifficulty)}
                className="w-full min-h-[46px] rounded-xl bg-[#111720] border border-[#303B49] px-4 py-3 text-sm text-[#F1F5F9] focus:border-[#E5B85C] focus:outline-none"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.value} value={d.value} className="bg-[#111720] text-[#F1F5F9]">
                    {d.label} — {d.hint}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-[#94A3B8]">
                Rank: <span className="text-[#E5B85C] font-medium">Rookie Judge</span> · 0 XP · 0 Cases
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-[#E05252] text-white text-sm font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap"
              >
                <span>Create Profile & Enter</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        </div>
      </main>

      <ProfilePhotoModal
        open={photoModalOpen}
        currentPhoto={photoDataUrl}
        fallbackAvatar={avatar}
        judgeName={name.trim() || 'Judge'}
        onSavePhoto={(dataUrl) => setPhotoDataUrl(dataUrl)}
        onClose={() => setPhotoModalOpen(false)}
      />
    </div>
  );
};
