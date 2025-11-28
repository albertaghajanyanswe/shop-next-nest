import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fileService } from '@/services/file.service';
import { QUERY_KEYS } from '@/shared/queryConstants';

export function useDeleteImage(onSuccess?: (url: string) => void) {
  const { mutate: deleteImage, isPending: isDeleting } = useMutation({
    mutationKey: [QUERY_KEYS.deleteImage],
    mutationFn: (url: string) => fileService.delete(url),
    onSuccess: (_, url) => {
      toast.success('Image deleted');
      onSuccess?.(url);
    },
    onError: () => toast.error('Failed to delete image'),
  });

  return { deleteImage, isDeleting };
}
