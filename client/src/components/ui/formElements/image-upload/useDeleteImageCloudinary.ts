import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { cloudinaryFileService } from '@/services/cloudinaryFile.service';

export function useDeleteImageCloudinary(onSuccess?: (url: string) => void) {
  const { mutate: deleteImage, isPending: isDeleting } = useMutation({
    mutationKey: [QUERY_KEYS.deleteImage],
    mutationFn: (url: string) => cloudinaryFileService.delete(url),
    onSuccess: (_, url) => {
      toast.success('Image deleted');
      onSuccess?.(url);
    },
    onError: () => toast.error('Failed to delete image'),
  });

  return { deleteImage, isDeleting };
}
