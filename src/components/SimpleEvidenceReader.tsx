import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  MessageSquare,
  UserCheck,
  Video,
} from 'lucide-react';
import { EvidenceItem } from '../types/courtroom';

interface SimpleEvidenceReaderProps {
  item: EvidenceItem;
  isReviewed: boolean;
  onMarkReviewedAndBack: () => void;
  onBack: () => void;
}

export const SimpleEvidenceReader: React.FC<SimpleEvidenceReaderProps> = ({
  item,
  isReviewed,
  onMarkReviewedAndBack,
  onBack,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="rounded-2xl bg-[#171F29] border border-[#303B49] p-5 sm:p-7 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#303B49]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-xl bg-[#111720] border border-[#303B49] text-sm font-medium text-[#F1F5F9] hover:border-[#E5B85C] transition-colors whitespace-nowrap"
        >
          <ArrowLeft size={16} />
          <span>Back to Evidence Cards</span>
        </button>

        <span className="text-xs font-mono text-[#E5B85C]">{item.cardLabel}</span>
      </div>

      {/* Title & Plain Summary */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-semibold text-[#F1F5F9]">{item.title}</h2>
        <p className="text-sm text-[#94A3B8]">
          {item.source} · {item.timestamp}
        </p>
        <p className="text-base text-[#B7C2D0] leading-relaxed pt-1">{item.summary}</p>
      </div>

      {/* Media Evidence */}
      {item.mediaData && (
        <div className="space-y-5">
          <div className="rounded-2xl overflow-hidden border border-[#303B49] bg-[#111720]">
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
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <Video size={30} className="text-[#E5B85C] mb-2" />
                  <p className="text-sm font-medium text-[#F1F5F9]">{item.title}</p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4">
                <p className="text-sm text-[#F1F5F9]">{item.mediaData.caption}</p>
              </div>
            </div>
          </div>

          {item.mediaData.transcript && item.mediaData.transcript.length > 0 && (
            <div className="rounded-xl bg-[#111720] border border-[#303B49] p-4 space-y-3">
              <h3 className="text-sm font-semibold text-[#F1F5F9]">What Is Said in the Clip</h3>
              <div className="space-y-3">
                {item.mediaData.transcript.map((line) => (
                  <div key={line.time} className="space-y-1">
                    <p className="text-[15px] text-[#F1F5F9] leading-relaxed">
                      <span className="font-mono text-xs text-[#E5B85C] mr-2">{line.time}</span>
                      {line.text}
                    </p>
                    {line.note && (
                      <p className="text-sm text-[#F0B45A] flex items-start gap-1.5">
                        <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                        <span>{line.note}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plain-English Observations */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#F1F5F9]">Details to Notice</h3>
            <div className="space-y-2.5">
              {item.mediaData.hotspots.map((hs) => (
                <div
                  key={hs.id}
                  className="rounded-xl bg-[#111720] border border-[#303B49] p-4 space-y-1"
                >
                  <p className="text-sm font-semibold text-[#E5B85C]">{hs.title}</p>
                  <p className="text-sm sm:text-[15px] text-[#B7C2D0] leading-relaxed">
                    {hs.finding}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {item.chatData && (
        <div className="rounded-2xl border border-[#303B49] bg-[#111720] overflow-hidden">
          <div className="px-4 py-3 bg-[#1C2632] border-b border-[#303B49] flex items-center gap-2.5">
            <MessageSquare size={17} className="text-[#E5B85C] shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#F1F5F9] truncate">
                {item.chatData.channelTitle}
              </p>
              <p className="text-xs text-[#B7C2D0]">{item.chatData.platformName}</p>
            </div>
          </div>

          <div className="p-4 space-y-3.5">
            {item.chatData.messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-xl p-4 border border-[#303B49] bg-[#171F29] space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#F1F5F9]">{msg.sender}</span>
                  <span className="text-xs font-mono text-[#94A3B8]">{msg.timestamp}</span>
                </div>
                <p className="text-xs text-[#94A3B8]">{msg.handle}</p>
                <p className="text-[15px] text-[#F1F5F9] leading-relaxed pt-0.5">{msg.text}</p>
                {msg.flagNote && (
                  <p className="pt-2 border-t border-[#303B49] text-sm text-[#F0B45A] flex items-start gap-2">
                    <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                    <span>{msg.flagNote}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Witness Statements */}
      {item.witnessData && (
        <div className="space-y-3.5">
          {item.witnessData.statements.map((w) => (
            <div
              key={w.id}
              className="rounded-2xl border border-[#303B49] bg-[#111720] p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#171F29] border border-[#303B49] flex items-center justify-center text-[#E5B85C] shrink-0">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#F1F5F9]">{w.witnessName}</h3>
                  <p className="text-xs text-[#94A3B8]">{w.role}</p>
                </div>
              </div>
              <p className="text-[15px] text-[#F1F5F9] leading-relaxed">{w.quote}</p>
              <p className="text-sm text-[#B7C2D0] pt-2 border-t border-[#303B49]">
                <span className="font-semibold text-[#E5B85C]">Note: </span>
                {w.credibilityContext}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Simple Document / Log Report */}
      {item.reportData && (
        <div className="rounded-2xl border border-[#303B49] bg-[#111720] overflow-hidden">
          <div className="px-5 py-4 bg-[#1C2632] border-b border-[#303B49] flex items-start gap-3">
            <FileText size={19} className="text-[#E5B85C] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-[#F1F5F9]">
                {item.reportData.headline}
              </h3>
              <p className="text-xs text-[#B7C2D0] mt-0.5">{item.reportData.issuingBody}</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm sm:text-[15px] text-[#B7C2D0]">{item.reportData.introText}</p>

            {item.reportData.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-[#303B49] bg-[#0B0F14]">
                <img
                  src={item.reportData.imageUrl}
                  alt={item.reportData.imageAlt ?? item.reportData.headline}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-72 object-cover"
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

                return (
                  <div key={field.label} className="p-4 space-y-1">
                    <p className="text-xs font-medium text-[#94A3B8]">{field.label}</p>
                    <p className={`text-[15px] font-medium leading-relaxed ${valueColor}`}>
                      {field.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-[#B7C2D0]">
          {isReviewed ? 'You have already checked this clue.' : 'Finished reading this clue?'}
        </p>
        <button
          type="button"
          onClick={onMarkReviewedAndBack}
          className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-xl bg-[#4CC38A] text-[#0B0F14] text-sm sm:text-base font-semibold hover:bg-[#3fb17b] transition-colors whitespace-nowrap"
        >
          <CheckCircle2 size={18} />
          <span>{isReviewed ? 'Back to Evidence Cards' : 'Mark Checked & Continue'}</span>
        </button>
      </div>
    </div>
  );
};
