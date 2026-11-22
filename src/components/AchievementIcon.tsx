import React from 'react';
import {
  Award,
  Eye,
  FileSearch,
  FolderCheck,
  Gavel,
  Scale,
  Search,
  ShieldCheck,
} from 'lucide-react';

interface AchievementIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

export const AchievementIcon: React.FC<AchievementIconProps> = ({
  iconName,
  size = 20,
  className = '',
}) => {
  switch (iconName) {
    case 'Gavel':
      return <Gavel size={size} className={className} />;
    case 'Search':
      return <Search size={size} className={className} />;
    case 'Eye':
      return <Eye size={size} className={className} />;
    case 'FolderCheck':
      return <FolderCheck size={size} className={className} />;
    case 'Award':
      return <Award size={size} className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck size={size} className={className} />;
    case 'FileSearch':
      return <FileSearch size={size} className={className} />;
    case 'Scale':
    default:
      return <Scale size={size} className={className} />;
  }
};
