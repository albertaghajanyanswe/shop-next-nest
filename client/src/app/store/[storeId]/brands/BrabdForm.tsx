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

interface BrandFormProps {
  brand?: GetBrandDto;
  categories: GetCategoryDto[];
}

export function BrandForm({ brand, categories }: BrandFormProps) {
  const { createBrand, isLoadingCreate } = useCreateBrand();
  const { updateBrand, isLoadingUpdate } = useUpdateBrand();
  const { deleteBrand, isLoadingDelete } = useDeleteBrand();

  const title = brand ? 'Update brand' : 'Create Brand';
  const description = brand ? 'Update brand details' : 'Add new brand to store';
  const action = brand ? 'Save' : 'Create';

  const form = useForm<IBrandInput>({
    mode: 'onChange',
    values: {
      name: brand?.name || '',
      description: brand?.description || '',
      images: brand?.images || [],
      // categoryId: brand?.categoryId || '',
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
            title='Delete Brand'
            description='This action cannot be undone. This will permanently delete your color from our servers.'
            confirmText='Delete'
            cancelText='Cancel'
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
              rules={{ required: 'Brand name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Brand name'
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
              rules={{ required: 'Brand description is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Brand description'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name='categoryId'
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <Button variant='default' disabled={isLoading || !isFormDirty}>
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}
