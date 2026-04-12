import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { PropsWithChildren } from 'react';
import { useTranslations } from 'next-intl';

interface ConfirmModalProps {
  handleConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  children,
  handleConfirm,
  title,
  description,
  confirmText,
  cancelText,
}: PropsWithChildren<ConfirmModalProps>) {
  const t = useTranslations('Modals');

  const displayTitle = title || t('confirm_title');
  const displayDescription = description || t('confirm_description');
  const displayConfirmText = confirmText || t('confirm_continue');
  const displayCancelText = cancelText || t('confirm_cancel');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{displayTitle}</AlertDialogTitle>
          <AlertDialogDescription>{displayDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{displayCancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className='bg-primary-700 hover:bg-primary-700/90'
          >
            {displayConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
