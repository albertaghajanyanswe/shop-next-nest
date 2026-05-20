import * as React from 'react';
import {
  Preview,
  Text,
  Section,
  Body,
  Container,
  Heading,
  Button,
} from '@react-email/components';
import { GlobalTemplate } from './global.template';

type ResetPasswordTemplateProps = {
  name: string;
  resetLink: string;
};

export function ResetPasswordTemplate({
  name,
  resetLink,
}: ResetPasswordTemplateProps) {
  return (
    <GlobalTemplate
      children={
        <Body className='bg-neutral-50 p-4 text-shop-primary-text'>
          <Preview>Reset your password</Preview>

          <Container className='max-w-2xl mx-auto bg-shop-white rounded-md shadow-md'>
            <div className='relative px-4 py-4 overflow-hidden'>
              <div className='relative text-center'>
                <Heading className='mb-4 text-3xl font-bold'>
                  Reset Your Password
                </Heading>
                <p className='mb-8 text-shop-muted-text-6'>
                  Hi {name}, we received a request to reset your password. Click the button below to create a new password.
                </p>
                <div className='mb-8'>
                  <Button
                    href={resetLink}
                    className='bg-shop-primary text-white px-6 py-3 rounded-md font-semibold'
                  >
                    Reset Password
                  </Button>
                </div>
                <p className='text-sm text-shop-muted-text-6 mb-4'>
                  Or copy and paste this link in your browser:
                </p>
                <p className='text-xs text-shop-muted-text-6 break-all mb-8'>
                  {resetLink}
                </p>
                <p className='text-xs text-shop-muted-text-6'>
                  This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
                </p>
              </div>
            </div>
          </Container>
        </Body>
      }
    />
  );
}
