'use client';

import { Button } from '@/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/formElements/Form';
import { ImageUpload } from '@/components/ui/formElements/image-upload/ImageUpload';
import { Input } from '@/components/ui/formElements/Input';
import { Heading } from '@/components/ui/Heading';
import { UpdateUserDto } from '@/generated/orval/types';
import { useUpdateUser } from '@/hooks/queries/user/useUpdateUser';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

export function UserProfile() {
  const t = useTranslations('DashboardSettings');
  const { user, updateUser, isLoadingUpdate } = useUpdateUser();

  const form = useForm<UpdateUserDto>({
    mode: 'onChange',
    values: {
      name: user?.name || '',
      picture: user?.picture || '',
      country: user?.country || '',
      city: user?.city || '',
      address: user?.address || '',
      phone: user?.phone || '',
    },
  });

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;
  const onSubmit: SubmitHandler<UpdateUserDto> = (data) => {
    updateUser(data);
  };

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <Heading title={t('profile_title')} description={t('profile_description')} />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='h-full space-y-6'
        >
          <FormField
            control={form.control}
            name='picture'
            rules={{ required: t('form_user_image_required') }}
            render={({ field }) => (
              <FormItem className='mt-4'>
                <FormLabel>{t('form_user_image')}</FormLabel>
                <FormControl>
                  <ImageUpload
                    isDisabled={isLoadingUpdate}
                    onChange={field.onChange}
                    value={field.value}
                    multiple={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            rules={{ required: t('form_name_required') }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form_name_placeholder')}
                    disabled={isLoadingUpdate}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_country')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_country_placeholder')}
                      disabled={isLoadingUpdate}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_city')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_city_placeholder')}
                      disabled={isLoadingUpdate}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='mt-4 grid gap-4 sm:grid-cols-3'>
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_address')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_address_placeholder')}
                      disabled={isLoadingUpdate}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_phone')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_phone_placeholder')}
                      disabled={isLoadingUpdate}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='postalCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_postal_code')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_postal_code_placeholder')}
                      disabled={isLoadingUpdate}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button variant='default' disabled={isLoadingUpdate || !isFormDirty}>
            {t('save_changes')}
          </Button>
        </form>
      </Form>
    </div>
  );
}
