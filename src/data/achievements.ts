import { AchievementDefinition } from '../types/courtroom';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-verdict',
    title: 'First Verdict',
    description: 'Submitted your first official ruling in the Deepfake Courtroom.',
    conditionLabel: 'Complete any 1 case',
    iconName: 'Gavel',
  },
  {
    id: 'evidence-explorer',
    title: 'Evidence Explorer',
    description: 'Examined every piece of available evidence before ruling on a case.',
    conditionLabel: 'Review 100% of evidence in a case',
    iconName: 'Search',
  },
  {
    id: 'sharp-observer',
    title: 'Sharp Observer',
    description: 'Classified key clues accurately and achieved a high investigation score.',
    conditionLabel: 'Score 85+ on any case',
    iconName: 'Eye',
  },
  {
    id: 'case-closer',
    title: 'Case Closer',
    description: 'Successfully solved both playable cybercrime investigations.',
    conditionLabel: 'Complete 2 distinct cases',
    iconName: 'FolderCheck',
  },
  {
    id: 'perfect-judgment',
    title: 'Perfect Judgment',
    description: 'Delivered a flawless investigation with thorough notes and reasoning.',
    conditionLabel: 'Score 95+ on any case',
    iconName: 'Award',
  },
  {
    id: 'campus-defender',
    title: 'Campus Defender',
    description: 'Protected student integrity by solving "The Viral Confession" accurately.',
    conditionLabel: 'Correctly solve a Campus Case',
    iconName: 'ShieldCheck',
  },
  {
    id: 'media-investigator',
    title: 'Media Investigator',
    description: 'Uncovered hidden forensic proof by cross-checking financial or digital records.',
    conditionLabel: 'Correctly solve a Financial Crimes case',
    iconName: 'FileSearch',
  },
  {
    id: 'digital-justice-master',
    title: 'Digital Justice Master',
    description: 'Reached the highest judicial standing through consistent forensic accuracy.',
    conditionLabel: 'Reach Digital Justice Master rank (1,000 XP)',
    iconName: 'Scale',
  },
];
