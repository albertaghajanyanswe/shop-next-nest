import { memo } from 'react';
import { CheckCircle } from 'lucide-react';

interface ISubscriptionFeaturesProps {
  features: string[];
  isPopular?: boolean;
}
const SubscriptionFeatures = ({
  features,
  isPopular,
}: ISubscriptionFeaturesProps) => {
  return (
    <ul className='space-y-2'>
      {features.map((feature) => (
        <li
          key={feature}
          className={`flex items-center text-sm ${isPopular ? 'text-neutral-900' : 'text-shop-primary-text'}`}
        >
          <CheckCircle
            className={`mr-2 h-4 w-4 ${isPopular ? 'text-neutral-900' : 'text-shop-light-primary'}`}
          />
          {feature}
        </li>
      ))}
    </ul>
  );
};
export default memo(SubscriptionFeatures);
