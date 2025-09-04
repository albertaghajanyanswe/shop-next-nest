import { Metadata } from 'next';
import { ColorEdit } from './ColorEdit';
import { NO_INDEX_PAGE } from '@/meta/constants';

export const metadata: Metadata = {
  title: 'Edit Color',
  ...NO_INDEX_PAGE,
};
export default function EditColorPage() {
  return <ColorEdit />;
}
