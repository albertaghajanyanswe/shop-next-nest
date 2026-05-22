'use client';

import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { Separator } from '@/components/ui/Separator';
import { SITE_NAME } from '@/utils/constants';
import HowItWorksSection from './HowItWorksSection';
import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import InfoBlock from './InfoBlock';
import { useLocale, useTranslations } from 'next-intl';

export default function HowItWorksPage() {
  const locale = useLocale();
  const t = useTranslations('HowItWorks');
  const headerT = useTranslations('HeaderMenu');

  if (locale === 'ru') {
    return (
      <>
        <Breadcrumbs
          items={[
            { title: headerT('Home'), href: '/' },
            { title: t('breadcrumb_title') },
          ]}
        />
        <PageHeader
          title={t('page_title')}
          description={t('page_description')}
          classNames='mt-4'
        />
        <div className='space-y-12'>
          <InfoBlock />
          <HowItWorksSection
            title={t('section_1_title')}
            steps={[
              t('section_1_step_1'),
              t('section_1_step_2'),
              t('section_1_step_3'),
              t('section_1_step_4'),
              t('section_1_step_5'),
            ]}
            imageSrc='/howItWorks/seller.png'
          />
          <HowItWorksSection
            title={t('section_2_title')}
            steps={[
              t('section_2_step_1'),
              t('section_2_step_2'),
              t('section_2_step_3'),
              t('section_2_step_4'),
            ]}
            imageSrc='/howItWorks/seller.png'
          />
          <HowItWorksSection
            title={t('section_3_title')}
            steps={[
              t('section_3_step_1'),
              t('section_3_step_2'),
              t('section_3_step_3'),
              t('section_3_step_4'),
              t('section_3_step_5'),
            ]}
            videoSrc='/howItWorks/product.webm'
          />
          <HowItWorksSection
            title={t('section_4_title')}
            steps={[
              t('section_4_step_1'),
              t('section_4_step_2'),
              t('section_4_step_3'),
              t('section_4_step_4'),
              t('section_4_step_5'),
              t('section_4_step_6'),
            ]}
            videoSrc='/howItWorks/store.webm'
          />
          <HowItWorksSection
            title={t('section_5_title')}
            steps={[
              t('section_5_step_1'),
              t('section_5_step_2'),
              t('section_5_step_3'),
              t('section_5_step_4'),
            ]}
            videoSrc='/howItWorks/buy.webm'
          />
          <HowItWorksSection
            title={t('section_6_title')}
            steps={[
              t('section_6_step_1'),
              t('section_6_step_2'),
              t('section_6_step_3'),
              t('section_6_step_4'),
              t('section_6_step_5'),
              t('section_6_step_6'),
            ]}
            videoSrc='/howItWorks/orders.webm'
          />
          <HowItWorksSection
            title={t('section_7_title')}
            steps={[
              t('section_7_step_1'),
              t('section_7_step_2'),
              t('section_7_step_3'),
              t('section_7_step_4'),
              t('section_7_step_5'),
              t('section_7_step_6'),
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
        items={[
          { title: headerT('Home'), href: '/' },
          { title: t('breadcrumb_title') },
        ]}
      />

      <PageHeader
        title={t('page_title')}
        description={t('page_description')}
        classNames='mt-4'
      />

      <div className='space-y-12'>
        <InfoBlock />

        <HowItWorksSection
          title={t('section_1_title')}
          steps={[
            t('section_1_step_1'),
            t('section_1_step_2'),
            t('section_1_step_3'),
            t('section_1_step_4'),
            t('section_1_step_5'),
          ]}
          imageSrc='/howItWorks/seller.png'
        />

        <HowItWorksSection
          title={t('section_2_title')}
          steps={[
            t('section_2_step_1'),
            t('section_2_step_2'),
            t('section_2_step_3'),
            t('section_2_step_4'),
          ]}
          imageSrc='/howItWorks/seller.png'
        />
        <HowItWorksSection
          title={t('section_3_title')}
          steps={[
            t('section_3_step_1'),
            t('section_3_step_2'),
            t('section_3_step_3'),
            t('section_3_step_4'),
            t('section_3_step_5'),
          ]}
          videoSrc='/howItWorks/product.webm'
        />

        <HowItWorksSection
          title={t('section_4_title')}
          steps={[
            t('section_4_step_1'),
            t('section_4_step_2'),
            t('section_4_step_3'),
            t('section_4_step_4'),
            t('section_4_step_5'),
            t('section_4_step_6'),
          ]}
          videoSrc='/howItWorks/store.webm'
        />

        <HowItWorksSection
          title={t('section_5_title')}
          steps={[
            t('section_5_step_1'),
            t('section_5_step_2'),
            t('section_5_step_3'),
            t('section_5_step_4'),
          ]}
          videoSrc='/howItWorks/buy.webm'
        />

        <HowItWorksSection
          title={t('section_6_title')}
          steps={[
            t('section_6_step_1'),
            t('section_6_step_2'),
            t('section_6_step_3'),
            t('section_6_step_4'),
            t('section_6_step_5'),
            t('section_6_step_6'),
          ]}
          videoSrc='/howItWorks/orders.webm'
        />

        <HowItWorksSection
          title={t('section_7_title')}
          steps={[
            t('section_7_step_1'),
            t('section_7_step_2'),
            t('section_7_step_3'),
            t('section_7_step_4'),
            t('section_7_step_5'),
            t('section_7_step_6'),
          ]}
          videoSrc='/howItWorks/sales.webm'
        />
      </div>
    </>
  );
}
