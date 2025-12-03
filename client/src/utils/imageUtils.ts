interface ImgParams {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | string;
  crop?: 'scale' | 'fill' | 'fit';
  blur?: number;
}

export const generateImgPath = (src: string, params: ImgParams = {}) => {
  if (!src) return '';

  try {
    const url = new URL(src);
    // Путь после /upload/
    const uploadIndex = url.pathname.indexOf('/upload/');
    if (uploadIndex === -1) return src;

    const base = url.origin + url.pathname.slice(0, uploadIndex + 8); // до /upload/
    const path = url.pathname.slice(uploadIndex + 8); // после /upload/

    const transformations: string[] = [];
    if (params?.width) transformations.push(`w_${params.width}`);
    if (params?.height) transformations.push(`h_${params.height}`);
    if (params?.crop) transformations.push(`c_${params.crop}`);
    if (params?.quality) transformations.push(`q_${params.quality}`);
    if (params?.format) transformations.push(`f_${params.format}`);
    if (params?.blur) transformations.push(`e_blur:${params.blur}`);

    const transformationStr = transformations.join(',');

    return `${base}${transformationStr ? transformationStr + '/' : ''}${path}`;
  } catch (err) {
    return src;
  }
};

export const categoryImgParams: ImgParams = {
  width: 200,
  format: 'auto',
  quality: 'auto',
};

export const categoryImgBlurParams: ImgParams = {
  ...categoryImgParams,
  blur: 1000,
};

export const productImgParams: ImgParams = {
  width: 500,
  format: 'auto',
  quality: 'auto',
};

export const productImgBlurParams: ImgParams = {
  ...productImgParams,
  blur: 1000,
};

export const generateImgPath1 = (src: string, options: ImgParams = {}) => {
  if (!src) return '';

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options;

  // вытаскиваем путь после upload
  const [, pathAfterUpload] = src.split('/upload/');
  if (!pathAfterUpload) return src;

  // формируем параметры трансформации
  const transformations = [
    width ? `w_${width}` : '',
    height ? `h_${height}` : '',
    `q_${quality}`,
    `f_${format}`,
    crop ? `c_${crop}` : '',
  ]
    .filter(Boolean)
    .join(',');

  // используем свой домен / прокси
  const proxyDomain = '/api/cloudinary/files/proxy';

  return `${proxyDomain}?path=${encodeURIComponent(pathAfterUpload)}&tr=${encodeURIComponent(transformations)}`;
};
