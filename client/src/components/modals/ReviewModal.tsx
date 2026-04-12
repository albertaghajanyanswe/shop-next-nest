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
} from '../ui/formElements/Form';
import { Rating } from 'react-simple-star-rating';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useTranslations } from 'next-intl';

interface IReviewModal {
  storeId: string;
}

export function ReviewModal({
  children,
  storeId,
}: PropsWithChildren<IReviewModal>) {
  const t = useTranslations('Modals');
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
          <DialogTitle>{t('review_title')}</DialogTitle>
          <DialogDescription>{t('review_description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='rating'
              rules={{ required: t('review_rating_required') }}
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
              rules={{ required: t('review_text_required') }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t('review_placeholder')}
                      disabled={isLoadingCreate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button variant='default' disabled={isLoadingCreate}>
                {isLoadingCreate
                  ? t('review_btn_creating')
                  : t('review_btn_create')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
