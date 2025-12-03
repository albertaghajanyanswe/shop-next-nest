import { Button } from '@/components/ui/Button';
import { GetUserDto } from '@/generated/orval/types';
import { HeartIcon } from 'lucide-react';
import { ComponentType, memo } from 'react';

interface HeaderNavLinkBtnProps {
  onClick: () => void;
  badge?: string | number;
  isActive: boolean;
  Icon: ComponentType<{ className?: string }>;
}
const HeaderNavLinkBtnComponent = ({
  onClick,
  isActive,
  Icon,
  badge = 0,
}: HeaderNavLinkBtnProps) => {
  return (
    <Button
      variant='outline'
      className={`icon-btn hover:text-shop-light-green hoverEffect group relative flex items-center whitespace-nowrap ${
        isActive ? 'bg-primary-50 border-primary-300' : ''
      }`}
      onClick={onClick}
    >
      <Icon className='text-shop-light-green' />
      <span className='bg-shop-light-green absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-xs font-semibold text-white'>
        {badge}
      </span>
    </Button>
  );
};

export const HeaderNavLinkBtn = memo(HeaderNavLinkBtnComponent);
HeaderNavLinkBtn.displayName = 'HeaderNavLinkBtn';
