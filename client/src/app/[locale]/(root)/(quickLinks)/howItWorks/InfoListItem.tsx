import { CheckCircle } from 'lucide-react';
import { memo } from 'react';

function InfoListItem({ text }: { text: string }) {
  return (
    <li className='text-shop-primary-text flex flex-row items-center justify-start gap-4 font-medium'>
      <CheckCircle className='h-4 w-4 text-emerald-200' />
      {text}
    </li>
  );
}

export default memo(InfoListItem);
