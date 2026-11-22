import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCaseById } from '../data/cases';
import {
  calculateCaseScore,
  DAILY_BONUS_XP,
  evaluateAchievements,
  generateSessionCode,
  getDailyCaseForDate,
  getEvidenceProgress,
  getRankProgress,
  getTodayDateKey,
  isEvidenceUnlocked,
} from '../logic/gameLogic';
import {
  AppSettings,
  AvatarId,
  CaseInvestigationState,
  CompletedCaseRecord,
  CourtroomPersistedState,
  EvidenceClassification,
  JudgeProfile,
  JuryParticipant,
  JurySession,
  PreferredDifficulty,
  VerdictOption,
  VerdictSubmission,
  ReasoningOption,
} from '../types/courtroom';
import { playCourtroomTone } from '../utils/sound';
import { clearPersistedState, getInitialState, loadPersistedState, savePersistedState } from '../utils/storage';

interface SubmitVerdictResult {
  record: CompletedCaseRecord;
  newlyUnlockedAchievements: string[];
  dailyBonusAwarded: number;
}

interface CourtroomContextValue {
  state: CourtroomPersistedState;
  rankProgress: ReturnType<typeof getRankProgress>;
  todayKey: string;
  dailyCase: ReturnType<typeof getDailyCaseForDate>;
  isDailyCompletedToday: boolean;
  lastOutcome: SubmitVerdictResult | null;
  saveProfile: (input: {
    name: string;
    avatar: AvatarId;
    photoDataUrl?: string | null;
    preferredDifficulty: PreferredDifficulty;
  }) => void;
  updateProfilePhoto: (photoDataUrl: string | null) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  startOrResumeCase: (caseId: string, reset?: boolean) => void;
  updateEvidenceState: (
    caseId: string,
    evidenceId: string,
    patch: { reviewed?: boolean; classification?: EvidenceClassification; note?: string }
  ) => { unlockedNewIds: string[] };
  submitVerdict: (caseId: string, submission: VerdictSubmission) => SubmitVerdictResult | null;
  createJurySession: (caseId: string, hostName: string, includeDemoJurors: boolean) => JurySession;
  addJuryParticipant: (sessionCode: string, name: string, avatar: AvatarId) => void;
  submitJuryVote: (
    sessionCode: string,
    participantId: string,
    verdict: VerdictOption,
    reason: ReasoningOption,
    note: string
  ) => void;
  revealJurySession: (sessionCode: string) => void;
  resetAllProgress: () => void;
}

const CourtroomContext = createContext<CourtroomContextValue | null>(null);

export const CourtroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CourtroomPersistedState>(() => loadPersistedState());
  const [lastOutcome, setLastOutcome] = useState<SubmitVerdictResult | null>(null);

  // Sync persisted state to localStorage
  useEffect(() => {
    savePersistedState(state);
  }, [state]);

  // Sync reduced motion class on <html>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('reduce-motion', state.settings.reducedMotion);
  }, [state.settings.reducedMotion]);

  const todayKey = getTodayDateKey();
  const dailyCase = useMemo(() => getDailyCaseForDate(todayKey), [todayKey]);
  const isDailyCompletedToday = state.dailyRewardsClaimed.includes(todayKey);
  const rankProgress = useMemo(() => getRankProgress(state.xp), [state.xp]);

  const saveProfile = (input: {
    name: string;
    avatar: AvatarId;
    photoDataUrl?: string | null;
    preferredDifficulty: PreferredDifficulty;
  }) => {
    const trimmed = input.name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      profile: {
        name: trimmed,
        avatar: input.avatar,
        photoDataUrl:
          input.photoDataUrl !== undefined
            ? input.photoDataUrl
            : prev.profile?.photoDataUrl ?? null,
        preferredDifficulty: input.preferredDifficulty,
        createdAt: prev.profile?.createdAt ?? new Date().toISOString(),
      },
    }));
    playCourtroomTone('click', state.settings.soundEnabled);
  };

  const updateProfilePhoto = (photoDataUrl: string | null) => {
    setState((prev) => {
      if (!prev.profile) return prev;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          photoDataUrl,
        },
      };
    });
    playCourtroomTone('click', state.settings.soundEnabled);
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
      },
    }));
  };

  const startOrResumeCase = (caseId: string, reset = false) => {
    setState((prev) => {
      if (!reset && prev.activeInvestigations[caseId]) {
        return prev;
      }
      const nextInv: CaseInvestigationState = {
        caseId,
        startedAt: new Date().toISOString(),
        evidenceState: {},
      };
      return {
        ...prev,
        activeInvestigations: {
          ...prev.activeInvestigations,
          [caseId]: nextInv,
        },
      };
    });
  };

  const updateEvidenceState = (
    caseId: string,
    evidenceId: string,
    patch: { reviewed?: boolean; classification?: EvidenceClassification; note?: string }
  ): { unlockedNewIds: string[] } => {
    const caseDef = getCaseById(caseId);
    const unlockedNewIds: string[] = [];

    setState((prev) => {
      const existingInv = prev.activeInvestigations[caseId] ?? {
        caseId,
        startedAt: new Date().toISOString(),
        evidenceState: {},
      };

      const previouslyUnlocked = new Set<string>();
      if (caseDef) {
        for (const item of caseDef.evidence) {
          if (isEvidenceUnlocked(item, existingInv)) {
            previouslyUnlocked.add(item.id);
          }
        }
      }

      const prevEv = existingInv.evidenceState[evidenceId] ?? {
        reviewed: false,
        classification: 'unclassified' as EvidenceClassification,
        note: '',
      };

      const nextInv: CaseInvestigationState = {
        ...existingInv,
        evidenceState: {
          ...existingInv.evidenceState,
          [evidenceId]: {
            reviewed: patch.reviewed !== undefined ? patch.reviewed : prevEv.reviewed,
            classification:
              patch.classification !== undefined ? patch.classification : prevEv.classification,
            note: patch.note !== undefined ? patch.note : prevEv.note,
          },
        },
      };

      if (caseDef) {
        for (const item of caseDef.evidence) {
          if (!previouslyUnlocked.has(item.id) && isEvidenceUnlocked(item, nextInv)) {
            unlockedNewIds.push(item.id);
          }
        }
      }

      if (unlockedNewIds.length > 0) {
        playCourtroomTone('unlock', prev.settings.soundEnabled);
      } else if (patch.reviewed !== undefined || patch.classification !== undefined) {
        playCourtroomTone('click', prev.settings.soundEnabled);
      }

      return {
        ...prev,
        activeInvestigations: {
          ...prev.activeInvestigations,
          [caseId]: nextInv,
        },
      };
    });

    return { unlockedNewIds };
  };

  const submitVerdict = (
    caseId: string,
    submission: VerdictSubmission
  ): SubmitVerdictResult | null => {
    const caseDef = getCaseById(caseId);
    if (!caseDef) return null;

    const currentInv = state.activeInvestigations[caseId];
    const breakdown = calculateCaseScore(caseDef, currentInv, submission);
    const progress = getEvidenceProgress(caseDef, currentInv);
    const startedMs = currentInv?.startedAt ? new Date(currentInv.startedAt).getTime() : Date.now();
    const timeTakenSeconds = Math.max(10, Math.round((Date.now() - startedMs) / 1000));

    const isDailyCase = dailyCase.id === caseId;
    const canAwardDailyBonus = isDailyCase && !state.dailyRewardsClaimed.includes(todayKey);
    const dailyBonusAwarded = canAwardDailyBonus ? DAILY_BONUS_XP : 0;

    // Avoid farming infinite XP on rapid replays: award full XP first time, or improvement delta + small practice XP on replay
    const previousBestForCase = state.completedCases
      .filter((c) => c.caseId === caseId)
      .reduce((max, c) => Math.max(max, c.xpEarned), 0);

    const caseXpGain =
      previousBestForCase === 0
        ? breakdown.xpEarned
        : Math.max(20, breakdown.xpEarned - previousBestForCase);

    const totalXpAwarded = caseXpGain + dailyBonusAwarded;

    const record: CompletedCaseRecord = {
      caseId: caseDef.id,
      categoryId: caseDef.categoryId,
      caseTitle: caseDef.title,
      difficulty: caseDef.difficulty,
      verdict: submission.verdict,
      correctVerdict: caseDef.correctVerdict,
      reason: submission.reason,
      explanation: (submission.explanation ?? '').trim(),
      isCorrect: breakdown.isCorrect,
      score: breakdown.totalScore,
      scoreBreakdown: breakdown,
      xpEarned: totalXpAwarded,
      evidenceReviewed: progress.reviewedCount,
      totalEvidence: progress.totalCount,
      timeTakenSeconds,
      completedAt: new Date().toISOString(),
      isDailyCompletion: canAwardDailyBonus,
    };

    const nextXp = state.xp + totalXpAwarded;
    const nextCompleted = [record, ...state.completedCases];
    const { allUnlocked, newlyUnlocked } = evaluateAchievements(
      nextXp,
      nextCompleted,
      state.unlockedAchievements
    );

    const nextDailyClaimed = canAwardDailyBonus
      ? [...state.dailyRewardsClaimed, todayKey]
      : state.dailyRewardsClaimed;

    setState((prev) => ({
      ...prev,
      xp: nextXp,
      completedCases: nextCompleted,
      unlockedAchievements: allUnlocked,
      dailyRewardsClaimed: nextDailyClaimed,
    }));

    playCourtroomTone('verdict', state.settings.soundEnabled);

    const result: SubmitVerdictResult = {
      record,
      newlyUnlockedAchievements: newlyUnlocked,
      dailyBonusAwarded,
    };
    setLastOutcome(result);
    return result;
  };

  const createJurySession = (
    caseId: string,
    hostName: string,
    includeDemoJurors: boolean
  ): JurySession => {
    const code = generateSessionCode();
    const cleanHost = hostName.trim() || state.profile?.name || 'Lead Judge';
    const hostParticipant: JuryParticipant = {
      id: `juror-host-${Date.now()}`,
      name: cleanHost,
      avatar: state.profile?.avatar ?? 'scales',
      photoDataUrl: state.profile?.photoDataUrl ?? null,
      isFictional: false,
    };

    const demoJurors: JuryParticipant[] = includeDemoJurors
      ? caseId === 'campus-viral-confession'
        ? [
            {
              id: `juror-demo-1-${Date.now()}`,
              name: 'Maya Chen (Demo Juror)',
              avatar: 'lens',
              isFictional: true,
              verdict: 'Manipulated',
              reason: 'Clues show something was faked or changed.',
              note: 'The ID card log and Prof. Lin both prove Arjun was inside the Robotics Lab.',
              submittedAt: new Date().toISOString(),
            },
            {
              id: `juror-demo-2-${Date.now()}`,
              name: 'Daniel Ortiz (Demo Juror)',
              avatar: 'owl',
              isFictional: true,
              verdict: 'Not Enough Evidence',
              reason: 'Some clues do not match up.',
              note: 'Riya saw him in a similar hoodie near the library, so I want to be careful.',
              submittedAt: new Date().toISOString(),
            },
            {
              id: `juror-demo-3-${Date.now()}`,
              name: 'Priya Nair (Demo Juror)',
              avatar: 'shield',
              isFictional: true,
              verdict: 'Manipulated',
              reason: 'The source cannot be trusted.',
              note: 'The account was created 25 minutes before posting and the face lighting looks indoors.',
              submittedAt: new Date().toISOString(),
            },
          ]
        : [
            {
              id: `juror-demo-1-${Date.now()}`,
              name: 'Maya Chen (Demo Juror)',
              avatar: 'lens',
              isFictional: true,
              verdict: 'Manipulated',
              reason: 'The source cannot be trusted.',
              note: 'A real company never asks students to send $285 for a laptop before starting.',
              submittedAt: new Date().toISOString(),
            },
            {
              id: `juror-demo-2-${Date.now()}`,
              name: 'Daniel Ortiz (Demo Juror)',
              avatar: 'owl',
              isFictional: true,
              verdict: 'Manipulated',
              reason: 'Clues show something was faked or changed.',
              note: 'The Career Office confirmed the real company uses @vanguardcrest.io, not an 11-day-old site.',
              submittedAt: new Date().toISOString(),
            },
            {
              id: `juror-demo-3-${Date.now()}`,
              name: 'Priya Nair (Demo Juror)',
              avatar: 'shield',
              isFictional: true,
              verdict: 'Not Enough Evidence',
              reason: 'Some clues do not match up.',
              note: 'The message sounded polite and mentioned the Spring Fair, though the 5 PM deadline felt rushed.',
              submittedAt: new Date().toISOString(),
            },
          ]
      : [];

    const session: JurySession = {
      code,
      caseId,
      createdAt: new Date().toISOString(),
      revealed: false,
      participants: [hostParticipant, ...demoJurors],
    };

    setState((prev) => ({
      ...prev,
      jurySessions: [session, ...prev.jurySessions],
    }));

    return session;
  };

  const addJuryParticipant = (sessionCode: string, name: string, avatar: AvatarId) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      jurySessions: prev.jurySessions.map((s) =>
        s.code === sessionCode
          ? {
              ...s,
              participants: [
                ...s.participants,
                {
                  id: `juror-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  name: trimmed,
                  avatar,
                  isFictional: false,
                },
              ],
            }
          : s
      ),
    }));
  };

  const submitJuryVote = (
    sessionCode: string,
    participantId: string,
    verdict: VerdictOption,
    reason: ReasoningOption,
    note: string
  ) => {
    setState((prev) => ({
      ...prev,
      jurySessions: prev.jurySessions.map((s) =>
        s.code === sessionCode
          ? {
              ...s,
              participants: s.participants.map((p) =>
                p.id === participantId
                  ? {
                      ...p,
                      verdict,
                      reason,
                      note: note.trim(),
                      submittedAt: new Date().toISOString(),
                    }
                  : p
              ),
            }
          : s
      ),
    }));
    playCourtroomTone('click', state.settings.soundEnabled);
  };

  const revealJurySession = (sessionCode: string) => {
    setState((prev) => ({
      ...prev,
      jurySessions: prev.jurySessions.map((s) =>
        s.code === sessionCode ? { ...s, revealed: true } : s
      ),
    }));
    playCourtroomTone('verdict', state.settings.soundEnabled);
  };

  const resetAllProgress = () => {
    clearPersistedState();
    setLastOutcome(null);
    setState((prev) => ({
      ...getInitialState(),
      profile: prev.profile,
      settings: prev.settings,
    }));
  };

  const value: CourtroomContextValue = {
    state,
    rankProgress,
    todayKey,
    dailyCase,
    isDailyCompletedToday,
    lastOutcome,
    saveProfile,
    updateProfilePhoto,
    updateSettings,
    startOrResumeCase,
    updateEvidenceState,
    submitVerdict,
    createJurySession,
    addJuryParticipant,
    submitJuryVote,
    revealJurySession,
    resetAllProgress,
  };

  return <CourtroomContext.Provider value={value}>{children}</CourtroomContext.Provider>;
};

export function useCourtroom() {
  const ctx = useContext(CourtroomContext);
  if (!ctx) {
    throw new Error('useCourtroom must be used inside CourtroomProvider');
  }
  return ctx;
}
