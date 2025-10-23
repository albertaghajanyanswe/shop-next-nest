import { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/utils/constants';
import { CreateColor } from './CreateColor';

export const metadata: Metadata = {
  title: 'Create Color',
  ...NO_INDEX_PAGE,
};

export default function CreateColorPage() {
  return <CreateColor />;
}
