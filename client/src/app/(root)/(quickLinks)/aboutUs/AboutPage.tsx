import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'About Us' }]}
      />

      <PageHeader
        title='About Us'
        description='We build modern, customer-centric E-commerce experiences powered by technology, transparency, and trust.'
        classNames='mt-4'
      />

      <section>
        <div className='flex flex-col gap-y-4'>
          <p className='leading-relaxed; text-sm text-neutral-600'>
            {SITE_NAME} was founded in 2025 with the desire to create an
            online marketplace, where could buy and sell goods, offer services
            and so on. Our mission is to be most trusted and comprehensive
            online platform, helping accelerate the country’s transformation to
            a modern digital society. We connect people with the goods,
            services, and opportunities they need to enhance their everyday
            lives. By offering a safe, efficient, transparent, and accessible
            marketplace
          </p>
          <p className='leading-relaxed; text-sm text-neutral-600'>
            Our team of expert developers, designers, and strategists work
            tirelessly to create custom solutions that help our clients
            streamline their operations, increase efficiency, and drive growth.
          </p>
          <p className='leading-relaxed; text-sm text-neutral-600'>
            At {SITE_NAME}, we believe in the power of technology to transform
            businesses and improve lives. We are committed to staying at the
            forefront of technological advancements and delivering exceptional
            value to our clients.
          </p>
        </div>
      </section>
    </>
  );
}
