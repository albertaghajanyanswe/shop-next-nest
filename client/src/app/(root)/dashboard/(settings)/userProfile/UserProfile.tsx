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
import { UpdateUserDto } from '@/generated/orval/types';
import { useDeleteStore } from '@/hooks/queries/stores/useDeleteStore';
import { useUpdateStore } from '@/hooks/queries/stores/useUpdateStore';
import { useUpdateUser } from '@/hooks/queries/user/useUpdateUser';
import { IUpdateStore } from '@/shared/types/store.interface';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';

export function UserProfile() {
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
        <Heading title='Settings' description='Update user profile data.' />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='h-full space-y-6'
        >
          <FormField
            control={form.control}
            name='picture'
            rules={{ required: 'Upload at least one image' }}
            render={({ field }) => {
              return (
                <FormItem className='mt-4'>
                  <FormLabel>User Image</FormLabel>
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
              );
            }}
          />
          <FormField
            control={form.control}
            name='name'
            rules={{ required: 'User name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='User name'
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
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='User country'
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
                      placeholder='User city'
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='User address'
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
                      placeholder='User phone'
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
              // rules={{ required: 'User postal code is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='User postal code'
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
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
