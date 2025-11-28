import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useProfile } from '@/hooks/useProfile';
import { userService } from '@/services/user.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { GetProductWithDetails } from '@/generated/orval/types';
import { memo } from 'react';

interface FavoriteButtonProps {
  product: GetProductWithDetails;
  className?: string;
  btnVariant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary'
    | null
    | undefined;
}

function FavoriteButton({
  product,
  className = '',
  btnVariant = 'secondary',
}: FavoriteButtonProps) {
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
  const isExists = user.favorites?.some((p) => p.id === product.id);

  return (
    <Button
      variant={btnVariant}
      size='icon'
      onClick={() => toggleFavorite()}
      disabled={isPending}
      className={className}
      aria-label='Toggle favorite'
    >
      {isExists ? (
        <AiFillHeart className='text-shop-btn-dark-green size-5' />
      ) : (
        <AiOutlineHeart className='size-5' />
      )}
    </Button>
  );
}

export default memo(FavoriteButton);
