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
import { DASHBOARD_URL } from '@/config/url.config';
import { useDeleteStore } from '@/hooks/queries/stores/useDeleteStore';
import { useUpdateStore } from '@/hooks/queries/stores/useUpdateStore';
import { IUpdateStore } from '@/shared/types/store.interface';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';

export function Settings() {
  const { store, updateStore, isLoadingUpdate } = useUpdateStore();
  const { deleteStore, isLoadingDelete } = useDeleteStore();

  console.log('STORE ', store);
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
  console.log('form ', form.formState.dirtyFields);

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;
  const onSubmit: SubmitHandler<IUpdateStore> = (data) => {
    updateStore(data);
  };

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <Heading title='Settings' description='Manage your store settings.' />
        <ConfirmModal
          handleConfirm={() => deleteStore()}
          title='Delete Store'
          description='This action cannot be undone. This will permanently delete your store and remove your data from our servers.'
          confirmText='Delete'
          cancelText='Cancel'
        >
          <Button
            variant='primary'
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
            rules={{ required: 'Upload at least one image' }}
            render={({ field }) => {
              console.log('FIELD = ', field);
              return (
                <FormItem className='mt-4'>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      isDisabled={isLoadingUpdate}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <FormField
              control={form.control}
              name='title'
              rules={{ required: 'Store name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Store name'
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
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Store country'
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
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Store city'
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Store address'
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
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Store phone'
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
                <FormLabel>Store description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Store description'
                    disabled={isLoadingUpdate}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant='primary' disabled={isLoadingUpdate || !isFormDirty}>
            Save changes
          </Button>
        </form>
      </Form>

      {store?.isDefaultStore && <StoreNoteBlock />}
    </div>
  );
}
