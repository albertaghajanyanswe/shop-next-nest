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
import { Trash2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IBrand, IBrandInput } from '@/shared/types/brand.interface';
import { useCreateBrand } from '@/hooks/queries/brands/useCreateBrand';
import { useUpdateBrand } from '@/hooks/queries/brands/useUpdateBrand';
import { useDeleteBrand } from '@/hooks/queries/brands/useDeleteBrand';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { ICategory } from '@/shared/types/category.interface';

interface BrandFormProps {
  brand?: IBrand;
  categories: ICategory[];
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
      categoryId: brand?.categoryId || '',
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
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {brand && (
          <ConfirmModal
            handleConfirm={() => deleteBrand()}
            title='Delete Brand'
            description='This action cannot be undone. This will permanently delete your color from our servers.'
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
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
