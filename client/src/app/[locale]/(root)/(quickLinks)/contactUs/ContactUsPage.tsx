'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/formElements/Form';
import { Input } from '@/components/ui/formElements/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/Button';
import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { useContactUs } from '@/hooks/queries/mailer/useContactUs';
import { useTranslations } from 'next-intl';

interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

export default function ContactUsPage() {
  const { sendContactUs, isLoadingContactUs } = useContactUs();
  const t = useTranslations('QuickLinks.ContactUs');
  const tCommon = useTranslations('HeaderMenu');

  const form = useForm<ContactFormInput>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;

  const onSubmit: SubmitHandler<ContactFormInput> = (data) => {
    sendContactUs(data);
    form.reset();
  };

  return (
    <>
      <Breadcrumbs
        items={[{ title: tCommon('Home'), href: '/' }, { title: t('title') }]}
      />

      <section className='flex w-full flex-col items-center justify-center'>
        <PageHeader
          title={t('title')}
          description={t('description')}
          classNames='mt-4 w-full sm:w-[60%]'
        />
        <div className='w-full sm:w-[60%]'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='h-full space-y-6'
            >
              {/* NAME */}
              <FormField
                control={form.control}
                name='name'
                rules={{ required: t('name_required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name='email'
                rules={{
                  required: t('email_required'),
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: t('email_invalid'),
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('email_placeholder')} type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MESSAGE */}
              <FormField
                control={form.control}
                name='message'
                rules={{ required: t('message_required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('message')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('message_placeholder')}
                        className='min-h-[160px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant='default'
                disabled={!isFormDirty || isLoadingContactUs}
                className='mt-4'
              >
                {t('submit')}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </>
  );
}
