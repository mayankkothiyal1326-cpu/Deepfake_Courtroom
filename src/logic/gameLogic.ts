import { CASES } from '../data/cases';
import { CATEGORIES } from '../data/categories';
import { RANKS } from '../data/ranks';
import {
  CaseDefinition,
  CaseInvestigationState,
  CategoryId,
  CompletedCaseRecord,
  EvidenceItem,
  JuryParticipant,
  RankTier,
  ScoreBreakdown,
  VerdictOption,
  VerdictSubmission,
} from '../types/courtroom';

export const DAILY_BONUS_XP = 50;

export function normalizeVerdict(verdict: VerdictOption): 'Authentic' | 'Manipulated' | 'Not Enough Evidence' {
  if (verdict === 'Inconclusive') return 'Not Enough Evidence';
  return verdict;
}

export function getRankForXp(xp: number): RankTier {
  const safeXp = Math.max(0, Math.floor(xp));
  let matched = RANKS[0];
  for (const rank of RANKS) {
    if (safeXp >= rank.minXp) {
      matched = rank;
    }
  }
  return matched;
}

export interface RankProgress {
  currentRank: RankTier;
  nextRank: RankTier | null;
  xpInTier: number;
  xpNeededForNext: number;
  percent: number;
}

export function getRankProgress(xp: number): RankProgress {
  const safeXp = Math.max(0, Math.floor(xp));
  const currentRank = getRankForXp(safeXp);
  const currentIndex = RANKS.findIndex((r) => r.level === currentRank.level);
  const nextRank =
    currentIndex >= 0 && currentIndex + 1 < RANKS.length ? RANKS[currentIndex + 1] : null;

  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      xpInTier: safeXp - currentRank.minXp,
      xpNeededForNext: 0,
      percent: 100,
    };
  }

  const tierSpan = nextRank.minXp - currentRank.minXp;
  const xpInTier = Math.max(0, safeXp - currentRank.minXp);
  const percent = Math.min(100, Math.round((xpInTier / tierSpan) * 100));

  return {
    currentRank,
    nextRank,
    xpInTier,
    xpNeededForNext: Math.max(0, nextRank.minXp - safeXp),
    percent,
  };
}

export function isEvidenceUnlocked(
  item: EvidenceItem,
  investigationState?: CaseInvestigationState
): boolean {
  if (!item.unlockAfterIds || item.unlockAfterIds.length === 0) {
    return true;
  }
  if (!investigationState) return false;
  return item.unlockAfterIds.every(
    (reqId) => investigationState.evidenceState[reqId]?.reviewed === true
  );
}

export function getEvidenceProgress(
  caseDef: CaseDefinition,
  investigationState?: CaseInvestigationState
): {
  unlockedCount: number;
  reviewedCount: number;
  classifiedCount: number;
  totalCount: number;
  canSubmitVerdict: boolean;
} {
  const totalCount = caseDef.evidence.length;
  let unlockedCount = 0;
  let reviewedCount = 0;
  let classifiedCount = 0;

  for (const item of caseDef.evidence) {
    const unlocked = isEvidenceUnlocked(item, investigationState);
    if (unlocked) unlockedCount += 1;
    const state = investigationState?.evidenceState[item.id];
    if (unlocked && state?.reviewed) {
      reviewedCount += 1;
    }
    if (unlocked && state?.classification && state.classification !== 'unclassified') {
      classifiedCount += 1;
    }
  }

  return {
    unlockedCount,
    reviewedCount,
    classifiedCount,
    totalCount,
    canSubmitVerdict: reviewedCount >= caseDef.requiredEvidenceCount,
  };
}

/**
 * Simple, transparent 100-point scoring rubric:
 * - Verdict Accuracy (50 pts): 50 for correct verdict, 20 partial credit for "Not Enough Evidence" when cautious.
 * - Evidence Checked (35 pts): proportional to how many evidence cards you inspected.
 * - Optional Reasoning (15 pts): 15 for an aligned reason, 10 for picking any reason, 8 baseline if skipped.
 */
export function calculateCaseScore(
  caseDef: CaseDefinition,
  investigationState: CaseInvestigationState | undefined,
  submission: VerdictSubmission
): ScoreBreakdown {
  const submittedNorm = normalizeVerdict(submission.verdict);
  const correctNorm = normalizeVerdict(caseDef.correctVerdict);
  const isCorrect = submittedNorm === correctNorm;

  let verdictPoints = 0;
  if (isCorrect) {
    verdictPoints = 50;
  } else if (submittedNorm === 'Not Enough Evidence' && correctNorm !== 'Not Enough Evidence') {
    verdictPoints = 20;
  }

  const totalItems = Math.max(1, caseDef.evidence.length);
  let reviewedCount = 0;
  for (const item of caseDef.evidence) {
    const evState = investigationState?.evidenceState[item.id];
    const unlocked = isEvidenceUnlocked(item, investigationState);
    if (unlocked && evState?.reviewed) {
      reviewedCount += 1;
    }
  }

  const reviewPoints = Math.round((reviewedCount / totalItems) * 35);

  let reasoningPoints = 8;
  if (submission.reason) {
    if (caseDef.alignedReasons.includes(submission.reason)) {
      reasoningPoints = 15;
    } else if (
      submittedNorm === 'Not Enough Evidence' &&
      submission.reason === 'There is not enough proof yet.'
    ) {
      reasoningPoints = 12;
    } else {
      reasoningPoints = 10;
    }
  }

  const totalScore = Math.min(100, verdictPoints + reviewPoints + reasoningPoints);
  const xpMultiplier = 0.4 + (totalScore / 100) * 0.6;
  const xpEarned = Math.round(caseDef.baseXp * xpMultiplier);

  return {
    verdictPoints,
    reviewPoints,
    classificationPoints: 0,
    reasoningPoints,
    totalScore,
    xpEarned,
    isCorrect,
  };
}

export function isLevelUnlocked(
  categoryId: CategoryId,
  levelNumber: number,
  completedCases: CompletedCaseRecord[]
): boolean {
  if (levelNumber <= 1) return true;
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return false;
  const prevSlot = category.levels.find((l) => l.levelNumber === levelNumber - 1);
  if (!prevSlot?.playableCaseId) {
    return false;
  }
  return completedCases.some((rec) => rec.caseId === prevSlot.playableCaseId);
}

export function evaluateAchievements(
  xp: number,
  completedCases: CompletedCaseRecord[],
  existingUnlocked: string[]
): { allUnlocked: string[]; newlyUnlocked: string[] } {
  const unlockedSet = new Set(existingUnlocked);
  const distinctCaseIds = new Set(completedCases.map((c) => c.caseId));

  if (completedCases.length >= 1) {
    unlockedSet.add('first-verdict');
  }
  if (completedCases.some((c) => c.evidenceReviewed >= c.totalEvidence && c.totalEvidence > 0)) {
    unlockedSet.add('evidence-explorer');
  }
  if (completedCases.some((c) => c.score >= 85)) {
    unlockedSet.add('sharp-observer');
  }
  if (distinctCaseIds.size >= 2) {
    unlockedSet.add('case-closer');
  }
  if (completedCases.some((c) => c.score >= 95)) {
    unlockedSet.add('perfect-judgment');
  }
  if (completedCases.some((c) => c.categoryId === 'campus' && c.isCorrect)) {
    unlockedSet.add('campus-defender');
  }
  if (completedCases.some((c) => c.categoryId === 'financial' && c.isCorrect)) {
    unlockedSet.add('media-investigator');
  }
  if (getRankForXp(xp).level >= 5) {
    unlockedSet.add('digital-justice-master');
  }

  const allUnlocked = Array.from(unlockedSet);
  const newlyUnlocked = allUnlocked.filter((id) => !existingUnlocked.includes(id));

  return { allUnlocked, newlyUnlocked };
}

export function getTodayDateKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyCaseForDate(dateKey: string): CaseDefinition {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  const index = hash % CASES.length;
  return CASES[index];
}

export function computeJuryDistribution(participants: JuryParticipant[]): {
  totalSubmitted: number;
  counts: Record<'Authentic' | 'Manipulated' | 'Not Enough Evidence', number>;
  percentages: Record<'Authentic' | 'Manipulated' | 'Not Enough Evidence', number>;
  majorityVerdict: 'Authentic' | 'Manipulated' | 'Not Enough Evidence' | null;
} {
  const counts: Record<'Authentic' | 'Manipulated' | 'Not Enough Evidence', number> = {
    Authentic: 0,
    Manipulated: 0,
    'Not Enough Evidence': 0,
  };

  let totalSubmitted = 0;
  for (const p of participants) {
    if (p.verdict) {
      const normalized = normalizeVerdict(p.verdict);
      counts[normalized] += 1;
      totalSubmitted += 1;
    }
  }

  const percentages: Record<'Authentic' | 'Manipulated' | 'Not Enough Evidence', number> = {
    Authentic: totalSubmitted > 0 ? Math.round((counts.Authentic / totalSubmitted) * 100) : 0,
    Manipulated: totalSubmitted > 0 ? Math.round((counts.Manipulated / totalSubmitted) * 100) : 0,
    'Not Enough Evidence':
      totalSubmitted > 0 ? Math.round((counts['Not Enough Evidence'] / totalSubmitted) * 100) : 0,
  };

  let majorityVerdict: 'Authentic' | 'Manipulated' | 'Not Enough Evidence' | null = null;
  if (totalSubmitted > 0) {
    const entries = (
      Object.entries(counts) as ['Authentic' | 'Manipulated' | 'Not Enough Evidence', number][]
    ).sort((a, b) => b[1] - a[1]);
    if (entries[0][1] > 0) {
      majorityVerdict = entries[0][0];
    }
  }

  return {
    totalSubmitted,
    counts,
    percentages,
    majorityVerdict,
  };
}

export function computeProgressAnalytics(completedCases: CompletedCaseRecord[]) {
  const totalCompleted = completedCases.length;
  const distinctCompletedIds = new Set(completedCases.map((c) => c.caseId));
  const averageScore =
    totalCompleted > 0
      ? Math.round(completedCases.reduce((sum, c) => sum + c.score, 0) / totalCompleted)
      : 0;
  const correctCount = completedCases.filter((c) => c.isCorrect).length;
  const accuracyPercent =
    totalCompleted > 0 ? Math.round((correctCount / totalCompleted) * 100) : 0;

  const categoryCompletion = CATEGORIES.map((cat) => {
    const completedInCat = new Set(
      completedCases.filter((c) => c.categoryId === cat.id).map((c) => c.caseId)
    ).size;
    return {
      categoryId: cat.id,
      name: cat.name,
      shortName: cat.shortName,
      accentColor: cat.accentColor,
      completed: completedInCat,
      total: cat.levels.length,
      percent: Math.round((completedInCat / cat.levels.length) * 100),
    };
  });

  const scoreHistory = [...completedCases]
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    .map((c, idx) => ({
      attempt: idx + 1,
      label: c.caseTitle,
      score: c.score,
      isCorrect: c.isCorrect,
      date: c.completedAt,
    }));

  return {
    totalCompleted,
    distinctCasesSolved: distinctCompletedIds.size,
    averageScore,
    correctCount,
    accuracyPercent,
    categoryCompletion,
    scoreHistory,
  };
}

export function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `CRT-${suffix}`;
}
