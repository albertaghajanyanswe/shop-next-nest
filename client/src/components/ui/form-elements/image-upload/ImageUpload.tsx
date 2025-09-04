import Image from 'next/image';
import { useUpload } from './useUpload';
import { Button } from '../../Button';
import { cn } from '@/lib/utils';
import { ImagePlus } from 'lucide-react';

interface ImageUploadProps {
  isDisabled?: boolean;
  onChange: (value: string[]) => void;
  value: string[];
}

export function ImageUpload({ isDisabled, onChange, value }: ImageUploadProps) {
  const { handleButtonClick, handleFileChange, isUploading, fileInputRef } =
    useUpload({ onChange, folder: 'products' });

  console.log(value);
  return (
    <div>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6'>
        {value.map((url) => {
          return (
            <div
              key={url}
              className='relative h-[200px] w-[200px] overflow-hidden rounded-md'
            >
              <Image src={url} alt='image' fill className='object-cover' />
            </div>
          );
        })}
      </div>
      <Button
        type='button'
        variant='secondary'
        onClick={handleButtonClick}
        disabled={isDisabled || isUploading}
        className={cn({
          'mt-4': value.length > 0,
        })}
      >
        <ImagePlus className='mr-2 size-4' />
        Upload image
      </Button>
      <input
        type='file'
        multiple
        className='hidden'
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isDisabled}
      />
    </div>
  );
}
