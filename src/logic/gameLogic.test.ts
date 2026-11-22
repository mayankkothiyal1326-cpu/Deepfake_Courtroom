import test from 'node:test';
import assert from 'node:assert/strict';
import { CASES } from '../data/cases';
import {
  calculateCaseScore,
  computeJuryDistribution,
  computeProgressAnalytics,
  evaluateAchievements,
  getDailyCaseForDate,
  getEvidenceProgress,
  getRankForXp,
  getRankProgress,
  isLevelUnlocked,
} from './gameLogic';
import { CaseInvestigationState, CompletedCaseRecord, JuryParticipant } from '../types/courtroom';

test('rank progression maps XP thresholds accurately', () => {
  assert.equal(getRankForXp(0).name, 'Rookie Judge');
  assert.equal(getRankForXp(150).name, 'Junior Investigator');
  assert.equal(getRankForXp(350).name, 'Evidence Analyst');
  assert.equal(getRankForXp(650).name, 'Senior Judge');
  assert.equal(getRankForXp(1000).name, 'Digital Justice Master');

  const progress = getRankProgress(75);
  assert.equal(progress.currentRank.name, 'Rookie Judge');
  assert.equal(progress.nextRank?.name, 'Junior Investigator');
  assert.equal(progress.percent, 50);
  assert.equal(progress.xpNeededForNext, 75);
});

test('both playable cases have 5 easy-to-access evidence cards', () => {
  assert.equal(CASES.length, 2);
  assert.equal(CASES[0].evidence.length, 5);
  assert.equal(CASES[1].evidence.length, 5);
});

test('scoring awards 100/100 for thorough accurate verdict and partial credit for Not Enough Evidence', () => {
  const campusCase = CASES[0];
  const fullState: CaseInvestigationState = {
    caseId: campusCase.id,
    startedAt: new Date().toISOString(),
    evidenceState: {
      'cmp-ev-1': { reviewed: true, classification: 'unclassified', note: '' },
      'cmp-ev-2': { reviewed: true, classification: 'unclassified', note: '' },
      'cmp-ev-3': { reviewed: true, classification: 'unclassified', note: '' },
      'cmp-ev-4': { reviewed: true, classification: 'unclassified', note: '' },
      'cmp-ev-5': { reviewed: true, classification: 'unclassified', note: '' },
    },
  };

  const perfect = calculateCaseScore(campusCase, fullState, {
    verdict: 'Manipulated',
    reason: 'Clues show something was faked or changed.',
  });
  assert.equal(perfect.isCorrect, true);
  assert.equal(perfect.totalScore, 100);
  assert.equal(perfect.verdictPoints, 50);
  assert.equal(perfect.reviewPoints, 35);
  assert.equal(perfect.reasoningPoints, 15);

  const cautious = calculateCaseScore(campusCase, fullState, {
    verdict: 'Not Enough Evidence',
    reason: 'There is not enough proof yet.',
  });
  assert.equal(cautious.isCorrect, false);
  assert.equal(cautious.verdictPoints, 20);

  const wrongOpposite = calculateCaseScore(campusCase, fullState, {
    verdict: 'Authentic',
  });
  assert.equal(wrongOpposite.verdictPoints, 0);
  assert.ok(cautious.totalScore > wrongOpposite.totalScore);
});

test('evidence progress unlocks verdict after reviewing 3 cards', () => {
  const finCase = CASES[1];
  const twoReviewed: CaseInvestigationState = {
    caseId: finCase.id,
    startedAt: new Date().toISOString(),
    evidenceState: {
      'fin-ev-1': { reviewed: true, classification: 'unclassified', note: '' },
      'fin-ev-2': { reviewed: true, classification: 'unclassified', note: '' },
    },
  };
  assert.equal(getEvidenceProgress(finCase, twoReviewed).canSubmitVerdict, false);

  const threeReviewed: CaseInvestigationState = {
    ...twoReviewed,
    evidenceState: {
      ...twoReviewed.evidenceState,
      'fin-ev-3': { reviewed: true, classification: 'unclassified', note: '' },
    },
  };
  assert.equal(getEvidenceProgress(finCase, threeReviewed).canSubmitVerdict, true);
});

test('level unlocks and achievements evaluate correctly', () => {
  assert.equal(isLevelUnlocked('campus', 1, []), true);
  assert.equal(isLevelUnlocked('campus', 2, []), false);

  const record: CompletedCaseRecord = {
    caseId: 'campus-viral-confession',
    categoryId: 'campus',
    caseTitle: 'The Viral Confession',
    difficulty: 'Beginner',
    verdict: 'Manipulated',
    correctVerdict: 'Manipulated',
    isCorrect: true,
    score: 96,
    scoreBreakdown: {
      verdictPoints: 50,
      reviewPoints: 35,
      classificationPoints: 0,
      reasoningPoints: 11,
      totalScore: 96,
      xpEarned: 146,
      isCorrect: true,
    },
    xpEarned: 146,
    evidenceReviewed: 5,
    totalEvidence: 5,
    timeTakenSeconds: 90,
    completedAt: '2026-11-20T12:00:00.000Z',
  };

  assert.equal(isLevelUnlocked('campus', 2, [record]), true);

  const { allUnlocked } = evaluateAchievements(146, [record], []);
  assert.ok(allUnlocked.includes('first-verdict'));
  assert.ok(allUnlocked.includes('evidence-explorer'));
  assert.ok(allUnlocked.includes('campus-defender'));
});

test('daily case rotation and jury distribution handle Not Enough Evidence', () => {
  const c1 = getDailyCaseForDate('2026-11-21');
  const c2 = getDailyCaseForDate('2026-11-21');
  assert.equal(c1.id, c2.id);

  const jurors: JuryParticipant[] = [
    { id: '1', name: 'Judge A', avatar: 'scales', verdict: 'Manipulated' },
    { id: '2', name: 'Judge B', avatar: 'gavel', verdict: 'Manipulated' },
    { id: '3', name: 'Judge C', avatar: 'owl', verdict: 'Not Enough Evidence' },
  ];
  const dist = computeJuryDistribution(jurors);
  assert.equal(dist.totalSubmitted, 3);
  assert.equal(dist.counts.Manipulated, 2);
  assert.equal(dist.counts['Not Enough Evidence'], 1);
  assert.equal(dist.majorityVerdict, 'Manipulated');

  const analytics = computeProgressAnalytics([]);
  assert.equal(analytics.totalCompleted, 0);
});

test('profile photo crop math preserves 1:1 square ratio without distortion or out-of-bounds', async () => {
  const { computeCoverCropRect, isSupportedImageFile } = await import('../utils/imageCrop');

  // Landscape 1600x900 centered at zoom 1 -> 900x900 square centered horizontally
  const landscape = computeCoverCropRect(1600, 900, 1, 0, 0);
  assert.equal(landscape.sWidth, 900);
  assert.equal(landscape.sHeight, 900);
  assert.equal(landscape.sx, 350);
  assert.equal(landscape.sy, 0);

  // Portrait 800x1200 zoomed 2x and panned to extreme edge stays within bounds
  const portrait = computeCoverCropRect(800, 1200, 2, 1, -1);
  assert.equal(portrait.sWidth, 400);
  assert.equal(portrait.sHeight, 400);
  assert.ok(portrait.sx >= 0 && portrait.sx + portrait.sWidth <= 800);
  assert.ok(portrait.sy >= 0 && portrait.sy + portrait.sHeight <= 1200);

  // File type checks
  assert.equal(isSupportedImageFile({ type: 'image/jpeg', name: 'photo.jpg' }), true);
  assert.equal(isSupportedImageFile({ type: 'image/png', name: 'pic.png' }), true);
  assert.equal(isSupportedImageFile({ type: 'image/webp', name: 'avatar.webp' }), true);
  assert.equal(isSupportedImageFile({ type: 'application/pdf', name: 'doc.pdf' }), false);
});

