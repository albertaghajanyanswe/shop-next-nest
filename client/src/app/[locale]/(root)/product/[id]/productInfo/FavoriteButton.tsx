import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Button } from '@/components/ui/Button';
import { useProfile } from '@/hooks/useProfile';
import { userService } from '@/services/user.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { memo } from 'react';
import toast from 'react-hot-toast';
import { CustomTooltip } from '@/components/customComponents/CustomTooltip';

interface FavoriteButtonProps {
  productId: string;
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
  productId,
  className = '',
  btnVariant = 'secondary',
  onlyIcon = true,
}: FavoriteButtonProps) {
  const { user } = useProfile();
  const queryClient = useQueryClient();
  const { mutate: toggleFavorite, isPending } = useMutation({
    mutationKey: QUERY_KEYS.toggleFavorite,
    mutationFn: () => userService.toggleFavorite(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });

  const isExists = user?.favorites?.some((p) => p.id === productId);

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('Please login to add product in favorite');
    }
    toggleFavorite();
  };
  const button = (
    <Button
      variant={btnVariant}
      size={onlyIcon ? 'icon' : 'default'}
      onClick={handleToggleFavorite}
      disabled={isPending}
      className={className}
      aria-label='Toggle favorite'
    >
      {isExists ? (
        <>
          <AiFillHeart className='text-primary size-4' />
          {!onlyIcon && (
            <span className='text-shop-primary-text'>
              Remove from favorites
            </span>
          )}
        </>
      ) : (
        <>
          <AiOutlineHeart className='size-4' />
          {!onlyIcon && (
            <span className='text-shop-primary-text'>Add to favorites</span>
          )}
        </>
      )}
    </Button>
  );

  return onlyIcon ? (
    <CustomTooltip
      text={isExists ? 'Remove from favorites' : 'Add to favorites'}
    >
      {button}
    </CustomTooltip>
  ) : (
    button
  );
}

export default memo(FavoriteButton);
