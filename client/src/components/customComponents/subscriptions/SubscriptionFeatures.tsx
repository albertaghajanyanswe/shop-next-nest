import { memo } from 'react';
import { CheckCircle } from 'lucide-react';

interface ISubscriptionFeaturesProps {
  features: string[];
}
const SubscriptionFeatures = ({ features }: ISubscriptionFeaturesProps) => {
  return (
    <ul className='space-y-2'>
      {features.map((feature) => (
        <li
          key={feature}
          className='flex items-center text-sm text-neutral-900'
        >
          <CheckCircle className='text-shop-light-green mr-2 h-4 w-4' />
          {feature}
        </li>
      ))}
    </ul>
  );
};
export default memo(SubscriptionFeatures);
