import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1.5"
          y="1.5"
          width="29"
          height="29"
          rx="7"
          fill="#171F29"
          stroke="#303B49"
          strokeWidth="1.5"
        />
        <path
          d="M16 7V24"
          stroke="#E5B85C"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M9 11.5H23"
          stroke="#F1F5F9"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M10.5 11.5L7.5 17.5H13.5L10.5 11.5Z"
          stroke="#E5B85C"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M21.5 11.5L18.5 17.5H24.5L21.5 11.5Z"
          stroke="#E05252"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 24H19.5"
          stroke="#E5B85C"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span className="font-display text-[15px] sm:text-lg font-semibold tracking-tight leading-none text-[#F1F5F9] whitespace-nowrap">
          Deepfake Courtroom
        </span>
      )}
    </span>
  );
};
