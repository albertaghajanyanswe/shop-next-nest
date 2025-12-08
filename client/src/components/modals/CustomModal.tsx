import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';

interface CustomModalProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOutsideClick?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
};

export function CustomModal({
  title,
  description,
  children,
  trigger,
  size = 'md',
  closeOnOutsideClick = true,
  open,
  onOpenChange,
}: CustomModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={sizeClasses[size]}
        onPointerDownOutside={
          !closeOnOutsideClick ? (e) => e.preventDefault() : undefined
        }
      >
        {title && (
          <DialogHeader>
            <DialogTitle className='text-md sm:text-xl'>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}
