import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { Separator } from '@/components/ui/Separator';
import { SITE_NAME } from '@/utils/constants';
import HowItWorksSection from './HowItWorksSection';
import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import InfoBlock from './InfoBlock';
import { useLocale } from 'next-intl';

export default function HowItWorksPage() {
  const locale = useLocale();

  if (locale === 'ru') {
    return (
      <>
        <Breadcrumbs
          items={[
            { title: 'Главная', href: '/' },
            { title: 'Как это работает' },
          ]}
        />
        <PageHeader
          title='Как это работает'
          description='Пошаговые руководства, которые помогут вам с легкостью создавать магазины и добавлять товары.'
          classNames='mt-4'
        />
        <div className='space-y-12'>
          <InfoBlock />
          <HowItWorksSection
            title='Как зарегистрироваться в качестве продавца и создать привязанный аккаунт Stripe. Это необходимо, если вы хотите продавать товары, так как доходы от продаж будут перечисляться на этот счет после подтверждения.'
            steps={[
              'Войдите на платформу',
              'Нажмите на аватар пользователя в шапке',
              'Нажмите "Настройки аккаунта" в боковом меню',
              'Нажмите кнопку "Регистрация в Stripe как продавец"',
              'Заполните необходимую информацию на странице Stripe и отправьте',
            ]}
            imageSrc='/howItWorks/seller.png'
          />
          <HowItWorksSection
            title='Как войти в панель управления Stripe в качестве продавца'
            steps={[
              'Войдите на платформу',
              'Нажмите на аватар пользователя в шапке',
              'Нажмите "Настройки аккаунта" в боковом меню',
              'Нажмите кнопку "Войти в панель управления Stripe"',
            ]}
            imageSrc='/howItWorks/seller.png'
          />
          <HowItWorksSection
            title='Как создать новый магазин'
            steps={[
              'Войдите на платформу',
              'Нажмите "Мои магазины" в шапке',
              'В правой части шапки откройте выпадающее меню магазина',
              'Выберите "Создать новый магазин"',
              'После создания вы можете редактировать детали магазина в разделе "Настройки магазина" в боковом меню',
            ]}
            videoSrc='/howItWorks/product.webm'
          />
          <HowItWorksSection
            title='Как создать новый товар'
            steps={[
              'Войдите на платформу',
              'Нажмите "Мои магазины" в шапке',
              'Откройте выпадающее меню магазина в правой части шапки',
              'Выберите магазин, в который хотите добавить товар',
              'В левом боковом меню перейдите в раздел "Товары"',
              'Нажмите "Сохранить/Создать" чтобы добавить новый товар',
            ]}
            videoSrc='/howItWorks/store.webm'
          />
          <HowItWorksSection
            title='Как купить товар'
            steps={[
              'Войдите на платформу',
              'Нажмите "Магазин" в шапке',
              'Добавьте товары в корзину',
              'Нажмите кнопку "Оформление заказа" и завершите покупку',
            ]}
            videoSrc='/howItWorks/buy.webm'
          />
          <HowItWorksSection
            title='Как посмотреть свои покупки'
            steps={[
              'Войдите на платформу',
              'Нажмите на иконку аватара в шапке',
              'Выберите "Мои заказы" в боковом меню',
              'Посмотрите историю ваших заказов',
              'Нажмите на заказ, чтобы увидеть детали',
              'Вы можете подтвердить получение покупки, нажав кнопку подтверждения в модальном окне.',
            ]}
            videoSrc='/howItWorks/orders.webm'
          />
          <HowItWorksSection
            title='Как посмотреть свои продажи в качестве продавца'
            steps={[
              'Войдите на платформу',
              'Нажмите на иконку аватара в шапке',
              'Выберите "Мои продажи" в боковом меню',
              'Посмотрите историю ваших продаж',
              'Нажмите на продажу, чтобы увидеть детали',
            ]}
            videoSrc='/howItWorks/sales.webm'
          />
        </div>
      </>
    );
  }

  // fallback EN
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
          title='How to register as a seller and create a connected Stripe account. This is a must if you want to sell products, because sales revenue will be transferred to this account after confirmation.'
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
