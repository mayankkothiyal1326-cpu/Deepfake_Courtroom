import { RankTier } from '../types/courtroom';

export const RANKS: RankTier[] = [
  {
    level: 1,
    name: 'Rookie Judge',
    minXp: 0,
    nextXp: 150,
    summary: 'Learning how to verify digital clues and avoid snap judgments.',
  },
  {
    level: 2,
    name: 'Junior Investigator',
    minXp: 150,
    nextXp: 350,
    summary: 'Spot inconsistencies across messages, witnesses, and metadata.',
  },
  {
    level: 3,
    name: 'Evidence Analyst',
    minXp: 350,
    nextXp: 650,
    summary: 'Cross-examine forensic logs and separate reliable facts from noise.',
  },
  {
    level: 4,
    name: 'Senior Judge',
    minXp: 650,
    nextXp: 1000,
    summary: 'Deliver accurate, well-reasoned rulings on complex cybercrime cases.',
  },
  {
    level: 5,
    name: 'Digital Justice Master',
    minXp: 1000,
    nextXp: null,
    summary: 'Master of digital forensics, media verification, and online safety.',
  },
];
