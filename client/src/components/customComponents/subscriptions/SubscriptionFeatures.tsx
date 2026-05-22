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
          className={`${isPopular ? 'text-white' : 'text-shop-primary-text'} flex items-center text-sm`}
        >
          <CheckCircle className={`${isPopular ? 'text-white' : 'text-shop-light-primary'} mr-2 h-4 w-4`} />
          {feature}
        </li>
      ))}
    </ul>
  );
};
export default memo(SubscriptionFeatures);
