import React from 'react';
import {
  Banknote,
  Fingerprint,
  GraduationCap,
  HeartHandshake,
  Newspaper,
  Sparkles,
} from 'lucide-react';
import { CategoryId } from '../types/courtroom';

interface CategoryIconProps {
  categoryId: CategoryId;
  size?: number;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryId,
  size = 20,
  className = '',
}) => {
  switch (categoryId) {
    case 'campus':
      return <GraduationCap size={size} className={className} />;
    case 'financial':
      return <Banknote size={size} className={className} />;
    case 'celebrity':
      return <Sparkles size={size} className={className} />;
    case 'media':
      return <Newspaper size={size} className={className} />;
    case 'identity':
      return <Fingerprint size={size} className={className} />;
    case 'personal':
      return <HeartHandshake size={size} className={className} />;
  }
};
