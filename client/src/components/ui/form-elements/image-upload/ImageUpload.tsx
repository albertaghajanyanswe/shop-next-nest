'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { X, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImageUpload } from './useImageUpload';
import { useDeleteImage } from './useDeleteImage';
import { generateImgPath } from '@/lib/imageUtils';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[] | ((prev: string[]) => string[])) => void;
  folder?: string;
  isDisabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  isDisabled,
}: ImageUploadProps) {
  const { handleUpload, isUploading } = useImageUpload({
    folder,
    onChange: (newUrls) => onChange([...value, ...newUrls]),
  });

  const { deleteImage, isDeleting } = useDeleteImage((url) =>
    onChange(value.filter((item) => item !== url))
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleUpload(acceptedFiles);
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    disabled: isDisabled || isUploading,
  });

  return (
    <div>
      {/* Dropzone area */}
      <div
        {...getRootProps()}
        className={cn(
          'group cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors sm:p-6',
          isDragActive
            ? 'border-primary-700 text-primary-700 bg-blue-50'
            : 'hover:border-primary-700 hover:text-primary-700 border-gray-300',
          (isUploading || isDisabled) && 'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <div className='flex flex-col items-center justify-center space-y-2'>
          <ImagePlus className='group-hover:text-primary-700 h-6 w-6 text-gray-500 transition-colors' />
          <p
            className={cn(
              'group-hover:text-primary-700 text-sm text-neutral-500 transition-colors',
              isDragActive && 'text-primary-700'
            )}
          >
            {isUploading
              ? 'Uploading...'
              : 'Drag & drop or click to upload images'}
          </p>
        </div>
      </div>

      {/* Preview grid */}
      {value.length > 0 && (
        <div className='mt-4 gap-4 grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {value.map((url) => (
            <div
              key={url}
              className='group relative aspect-square w-full overflow-hidden rounded-md border border-neutral-200 hover:border-neutral-400'
            >
              <Image
                src={generateImgPath(url)}
                alt='Product image'
                fill
                className='object-contain'
              />
              <button
                type='button'
                disabled={isDeleting || isUploading}
                onClick={() => deleteImage(url)}
                // className='cursor-pointer absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100'
                className='absolute top-2 right-2 cursor-pointer rounded-full bg-black/60 p-1 text-white'
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
