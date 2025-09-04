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
import { ImageUpload } from '@/components/ui/form-elements/image-upload/ImageUpload';
import { Input } from '@/components/ui/form-elements/Input';
import { Heading } from '@/components/ui/Heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useCreateProduct } from '@/hooks/queries/products/useCreateProduct';
import { useDeleteProduct } from '@/hooks/queries/products/useDeleteProduct';
import { useUpdateProduct } from '@/hooks/queries/products/useUpdateProduct';
import { IBrand } from '@/shared/types/brand.interface';
import { ICategory } from '@/shared/types/category.interface';
import { IColor } from '@/shared/types/color.interface';
import { EnumProductState, IProduct, IProductInput } from '@/shared/types/product.interface';
import { Trash2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface productFormProps {
  product?: IProduct;
  categories: ICategory[];
  colors: IColor[];
  brands: IBrand[];
}

const DEFAULT_VALUES: IProductInput = {
  title: '',
  description: '',
  images: [],
  price: 0,
  categoryId: '',
  colorId: '',
  brandId: '',
};
export function ProductForm({ product, categories, colors, brands }: productFormProps) {
  const { createProduct, isLoadingCreate } = useCreateProduct();
  const { updateProduct, isLoadingUpdate } = useUpdateProduct();
  const { deleteProduct, isLoadingDelete } = useDeleteProduct();

  const title = product ? 'Update product' : 'Create Product';
  const description = product
    ? 'Update product details'
    : 'Add new product to store';
  const action = product ? 'Save' : 'Create';

  const form = useForm<IProductInput>({
    mode: 'onChange',
    values: {
      title: product?.title || '',
      description: product?.description || '',
      images: product?.images || [],
      price: product?.price || 0,
      categoryId: product?.category?.id || '',
      colorId: product?.color?.id || '',
      brandId: product?.brand?.id || '',
      state: product?.state || EnumProductState.NEW,
    },
  });

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;
  const isLoading = isLoadingUpdate || isLoadingCreate;
  const onSubmit: SubmitHandler<IProductInput> = (data) => {
    data.price = Number(data.price);
    if (product) {
      updateProduct(data);
    } else {
      createProduct(data);
    }
  };
  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {product && (
          <ConfirmModal
            handleConfirm={() => deleteProduct()}
            title='Delete Product'
            description='This action cannot be undone. This will permanently delete your product from our servers.'
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
          <FormField
            control={form.control}
            name='images'
            rules={{ required: 'Upload at least one image' }}
            render={({ field }) => (
              <FormItem className='mt-4'>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    isDisabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='title'
              rules={{ required: 'Product name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Product name'
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
              name='price'
              rules={{ required: 'Price is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Price'
                      disabled={isLoading}
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
              name='colorId'
              rules={{ required: 'Color is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a color' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <FormField
              control={form.control}
              name='brandId'
              rules={{ required: 'Brand is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a brand' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='state'
            rules={{ required: 'State is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a state' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      { id: 'NEW', title: 'New' },
                      { id: 'USED', title: 'Used' },
                    ].map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Product description'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant='primary' disabled={isLoading || !isFormDirty}>
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}
