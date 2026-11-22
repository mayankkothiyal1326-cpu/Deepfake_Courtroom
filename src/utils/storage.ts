import { CourtroomPersistedState } from '../types/courtroom';

export const STORAGE_KEY = 'deepfake_courtroom_state_v1';

export function getInitialState(): CourtroomPersistedState {
  return {
    profile: null,
    xp: 0,
    completedCases: [],
    activeInvestigations: {},
    unlockedAchievements: [],
    dailyRewardsClaimed: [],
    jurySessions: [],
    settings: {
      soundEnabled: true,
      reducedMotion: false,
    },
  };
}

export function loadPersistedState(): CourtroomPersistedState {
  if (typeof window === 'undefined') {
    return getInitialState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw) as Partial<CourtroomPersistedState>;
    const defaults = getInitialState();
    return {
      ...defaults,
      ...parsed,
      settings: {
        ...defaults.settings,
        ...(parsed.settings ?? {}),
      },
      completedCases: Array.isArray(parsed.completedCases) ? parsed.completedCases : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements)
        ? parsed.unlockedAchievements
        : [],
      dailyRewardsClaimed: Array.isArray(parsed.dailyRewardsClaimed)
        ? parsed.dailyRewardsClaimed
        : [],
      jurySessions: Array.isArray(parsed.jurySessions) ? parsed.jurySessions : [],
      activeInvestigations: parsed.activeInvestigations ?? {},
    };
  } catch {
    return getInitialState();
  }
}

export function savePersistedState(state: CourtroomPersistedState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors gracefully
  }
}

export function clearPersistedState(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors gracefully
  }
}
