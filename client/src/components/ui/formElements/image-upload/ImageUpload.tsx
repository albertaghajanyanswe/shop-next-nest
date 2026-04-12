'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { X, ImagePlus, LoaderCircle } from 'lucide-react';
import { cn } from '@/utils/common';
import { generateImgPath } from '@/utils/imageUtils';
import { useImageUploadCloudinary } from './useImageUploadCloudinary';
import { useDeleteImageCloudinary } from './useDeleteImageCloudinary';
import { Button } from '../../Button';

interface ImageUploadProps {
  value: string | string[];
  onChange: (
    value: string | string[] | ((prev: string | string[]) => string | string[])
  ) => void;
  folder?: string;
  isDisabled?: boolean;
  multiple?: boolean; // Новый prop
  maxFiles?: number; // Лимит файлов для multiple
}

export function ImageUpload({
  value,
  onChange,
  folder,
  isDisabled,
  multiple = true,
  maxFiles,
}: ImageUploadProps) {
  // Нормализуем value к массиву для удобства
  const normalizedValue = Array.isArray(value) ? value : value ? [value] : [];

  const { handleUpload, isUploading } = useImageUploadCloudinary({
    folder,
    onChange: (newUrls) => {
      if (multiple) {
        const updatedValue = [...normalizedValue, ...newUrls];
        onChange(updatedValue);
      } else {
        // Для single берём только первый загруженный файл
        onChange(newUrls[0] || '');
      }
    },
  });

  const { deleteImage, isDeleting } = useDeleteImageCloudinary((url) => {
    if (multiple) {
      onChange(normalizedValue.filter((item) => item !== url));
    } else {
      onChange('');
    }
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Для single режима берём только один файл
      const filesToUpload = multiple
        ? acceptedFiles
        : acceptedFiles.slice(0, 1);

      // Проверяем maxFiles для multiple
      if (multiple && maxFiles) {
        const remainingSlots = maxFiles - normalizedValue.length;
        if (remainingSlots <= 0) return;
        handleUpload(filesToUpload.slice(0, remainingSlots));
      } else {
        handleUpload(filesToUpload);
      }
    },
    [handleUpload, multiple, maxFiles, normalizedValue.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    disabled:
      isDisabled ||
      isUploading ||
      (multiple && maxFiles ? normalizedValue.length >= maxFiles : false),
    multiple: multiple,
  });

  const isMaxReached =
    multiple && maxFiles && normalizedValue.length >= maxFiles;

  return (
    <div>
      {/* Dropzone area - показываем только если нет изображения в single режиме или не достигнут лимит */}
      {(multiple || normalizedValue.length === 0) && !isMaxReached && (
        <div
          {...getRootProps()}
          className={cn(
            'group cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors sm:p-6',
            isDragActive
              ? 'border-shop-light-primary text-shop-light-primary bg-primary-100'
              : 'hover:border-shop-light-primary hover:text-shop-light-primary border-gray-300',
            (isUploading || isDisabled) && 'cursor-not-allowed opacity-50'
          )}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center justify-center space-y-2'>
            <ImagePlus className='group-hover:text-shop-light-primary h-6 w-6 text-shop-muted-text-6 transition-colors' />
            <p
              className={cn(
                'group-hover:text-shop-light-primary text-sm text-shop-muted-text-6 transition-colors',
                isDragActive && 'text-primary-700'
              )}
            >
              {isUploading
                ? 'Uploading...'
                : multiple
                  ? `Drag & drop or click to upload images${maxFiles ? ` (${normalizedValue.length}/${maxFiles})` : ''}`
                  : 'Drag & drop or click to upload an image'}
            </p>
          </div>
        </div>
      )}

      {isMaxReached && (
        <div className='rounded-lg border-2 border-dashed border-gray-300 p-4 text-center'>
          <p className='text-sm text-shop-muted-text-6'>
            Maximum number of images reached ({maxFiles})
          </p>
        </div>
      )}

      {/* Preview grid */}
      <div
        className={cn(
          'mt-4 grid gap-4',
          multiple
            ? 'xs:grid-cols-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
            : 'max-w-xs grid-cols-1'
        )}
      >
        {normalizedValue.map((url) => (
          <div
            key={url}
            className='group relative aspect-square w-40 overflow-hidden rounded-md border border-neutral-200 hover:border-neutral-400'
          >
            <Image
              src={generateImgPath(url)}
              alt='Product image'
              width={160}
              height={160}
              className='min-h-[160px] min-w-[160px] object-contain'
            />
            <Button
              size='icon'
              type='button'
              disabled={isDeleting || isUploading}
              onClick={() => deleteImage(url)}
              className='absolute top-2 right-2 h-6 w-6 cursor-pointer rounded-full bg-red-500 p-1 text-white transition hover:bg-red-600'
            >
              <X size={16} />
            </Button>
          </div>
        ))}

        {isUploading && (
          <div className='text-darkRed animate-scale-pulse-slow flex min-h-[128px] w-fit min-w-[128px] items-center gap-1 space-x-2 rounded-md border border-neutral-200 p-4'>
            <LoaderCircle className='text-shop-orange animate-spin' />
            <span className='text-shop-orange flex flex-row items-center justify-center gap-x-1 text-xs'>
              Uploading...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
