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

interface CategoryFormProps {
  category?: GetCategoryDto | null;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const { createCategory, isLoadingCreate } = useCreateCategory();
  const { updateCategory, isLoadingUpdate } = useUpdateCategory();
  const { deleteCategory, isLoadingDelete } = useDeleteCategory();

  const title = category ? 'Update category' : 'Create Category';
  const description = category
    ? 'Update category details'
    : 'Add new category to store';
  const action = category ? 'Save' : 'Create';

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
            title='Delete Category'
            description='This action cannot be undone. This will permanently delete your category from our servers.'
            confirmText='Delete'
            cancelText='Cancel'
          >
            <Button variant='primary' size='icon' disabled={isLoadingDelete}>
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
              rules={{ required: 'Upload at least one image' }}
              render={({ field }) => {
                console.log('FIELD = ', field);
                return (
                  <FormItem className='mt-4'>
                    <FormLabel>Images</FormLabel>
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
              rules={{ required: 'Category name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Category name'
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
              rules={{ required: 'Category description is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Category description'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button variant='primary' disabled={isLoading || !isFormDirty}>
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}
