import { memo } from 'react';
import { useTranslations } from 'next-intl';

interface NoDataFoundProps {
  entityName: string;
  showDesc?: boolean;
}
export const NoDataFound = ({
  entityName,
  showDesc = true,
}: NoDataFoundProps) => {
  const t = useTranslations('Loading');
  return (
    <div className='bg-shop-light-bg mt-0 flex min-h-50 w-full flex-col items-center justify-center space-y-4 rounded-md py-10 text-center'>
      <p className='text-shop-primary-text text-2xl font-semibold'>
        {t('no_entity_found', { entity: entityName })}
      </p>
      {showDesc && (
        <p className='text-shop-muted-text-5 text-sm'>
          {t('simple_check_later')}
        </p>
      )}
    </div>
  );
};

export default memo(NoDataFound);
