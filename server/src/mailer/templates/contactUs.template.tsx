import * as React from 'react';
import {
  Preview,
  Text,
  Section,
  Body,
  Container,
  Heading,
} from '@react-email/components';
import { GlobalTemplate } from './global.template';

type ContactUsTemplateProps = {
  name: string;
  email: string;
  message: string;
};

export function ContactUsTemplate({
  name,
  email,
  message,
}: ContactUsTemplateProps) {
  return (
    <GlobalTemplate
      children={
        <Body className='bg-neutral-50 p-4 text-neutral-900'>
          <Preview>New message from {name}</Preview>

          <Container className='max-w-2xl mx-auto bg-white rounded-md shadow-md'>
            <div className='relative px-4 py-4 overflow-hidden'>
              <div className='relative text-center'>
                <Heading className='mb-4 text-3xl font-bold'>
                  Contact Us
                </Heading>
                <p className='mb-8 text-neutral-600'>
                  Thank you for reaching out to us. We have received your
                  message and will get back to you as soon as possible.
                </p>
                <div>
                  <Heading as='h2' className='text-md'>User contacts</Heading>
                  <Text className='m-2'>Name: {name}</Text>
                  <Text className='m-2'>Email: {email}</Text>
                </div>
                <div>
                  <Heading as='h2' className='text-md'>Message</Heading>
                  <Text className='m-2'>Message: {message}</Text>
                </div>
              </div>
            </div>
          </Container>
        </Body>
      }
    />
  );
}
