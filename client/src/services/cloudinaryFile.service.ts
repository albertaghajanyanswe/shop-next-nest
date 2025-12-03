import { axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';

interface IFile {
  name: string;
  url: string;
}

interface IFileResponse {
  public_id: string;
  secure_url: string;
}

class CloudinaryFileService {
  async upload(file: FormData, folder?: string) {
    const { data } = await axiosWithAuth<IFileResponse[]>({
      url: API_URL.cloudinaryFiles(``),
      method: 'POST',
      data: file,
      params: { folder },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  }

  async delete(url: string) {
    const { data } = await axiosWithAuth<{ success: boolean }>({
      url: API_URL.cloudinaryFiles(),
      method: 'DELETE',
      data: { url },
    });

    return data;
  }
}

export const cloudinaryFileService = new CloudinaryFileService();
