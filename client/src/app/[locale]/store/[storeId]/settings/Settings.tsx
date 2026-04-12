'use client';

import { StoreNoteBlock } from '@/components/customComponents/StoreNoteBlock';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
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
import { Textarea } from '@/components/ui/Textarea';
import { useDeleteStore } from '@/hooks/queries/stores/useDeleteStore';
import { useUpdateStore } from '@/hooks/queries/stores/useUpdateStore';
import { IUpdateStore } from '@/shared/types/store.interface';
import { Trash2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

export function Settings() {
  const t = useTranslations('StorePages');
  const { store, updateStore, isLoadingUpdate } = useUpdateStore();
  const { deleteStore, isLoadingDelete } = useDeleteStore();

  const form = useForm<IUpdateStore>({
    mode: 'onChange',
    values: {
      title: store?.title || '',
      description: store?.description || '',
      images: store?.images || [],
      country: store?.country || '',
      city: store?.city || '',
      address: store?.address || '',
      phone: store?.phone || '',
    },
  });

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;
  const onSubmit: SubmitHandler<IUpdateStore> = (data) => {
    updateStore(data);
  };

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <Heading title={t('settings_title')} description={t('settings_description')} />
        <ConfirmModal
          handleConfirm={() => deleteStore()}
          title={t('delete_store')}
          description={t('delete_store_description')}
          confirmText={t('confirm_delete')}
          cancelText={t('cancel')}
        >
          <Button
            variant='default'
            size='icon'
            disabled={isLoadingDelete || store?.isDefaultStore}
          >
            <Trash2 className='size-4' />
          </Button>
        </ConfirmModal>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='h-full space-y-6'
        >
          <FormField
            control={form.control}
            name='images'
            rules={{ required: t('form_images_required') }}
            render={({ field }) => (
              <FormItem className='mt-4'>
                <FormLabel>{t('form_images')}</FormLabel>
                <FormControl>
                  <ImageUpload
                    isDisabled={isLoadingUpdate}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <FormField
              control={form.control}
              name='title'
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
          </div>

          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
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
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
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
          </div>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_description')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('form_description_placeholder')}
                    disabled={isLoadingUpdate}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant='default' disabled={isLoadingUpdate || !isFormDirty}>
            {t('save_changes')}
          </Button>
        </form>
      </Form>

      {store?.isDefaultStore && <StoreNoteBlock />}
    </div>
  );
}
