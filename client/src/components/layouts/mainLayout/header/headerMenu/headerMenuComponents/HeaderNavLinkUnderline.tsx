import { memo } from 'react';

interface HeaderLinkUnderlineProps {
  isActive: boolean;
}
export const HeaderNavLinkUnderlineComponent = ({
  isActive,
}: HeaderLinkUnderlineProps) => {
  const spanLeft =
    'absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-shop-light-primary group-hover:w-1/2 hoverEffect group-hover:left-0';
  const spanRight =
    'absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-shop-light-primary group-hover:w-1/2 hoverEffect group-hover:right-0';

  return (
    <>
      <span className={`${spanLeft} ${isActive && 'w-1/2'}`}></span>
      <span className={`${spanRight} ${isActive && 'w-1/2'}`}></span>
    </>
  );
};

export const HeaderNavLinkUnderline = memo(HeaderNavLinkUnderlineComponent);
