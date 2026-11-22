import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Eye,
  Gavel,
  Info,
  Plus,
  UserPlus,
  Users,
} from 'lucide-react';
import { AVATAR_OPTIONS, JudgeAvatar } from '../components/JudgeAvatar';
import { useCourtroom } from '../context/CourtroomContext';
import { CASES, getCaseById } from '../data/cases';
import { computeJuryDistribution } from '../logic/gameLogic';
import {
  ACTIVE_VERDICT_OPTIONS,
  AvatarId,
  REASONING_OPTIONS,
  ReasoningOption,
  VerdictOption,
} from '../types/courtroom';

export const JuryModePage: React.FC = () => {
  const {
    state,
    createJurySession,
    addJuryParticipant,
    submitJuryVote,
    revealJurySession,
  } = useCourtroom();

  const [selectedCaseId, setSelectedCaseId] = useState(CASES[0].id);
  const [hostName, setHostName] = useState(state.profile?.name ?? 'Lead Judge');
  const [includeDemoJurors, setIncludeDemoJurors] = useState(true);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');

  const [activeSessionCode, setActiveSessionCode] = useState<string | null>(
    state.jurySessions[0]?.code ?? null
  );
  const [copied, setCopied] = useState(false);

  const [newJurorName, setNewJurorName] = useState('');
  const [newJurorAvatar, setNewJurorAvatar] = useState<AvatarId>('gavel');

  const [votingJurorId, setVotingJurorId] = useState<string | null>(null);
  const [voteVerdict, setVoteVerdict] = useState<VerdictOption>('Manipulated');
  const [voteReason, setVoteReason] = useState<ReasoningOption>(REASONING_OPTIONS[1]);
  const [voteNote, setVoteNote] = useState('');

  const activeSession = useMemo(
    () => state.jurySessions.find((s) => s.code === activeSessionCode) ?? null,
    [state.jurySessions, activeSessionCode]
  );

  const activeCase = activeSession ? getCaseById(activeSession.caseId) : undefined;
  const distribution = activeSession
    ? computeJuryDistribution(activeSession.participants)
    : null;

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const session = createJurySession(selectedCaseId, hostName, includeDemoJurors);
    setActiveSessionCode(session.code);
    setVotingJurorId(session.participants[0]?.id ?? null);
    setJoinError('');
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = joinCodeInput.trim().toUpperCase();
    const match = state.jurySessions.find((s) => s.code.toUpperCase() === cleaned);
    if (!match) {
      setJoinError('No local session matches that code on this device.');
      return;
    }
    setJoinError('');
    setActiveSessionCode(match.code);
    setVotingJurorId(match.participants.find((p) => !p.verdict)?.id ?? null);
  };

  const handleAddJuror = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !newJurorName.trim()) return;
    addJuryParticipant(activeSession.code, newJurorName, newJurorAvatar);
    setNewJurorName('');
  };

  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !votingJurorId) return;
    submitJuryVote(activeSession.code, votingJurorId, voteVerdict, voteReason, voteNote);
    setVoteNote('');
    const nextPending = activeSession.participants.find(
      (p) => p.id !== votingJurorId && !p.verdict
    );
    setVotingJurorId(nextPending?.id ?? null);
  };

  const handleCopyCode = () => {
    if (!activeSession) return;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(activeSession.code);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#303B49]">
        <p className="text-xs font-mono text-[#E5B85C]">GROUP MODE</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F1F5F9] mt-1">
          Jury Mode
        </h1>
        <p className="text-sm sm:text-[15px] text-[#B7C2D0] mt-1">
          Play a case with friends or classmates on one device, lock in secret votes, and reveal
          everyone’s verdict together.
        </p>
      </div>

      <div className="rounded-xl bg-[#111720] border border-[#303B49] px-4 py-3 flex items-start gap-3 text-xs sm:text-sm text-[#B7C2D0]">
        <Info size={16} className="text-[#E5B85C] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#F1F5F9]">Local Group Mode:</strong> Runs locally on this device
          with optional fictional demo jurors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <form
          onSubmit={handleCreateSession}
          className="lg:col-span-7 rounded-2xl bg-[#171F29] border border-[#303B49] p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#E5B85C]" />
            <h2 className="font-display text-lg font-semibold text-[#F1F5F9]">
              Start a Jury Session
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="jury-case-select"
                className="block text-xs font-semibold text-[#B7C2D0] mb-1.5"
              >
                Pick a Case
              </label>
              <select
                id="jury-case-select"
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full min-h-[44px] rounded-xl bg-[#111720] border border-[#303B49] px-3.5 text-sm text-[#F1F5F9]"
              >
                {CASES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#111720]">
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="jury-host-input"
                className="block text-xs font-semibold text-[#B7C2D0] mb-1.5"
              >
                Your Name
              </label>
              <input
                id="jury-host-input"
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Judge name"
                className="w-full min-h-[44px] rounded-xl bg-[#111720] border border-[#303B49] px-3.5 text-sm text-[#F1F5F9] placeholder-[#94A3B8]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-[#B7C2D0] cursor-pointer">
            <input
              type="checkbox"
              checked={includeDemoJurors}
              onChange={(e) => setIncludeDemoJurors(e.target.checked)}
              className="w-4 h-4 rounded accent-[#E5B85C]"
            />
            <span>Include 3 demo classmates to compare votes right away</span>
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 rounded-xl bg-[#E05252] text-white text-sm font-semibold hover:bg-[#cc4545] transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            <span>Create Jury Session</span>
          </button>
        </form>

        <form
          onSubmit={handleJoinByCode}
          className="lg:col-span-5 rounded-2xl bg-[#171F29] border border-[#303B49] p-5 sm:p-6 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-[#F1F5F9]">
              Reopen Session by Code
            </h2>
            <input
              id="join-code-input"
              type="text"
              value={joinCodeInput}
              onChange={(e) => {
                setJoinCodeInput(e.target.value);
                if (joinError) setJoinError('');
              }}
              aria-label="Session code"
              placeholder="e.g. CRT-7A4K"
              className="w-full min-h-[44px] rounded-xl bg-[#111720] border border-[#303B49] px-3.5 font-mono text-sm uppercase text-[#F1F5F9] placeholder-[#94A3B8]"
            />
            {joinError && <p className="text-xs text-[#E05252]">{joinError}</p>}
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] px-4 rounded-xl bg-[#1C2632] border border-[#303B49] text-sm font-semibold text-[#F1F5F9] hover:border-[#E5B85C]"
          >
            Open Session
          </button>
        </form>
      </div>

      {activeSession && activeCase && distribution && (
        <section className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 sm:p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#303B49]">
            <div className="space-y-1">
              <p className="text-xs font-mono text-[#E5B85C]">
                SESSION {activeSession.code} · {activeCase.title}
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#F1F5F9]">
                Jury Deliberation
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 rounded-xl bg-[#111720] border border-[#303B49] text-xs font-mono text-[#F1F5F9]"
              >
                <Copy size={14} />
                <span>{copied ? 'Copied' : activeSession.code}</span>
              </button>

              <Link
                to={`/case/${activeCase.id}/investigate?step=evidence`}
                className="inline-flex items-center min-h-[42px] px-3.5 rounded-xl bg-[#111720] border border-[#303B49] text-xs font-medium text-[#B7C2D0] hover:text-[#F1F5F9]"
              >
                Read Case Clues
              </Link>

              {!activeSession.revealed && (
                <button
                  type="button"
                  disabled={distribution.totalSubmitted === 0}
                  onClick={() => revealJurySession(activeSession.code)}
                  className={`inline-flex items-center gap-1.5 min-h-[42px] px-4 rounded-xl text-xs font-semibold ${
                    distribution.totalSubmitted > 0
                      ? 'bg-[#E5B85C] text-[#0B0F14] hover:bg-[#d8ab4f]'
                      : 'bg-[#111720] border border-[#303B49] text-[#94A3B8] cursor-not-allowed'
                  }`}
                >
                  <Eye size={14} />
                  <span>Reveal All Verdicts</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-semibold text-[#F1F5F9]">
                Jurors ({activeSession.participants.length})
              </h3>

              <div className="space-y-2.5">
                {activeSession.participants.map((p) => {
                  const isVoting = votingJurorId === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                        isVoting
                          ? 'bg-[#1C2632] border-[#E5B85C]'
                          : 'bg-[#111720] border-[#303B49]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <JudgeAvatar
                          avatar={p.avatar}
                          photoDataUrl={
                            p.photoDataUrl ??
                            (!p.isFictional && p.name === state.profile?.name
                              ? state.profile?.photoDataUrl ?? null
                              : null)
                          }
                          alt={`${p.name} avatar`}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#F1F5F9] truncate">{p.name}</p>
                          <p className="text-xs text-[#94A3B8]">
                            {p.verdict
                              ? activeSession.revealed
                                ? `Voted: ${p.verdict}`
                                : 'Vote Locked'
                              : 'Waiting for vote'}
                          </p>
                        </div>
                      </div>

                      {!activeSession.revealed && !p.isFictional && (
                        <button
                          type="button"
                          onClick={() => setVotingJurorId(p.id)}
                          className="min-h-[40px] px-3 rounded-lg bg-[#171F29] border border-[#303B49] text-xs font-semibold text-[#E5B85C] whitespace-nowrap shrink-0"
                        >
                          {p.verdict ? 'Change' : 'Vote'}
                        </button>
                      )}
                      {p.verdict && (p.isFictional || activeSession.revealed) && (
                        <CheckCircle2 size={16} className="text-[#4CC38A] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {!activeSession.revealed && (
                <form
                  onSubmit={handleAddJuror}
                  className="pt-4 border-t border-[#303B49] space-y-2.5"
                >
                  <p className="text-xs font-semibold text-[#B7C2D0] flex items-center gap-1.5">
                    <UserPlus size={14} className="text-[#E5B85C]" />
                    <span>Add Another Juror</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={newJurorName}
                      onChange={(e) => setNewJurorName(e.target.value)}
                      placeholder="Friend’s name"
                      aria-label="New participant name"
                      className="flex-1 min-w-[140px] min-h-[42px] rounded-xl bg-[#111720] border border-[#303B49] px-3 text-sm text-[#F1F5F9] placeholder-[#94A3B8]"
                    />
                    <select
                      value={newJurorAvatar}
                      onChange={(e) => setNewJurorAvatar(e.target.value as AvatarId)}
                      aria-label="Participant emblem"
                      className="min-h-[42px] rounded-xl bg-[#111720] border border-[#303B49] px-2.5 text-xs text-[#F1F5F9]"
                    >
                      {AVATAR_OPTIONS.map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#111720]">
                          {a.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="min-h-[42px] px-4 rounded-xl bg-[#1C2632] border border-[#303B49] text-xs font-semibold text-[#F1F5F9]"
                    >
                      Add
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="lg:col-span-7">
              {!activeSession.revealed ? (
                <div className="rounded-2xl bg-[#111720] border border-[#303B49] p-5">
                  {votingJurorId ? (
                    (() => {
                      const juror = activeSession.participants.find(
                        (p) => p.id === votingJurorId
                      );
                      return (
                        <form onSubmit={handleCastVote} className="space-y-4">
                          <div>
                            <p className="text-xs font-mono text-[#E5B85C]">
                              SECRET BALLOT · {juror?.name}
                            </p>
                            <p className="text-sm text-[#B7C2D0] mt-1">
                              {activeCase.disputedClaim}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {ACTIVE_VERDICT_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setVoteVerdict(opt)}
                                className={`min-h-[46px] px-3 rounded-xl border text-sm font-semibold transition-colors ${
                                  voteVerdict === opt
                                    ? 'bg-[#1C2632] border-[#E5B85C] text-[#F1F5F9]'
                                    : 'bg-[#171F29] border-[#303B49] text-[#B7C2D0]'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          <div>
                            <label
                              htmlFor="jury-reason-select"
                              className="block text-xs font-medium text-[#B7C2D0] mb-1.5"
                            >
                              Main Reason
                            </label>
                            <select
                              id="jury-reason-select"
                              value={voteReason}
                              onChange={(e) => setVoteReason(e.target.value as ReasoningOption)}
                              className="w-full min-h-[44px] rounded-xl bg-[#171F29] border border-[#303B49] px-3.5 text-sm text-[#F1F5F9]"
                            >
                              {REASONING_OPTIONS.map((r) => (
                                <option key={r} value={r} className="bg-[#171F29]">
                                  {r}
                                </option>
                              ))}
                            </select>
                          </div>

                          <textarea
                            rows={2}
                            value={voteNote}
                            onChange={(e) => setVoteNote(e.target.value)}
                            aria-label="Short note"
                            placeholder="Optional short note on what convinced you..."
                            className="w-full rounded-xl bg-[#171F29] border border-[#303B49] px-3.5 py-2.5 text-sm text-[#F1F5F9] placeholder-[#94A3B8]"
                          />

                          <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 rounded-xl bg-[#E05252] text-white text-sm font-semibold hover:bg-[#cc4545]"
                          >
                            <Gavel size={16} />
                            <span>Lock Vote for {juror?.name}</span>
                          </button>
                        </form>
                      );
                    })()
                  ) : (
                    <div className="py-8 text-center space-y-3">
                      <CheckCircle2 size={28} className="mx-auto text-[#4CC38A]" />
                      <h3 className="text-base font-semibold text-[#F1F5F9]">
                        Votes Locked In
                      </h3>
                      <p className="text-sm text-[#B7C2D0]">
                        Tap Reveal All Verdicts to compare everyone’s decision with the truth.
                      </p>
                      <button
                        type="button"
                        onClick={() => revealJurySession(activeSession.code)}
                        className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 rounded-xl bg-[#E5B85C] text-[#0B0F14] text-sm font-semibold"
                      >
                        <Eye size={16} />
                        <span>Reveal All Verdicts</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#111720] border border-[#303B49] p-5 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#303B49]">
                    <h3 className="text-lg font-semibold text-[#F1F5F9]">Jury Results</h3>
                    <span className="text-sm text-[#B7C2D0]">
                      Truth: <strong className="text-[#E5B85C]">{activeCase.correctVerdict}</strong>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(
                      [
                        { key: 'Authentic' as const, color: '#4CC38A' },
                        { key: 'Manipulated' as const, color: '#E05252' },
                        { key: 'Not Enough Evidence' as const, color: '#F0B45A' },
                      ]
                    ).map((bar) => (
                      <div key={bar.key} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#F1F5F9]">{bar.key}</span>
                          <span className="font-mono text-[#B7C2D0] tabular-nums">
                            {distribution.counts[bar.key]} ({distribution.percentages[bar.key]}%)
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-[#0B0F14] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${distribution.percentages[bar.key]}%`,
                              backgroundColor: bar.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#303B49] space-y-2.5">
                    {activeSession.participants
                      .filter((p) => Boolean(p.verdict))
                      .map((p) => (
                        <div
                          key={p.id}
                          className="rounded-xl bg-[#171F29] border border-[#303B49] p-3.5 space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2 text-sm">
                            <span className="font-semibold text-[#F1F5F9]">{p.name}</span>
                            <span
                              className={`text-xs font-semibold ${
                                p.verdict === activeCase.correctVerdict
                                  ? 'text-[#4CC38A]'
                                  : 'text-[#F0B45A]'
                              }`}
                            >
                              {p.verdict}
                            </span>
                          </div>
                          {p.note && <p className="text-xs text-[#B7C2D0]">"{p.note}"</p>}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
