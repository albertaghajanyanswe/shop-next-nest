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
import { useCreateColor } from '@/hooks/queries/colors/useCreateColor';
import { useDeleteColor } from '@/hooks/queries/colors/useDeleteColor';
import { useUpdateColor } from '@/hooks/queries/colors/useUpdateColor';
import { IColorInput } from '@/shared/types/color.interface';
import { IColor } from '@/shared/types/color.interface';
import { Trash2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AdvancedColorPicker } from '@/components/ui/ColorPicker';

interface ColorFormProps {
  color?: IColor;
}

export function ColorForm({ color }: ColorFormProps) {
  const { createColor, isLoadingCreate } = useCreateColor();
  const { updateColor, isLoadingUpdate } = useUpdateColor();
  const { deleteColor, isLoadingDelete } = useDeleteColor();

  const title = color ? 'Update color' : 'Create Color';
  const description = color ? 'Update color details' : 'Add new color to store';
  const action = color ? 'Save' : 'Create';

  const form = useForm<IColorInput>({
    mode: 'onChange',
    values: {
      name: color?.name || '',
      value: color?.value || '',
    },
  });

  console.log('\n\n\n form values', form.getValues());
  console.log('color', color);
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
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {color && (
          <ConfirmModal
            handleConfirm={() => deleteColor()}
            title='Delete Color'
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
              rules={{ required: 'Color name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Color name'
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
              rules={{ required: 'Color value is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color value</FormLabel>
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
          <Button variant='primary' disabled={isLoading || !isFormDirty}>
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}
