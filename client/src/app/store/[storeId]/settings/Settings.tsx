'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form-elements/Form';
import { Input } from '@/components/ui/form-elements/Input';
import { Heading } from '@/components/ui/Heading';
import { Textarea } from '@/components/ui/Textarea';
import { useDeleteStore } from '@/hooks/queries/stores/useDeleteStore';
import { useUpdateStore } from '@/hooks/queries/stores/useUpdateStore';
import { IUpdateStore } from '@/shared/types/store.interface';
import { Trash2 } from 'lucide-react';
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
    },
  });
  console.log('form ', form.formState.dirtyFields);

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;
  const onSubmit: SubmitHandler<IUpdateStore> = (data) => {
    updateStore(data);
  };

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage your store settings.' />
        <ConfirmModal
          handleConfirm={() => deleteStore()}
          title='Delete Store'
          description='This action cannot be undone. This will permanently delete your store and remove your data from our servers.'
          confirmText='Delete'
          cancelText='Cancel'
        >
          <Button variant='primary' size='icon' disabled={isLoadingDelete}>
            <Trash2 className='size-4' />
          </Button>
        </ConfirmModal>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='h-full space-y-6'
        >
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <FormField
              control={form.control}
              name='title'
              rules={{ required: 'Store name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store name</FormLabel>
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
    </div>
  );
}
