import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useProfile } from '@/hooks/useProfile';
import { userService } from '@/services/user.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { GetProductWithDetails } from '@/generated/orval/types';
import { memo } from 'react';
import toast from 'react-hot-toast';
import { CustomTooltip } from '@/components/ui/CustomTooltip';

interface FavoriteButtonProps {
  product: GetProductWithDetails;
  className?: string;
  btnVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary'
    | null
    | undefined;

  onlyIcon?: boolean;
}

function FavoriteButton({
  product,
  className = '',
  btnVariant = 'secondary',
  onlyIcon = true,
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

  const isExists = user?.favorites?.some((p) => p.id === product.id);

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('Please login to add product in favorite');
    }
    toggleFavorite();
  };
  return (
    <CustomTooltip text='Add to favorites'>
      <Button
        variant={btnVariant}
        size={onlyIcon ? 'icon' : 'default'}
        onClick={handleToggleFavorite}
        disabled={isPending}
        className={className}
        aria-label='Toggle favorite'
      >
        {isExists ? (
          onlyIcon ? (
            <AiFillHeart className='text-shop-btn-dark-green size-5' />
          ) : (
            <>Remove From Favorites</>
          )
        ) : onlyIcon ? (
          <AiOutlineHeart className='size-5' />
        ) : (
          <>Add To Favorites</>
        )}
      </Button>
    </CustomTooltip>
  );
}

export default memo(FavoriteButton);
