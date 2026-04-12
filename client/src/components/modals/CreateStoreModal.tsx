import { useState, type PropsWithChildren } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ICreateStore } from '@/shared/types/store.interface';
import { useCreateStore } from '@/hooks/queries/stores/useCreateStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/formElements/Form';
import { Input } from '../ui/formElements/Input';
import { Button } from '../ui/Button';
import { GetStoreDto } from '@/generated/orval/types';
import { useTranslations } from 'next-intl';

export function CreateStoreModal({
  children,
  setCurrentStore,
  disabledTrigger = false,
}: PropsWithChildren<unknown> & {
  disabledTrigger?: boolean;
  setCurrentStore: (store: GetStoreDto) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('CreateStoreModal');
  const { createStore, isLoadingCreate } = useCreateStore();

  const form = useForm<ICreateStore>({
    mode: 'onChange',
    defaultValues: {
      title: '',
    },
  });

  const onSubmit: SubmitHandler<ICreateStore> = async (data: ICreateStore) => {
    const res = await createStore(data);
    if (res.id) {
      setCurrentStore(res);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger disabled={disabledTrigger} className='w-full'>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              rules={{ required: t('required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('store_name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('store_name')}
                      disabled={isLoadingCreate}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button variant='default' disabled={isLoadingCreate}>
                {t('create')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
