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
      <Icon className='h-5 min-h-5 w-5 min-w-5' />
      <div>
        <p className='font-semibold'>{title}</p>
        <p className='text-sm wrap-anywhere text-neutral-600'>{desc}</p>
      </div>
    </div>
  );
};
