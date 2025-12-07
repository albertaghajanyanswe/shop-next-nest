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

async function getCategories() {
  // TODO
  const categories = (
    (await categoryService.getAll({ limit: 7, skip: 0 })) || []
  )?.categories;
  return categories as GetCategoryDto[];
}

export default async function Footer() {
  const categories = await getCategories();

  return (
    <footer className='global-container bg-shop-light-bg w-full border-t'>
      <div>
        {/* ===== Top Contact Row ===== */}
        <div className='container grid grid-cols-2 gap-8 py-6 md:grid-cols-4'>
          {FooterAboutLinks.map((i) => (
            <FooterInfoBlock
              key={i.title}
              title={i.title}
              desc={i.desc}
              Icon={i.Icon}
            />
          ))}
        </div>

        <hr className='border-gray-200' />

        {/* ===== Main Footer ===== */}
        <div className='xs:grid-cols-2 container grid grid-cols-1 gap-10 py-6 md:grid-cols-4'>
          {/* Logo + Social */}
          <div>
            <button className='text-primary hover:text-primary/90 order-2 flex flex-none items-center space-x-2 md:order-1'>
              <div className='text-2xl'>
                <Logo />
              </div>
            </button>

            <p className='mt-4 max-w-xs text-sm text-neutral-600'>
              Buy, Sell, and Follow your Favorites Products
            </p>

            <div className='mt-6 flex items-center space-x-4'>
              {FooterSocialLinks.map((soc) => (
                <div className='group' key={soc.title}>
                  <soc.Icon className='hoverEffect text-shop-dark-green group-hover:border-shop-dark-green h-8 w-8 cursor-pointer rounded-full border p-1 group-hover:scale-110' />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Quick Links</h3>
            <ul className='space-y-2 text-sm text-neutral-600'>
              {FooterQuickLinks.map((quickLink) => {
                return (
                  <li key={quickLink.title}>
                    <Link
                      className='hover:text-shop-light-green'
                      href={quickLink.href}
                    >
                      {quickLink.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Popular Categories</h3>
            <ul className='space-y-2 text-sm text-neutral-600'>
              {categories?.map((category) => {
                return (
                  <li key={category.id}>
                    <Link
                      className='hover:text-shop-light-green'
                      href={PUBLIC_URL.category(category.id)}
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
            <h3 className='mb-4 text-lg font-semibold'>Newsletter</h3>
            <p className='mb-4 text-sm text-neutral-600'>
              Subscribe to our newsletter to receive updates and exclusive
              offers.
            </p>
            <div className='flex flex-col space-y-4'>
              <Input placeholder='Enter your email' />
              <Button variant='primary' size='lg' disabled>
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
      <hr className='border-gray-200' />

      {/* Bottom */}
      <div className='py-6 text-center text-neutral-600'>
        © 2025 <span className='font-semibold'>MYSTORE</span>. All rights
        reserved.
      </div>
    </footer>
  );
}
