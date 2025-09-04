import { ChangeEvent, useCallback, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { fileService } from '@/services/file.service';
import { QUERY_KEYS } from '@/shared/constants';
import { useMutation } from '@tanstack/react-query';

type UseUploadProps = {
  onChange: (value: string[]) => void;
  folder?: string;
};

export function useUpload({ onChange, folder }: UseUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadFiles, isPending: isUploading } = useMutation({
    mutationKey: QUERY_KEYS.uploadImage,
    mutationFn: (formData: FormData) => fileService.upload(formData, folder),
    onSuccess: (data) => {
      onChange(data.map((item) => item.url));
    },
    onError: () => {
      toast.error('Failed to upload image');
    },
  });

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles) {
        const fileArray = Array.from(selectedFiles);
        const formData = new FormData();
        fileArray.forEach((file) => {
          formData.append('files', file);
        });
        uploadFiles(formData);
      }
    },
    [uploadFiles]
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  return useMemo(
    () => ({
      handleButtonClick,
      handleFileChange,
      isUploading,
      fileInputRef,
    }),
    [handleButtonClick, handleFileChange, isUploading, fileInputRef]
  );
}
