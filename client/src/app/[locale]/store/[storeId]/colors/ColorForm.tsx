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
import { useCreateColor } from '@/hooks/queries/colors/useCreateColor';
import { useDeleteColor } from '@/hooks/queries/colors/useDeleteColor';
import { useUpdateColor } from '@/hooks/queries/colors/useUpdateColor';
import { IColorInput } from '@/shared/types/color.interface';
import { Trash2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AdvancedColorPicker } from '@/components/ui/ColorPicker';
import { GetColorDto } from '@/generated/orval/types';
import { useTranslations } from 'next-intl';

interface ColorFormProps {
  color?: GetColorDto;
}

export function ColorForm({ color }: ColorFormProps) {
  const t = useTranslations('StorePages');
  const { createColor, isLoadingCreate } = useCreateColor();
  const { updateColor, isLoadingUpdate } = useUpdateColor();
  const { deleteColor, isLoadingDelete } = useDeleteColor();

  const title = color ? t('update_color') : t('create_color');
  const description = color ? t('update_color_details') : t('add_color');
  const action = color ? t('save') : t('create_action');

  const form = useForm<IColorInput>({
    mode: 'onChange',
    values: {
      name: color?.name || '',
      value: color?.value || '',
    },
  });

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;
  const isLoading = isLoadingUpdate || isLoadingCreate;

  const onSubmit: SubmitHandler<IColorInput> = (data) => {
    if (color) {
      updateColor(data);
    } else {
      createColor(data);
    }
  };

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <Heading title={title} description={description} />
        {color && (
          <ConfirmModal
            handleConfirm={() => deleteColor()}
            title={t('delete_color_title')}
            description={t('delete_color_description')}
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
              name='name'
              rules={{ required: t('form_color_name_required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_color_name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form_color_name_placeholder')}
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
              name='value'
              rules={{ required: t('form_color_value_required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form_color_value')}</FormLabel>
                  <FormControl className='w-full'>
                    <AdvancedColorPicker
                      color={field.value}
                      onChange={field.onChange}
                      triggerClassName='w-full'
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
