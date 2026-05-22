'use client';

import { CustomComboBox } from '@/components/customComponents/CustomCombobox';
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
  GetProductWithDetailsIntendedFor,
  GetProductWithDetailsState,
} from '@/generated/orval/types';
import { useCreateProduct } from '@/hooks/queries/products/useCreateProduct';
import { useDeleteProduct } from '@/hooks/queries/products/useDeleteProduct';
import { useUpdateProduct } from '@/hooks/queries/products/useUpdateProduct';
import { useProfile } from '@/hooks/useProfile';
import { IProductInput } from '@/shared/types/product.interface';
import { CirclePlus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Loading from '@/components/customComponents/loading/Loading';

interface ProductFormProps {
  product?: GetProductWithDetails;
  categories: GetCategoryDto[];
  colors: GetColorDto[];
  brands: GetBrandDto[];
  isLoadingData: boolean;
}

export function ProductForm({
  product,
  categories,
  colors,
  brands,
  isLoadingData,
}: ProductFormProps) {
  const t = useTranslations('StorePages');
  const { user, isLoading: isLoadingUser, canCreateProduct } = useProfile();

  const { createProduct, isLoadingCreate } = useCreateProduct();
  const { updateProduct, isLoadingUpdate } = useUpdateProduct();
  const { deleteProduct, isLoadingDelete } = useDeleteProduct();

  const title = product ? t('update_product') : t('create_product');
  const description = product ? t('update_product_details') : t('add_product');
  const action = product ? t('save') : t('create_action');

  const form = useForm<IProductInput>({
    mode: 'onChange',
    values: {
      title: product?.title || '',
      description:
        typeof product?.description === 'string' ? product.description : '',
      images: product?.images || [],
      price: product?.price || 0,
      categoryId: product?.category?.id || '',
      colorId: product?.color?.id || '',
      brandId: product?.brand?.id || '',
      state: product?.state || GetProductWithDetailsState.NEW,
      quantity: product?.quantity || 0,
      isOriginal: product?.isOriginal ?? false,
      isPublished: product?.isPublished ?? true,
      productDetails: product?.productDetails || [],
      intendedFor:
        product?.intendedFor || GetProductWithDetailsIntendedFor.SALE,
    },
  });

  const {
    fields: attributeFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'productDetails',
  });

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;
  const isLoading = isLoadingUpdate || isLoadingCreate;

  const onSubmit: SubmitHandler<IProductInput> = (data) => {
    data.price = Number(data.price);
    data.quantity = Number(data.quantity);

    if (product) {
      updateProduct(data);
    } else if (canCreateProduct) {
      createProduct(data);
    }
  };

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <Heading title={title} description={description} />
        {product && (
          <ConfirmModal
            handleConfirm={() => deleteProduct()}
            title={t('delete_product_title')}
            description={t('delete_product_description')}
            confirmText={t('confirm_delete')}
            cancelText={t('cancel')}
          >
            <Button variant='default' size='icon' disabled={isLoadingDelete}>
              <Trash2 className='size-4' />
            </Button>
          </ConfirmModal>
        )}
      </div>
      {isLoadingData && <Loading text={t('loading')} />}
      {!isLoadingData && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='h-full space-y-6'
          >
            <FormField
              control={form.control}
              name='images'
              rules={{ required: t('form_product_images_required') }}
              render={({ field }) => {
                return (
                  <FormItem className='mt-4'>
                    <FormLabel>{t('form_product_images')}</FormLabel>
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
                rules={{ required: t('form_product_name_required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form_product_name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form_product_name_placeholder')}
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
                rules={{ required: t('form_product_price_required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form_product_price')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form_product_price_placeholder')}
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
              <FormField
                control={form.control}
                name='colorId'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t('form_product_color')}</FormLabel>
                    <FormControl>
                      <CustomComboBox
                        options={colors}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('form_product_color_placeholder')}
                        disabled={isLoading}
                        error={fieldState?.error?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='categoryId'
                rules={{ required: t('form_product_category_required') }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t('form_product_category')}</FormLabel>
                    <FormControl>
                      <CustomComboBox
                        options={categories}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('form_product_category_placeholder')}
                        disabled={isLoading}
                        error={fieldState?.error?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='brandId'
                rules={{ required: t('form_product_brand_required') }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t('form_product_brand')}</FormLabel>
                    <FormControl>
                      <CustomComboBox
                        options={brands}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('form_product_brand_placeholder')}
                        disabled={isLoading}
                        error={fieldState?.error?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid items-start gap-4 sm:grid-cols-3'>
              <FormField
                control={form.control}
                name='intendedFor'
                rules={{ required: t('form_product_intended_for_required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form_product_intended_for')}</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value as unknown as string}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue
                            placeholder={t(
                              'form_product_intended_for_placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { id: 'FREE', title: t('free') },
                          { id: 'SALE', title: t('sale') },
                          { id: 'RENT', title: t('rent') },
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
                name='state'
                rules={{ required: t('form_product_state_required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form_product_state')}</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value as unknown as string}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue
                            placeholder={t('form_product_state_placeholder')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { id: 'NEW', title: t('state_new') },
                          { id: 'USED', title: t('state_used') },
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
                  required: t('form_product_quantity_required'),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form_product_quantity')}</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder={t('form_product_quantity_placeholder')}
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
              rules={{ required: t('form_product_description_required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_product_description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('form_product_description_placeholder')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid items-start gap-4 sm:grid-cols-3'>
              <FormField
                control={form.control}
                name='isOriginal'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form_product_is_original')}</FormLabel>
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
              <FormField
                control={form.control}
                name='isPublished'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form_product_is_published')}</FormLabel>
                    <FormControl>
                      <Switch
                        id='isPublished'
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
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <p className='text-lg font-medium'>
                  {t('form_product_details')}
                </p>

                <Button
                  type='button'
                  variant='primary'
                  size='sm'
                  onClick={() => append({ key: '', value: '' })}
                >
                  <CirclePlus className='size-4' />
                  <span className='ml-2'>{t('form_product_details_add')}</span>
                </Button>
              </div>

              {attributeFields.map((field, index) => (
                <div
                  className='flex flex-row items-center gap-4'
                  key={field.id}
                >
                  <div className='grid w-full items-start gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name={`productDetails.${index}.key`}
                      rules={{
                        required: t('form_product_details_key_required'),
                      }}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              id={`productDetails-${index}-key`}
                              placeholder={t(
                                'form_product_details_key_placeholder'
                              )}
                              className={`${fieldState.error ? 'border-destructive focus:border-destructive hover:border-destructive border-1' : ''}`}
                              {...field}
                            />
                          </FormControl>
                          {fieldState.error && (
                            <p className='text-destructive text-sm'>
                              {fieldState.error.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`productDetails.${index}.value`}
                      rules={{
                        required: t('form_product_details_value_required'),
                      }}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              id={`productDetails-${index}-value`}
                              placeholder={t(
                                'form_product_details_value_placeholder'
                              )}
                              className={`${fieldState.error ? 'border-destructive focus:border-destructive hover:border-destructive border-1' : ''}`}
                              {...field}
                            />
                          </FormControl>
                          {fieldState.error && (
                            <p className='text-destructive text-sm'>
                              {fieldState.error.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    className='text-red-500 hover:bg-red-500/5'
                    onClick={() => remove(index)}
                  >
                    <Trash2 className='size-4 text-red-500 hover:text-red-600' />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant='default'
              disabled={
                isLoading || !isFormDirty || (!product && !canCreateProduct)
              }
            >
              {action}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
