export type CategoryId =
  | 'celebrity'
  | 'campus'
  | 'financial'
  | 'media'
  | 'identity'
  | 'personal';

export type DifficultyLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert'
  | 'Final Case';

export type EvidenceSectionType =
  | 'media'
  | 'chat'
  | 'witness'
  | 'report'
  | 'timeline';

export type EvidenceClassification =
  | 'unclassified'
  | 'reliable'
  | 'suspicious'
  | 'uncertain';

export type VerdictOption =
  | 'Authentic'
  | 'Manipulated'
  | 'Not Enough Evidence'
  | 'Inconclusive';

export const ACTIVE_VERDICT_OPTIONS: ('Authentic' | 'Manipulated' | 'Not Enough Evidence')[] = [
  'Authentic',
  'Manipulated',
  'Not Enough Evidence',
];

export type ReasoningOption =
  | 'Clues prove it is real.'
  | 'Clues show something was faked or changed.'
  | 'The source cannot be trusted.'
  | 'Some clues do not match up.'
  | 'There is not enough proof yet.';

export const REASONING_OPTIONS: ReasoningOption[] = [
  'Clues prove it is real.',
  'Clues show something was faked or changed.',
  'The source cannot be trusted.',
  'Some clues do not match up.',
  'There is not enough proof yet.',
];

export type AvatarId =
  | 'scales'
  | 'gavel'
  | 'shield'
  | 'lens'
  | 'owl'
  | 'compass';

export type PreferredDifficulty = 'Any' | 'Beginner' | 'Intermediate' | 'Advanced';

export interface CaseCharacter {
  name: string;
  role: string;
  note: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  handle: string;
  timestamp: string;
  text: string;
  isIncoming: boolean;
  flagNote?: string;
}

export interface WitnessStatementEntry {
  id: string;
  witnessName: string;
  role: string;
  recordedAt: string;
  quote: string;
  credibilityContext: string;
}

export interface ReportField {
  label: string;
  value: string;
  highlight?: 'normal' | 'warning' | 'alert' | 'verified';
}

export interface TimelineEvent {
  id: string;
  time: string;
  dateLabel: string;
  title: string;
  detail: string;
  source: string;
  discrepancyNote?: string;
}

export interface MediaHotspot {
  id: string;
  timestampOrRegion: string;
  title: string;
  finding: string;
}

export interface EvidenceItem {
  id: string;
  section: EvidenceSectionType;
  cardLabel: string;
  title: string;
  subtitle: string;
  source: string;
  timestamp: string;
  summary: string;
  keyTakeaway: string;
  expectedClassifications: EvidenceClassification[];
  isKeyClue?: boolean;
  isMisleading?: boolean;
  unlockAfterIds?: string[];
  unlockHint?: string;
  mediaData?: {
    imageUrl: string;
    imageAlt: string;
    mediaLabel: string;
    duration?: string;
    resolution?: string;
    fileFormat?: string;
    caption: string;
    transcript?: { time: string; text: string; note?: string }[];
    hotspots: MediaHotspot[];
  };
  chatData?: {
    platformName: string;
    channelTitle: string;
    participants: string;
    contextNote: string;
    messages: ChatMessage[];
  };
  witnessData?: {
    statements: WitnessStatementEntry[];
  };
  reportData?: {
    documentNumber: string;
    issuingBody: string;
    dateIssued: string;
    documentType: 'Forensic Lab Report' | 'Offer Letter' | 'IT Access Log' | 'Registry Lookup';
    imageUrl?: string;
    imageAlt?: string;
    headline: string;
    introText: string;
    fields: ReportField[];
    footnotes?: string;
  };
  timelineData?: {
    events: TimelineEvent[];
  };
}

export interface CaseLearningContent {
  whatHappened: string;
  redFlags: string[];
  whatShouldYouDo: string[];
  realLifeLesson: string;
}

export interface CaseTruthReveal {
  outcomeHeadline: string;
  explanation: string;
  importantClues: string[];
  evidenceThatMatteredMost: string[];
  misleadingEvidence: string[];
  consequences: string;
}

export interface CaseDefinition {
  id: string;
  caseCode: string;
  categoryId: CategoryId;
  levelNumber: number;
  title: string;
  difficulty: DifficultyLevel;
  incidentDate: string;
  estimatedMinutes: number;
  baseXp: number;
  heroImage: string;
  shortHook: string;
  summary: string;
  disputedClaim: string;
  objective: string;
  characters: CaseCharacter[];
  evidence: EvidenceItem[];
  requiredEvidenceCount: number;
  correctVerdict: VerdictOption;
  alignedReasons: ReasoningOption[];
  truthReveal: CaseTruthReveal;
  learn: CaseLearningContent;
}

export interface PlannedLevelSlot {
  levelNumber: number;
  title: string;
  difficulty: DifficultyLevel;
  teaser: string;
  playableCaseId?: string;
}

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  accentColor: string;
  badgeLabel: string;
  levels: PlannedLevelSlot[];
}

export interface JudgeProfile {
  name: string;
  avatar: AvatarId;
  photoDataUrl?: string | null;
  preferredDifficulty: PreferredDifficulty;
  createdAt: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export interface EvidenceUserState {
  reviewed: boolean;
  classification: EvidenceClassification;
  note: string;
}

export interface CaseInvestigationState {
  caseId: string;
  startedAt: string;
  evidenceState: Record<string, EvidenceUserState>;
}

export interface ScoreBreakdown {
  verdictPoints: number;
  reviewPoints: number;
  classificationPoints: number;
  reasoningPoints: number;
  totalScore: number;
  xpEarned: number;
  isCorrect: boolean;
}

export interface VerdictSubmission {
  verdict: VerdictOption;
  reason?: ReasoningOption;
  explanation?: string;
}

export interface CompletedCaseRecord {
  caseId: string;
  categoryId: CategoryId;
  caseTitle: string;
  difficulty: DifficultyLevel;
  verdict: VerdictOption;
  correctVerdict: VerdictOption;
  reason?: ReasoningOption;
  explanation?: string;
  isCorrect: boolean;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  xpEarned: number;
  evidenceReviewed: number;
  totalEvidence: number;
  timeTakenSeconds: number;
  completedAt: string;
  isDailyCompletion?: boolean;
}

export interface RankTier {
  level: number;
  name: string;
  minXp: number;
  nextXp: number | null;
  summary: string;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  conditionLabel: string;
  iconName: string;
}

export interface JuryParticipant {
  id: string;
  name: string;
  avatar: AvatarId;
  photoDataUrl?: string | null;
  isFictional?: boolean;
  verdict?: VerdictOption;
  reason?: ReasoningOption;
  note?: string;
  submittedAt?: string;
}

export interface JurySession {
  code: string;
  caseId: string;
  createdAt: string;
  revealed: boolean;
  participants: JuryParticipant[];
}

export interface CourtroomPersistedState {
  profile: JudgeProfile | null;
  xp: number;
  completedCases: CompletedCaseRecord[];
  activeInvestigations: Record<string, CaseInvestigationState>;
  unlockedAchievements: string[];
  dailyRewardsClaimed: string[];
  jurySessions: JurySession[];
  settings: AppSettings;
}
