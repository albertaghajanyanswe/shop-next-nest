import * as React from 'react';
import {
  Preview,
  Text,
  Section,
  Body,
  Container,
  Heading,
  Img,
} from '@react-email/components';
import { GlobalTemplate } from './global.template';

type NewProductTemplateProps = {
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage: string;
  storeName: string;
  category: string;
  brand: string;
};

export function NewProductTemplate({
  productName,
  productDescription,
  productPrice,
  productImage,
  storeName,
  category,
  brand,
}: NewProductTemplateProps) {
  return (
    <GlobalTemplate
      children={
        <Body className='bg-neutral-50 p-4 text-shop-primary-text'>
          <Preview>New product: {productName}</Preview>

          <Container className='max-w-2xl mx-auto bg-shop-white rounded-md shadow-md'>
            <div className='relative px-4 py-4 overflow-hidden'>
              <div className='relative text-center'>
                <Heading className='mb-4 text-3xl font-bold'>
                  New Product Available
                </Heading>
                <p className='mb-8 text-shop-muted-text-6'>
                  A new product has been added that matches your interests!
                </p>

                <Section className='mb-6'>
                  {productImage && (
                    <Img
                      src={productImage}
                      alt={productName}
                      className='w-full max-w-md mx-auto rounded-md'
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  )}
                </Section>

                <div className='text-left border-t pt-4'>
                  <Heading as='h2' className='text-xl font-bold mb-2'>
                    {productName}
                  </Heading>

                  {productDescription && (
                    <Text className='mb-3 text-shop-muted-text-6'>
                      {productDescription}
                    </Text>
                  )}

                  <div className='mb-4 space-y-2'>
                    <Text className='font-semibold'>
                      Price: ${productPrice.toFixed(2)}
                    </Text>
                    {category && (
                      <Text className='text-sm'>
                        <strong>Category:</strong> {category}
                      </Text>
                    )}
                    {brand && (
                      <Text className='text-sm'>
                        <strong>Brand:</strong> {brand}
                      </Text>
                    )}
                    {storeName && (
                      <Text className='text-sm'>
                        <strong>Store:</strong> {storeName}
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Body>
      }
    />
  );
}
