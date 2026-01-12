import { CustomComboBox } from '@/components/customComponents/CustomCombobox';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Combobox } from '@/components/ui/Combobox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import {
  GetBrandDto,
  GetCategoryDto,
  GetColorDto,
  GetProductWithDetails,
  GetProductWithDetailsState,
} from '@/generated/orval/types';
import { useCreateProduct } from '@/hooks/queries/products/useCreateProduct';
import { useDeleteProduct } from '@/hooks/queries/products/useDeleteProduct';
import { useUpdateProduct } from '@/hooks/queries/products/useUpdateProduct';
import { useProfile } from '@/hooks/useProfile';
import { IProductInput } from '@/shared/types/product.interface';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ProductFormProps {
  product?: GetProductWithDetails;
  categories: GetCategoryDto[];
  colors: GetColorDto[];
  brands: GetBrandDto[];
}

// const DEFAULT_VALUES: IProductInput = {
//   title: '',
//   description: '',
//   images: [],
//   price: 0,
//   categoryId: '',
//   colorId: '',
//   brandId: '',
//   state: EnumProductState.NEW,
// };
export function ProductForm({
  product,
  categories,
  colors,
  brands,
}: ProductFormProps) {
  const { user, isLoading: isLoadingUser, canCreateProduct } = useProfile();

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
      state: product?.state || GetProductWithDetailsState.NEW,
      quantity: product?.quantity || 1,
      isOriginal: product?.isOriginal ?? true,
    },
  });

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;
  const isLoading = isLoadingUpdate || isLoadingCreate;
  const onSubmit: SubmitHandler<IProductInput> = (data) => {
    data.price = Number(data.price);
    data.quantity = Number(data.quantity);
    console.log('data ', data);
    if (product) {
      updateProduct(data);
    } else if (canCreateProduct) {
      createProduct(data);
    }
  };

  const categoriesList = useMemo(() => {
    return categories.map((i) => ({ label: i.name, value: i.id }));
  }, [categories]);

  const brandsList = useMemo(() => {
    return brands.map((i) => ({ label: i.name, value: i.id }));
  }, [brands]);
  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <Heading title={title} description={description} />
        {product && (
          <ConfirmModal
            handleConfirm={() => deleteProduct()}
            title='Delete Product'
            description='This action cannot be undone. This will permanently delete your product from our servers.'
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
          {/* <FormField
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
          /> */}
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className='grid items-start gap-4 sm:grid-cols-2'>
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
          <div className='grid items-start gap-4 sm:grid-cols-3'>
            {/* <FormField
              control={form.control}
              name='colorId'
              // rules={{ required: 'Color is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    // open
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
            /> */}

            <FormField
              control={form.control}
              name='colorId'
              rules={{ required: 'Color is required' }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <CustomComboBox
                      options={colors}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder='Select a color'
                      disabled={isLoading}
                      error={fieldState?.error?.message}
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

            <FormField
              control={form.control}
              name='categoryId'
              rules={{ required: 'Category is required' }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CustomComboBox
                      options={categories}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder='Select a category'
                      disabled={isLoading}
                      error={fieldState?.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
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
            /> */}
            <FormField
              control={form.control}
              name='brandId'
              rules={{ required: 'Brand is required' }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <CustomComboBox
                      options={brands}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder='Select a brand'
                      disabled={isLoading}
                      error={fieldState?.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid items-start gap-4 sm:grid-cols-2'>
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
                    defaultValue={field.value as unknown as string}
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
              name='quantity'
              rules={{
                required: 'Quantity is required',
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Quantity'
                      disabled={isLoading}
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
          <FormField
            control={form.control}
            name='isOriginal'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is Original</FormLabel>
                <FormControl>
                  <Switch
                    id='isOriginal'
                    {...field}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant='default'
            disabled={isLoading || !isFormDirty || !canCreateProduct}
          >
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}
