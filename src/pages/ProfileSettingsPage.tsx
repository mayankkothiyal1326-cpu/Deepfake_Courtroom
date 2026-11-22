import React, { useState } from 'react';
import {
  Camera,
  Check,
  RotateCcw,
  Save,
  Sliders,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AVATAR_OPTIONS, JudgeAvatar } from '../components/JudgeAvatar';
import { ProfilePhotoModal } from '../components/ProfilePhotoModal';
import { useCourtroom } from '../context/CourtroomContext';
import { AvatarId, PreferredDifficulty } from '../types/courtroom';

export const ProfileSettingsPage: React.FC = () => {
  const {
    state,
    rankProgress,
    saveProfile,
    updateProfilePhoto,
    updateSettings,
    resetAllProgress,
  } = useCourtroom();

  const [name, setName] = useState(state.profile?.name ?? 'Judge');
  const [avatar, setAvatar] = useState<AvatarId>(state.profile?.avatar ?? 'scales');
  const [difficulty, setDifficulty] = useState<PreferredDifficulty>(
    state.profile?.preferredDifficulty ?? 'Any'
  );
  const [saveMessage, setSaveMessage] = useState('');
  const [photoMessage, setPhotoMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetNotice, setResetNotice] = useState('');
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const currentPhoto = state.profile?.photoDataUrl ?? null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = name.trim();
    if (cleaned.length < 2) {
      setNameError('Judge name must be at least 2 characters.');
      return;
    }
    setNameError('');
    saveProfile({
      name: cleaned,
      avatar,
      photoDataUrl: currentPhoto,
      preferredDifficulty: difficulty,
    });
    setSaveMessage('Profile changes saved.');
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const handlePhotoSaved = (dataUrl: string | null) => {
    updateProfilePhoto(dataUrl);
    setPhotoMessage(
      dataUrl ? 'Profile photo saved on this device.' : 'Profile photo removed. Default emblem restored.'
    );
    setTimeout(() => setPhotoMessage(''), 3000);
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setResetDialogOpen(false);
    setResetNotice('All XP, completed cases, notes, and achievements have been reset.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-5 border-b border-[#303B49]">
        <p className="text-xs font-mono text-[#E5B85C]">JUDGE ACCOUNT & PREFERENCES</p>
        <h1 className="font-display text-3xl font-semibold text-[#F1F5F9] mt-1">
          Profile & Settings
        </h1>
        <p className="text-sm text-[#B7C2D0] mt-1.5">
          Update your judge photo, name, audio preferences, or saved investigation progress.
        </p>
      </div>

      {/* Rank Standing & Profile Photo Banner */}
      <section className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setPhotoModalOpen(true)}
              aria-label={currentPhoto ? 'Change judge profile photo' : 'Upload judge profile photo'}
              className="relative rounded-full shrink-0 group focus-visible:outline-2 focus-visible:outline-[#E5B85C]"
            >
              <JudgeAvatar
                avatar={avatar}
                photoDataUrl={currentPhoto}
                alt={`Judge ${state.profile?.name ?? name} profile photo`}
                size="lg"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-[#1C2632] border border-[#E5B85C] flex items-center justify-center text-[#E5B85C] group-hover:bg-[#E5B85C] group-hover:text-[#0B0F14] transition-colors"
                aria-hidden="true"
              >
                <Camera size={14} />
              </span>
            </button>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-[#F1F5F9] truncate">
                Judge {state.profile?.name ?? name}
              </p>
              <p className="text-sm text-[#E5B85C] font-medium">
                {rankProgress.currentRank.name}
              </p>
              <p className="text-xs text-[#94A3B8] font-mono tabular-nums mt-0.5">
                {state.xp} XP · {state.completedCases.length} Completed Rulings ·{' '}
                {state.unlockedAchievements.length} Badges
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setPhotoModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-[#111720] border border-[#303B49] text-sm font-semibold text-[#F1F5F9] hover:border-[#E5B85C] transition-colors whitespace-nowrap"
            >
              <Upload size={15} className="text-[#E5B85C]" />
              <span>{currentPhoto ? 'Change Photo' : 'Upload Photo'}</span>
            </button>

            {currentPhoto && (
              <button
                type="button"
                onClick={() => handlePhotoSaved(null)}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 rounded-xl bg-[#E05252]/15 border border-[#E05252]/40 text-sm font-medium text-[#E05252] hover:bg-[#E05252] hover:text-white transition-colors whitespace-nowrap"
              >
                <Trash2 size={15} />
                <span>Remove Photo</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#303B49]/70 text-xs">
          <span className="text-[#94A3B8]">
            Tap your avatar or Upload Photo to choose a JPG, PNG, or WEBP image from your device.
            Stored locally only.
          </span>
          {photoMessage && (
            <span role="status" className="font-medium text-[#4CC38A]">
              {photoMessage}
            </span>
          )}
        </div>
      </section>

      {/* Edit Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl bg-[#171F29] border border-[#303B49] p-6 space-y-5"
      >
        <h2 className="font-display text-lg font-semibold text-[#F1F5F9]">
          Judge Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="settings-judge-name"
              className="block text-xs font-semibold text-[#B7C2D0] mb-1.5"
            >
              Judge Name
            </label>
            <input
              id="settings-judge-name"
              type="text"
              maxLength={32}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              className="w-full rounded-xl bg-[#111720] border border-[#303B49] px-3.5 py-2.5 text-sm text-[#F1F5F9] focus:border-[#E5B85C] focus:outline-none"
            />
            {nameError && <p className="text-xs text-[#E05252] mt-1.5">{nameError}</p>}
          </div>

          <div>
            <label
              htmlFor="settings-difficulty"
              className="block text-xs font-semibold text-[#B7C2D0] mb-1.5"
            >
              Preferred Difficulty
            </label>
            <select
              id="settings-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as PreferredDifficulty)}
              className="w-full rounded-xl bg-[#111720] border border-[#303B49] px-3.5 py-2.5 text-sm text-[#F1F5F9] focus:border-[#E5B85C] focus:outline-none"
            >
              <option value="Any" className="bg-[#111720]">
                All Levels
              </option>
              <option value="Beginner" className="bg-[#111720]">
                Beginner
              </option>
              <option value="Intermediate" className="bg-[#111720]">
                Intermediate
              </option>
              <option value="Advanced" className="bg-[#111720]">
                Advanced
              </option>
            </select>
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-[#B7C2D0] mb-2">
            Judge Emblem
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {AVATAR_OPTIONS.map((opt) => {
              const selected = avatar === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAvatar(opt.id)}
                  aria-pressed={selected}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-colors ${
                    selected
                      ? 'bg-[#1C2632] border-[#E5B85C] text-[#F1F5F9]'
                      : 'bg-[#111720] border-[#303B49] text-[#B7C2D0] hover:bg-[#1C2632]'
                  }`}
                >
                  <JudgeAvatar avatar={opt.id} size="sm" />
                  <span className="text-xs font-medium truncate flex-1">{opt.label}</span>
                  {selected && <Check size={14} className="text-[#E5B85C] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          {saveMessage ? (
            <span role="status" className="text-xs font-medium text-[#4CC38A]">
              {saveMessage}
            </span>
          ) : (
            <span className="text-xs text-[#94A3B8]">Stored locally in your browser.</span>
          )}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5B85C] text-[#0B0F14] text-sm font-semibold hover:bg-[#d8ab4f] transition-colors whitespace-nowrap"
          >
            <Save size={15} />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Sound & Animation Preferences */}
      <section className="rounded-2xl bg-[#171F29] border border-[#303B49] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-[#E5B85C]" />
          <h2 className="font-display text-lg font-semibold text-[#F1F5F9]">
            Experience Preferences
          </h2>
        </div>

        <div className="divide-y divide-[#303B49]">
          <div className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {state.settings.soundEnabled ? (
                <Volume2 size={18} className="text-[#4CC38A] shrink-0 mt-0.5" />
              ) : (
                <VolumeX size={18} className="text-[#94A3B8] shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium text-[#F1F5F9]">Courtroom Sound Effects</p>
                <p className="text-xs text-[#94A3B8]">
                  Subtle audio chimes when unlocking clues or delivering a verdict.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={state.settings.soundEnabled}
              onClick={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                state.settings.soundEnabled
                  ? 'bg-[#4CC38A]/15 border-[#4CC38A]/50 text-[#4CC38A]'
                  : 'bg-[#111720] border-[#303B49] text-[#B7C2D0]'
              }`}
            >
              {state.settings.soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>

          <div className="py-3.5 last:pb-0 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#F1F5F9]">Reduced Motion</p>
              <p className="text-xs text-[#94A3B8]">
                Disable subtle UI transitions for a calmer, instant-snap interface.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={state.settings.reducedMotion}
              onClick={() => updateSettings({ reducedMotion: !state.settings.reducedMotion })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                state.settings.reducedMotion
                  ? 'bg-[#E5B85C]/15 border-[#E5B85C]/50 text-[#E5B85C]'
                  : 'bg-[#111720] border-[#303B49] text-[#B7C2D0]'
              }`}
            >
              {state.settings.reducedMotion ? 'Reduced' : 'Standard'}
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone: Reset Progress */}
      <section className="rounded-2xl bg-[#171F29] border border-[#E05252]/40 p-6 space-y-3">
        <h2 className="font-display text-lg font-semibold text-[#F1F5F9]">
          Reset Investigation Progress
        </h2>
        <p className="text-sm text-[#B7C2D0]">
          Clear your XP, rank progress, completed cases, archive history, notes, and unlocked
          badges. Your judge name and emblem will remain intact.
        </p>

        {resetNotice && (
          <p role="status" className="text-xs font-medium text-[#4CC38A]">
            {resetNotice}
          </p>
        )}

        <div className="pt-1">
          <button
            type="button"
            onClick={() => setResetDialogOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E05252]/15 border border-[#E05252]/50 text-sm font-semibold text-[#E05252] hover:bg-[#E05252] hover:text-white transition-colors whitespace-nowrap"
          >
            <RotateCcw size={15} />
            <span>Reset All Progress</span>
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={resetDialogOpen}
        title="Reset All Investigation Progress?"
        description="This will permanently erase your XP, rank progress, case archive, evidence notes, and unlocked achievements on this device. This action cannot be undone."
        confirmLabel="Yes, Reset Progress"
        tone="danger"
        onConfirm={handleConfirmReset}
        onCancel={() => setResetDialogOpen(false)}
      />

      <ProfilePhotoModal
        open={photoModalOpen}
        currentPhoto={currentPhoto}
        fallbackAvatar={avatar}
        judgeName={state.profile?.name ?? name}
        onSavePhoto={handlePhotoSaved}
        onClose={() => setPhotoModalOpen(false)}
      />
    </div>
  );
};
