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

interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

export default function ContactUsPage() {
  const { sendContactUs, isLoadingContactUs } = useContactUs();

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
        items={[{ title: 'Home', href: '/' }, { title: 'Contact Us' }]}
      />

      <section className='flex w-full flex-col items-center justify-center'>
        <PageHeader
          title='Contact Us'
          description='Our support team is here to help with any questions or feedback.'
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
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Your name' {...field} />
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
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Enter a valid email',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Your email' type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MESSAGE */}
              <FormField
                control={form.control}
                name='message'
                rules={{ required: 'Message is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Your message'
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
                Send Message
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </>
  );
}
