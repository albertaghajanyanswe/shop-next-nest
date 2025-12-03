import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { fileService } from '@/services/file.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { cloudinaryFileService } from '@/services/cloudinaryFile.service';

interface UseImageUploadProps {
  folder?: string;
  onChange: (value: string[]) => void;
}

export function useImageUploadCloudinary({ folder, onChange }: UseImageUploadProps) {
  const { mutate: uploadFiles, isPending: isUploading } = useMutation({
    mutationKey: [QUERY_KEYS.uploadImage, folder],
    mutationFn: (formData: FormData) => cloudinaryFileService.upload(formData, folder),
    onSuccess: (data) => {
      const urls = data.map((file) => file.secure_url);
      onChange(urls);
      toast.success('Images uploaded successfully');
    },
    onError: () => toast.error('Failed to upload images'),
  });

  const handleUpload = useCallback(
    (files: File[]) => {
      if (!files.length) return;
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      uploadFiles(formData);
    },
    [uploadFiles]
  );

  return { handleUpload, isUploading };
}
