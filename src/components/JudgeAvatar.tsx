import React, { useEffect, useState } from 'react';
import { Compass, Eye, Gavel, Scale, Search, Shield } from 'lucide-react';
import { AvatarId } from '../types/courtroom';

export const AVATAR_OPTIONS: {
  id: AvatarId;
  label: string;
  accent: string;
  bg: string;
}[] = [
  { id: 'scales', label: 'Balance Scales', accent: '#E5B85C', bg: '#262118' },
  { id: 'gavel', label: 'Court Gavel', accent: '#E05252', bg: '#27191C' },
  { id: 'shield', label: 'Cyber Shield', accent: '#4CC38A', bg: '#162620' },
  { id: 'lens', label: 'Forensic Lens', accent: '#60A5FA', bg: '#16212E' },
  { id: 'owl', label: 'Night Observer', accent: '#A78BFA', bg: '#211B2E' },
  { id: 'compass', label: 'Truth Compass', accent: '#F0B45A', bg: '#272017' },
];

interface JudgeAvatarProps {
  avatar: AvatarId;
  photoDataUrl?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const JudgeAvatar: React.FC<JudgeAvatarProps> = ({
  avatar,
  photoDataUrl,
  alt = 'Judge profile photo',
  size = 'md',
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [photoDataUrl]);

  const option = AVATAR_OPTIONS.find((o) => o.id === avatar) ?? AVATAR_OPTIONS[0];
  const dims =
    size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-16 h-16' : 'w-11 h-11';
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 28 : 20;

  if (photoDataUrl && !imgFailed) {
    return (
      <div
        className={`${dims} rounded-full overflow-hidden border border-[#303B49] bg-[#111720] shrink-0 ${className}`}
      >
        <img
          src={photoDataUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const renderIcon = () => {
    const props = { size: iconSize, color: option.accent, strokeWidth: 1.8 };
    switch (option.id) {
      case 'gavel':
        return <Gavel {...props} />;
      case 'shield':
        return <Shield {...props} />;
      case 'lens':
        return <Search {...props} />;
      case 'owl':
        return <Eye {...props} />;
      case 'compass':
        return <Compass {...props} />;
      case 'scales':
      default:
        return <Scale {...props} />;
    }
  };

  return (
    <div
      className={`${dims} rounded-full border border-[#303B49] flex items-center justify-center shrink-0 ${className}`}
      style={{ backgroundColor: option.bg }}
      aria-hidden="true"
    >
      {renderIcon()}
    </div>
  );
};
