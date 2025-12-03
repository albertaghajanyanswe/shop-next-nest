import { ComponentType } from 'react';

interface FooterInfoBlockProps {
  title: string;
  desc: string;
  Icon: ComponentType<{ className?: string }>;
}
export const FooterInfoBlock = ({
  title,
  desc,
  Icon,
}: FooterInfoBlockProps) => {
  return (
    <div className='flex items-start space-x-3'>
      <Icon className='min-h-5 h-5 w-5 min-w-5' />
      <div>
        <p className='font-semibold'>{title}</p>
        <p className='text-sm text-neutral-600 wrap-anywhere'>{desc}</p>
      </div>
    </div>
  );
};
