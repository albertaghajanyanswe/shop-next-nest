import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { CreateBrand } from './CreateBrand';

export const metadata: Metadata = {
  title: 'Create Brand',
  ...NO_INDEX_PAGE,
};

export default function CreateColorPage() {
  return <CreateBrand />;
}
