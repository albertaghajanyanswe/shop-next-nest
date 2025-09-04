import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/meta/constants';
import { BrandEdit } from './BrandEdit';

export const metadata: Metadata = {
  title: 'Edit Color',
  ...NO_INDEX_PAGE,
};
export default function EditColorPage() {
  return <BrandEdit />;
}
