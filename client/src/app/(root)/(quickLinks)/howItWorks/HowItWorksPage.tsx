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

        <HowItWorksSection
          title='How to register as a seller and create a connected Stripe account. This is a must if you want to sell products.'
          steps={[
            'Log in to the platform',
            'Click on User Avatar in the header',
            'Click on Account Settings from the sidebar menu',
            'Click on Register on Stripe as a seller button',
            'Fill in the required information on the Stripe page and submit',
          ]}
          imageSrc='/howItWorks/seller.png'
        />

        <HowItWorksSection
          title='How to login Stripe dashboard as a seller'
          steps={[
            'Log in to the platform',
            'Click on User Avatar in the header',
            'Click on Account Settings from the sidebar menu',
            'Click on Login to Stripe Dashboard button',
          ]}
          imageSrc='/howItWorks/seller.png'
        />
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

        <HowItWorksSection
          title='How to buy product'
          steps={[
            'Log in to the platform',
            'Click on Shop in the header',
            'Add products to your cart',
            'Click on Checkout button and complete your purchase',
          ]}
          videoSrc='/howItWorks/buy.webm'
        />

        <HowItWorksSection
          title='How to see your purchases'
          steps={[
            'Log in to the platform',
            'Click on Avatar icon in the header',
            'Select My orders from the sidebar menu',
            'View your orders history',
            'Click on an order to see details',
            'You can confirm receipt of your purchase by clicking Confirm button from details modal if you are the buyer or the admin of the store from which the product was purchased.',
          ]}
          videoSrc='/howItWorks/orders.webm'
        />

        <HowItWorksSection
          title='How to see your sales products as a seller'
          steps={[
            'Log in to the platform',
            'Click on Avatar icon in the header',
            'Select My sales from the sidebar menu',
            'View your sales history',
            'Click on a sale to see details',
            'You can confirm receipt of your purchase by clicking Confirm button from details modal if you are the buyer or the admin of the store from which the product was purchased.',
          ]}
          videoSrc='/howItWorks/sales.webm'
        />
      </div>
    </>
  );
}
