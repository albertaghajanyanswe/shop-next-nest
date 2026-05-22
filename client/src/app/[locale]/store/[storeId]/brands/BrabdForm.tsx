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
} from '@/components/ui/formElements/Form';
import { Input } from '@/components/ui/formElements/Input';
import { Heading } from '@/components/ui/Heading';
import { Trash2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IBrandInput } from '@/shared/types/brand.interface';
import { useCreateBrand } from '@/hooks/queries/brands/useCreateBrand';
import { useUpdateBrand } from '@/hooks/queries/brands/useUpdateBrand';
import { useDeleteBrand } from '@/hooks/queries/brands/useDeleteBrand';
import { GetBrandDto, GetCategoryDto } from '@/generated/orval/types';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUpload } from '@/components/ui/formElements/image-upload/ImageUpload';
import { useTranslations } from 'next-intl';

interface BrandFormProps {
  brand?: GetBrandDto;
  categories: GetCategoryDto[];
}

export function BrandForm({ brand }: BrandFormProps) {
  const t = useTranslations('StorePages');
  const { createBrand, isLoadingCreate } = useCreateBrand();
  const { updateBrand, isLoadingUpdate } = useUpdateBrand();
  const { deleteBrand, isLoadingDelete } = useDeleteBrand();

  const title = brand ? t('update_brand') : t('create_brand');
  const description = brand ? t('update_brand_details') : t('add_brand');
  const action = brand ? t('save') : t('create_action');

  const form = useForm<IBrandInput>({
    mode: 'onChange',
    values: {
      name: brand?.name || '',
      description: brand?.description || '',
      images: brand?.images || [],
    },
  });

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;
  const isLoading = isLoadingUpdate || isLoadingCreate;

  const onSubmit: SubmitHandler<IBrandInput> = (data) => {
    if (brand) {
      updateBrand(data);
    } else {
      createBrand(data);
    }
  };

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <Heading title={title} description={description} />
        {brand && (
          <ConfirmModal
            handleConfirm={() => deleteBrand()}
            title={t('delete_brand_title')}
            description={t('delete_brand_description')}
            confirmText={t('confirm_delete')}
            cancelText={t('cancel')}
          >
            <Button variant='default' size='icon' disabled={isLoadingDelete}>
              <Trash2 className='size-4' />
            </Button>
          </ConfirmModal>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='h-full space-y-6'
        >
          <div className='xs:grid-cols-1 mt-6 grid gap-6'>
            <FormField
              control={form.control}
              name='images'
              rules={{ required: t('form_images_required') }}
              render={({ field }) => {
                return (
                  <FormItem className='mt-4'>
                    <FormLabel>{t('form_images')}</FormLabel>
                    <FormControl>
                      <ImageUpload
                        isDisabled={isLoading}
                        onChange={field.onChange}
                        value={field.value}
                        folder='brands'
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
              rules={{ required: t('form_brand_name_required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_brand_name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_brand_name_placeholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              rules={{ required: t('form_brand_description_required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_brand_description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('form_brand_description_placeholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button variant='default' disabled={isLoading || !isFormDirty}>
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}
