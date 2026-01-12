import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { BrandEdit } from '../../[storeId]/brands/[brandId]/BrandEdit';

export const metadata: Metadata = {
  title: 'Edit Color',
  ...NO_INDEX_PAGE,
};
export default function EditColorPage() {
  return <BrandEdit />;
}
