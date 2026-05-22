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
import { ImageUpload } from '@/components/ui/formElements/image-upload/ImageUpload';
import { Input } from '@/components/ui/formElements/Input';
import { Heading } from '@/components/ui/Heading';
import { Textarea } from '@/components/ui/Textarea';
import { GetCategoryDto } from '@/generated/orval/types';
import { useCreateCategory } from '@/hooks/queries/categories/useCreateCategory';
import { useDeleteCategory } from '@/hooks/queries/categories/useDeleteCategory';
import { useUpdateCategory } from '@/hooks/queries/categories/useUpdateCategory';
import { ICategoryInput } from '@/shared/types/category.interface';
import { Trash2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

interface CategoryFormProps {
  category?: GetCategoryDto | null;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const t = useTranslations('StorePages');
  const { createCategory, isLoadingCreate } = useCreateCategory();
  const { updateCategory, isLoadingUpdate } = useUpdateCategory();
  const { deleteCategory, isLoadingDelete } = useDeleteCategory();

  const title = category ? t('update_category') : t('create_category');
  const description = category
    ? t('update_category_details')
    : t('add_category');
  const action = category ? t('save') : t('create_action');

  const form = useForm<ICategoryInput>({
    mode: 'onChange',
    values: {
      name: category?.name || '',
      description: category?.description || '',
      images: category?.images || [],
    },
  });

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;
  const isLoading = isLoadingUpdate || isLoadingCreate;

  const onSubmit: SubmitHandler<ICategoryInput> = (data) => {
    if (category) {
      updateCategory(data);
    } else {
      createCategory(data);
    }
  };
  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <Heading title={title} description={description} />
        {category && (
          <ConfirmModal
            handleConfirm={() => deleteCategory()}
            title={t('delete_category_title')}
            description={t('delete_category_description')}
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
                        folder='categories'
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
              rules={{ required: t('form_category_name_required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_category_name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_category_name_placeholder')}
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
              rules={{ required: t('form_category_description_required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_category_description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('form_category_description_placeholder')}
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
