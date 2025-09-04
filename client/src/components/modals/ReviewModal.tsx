import { useCreateReview } from '@/hooks/queries/reviews/useCreateReview';
import { IReviewInput } from '@/shared/types/review.interface';
import { FC, PropsWithChildren, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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
  FormMessage,
} from '../ui/form-elements/Form';
import { Rating } from 'react-simple-star-rating';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface IReviewModal {
  storeId: string;
}

export function ReviewModal({
  children,
  storeId,
}: PropsWithChildren<IReviewModal>) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<IReviewInput>({
    mode: 'onChange',
  });

  const { createReview, isLoadingCreate } = useCreateReview(storeId);

  const onSubmit: SubmitHandler<IReviewInput> = (data: IReviewInput) => {
    createReview(data);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Review</DialogTitle>
          <DialogDescription>
            Please leave a comment and rating for the product
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='rating'
              rules={{ required: 'Rating is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Rating
                      onClick={field.onChange}
                      initialValue={field.value}
                      SVGstyle={{ display: 'inline-block' }}
                      size={20}
                      transition
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='text'
              rules={{ required: 'Text is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Write your review here...'
                      disabled={isLoadingCreate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button variant='primary' disabled={isLoadingCreate}>
                {isLoadingCreate ? 'Creating...' : 'Create Review'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
