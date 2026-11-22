import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  StickyNote,
  UserCheck,
  Video,
} from 'lucide-react';
import {
  EvidenceClassification,
  EvidenceItem,
  EvidenceUserState,
} from '../types/courtroom';

interface EvidenceViewerProps {
  item: EvidenceItem;
  userState: EvidenceUserState;
  onToggleReviewed: () => void;
  onSelectClassification: (classification: EvidenceClassification) => void;
  onChangeNote: (note: string) => void;
}

const CLASSIFICATION_OPTIONS: {
  value: EvidenceClassification;
  label: string;
  activeClass: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  {
    value: 'reliable',
    label: 'Reliable',
    activeClass: 'bg-[#4CC38A]/15 text-[#4CC38A] border-[#4CC38A]/60',
    icon: ShieldCheck,
  },
  {
    value: 'suspicious',
    label: 'Suspicious',
    activeClass: 'bg-[#E05252]/15 text-[#E05252] border-[#E05252]/60',
    icon: ShieldAlert,
  },
  {
    value: 'uncertain',
    label: 'Uncertain',
    activeClass: 'bg-[#F0B45A]/15 text-[#F0B45A] border-[#F0B45A]/60',
    icon: HelpCircle,
  },
];

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  item,
  userState,
  onToggleReviewed,
  onSelectClassification,
  onChangeNote,
}) => {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(
    item.mediaData?.hotspots[0]?.id ?? null
  );
  const [imageError, setImageError] = useState(false);

  const activeHotspot =
    item.mediaData?.hotspots.find((h) => h.id === selectedHotspotId) ??
    item.mediaData?.hotspots[0];

  return (
    <div className="space-y-6">
      {/* Header Metadata Bar */}
      <div className="pb-5 border-b border-[#303B49] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#94A3B8]">
            <span className="font-mono text-[#E5B85C]">{item.source}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{item.timestamp}</span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#F1F5F9]">
            {item.title}
          </h2>
          <p className="text-sm text-[#B7C2D0]">{item.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onToggleReviewed}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 ${
            userState.reviewed
              ? 'bg-[#4CC38A]/15 text-[#4CC38A] border-[#4CC38A]/50 hover:bg-[#4CC38A]/20'
              : 'bg-[#E5B85C] text-[#0B0F14] border-[#E5B85C] hover:bg-[#d8ab4f]'
          }`}
        >
          <CheckCircle2 size={17} />
          <span>{userState.reviewed ? 'Reviewed' : 'Mark as Reviewed'}</span>
        </button>
      </div>

      {/* Investigator Summary */}
      <p className="text-[15px] text-[#B7C2D0] leading-relaxed">{item.summary}</p>

      {/* Section-Specific Forensic Renderer */}
      {item.mediaData && (
        <div className="space-y-5">
          <div className="rounded-2xl overflow-hidden border border-[#303B49] bg-[#111720]">
            <div className="px-4 py-3 border-b border-[#303B49] flex flex-wrap items-center justify-between gap-2 text-xs text-[#B7C2D0]">
              <span className="inline-flex items-center gap-2 font-medium text-[#F1F5F9]">
                <Video size={15} className="text-[#E5B85C]" />
                <span>{item.mediaData.mediaLabel}</span>
              </span>
              <span className="font-mono text-[#94A3B8] tabular-nums">
                {[item.mediaData.duration, item.mediaData.resolution, item.mediaData.fileFormat]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>

            <div className="relative bg-[#0B0F14] aspect-video w-full overflow-hidden">
              {!imageError ? (
                <img
                  src={item.mediaData.imageUrl}
                  alt={item.mediaData.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#111720] to-[#171F29]">
                  <Video size={32} className="text-[#E5B85C] mb-2" />
                  <p className="text-sm font-medium text-[#F1F5F9]">{item.title}</p>
                  <p className="text-xs text-[#94A3B8] mt-1">{item.mediaData.caption}</p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4">
                <p className="text-sm text-[#F1F5F9]">{item.mediaData.caption}</p>
              </div>
            </div>
          </div>

          {/* Interactive Forensic Inspection Points */}
          <div className="rounded-2xl border border-[#303B49] bg-[#111720] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-[#F1F5F9]">
                Forensic Inspection Points
              </h3>
              <span className="text-xs text-[#94A3B8]">
                Select a point to inspect closely
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {item.mediaData.hotspots.map((hs, index) => {
                const selected = activeHotspot?.id === hs.id;
                return (
                  <button
                    key={hs.id}
                    type="button"
                    onClick={() => setSelectedHotspotId(hs.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap ${
                      selected
                        ? 'bg-[#1C2632] text-[#F1F5F9] border-[#E5B85C]'
                        : 'bg-[#171F29] text-[#B7C2D0] border-[#303B49] hover:text-[#F1F5F9]'
                    }`}
                  >
                    {index + 1}. {hs.title}
                  </button>
                );
              })}
            </div>

            {activeHotspot && (
              <div className="p-4 rounded-xl bg-[#171F29] border border-[#303B49] space-y-1.5">
                <div className="text-xs font-mono text-[#E5B85C]">
                  {activeHotspot.timestampOrRegion}
                </div>
                <p className="text-sm font-semibold text-[#F1F5F9]">{activeHotspot.title}</p>
                <p className="text-sm text-[#B7C2D0] leading-relaxed">{activeHotspot.finding}</p>
              </div>
            )}
          </div>

          {/* Transcript if present */}
          {item.mediaData.transcript && item.mediaData.transcript.length > 0 && (
            <div className="rounded-2xl border border-[#303B49] bg-[#111720] p-5 space-y-3">
              <h3 className="text-base font-semibold text-[#F1F5F9]">Audio Transcript</h3>
              <div className="divide-y divide-[#303B49]">
                {item.mediaData.transcript.map((line) => (
                  <div key={line.time} className="py-3 first:pt-0 last:pb-0 flex gap-4">
                    <span className="font-mono text-xs text-[#E5B85C] tabular-nums shrink-0 pt-0.5">
                      {line.time}
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm text-[#F1F5F9] leading-relaxed">{line.text}</p>
                      {line.note && (
                        <p className="text-xs text-[#F0B45A] flex items-center gap-1.5">
                          <AlertTriangle size={13} className="shrink-0" />
                          <span>{line.note}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {item.chatData && (
        <div className="rounded-2xl border border-[#303B49] bg-[#111720] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#303B49] bg-[#171F29] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <MessageSquare size={17} className="text-[#E5B85C]" />
              <div>
                <p className="text-sm font-semibold text-[#F1F5F9]">
                  {item.chatData.channelTitle}
                </p>
                <p className="text-xs text-[#94A3B8]">
                  {item.chatData.platformName} · {item.chatData.participants}
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 bg-[#1C2632]/50 border-b border-[#303B49] text-xs text-[#B7C2D0]">
            {item.chatData.contextNote}
          </div>

          <div className="p-5 space-y-4">
            {item.chatData.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isIncoming ? 'items-start' : 'items-end'}`}
              >
                <div className="max-w-2xl w-full sm:w-auto rounded-2xl p-4 border border-[#303B49] bg-[#171F29]">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mb-2">
                    <span className="text-sm font-semibold text-[#F1F5F9]">{msg.sender}</span>
                    <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mb-2">{msg.handle}</p>
                  <p className="text-sm text-[#F1F5F9] leading-relaxed">{msg.text}</p>
                  {msg.flagNote && (
                    <div className="mt-3 pt-2.5 border-t border-[#303B49] flex items-start gap-2 text-xs text-[#F0B45A]">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>{msg.flagNote}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {item.witnessData && (
        <div className="space-y-4">
          {item.witnessData.statements.map((w) => (
            <div
              key={w.id}
              className="rounded-2xl border border-[#303B49] bg-[#111720] p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#303B49]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#171F29] border border-[#303B49] flex items-center justify-center text-[#E5B85C] shrink-0">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#F1F5F9]">{w.witnessName}</h3>
                    <p className="text-xs text-[#94A3B8]">{w.role}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
                  Recorded {w.recordedAt}
                </span>
              </div>

              <blockquote className="text-[15px] text-[#F1F5F9] leading-relaxed">
                {w.quote}
              </blockquote>

              <div className="pt-2 text-xs text-[#B7C2D0] flex items-start gap-2">
                <span className="font-semibold text-[#E5B85C] shrink-0">Context:</span>
                <span>{w.credibilityContext}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {item.reportData && (
        <div className="rounded-2xl border border-[#303B49] bg-[#111720] overflow-hidden">
          <div className="px-5 py-4 bg-[#171F29] border-b border-[#303B49] flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-[#E5B85C] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-mono text-[#E5B85C]">
                  {item.reportData.documentType} · {item.reportData.documentNumber}
                </p>
                <h3 className="text-lg font-semibold text-[#F1F5F9] mt-0.5">
                  {item.reportData.headline}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {item.reportData.issuingBody} · Issued {item.reportData.dateIssued}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            <p className="text-sm text-[#B7C2D0] leading-relaxed">
              {item.reportData.introText}
            </p>

            {item.reportData.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-[#303B49] bg-[#0B0F14]">
                <img
                  src={item.reportData.imageUrl}
                  alt={item.reportData.imageAlt ?? item.reportData.headline}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-80 object-cover"
                />
              </div>
            )}

            <div className="divide-y divide-[#303B49] rounded-xl border border-[#303B49] bg-[#171F29]">
              {item.reportData.fields.map((field) => {
                const valueColor =
                  field.highlight === 'alert'
                    ? 'text-[#E05252]'
                    : field.highlight === 'warning'
                    ? 'text-[#F0B45A]'
                    : field.highlight === 'verified'
                    ? 'text-[#4CC38A]'
                    : 'text-[#F1F5F9]';

                const statusLabel =
                  field.highlight === 'alert'
                    ? 'Flagged Anomaly'
                    : field.highlight === 'warning'
                    ? 'Needs Caution'
                    : field.highlight === 'verified'
                    ? 'Verified Record'
                    : null;

                return (
                  <div
                    key={field.label}
                    className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                  >
                    <div className="sm:w-2/5 text-xs font-medium text-[#94A3B8]">
                      {field.label}
                    </div>
                    <div className="sm:w-3/5 space-y-1">
                      <p className={`text-sm font-medium ${valueColor}`}>{field.value}</p>
                      {statusLabel && (
                        <p className="text-xs text-[#94A3B8]">{statusLabel}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {item.reportData.footnotes && (
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {item.reportData.footnotes}
              </p>
            )}
          </div>
        </div>
      )}

      {item.timelineData && (
        <div className="rounded-2xl border border-[#303B49] bg-[#111720] p-5">
          <div className="space-y-0 divide-y divide-[#303B49]">
            {item.timelineData.events.map((ev) => (
              <div key={ev.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4">
                <div className="sm:w-36 shrink-0 flex items-center sm:flex-col sm:items-start gap-2 sm:gap-0.5">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#E5B85C] tabular-nums">
                    <Clock size={13} />
                    <span>{ev.dateLabel}</span>
                  </span>
                  <span className="font-mono text-xs text-[#94A3B8] tabular-nums">{ev.time}</span>
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-sm font-semibold text-[#F1F5F9]">{ev.title}</h3>
                  <p className="text-sm text-[#B7C2D0] leading-relaxed">{ev.detail}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#94A3B8]">
                    <span>Source: {ev.source}</span>
                    {ev.discrepancyNote && (
                      <span className="text-[#E05252] font-medium inline-flex items-center gap-1">
                        <AlertTriangle size={12} />
                        <span>{ev.discrepancyNote}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Judge Assessment Controls: Classification & Personal Notes */}
      <div className="rounded-2xl border border-[#303B49] bg-[#171F29] p-5 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#F1F5F9]">
              Classify This Evidence
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Record how trustworthy this item appears before making your verdict.
            </p>
          </div>
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Evidence classification"
          >
            {CLASSIFICATION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = userState.classification === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onSelectClassification(opt.value)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap ${
                    isSelected
                      ? opt.activeClass
                      : 'bg-[#111720] text-[#B7C2D0] border-[#303B49] hover:text-[#F1F5F9] hover:bg-[#1C2632]'
                  }`}
                >
                  <Icon size={15} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[#303B49]">
          <label
            htmlFor={`note-${item.id}`}
            className="flex items-center gap-2 text-sm font-medium text-[#F1F5F9] mb-2"
          >
            <StickyNote size={15} className="text-[#E5B85C]" />
            <span>Personal Case Notes (Optional)</span>
          </label>
          <textarea
            id={`note-${item.id}`}
            rows={2}
            value={userState.note}
            onChange={(e) => onChangeNote(e.target.value)}
            placeholder="Jot down anomalies, timestamps, or questions to revisit on your Evidence Board..."
            className="w-full rounded-xl bg-[#111720] border border-[#303B49] px-3.5 py-2.5 text-sm text-[#F1F5F9] placeholder-[#94A3B8] focus:border-[#E5B85C] focus:outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
