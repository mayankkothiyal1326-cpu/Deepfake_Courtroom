import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Gavel,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Video,
  XCircle,
} from 'lucide-react';
import { SimpleEvidenceReader } from '../components/SimpleEvidenceReader';
import { useCourtroom } from '../context/CourtroomContext';
import { CASES, getCaseById } from '../data/cases';
import { getCategoryById } from '../data/categories';
import { getEvidenceProgress } from '../logic/gameLogic';
import {
  EvidenceSectionType,
  REASONING_OPTIONS,
  ReasoningOption,
  VerdictOption,
} from '../types/courtroom';

export type CaseStep = 'story' | 'evidence' | 'verdict' | 'reveal';

interface CasePlayPageProps {
  defaultStep?: CaseStep;
}

const VERDICT_CARDS: {
  value: 'Authentic' | 'Manipulated' | 'Not Enough Evidence';
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  accent: string;
}[] = [
  {
    value: 'Authentic',
    title: 'Authentic',
    description: 'The video, message, or offer looks genuine and truthful.',
    icon: ShieldCheck,
    accent: '#4CC38A',
  },
  {
    value: 'Manipulated',
    title: 'Manipulated',
    description: 'Something was faked, altered, or created to deceive people.',
    icon: ShieldAlert,
    accent: '#E05252',
  },
  {
    value: 'Not Enough Evidence',
    title: 'Not Enough Evidence',
    description: 'There is not enough clear proof to decide either way.',
    icon: HelpCircle,
    accent: '#F0B45A',
  },
];

function getSectionIcon(section: EvidenceSectionType) {
  switch (section) {
    case 'media':
      return Video;
    case 'chat':
      return MessageSquare;
    case 'witness':
      return UserCheck;
    default:
      return FileText;
  }
}

export const CasePlayPage: React.FC<CasePlayPageProps> = ({ defaultStep = 'story' }) => {
  const { caseId } = useParams<{ caseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    state,
    rankProgress,
    lastOutcome,
    startOrResumeCase,
    updateEvidenceState,
    submitVerdict,
  } = useCourtroom();

  const caseDef = caseId ? getCaseById(caseId) : undefined;
  const stepParam = searchParams.get('step') as CaseStep | null;
  const currentStep: CaseStep =
    stepParam && ['story', 'evidence', 'verdict', 'reveal'].includes(stepParam)
      ? stepParam
      : defaultStep;

  // Store open clue in URL (?step=evidence&clue=<id>) so Android Back swipe closes the clue
  // and returns cleanly to the Evidence Cards list instead of skipping back to Case Story.
  const openEvidenceId = currentStep === 'evidence' ? searchParams.get('clue') : null;

  // Track in-case forward navigation stack so UI Back buttons pop cleanly via navigate(-1)
  // without creating duplicate forward/back loops in browser history.
  const pushedStackRef = useRef<string[]>([]);

  const [selectedVerdict, setSelectedVerdict] = useState<VerdictOption | null>(null);
  const [selectedReason, setSelectedReason] = useState<ReasoningOption | null>(null);
  const [verdictError, setVerdictError] = useState('');

  useEffect(() => {
    if (caseDef && !state.activeInvestigations[caseDef.id]) {
      startOrResumeCase(caseDef.id, false);
    }
  }, [caseDef, state.activeInvestigations, startOrResumeCase]);

  // Reset in-case history stack when switching to a different case
  useEffect(() => {
    pushedStackRef.current = [];
    setSelectedVerdict(null);
    setSelectedReason(null);
    setVerdictError('');
  }, [caseId]);

  // Scroll to top and keep in-case stack synced if user swiped Back natively
  useEffect(() => {
    const currentKey = openEvidenceId ? `${currentStep}:${openEvidenceId}` : currentStep;
    const stack = pushedStackRef.current;
    if (stack.length > 0 && stack[stack.length - 1] === currentKey) {
      stack.pop();
    }
    window.scrollTo(0, 0);
  }, [currentStep, openEvidenceId, caseId]);

  if (!caseDef) {
    return (
      <div className="rounded-2xl bg-[#171F29] border border-[#303B49] p-8 text-center space-y-4">
        <h1 className="font-display text-2xl font-semibold text-[#F1F5F9]">Case Not Found</h1>
        <p className="text-sm text-[#B7C2D0]">Pick a playable case from Investigate Cases.</p>
        <Link
          to="/cases"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-[#E5B85C] text-[#0B0F14] text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Go to Cases</span>
        </Link>
      </div>
    );
  }

  const category = getCategoryById(caseDef.categoryId);
  const investigation = state.activeInvestigations[caseDef.id];
  const progress = getEvidenceProgress(caseDef, investigation);

  const latestRecord =
    (lastOutcome?.record.caseId === caseDef.id ? lastOutcome.record : null) ??
    state.completedCases.find((c) => c.caseId === caseDef.id) ??
    null;

  const pushStep = (nextStep: CaseStep) => {
    const currentKey = openEvidenceId ? `${currentStep}:${openEvidenceId}` : currentStep;
    pushedStackRef.current.push(currentKey);
    setSearchParams({ step: nextStep });
  };

  const openClue = (clueId: string) => {
    pushedStackRef.current.push('evidence');
    setSearchParams({ step: 'evidence', clue: clueId });
  };

  const goBackToStep = (targetStep: CaseStep) => {
    const lastPushed = pushedStackRef.current[pushedStackRef.current.length - 1];
    if (lastPushed === targetStep) {
      pushedStackRef.current.pop();
      navigate(-1);
    } else {
      setSearchParams({ step: targetStep }, { replace: true });
    }
  };

  const openEvidence = openEvidenceId
    ? caseDef.evidence.find((e) => e.id === openEvidenceId) ?? null
    : null;

  const handleCloseClue = () => {
    goBackToStep('evidence');
  };

  const handleMarkCheckedAndBack = () => {
    if (openEvidence) {
      updateEvidenceState(caseDef.id, openEvidence.id, { reviewed: true });
    }
    goBackToStep('evidence');
  };

  const handleSubmitVerdict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVerdict) {
      setVerdictError('Please tap one of the three verdict choices first.');
      return;
    }
    setVerdictError('');
    submitVerdict(caseDef.id, {
      verdict: selectedVerdict,
      reason: selectedReason ?? undefined,
    });
    pushStep('reveal');
  };

  const handlePlayAgain = () => {
    startOrResumeCase(caseDef.id, true);
    setSelectedVerdict(null);
    setSelectedReason(null);
    pushedStackRef.current = [];
    setSearchParams({ step: 'story' });
  };

  const nextPlayableCase = CASES.find((c) => c.id !== caseDef.id) ?? CASES[0];

  const stepsMeta: { id: CaseStep; num: number; label: string }[] = [
    { id: 'story', num: 1, label: 'Case Story' },
    { id: 'evidence', num: 2, label: 'Evidence' },
    { id: 'verdict', num: 3, label: 'Verdict' },
    { id: 'reveal', num: 4, label: 'Reveal' },
  ];

  const activeStepIndex = stepsMeta.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Compact Header & Step Indicator */}
      <div className="space-y-4 pb-4 border-b border-[#303B49]">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/cases"
            className="inline-flex items-center gap-1.5 min-h-[40px] text-sm font-medium text-[#B7C2D0] hover:text-[#F1F5F9] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>All Cases</span>
          </Link>
          <span className="text-xs font-mono text-[#E5B85C]">
            {category?.shortName} · {caseDef.difficulty}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9]">
          {caseDef.title}
        </h1>

        {/* Clear 4-Step Progress Bar */}
        <ol className="grid grid-cols-4 gap-2" aria-label="Case steps">
          {stepsMeta.map((step, idx) => {
            const isCurrent = idx === activeStepIndex;
            const isDone = idx < activeStepIndex;
            return (
              <li
                key={step.id}
                className={`rounded-xl px-2.5 py-2 border text-center transition-colors ${
                  isCurrent
                    ? 'bg-[#1C2632] border-[#E5B85C] text-[#F1F5F9]'
                    : isDone
                    ? 'bg-[#171F29] border-[#4CC38A]/50 text-[#4CC38A]'
                    : 'bg-[#111720] border-[#303B49] text-[#94A3B8]'
                }`}
              >
                <span className="block text-[11px] font-mono">Step {step.num}</span>
                <span className="block text-xs sm:text-sm font-semibold truncate mt-0.5">
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* STEP 1 — CASE STORY */}
      {currentStep === 'story' && (
        <div className="space-y-5">
          <div className="rounded-2xl overflow-hidden border border-[#303B49] bg-[#171F29]">
            <div className="aspect-video sm:aspect-[21/9] w-full bg-[#111720] overflow-hidden">
              <img
                src={caseDef.heroImage}
                alt={`Scene from ${caseDef.title}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-7 space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-mono text-[#E5B85C]">STEP 1 · WHAT HAPPENED</p>
                <p className="text-base text-[#F1F5F9] leading-relaxed">{caseDef.summary}</p>
              </div>

              <div className="rounded-xl bg-[#111720] border border-[#303B49] p-4 space-y-1">
                <p className="text-xs font-mono text-[#E05252]">QUESTION TO SOLVE</p>
                <p className="text-[15px] font-semibold text-[#F1F5F9] leading-relaxed">
                  {caseDef.disputedClaim}
                </p>
              </div>

              {/* People Involved */}
              <div className="space-y-2.5">
                <h2 className="text-sm font-semibold text-[#F1F5F9]">People in This Case</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {caseDef.characters.map((person) => (
                    <div
                      key={person.name}
                      className="rounded-xl bg-[#111720] border border-[#303B49] p-3.5 space-y-1"
                    >
                      <p className="text-sm font-semibold text-[#F1F5F9]">{person.name}</p>
                      <p className="text-xs text-[#E5B85C]">{person.role}</p>
                      <p className="text-xs text-[#B7C2D0] leading-relaxed pt-0.5">
                        {person.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => pushStep('evidence')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[50px] px-7 rounded-xl bg-[#E05252] text-white text-base font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap"
                >
                  <span>Check the Evidence ({caseDef.evidence.length} Clues)</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — CHECK THE EVIDENCE */}
      {currentStep === 'evidence' && (
        <div className="space-y-5">
          {openEvidence ? (
            <SimpleEvidenceReader
              item={openEvidence}
              isReviewed={Boolean(investigation?.evidenceState[openEvidence.id]?.reviewed)}
              onMarkReviewedAndBack={handleMarkCheckedAndBack}
              onBack={handleCloseClue}
            />
          ) : (
            <>
              <div className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-mono text-[#E5B85C]">STEP 2 · CHECK THE EVIDENCE</p>
                    <h2 className="font-display text-xl font-semibold text-[#F1F5F9] mt-0.5">
                      Inspect the Clues
                    </h2>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[#4CC38A] tabular-nums">
                    Checked {progress.reviewedCount} of {progress.totalCount}
                  </span>
                </div>
                <p className="text-sm text-[#B7C2D0]">
                  Tap <strong className="text-[#F1F5F9]">Read Clue</strong> on each card below.
                  Check at least {caseDef.requiredEvidenceCount} clues (or all {caseDef.evidence.length}{' '}
                  for the best score) before making your verdict.
                </p>
              </div>

              {/* 5 Simple Evidence Cards (Static cards with explicit buttons to avoid accidental mobile taps) */}
              <div className="space-y-3">
                {caseDef.evidence.map((item, idx) => {
                  const isReviewed = Boolean(investigation?.evidenceState[item.id]?.reviewed);
                  const Icon = getSectionIcon(item.section);

                  return (
                    <article
                      key={item.id}
                      className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isReviewed
                          ? 'bg-[#171F29] border-[#4CC38A]/50'
                          : 'bg-[#171F29] border-[#303B49]'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                            isReviewed
                              ? 'bg-[#4CC38A]/15 border-[#4CC38A]/40 text-[#4CC38A]'
                              : 'bg-[#111720] border-[#303B49] text-[#E5B85C]'
                          }`}
                        >
                          {isReviewed ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono text-[#E5B85C]">
                              Clue {idx + 1} · {item.cardLabel}
                            </span>
                            <span aria-hidden="true" className="text-[#94A3B8]">
                              ·
                            </span>
                            <span
                              className={
                                isReviewed ? 'text-[#4CC38A] font-semibold' : 'text-[#94A3B8]'
                              }
                            >
                              {isReviewed ? 'Checked' : 'Not checked yet'}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-[#F1F5F9]">
                            {item.title}
                          </h3>
                          <p className="text-sm text-[#B7C2D0]">{item.subtitle}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openClue(item.id)}
                        className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          isReviewed
                            ? 'bg-[#111720] border border-[#303B49] text-[#F1F5F9] hover:border-[#E5B85C]'
                            : 'bg-[#E5B85C] text-[#0B0F14] hover:bg-[#d8ab4f]'
                        }`}
                      >
                        <span>{isReviewed ? 'Read Again' : 'Read Clue'}</span>
                        <ArrowRight size={15} />
                      </button>
                    </article>
                  );
                })}
              </div>

              {/* Step 2 Footer Controls */}
              <div className="rounded-2xl bg-[#111720] border border-[#303B49] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => goBackToStep('story')}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-[#171F29] border border-[#303B49] text-sm font-medium text-[#B7C2D0] hover:text-[#F1F5F9]"
                >
                  <ArrowLeft size={16} />
                  <span>Re-read Story</span>
                </button>

                <button
                  type="button"
                  disabled={!progress.canSubmitVerdict}
                  onClick={() => pushStep('verdict')}
                  className={`inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
                    progress.canSubmitVerdict
                      ? 'bg-[#E05252] text-white hover:bg-[#cc4545]'
                      : 'bg-[#171F29] border border-[#303B49] text-[#94A3B8] cursor-not-allowed'
                  }`}
                >
                  <Gavel size={17} />
                  <span>
                    {progress.canSubmitVerdict
                      ? 'Make Your Verdict'
                      : `Check ${caseDef.requiredEvidenceCount - progress.reviewedCount} More Clue${
                          caseDef.requiredEvidenceCount - progress.reviewedCount === 1 ? '' : 's'
                        }`}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* STEP 3 — MAKE YOUR VERDICT */}
      {currentStep === 'verdict' && (
        <form onSubmit={handleSubmitVerdict} className="space-y-6">
          <div className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 sm:p-7 space-y-5">
            <div className="space-y-1.5">
              <p className="text-xs font-mono text-[#E5B85C]">STEP 3 · MAKE YOUR VERDICT</p>
              <h2 className="font-display text-2xl font-semibold text-[#F1F5F9]">
                What Is Your Ruling?
              </h2>
              <p className="text-sm sm:text-[15px] text-[#B7C2D0]">{caseDef.disputedClaim}</p>
            </div>

            {/* 3 Simple Verdict Buttons */}
            <div className="space-y-3" role="radiogroup" aria-label="Choose your verdict">
              {VERDICT_CARDS.map((card) => {
                const Icon = card.icon;
                const isSelected = selectedVerdict === card.value;
                return (
                  <button
                    key={card.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setSelectedVerdict(card.value);
                      if (verdictError) setVerdictError('');
                    }}
                    className={`w-full text-left p-5 rounded-2xl border transition-colors flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#1C2632] border-[#E5B85C]'
                        : 'bg-[#111720] border-[#303B49] hover:bg-[#1C2632]/70'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="mt-0.5 shrink-0" style={{ color: card.accent }}>
                        <Icon size={24} />
                      </span>
                      <div>
                        <p className="text-base sm:text-lg font-semibold text-[#F1F5F9]">
                          {card.title}
                        </p>
                        <p className="text-sm text-[#B7C2D0] mt-0.5">{card.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 size={22} className="text-[#E5B85C] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Optional Simple Reasoning Picker */}
            <div className="pt-4 border-t border-[#303B49] space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-[#F1F5F9]">
                  Why did you choose this?{' '}
                  <span className="font-normal text-[#94A3B8]">(Optional)</span>
                </h3>
              </div>

              <div className="space-y-2" role="radiogroup" aria-label="Optional reason">
                {REASONING_OPTIONS.map((reason) => {
                  const isSelected = selectedReason === reason;
                  return (
                    <button
                      key={reason}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedReason(isSelected ? null : reason)}
                      className={`w-full text-left min-h-[44px] px-4 py-3 rounded-xl border text-sm transition-colors flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#1C2632] border-[#E5B85C] text-[#F1F5F9] font-medium'
                          : 'bg-[#111720] border-[#303B49] text-[#B7C2D0] hover:text-[#F1F5F9]'
                      }`}
                    >
                      <span>{reason}</span>
                      {isSelected && <CheckCircle2 size={17} className="text-[#E5B85C] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {verdictError && (
              <p role="alert" className="text-sm font-medium text-[#E05252]">
                {verdictError}
              </p>
            )}

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => goBackToStep('evidence')}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-[#111720] border border-[#303B49] text-sm font-medium text-[#B7C2D0] hover:text-[#F1F5F9]"
              >
                <ArrowLeft size={16} />
                <span>Back to Evidence</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 min-h-[50px] px-7 rounded-xl bg-[#E05252] text-white text-base font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap"
              >
                <Gavel size={18} />
                <span>Submit Verdict</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* STEP 4 — CASE REVEAL */}
      {currentStep === 'reveal' && (
        <>
          {!latestRecord ? (
            <div className="rounded-2xl bg-[#171F29] border border-[#303B49] p-8 text-center space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#F1F5F9]">
                Submit Your Verdict First
              </h2>
              <p className="text-sm text-[#B7C2D0]">
                Check the clues and submit your verdict to unlock the case reveal.
              </p>
              <button
                type="button"
                onClick={() => pushStep('evidence')}
                className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-xl bg-[#E5B85C] text-[#0B0F14] text-sm font-semibold"
              >
                <span>Go to Evidence</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Verdict Outcome Card */}
              <section
                className={`rounded-2xl bg-[#171F29] border p-6 sm:p-7 space-y-4 ${
                  latestRecord.isCorrect ? 'border-[#4CC38A]/70' : 'border-[#E05252]/70'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {latestRecord.isCorrect ? (
                    <CheckCircle2 size={28} className="text-[#4CC38A] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={28} className="text-[#E05252] shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p
                      className={`text-xs font-mono font-semibold ${
                        latestRecord.isCorrect ? 'text-[#4CC38A]' : 'text-[#E05252]'
                      }`}
                    >
                      {latestRecord.isCorrect ? 'CORRECT VERDICT' : 'CASE TRUTH REVEALED'}
                    </p>
                    <h2 className="font-display text-2xl font-semibold text-[#F1F5F9]">
                      {caseDef.truthReveal.outcomeHeadline}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm pt-1">
                  <span className="text-[#B7C2D0]">
                    Your Verdict: <strong className="text-[#F1F5F9]">{latestRecord.verdict}</strong>
                  </span>
                  <span className="text-[#B7C2D0]">
                    Correct Answer:{' '}
                    <strong className="text-[#E5B85C]">{caseDef.correctVerdict}</strong>
                  </span>
                </div>

                <p className="text-[15px] text-[#F1F5F9] leading-relaxed pt-2 border-t border-[#303B49]">
                  {caseDef.truthReveal.explanation}
                </p>
              </section>

              {/* Important Clues & Misleading Clue */}
              <section className="rounded-2xl bg-[#171F29] border border-[#303B49] p-6 space-y-4">
                <h3 className="text-base font-semibold text-[#F1F5F9] flex items-center gap-2">
                  <BookOpen size={18} className="text-[#E5B85C]" />
                  <span>The Important Clues</span>
                </h3>
                <ul className="space-y-2.5 text-sm sm:text-[15px] text-[#B7C2D0]">
                  {caseDef.truthReveal.importantClues.map((clue) => (
                    <li key={clue} className="leading-relaxed">
                      • {clue}
                    </li>
                  ))}
                </ul>

                {caseDef.truthReveal.misleadingEvidence.length > 0 && (
                  <div className="rounded-xl bg-[#111720] border border-[#303B49] p-4 space-y-1">
                    <p className="text-xs font-mono text-[#F0B45A] flex items-center gap-1.5">
                      <AlertTriangle size={14} />
                      <span>THE TRICKY CLUE</span>
                    </p>
                    <p className="text-sm text-[#B7C2D0] leading-relaxed">
                      {caseDef.truthReveal.misleadingEvidence[0]}
                    </p>
                  </div>
                )}
              </section>

              {/* One Practical Lesson */}
              <section className="rounded-2xl bg-[#111720] border border-[#E5B85C]/60 p-6 space-y-2">
                <p className="text-xs font-mono text-[#E5B85C] flex items-center gap-1.5">
                  <Lightbulb size={15} />
                  <span>PRACTICAL SAFETY LESSON</span>
                </p>
                <p className="text-base font-medium text-[#F1F5F9] leading-relaxed">
                  {caseDef.learn.realLifeLesson}
                </p>
              </section>

              {/* Secondary Compact Reward Summary */}
              <section className="rounded-2xl bg-[#171F29] border border-[#303B49] px-5 py-4 flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono tabular-nums">
                  <span className="text-[#F1F5F9]">
                    Score: <strong className="text-[#E5B85C]">{latestRecord.score}/100</strong>
                  </span>
                  <span className="text-[#4CC38A]">+{latestRecord.xpEarned} XP</span>
                  <span className="text-[#B7C2D0]">
                    Clues: {latestRecord.evidenceReviewed}/{latestRecord.totalEvidence}
                  </span>
                </div>
                <span className="text-xs text-[#94A3B8]">
                  Rank: <strong className="text-[#E5B85C]">{rankProgress.currentRank.name}</strong>
                </span>
              </section>

              {/* Next Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePlayAgain}
                    className="inline-flex items-center justify-center gap-2 min-h-[46px] px-4 rounded-xl bg-[#171F29] border border-[#303B49] text-sm font-medium text-[#F1F5F9] hover:border-[#E5B85C]"
                  >
                    <RotateCcw size={16} />
                    <span>Play Again</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center justify-center min-h-[46px] px-4 rounded-xl bg-[#171F29] border border-[#303B49] text-sm font-medium text-[#B7C2D0] hover:text-[#F1F5F9]"
                  >
                    Back to Dashboard
                  </button>
                </div>

                <Link
                  to={`/case/${nextPlayableCase.id}/investigate?step=story`}
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-[#E05252] text-white text-sm sm:text-base font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap"
                >
                  <span>Next Case: {nextPlayableCase.title}</span>
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
