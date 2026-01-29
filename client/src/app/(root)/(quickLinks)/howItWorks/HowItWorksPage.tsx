import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { Separator } from '@/components/ui/Separator';
import { SITE_NAME } from '@/utils/constants';
import HowItWorksSection from './HowItWorksSection';
import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import InfoBlock from './InfoBlock';

export default function HowItWorksPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'How It Works' }]}
      />

      <PageHeader
        title='How It Works'
        description='Step-by-step guides to help you create stores and add products with ease.'
        classNames='mt-4'
      />

      <div className='space-y-12'>
        <InfoBlock />

        {/* SECTION 1 */}
        <HowItWorksSection
          title='How to create a new store'
          steps={[
            'Log in to the platform',
            'Click on MyStores in the header',
            'In the right side of the header, open the store dropdown menu',
            'Select Create new store',
            'After creation, you can edit store details in "Store settings" from the sidebar',
          ]}
          videoSrc='/howItWorks/product.webm'
        />

        {/* SECTION 2 */}
        <HowItWorksSection
          title='How to create a new product'
          steps={[
            'Log in to the platform',
            'Click on MyStores in the header',
            'Open the store dropdown menu on the right side of the header',
            'Select the store where you want to add a product',
            'From the left sidebar, go to Products',
            'Click Create to add a new product',
          ]}
          videoSrc='/howItWorks/store.webm'
        />
      </div>
    </>
  );
}
