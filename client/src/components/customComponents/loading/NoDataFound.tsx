import { LoaderCircle } from 'lucide-react';
import { memo } from 'react';

interface NoDataFoundProps {
  entityName: string;
  showDesc?: boolean;
}
export const NoDataFound = ({
  entityName,
  showDesc = true,
}: NoDataFoundProps) => {
  return (
    <div className='bg-shop-light-bg mt-0 flex min-h-50 w-full flex-col items-center justify-center space-y-4 rounded-md py-10 text-center'>
      <p className='text-2xl font-semibold text-gray-800'>
        No {entityName} found
      </p>
      {showDesc && (
        <p className='text-sm text-gray-500'>Please check back later.</p>
      )}
    </div>
  );
};

export default memo(NoDataFound);
