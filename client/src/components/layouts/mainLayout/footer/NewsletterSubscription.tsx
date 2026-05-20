'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/formElements/Input';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { mailerService } from '@/services/mailer.service';

export function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('Footer');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t('enter_email'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await mailerService.subscribe({ email });
      if (response.data.success) {
        toast.success(response.data.message);
        setEmail('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(t('subscribe_error') || 'Failed to subscribe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className='flex flex-col space-y-4'>
      <Input
        placeholder={t('enter_email')}
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <Button variant='default' size='lg' disabled={isLoading} type='submit'>
        {isLoading ? t('subscribing') || 'Subscribing...' : t('subscribe')}
      </Button>
    </form>
  );
}
