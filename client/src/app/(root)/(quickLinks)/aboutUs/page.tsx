import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';

export const metadata = {
  title: `About Us | ${SITE_NAME}`,
  description: `Learn about our mission, values, and the team behind ${SITE_NAME}.`,
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ title: 'Home', href: '/' }, { title: 'About Us' }]}
      />

      <PageHeader
        title='About Us'
        description='We build modern, customer-centric eCommerce experiences powered by technology, transparency, and trust.'
        classNames='mt-4'
      />

      <section>
        <div className='flex flex-col gap-y-4'>
          <p className='leading-relaxed; text-sm text-neutral-600'>
            {SITE_NAME} is a cutting-edge technology company dedicated to
            providing innovative solutions for modern businesses. Founded in
            2020, we've quickly established ourselves as a leader in digital
            transformation and software development.
          </p>
          <p className='leading-relaxed; text-sm text-neutral-600'>
            Our team of expert developers, designers, and strategists work
            tirelessly to create custom solutions that help our clients
            streamline their operations, increase efficiency, and drive growth.
          </p>
          <p className='leading-relaxed; text-sm text-neutral-600'>
            At {SITE_NAME}, we believe in the power of technology to transform
            businesses and improve lives. We're committed to staying at the
            forefront of technological advancements and delivering exceptional
            value to our clients.
          </p>
        </div>
      </section>
    </>
  );
}
