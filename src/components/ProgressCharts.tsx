import React from 'react';
import { BarChart3 } from 'lucide-react';

interface CategoryCompletionDatum {
  categoryId: string;
  name: string;
  shortName: string;
  accentColor: string;
  completed: number;
  total: number;
  percent: number;
}

export const CategoryCompletionChart: React.FC<{
  data: CategoryCompletionDatum[];
}> = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.map((row) => (
        <div key={row.categoryId} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[#F1F5F9]">{row.name}</span>
            <span className="font-mono text-xs text-[#B7C2D0] tabular-nums">
              {row.completed}/{row.total} cases ({row.percent}%)
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#111720] border border-[#303B49] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(row.completed > 0 ? 6 : 0, row.percent)}%`,
                backgroundColor: row.accentColor,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

interface ScorePoint {
  attempt: number;
  label: string;
  score: number;
  isCorrect: boolean;
  date: string;
}

export const PerformanceHistoryChart: React.FC<{
  history: ScorePoint[];
}> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="h-52 rounded-xl border border-dashed border-[#303B49] bg-[#111720] flex flex-col items-center justify-center p-6 text-center">
        <BarChart3 size={28} className="text-[#94A3B8] mb-2" />
        <p className="text-sm font-medium text-[#F1F5F9]">No completed rulings yet</p>
        <p className="text-xs text-[#94A3B8] mt-1 max-w-xs">
          Complete your first investigation to track your courtroom accuracy and score trend here.
        </p>
      </div>
    );
  }

  const width = 560;
  const height = 210;
  const padLeft = 40;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 34;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const points = history.map((pt, idx) => {
    const x =
      history.length === 1
        ? padLeft + plotW / 2
        : padLeft + (idx / (history.length - 1)) * plotW;
    const y = padTop + plotH - (pt.score / 100) * plotH;
    return { ...pt, x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-52 min-w-[340px]"
        role="img"
        aria-label="Investigation scores over time"
      >
        {/* Horizontal gridlines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = padTop + plotH - (val / 100) * plotH;
          return (
            <g key={val}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#303B49"
                strokeWidth="1"
                strokeDasharray={val === 0 ? undefined : '3 3'}
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="#94A3B8"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Trend line */}
        {points.length > 1 && (
          <polyline
            fill="none"
            stroke="#E5B85C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />
        )}

        {/* Data points */}
        {points.map((p) => (
          <g key={`${p.attempt}-${p.date}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r="5.5"
              fill={p.isCorrect ? '#4CC38A' : '#E05252'}
              stroke="#0B0F14"
              strokeWidth="2"
            />
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fill="#F1F5F9"
              fontSize="11"
              fontWeight="600"
              fontFamily="IBM Plex Mono, monospace"
            >
              {p.score}
            </text>
            <text
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="11"
              fontFamily="IBM Plex Mono, monospace"
            >
              #{p.attempt}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex items-center gap-5 text-xs text-[#94A3B8]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4CC38A]" aria-hidden="true" />
          <span>Correct Verdict</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E05252]" aria-hidden="true" />
          <span>Incorrect / Cautious Verdict</span>
        </span>
      </div>
    </div>
  );
};
