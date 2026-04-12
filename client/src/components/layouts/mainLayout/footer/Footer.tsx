import Link from 'next/link';
import { Input } from '@/components/ui/formElements/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '../header/logo/Logo';
import { FooterInfoBlock } from './InfoBlock';
import { categoryService } from '@/services/category.service';
import { GetCategoryDto } from '@/generated/orval/types';
import { PUBLIC_URL } from '@/config/url.config';
import {
  FooterAboutLinks,
  FooterQuickLinks,
  FooterSocialLinks,
} from './config';
import QueryString from 'qs';
import { getTranslations } from 'next-intl/server';

export const revalidate = 300;

async function getCategories() {
  try {
    // TODO
    const categories = (
      (await categoryService.getAll({ limit: 7, skip: 0 })) || []
    )?.categories;
    return categories as GetCategoryDto[];
  } catch {
    return [];
  }
}

export default async function Footer() {
  const categories = await getCategories();
  const t = await getTranslations('Footer');
  const tLinks = await getTranslations('FooterLinks');

  return (
    <footer className='global-container bg-shop-bg w-full border-t'>
      <div>
        {/* ===== Top Contact Row ===== */}
        {/* <div className='container grid grid-cols-2 gap-8 py-6 md:grid-cols-4'>
          {FooterAboutLinks.map((i) => (
            <FooterInfoBlock
              key={i.title}
              title={i.title}
              desc={i.desc}
              Icon={i.Icon}
            />
          ))}
        </div>

        <hr className='border-gray-200' /> */}

        {/* ===== Main Footer ===== */}
        <div className='xs:grid-cols-2 container grid grid-cols-1 gap-10 py-6 md:grid-cols-4'>
          {/* Logo + Social */}
          <div>
            <button className='text-primary hover:text-primary/90 order-2 flex flex-none items-center space-x-2 md:order-1'>
              <div className='text-2xl'>
                <Logo />
              </div>
            </button>

            <p className='text-shop-muted-text-6 mt-4 max-w-xs text-sm'>
              {t('buy_sell_follow')}
            </p>

            <div className='mt-6 flex items-center space-x-4'>
              {FooterSocialLinks.map((soc) => (
                <div className='group' key={soc.title}>
                  <soc.Icon className='hoverEffect text-shop-primary group-hover:border-shop-primary h-8 w-8 cursor-pointer rounded-full border p-1 group-hover:scale-110' />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>{t('quick_links')}</h3>
            <ul className='text-shop-muted-text-6 space-y-2 text-sm'>
              {FooterQuickLinks.map((quickLink) => {
                return (
                  <li key={quickLink.title}>
                    <Link
                      className='hover:text-shop-light-primary'
                      href={quickLink.href}
                    >
                      {tLinks(quickLink.title as any)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>
              {t('popular_categories')}
            </h3>
            <ul className='text-shop-muted-text-6 space-y-2 text-sm'>
              {categories?.map((category) => {
                return (
                  <li key={category.id}>
                    <Link
                      href={PUBLIC_URL.shop(
                        QueryString.stringify(
                          { filter: { categoryId: [category.id] } },
                          { skipNulls: true }
                        )
                      )}
                    >
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>{t('newsletter')}</h3>
            <p className='text-shop-muted-text-6 mb-4 text-sm'>
              {t('subscribe_desc')}
            </p>
            <div className='flex flex-col space-y-4'>
              <Input placeholder={t('enter_email')} />
              <Button variant='default' size='lg' disabled>
                {t('subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <hr className='border-gray-200' />

      {/* Bottom */}
      <div className='text-shop-muted-text-6 py-6 text-center'>
        © 2025 <span className='font-semibold'>MYSTORE</span>. {t('all_rights')}
      </div>
    </footer>
  );
}
