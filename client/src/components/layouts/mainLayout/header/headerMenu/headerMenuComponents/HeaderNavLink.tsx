import Link from 'next/link';
import { HeaderNavLinkUnderline } from './HeaderNavLinkUnderline';
import { memo } from 'react';

const HeaderNavLinkComponent = ({
  href,
  isActive,
  label,
  children,
  linkClass = '',
}: {
  href: string;
  isActive: boolean;
  label: string;
  children?: React.ReactNode;
  linkClass?: string;
}) => {
  const inactiveClass =
    'hover:text-shop-light-primary hoverEffect group relative';
  const activeClass = `text-shop-light-primary ${inactiveClass}`;

  return (
    <Link
      href={href}
      className={`${linkClass} ${isActive ? activeClass : inactiveClass}`}
    >
      {children || label}
      <HeaderNavLinkUnderline isActive={isActive} />
    </Link>
  );
};

export const HeaderNavLink = memo(HeaderNavLinkComponent);
