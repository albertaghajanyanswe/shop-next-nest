import { Button } from '@/components/ui/Button';
import { useProfile } from '@/hooks/useProfile';
import { userService } from '@/services/user.service';
import { QUERY_KEYS } from '@/shared/constants';
import { IProduct } from '@/shared/types/product.interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface FavoriteButtonProps {
  product: IProduct;
  className?: string;
}

export default function FavoriteButton({ product, className = '' }: FavoriteButtonProps) {
  const { user } = useProfile();
  const queryClient = useQueryClient();
  const { mutate: toggleFavorite, isPending } = useMutation({
    mutationKey: QUERY_KEYS.toggleFavorite,
    mutationFn: () => userService.toggleFavorite(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });

  if (!user) return null;
  const isExists = user.favorites.some((p) => p.id === product.id);

  return (
    <Button
      variant='secondary'
      size='icon'
      onClick={() => toggleFavorite()}
      disabled={isPending}
      className={className}
      aria-label='Toggle favorite'
    >
      {isExists ? (
        <AiFillHeart className='size-5 text-red-500' />
      ) : (
        <AiOutlineHeart className='size-5' />
      )}
    </Button>
  );
}
