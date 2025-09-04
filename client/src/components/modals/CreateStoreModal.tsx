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
} from '../ui/form-elements/Form';
import { Input } from '../ui/form-elements/Input';
import { Button } from '../ui/Button';

export function CreateStoreModal({ children }: PropsWithChildren<unknown>) {
  const [isOpen, setIsOpen] = useState(false);
  const { createStore, isLoadingCreate } = useCreateStore();

  const form = useForm<ICreateStore>({
    mode: 'onChange',
    defaultValues: {
      title: '',
    },
  });

  const onSubmit: SubmitHandler<ICreateStore> = (data: ICreateStore) => {
    createStore(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className='w-full'>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Store</DialogTitle>
          <DialogDescription>
            Create a new store to start selling your products.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              rules={{ required: 'Store name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Store name'
                      disabled={isLoadingCreate}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button variant='primary' disabled={isLoadingCreate}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
