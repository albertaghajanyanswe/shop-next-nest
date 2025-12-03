import { Metadata } from 'next';

interface MetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  isPublic?: boolean;
  keywords?: string[];
  author?: string;
  ogType?: 'website' | 'article';
}

/**
 * Функция для генерации метаданных на серверной стороне
 * Используется в layout.tsx или page.tsx через generateMetadata
 */
export function generateMeta(props: MetaProps): Metadata {
  const {
    title,
    description,
    image = '/images/myStore_logo.svg',
    url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    isPublic = true,
    keywords = [],
    author = '',
    ogType = 'website',
  } = props;

  const fullUrl = url.startsWith('http')
    ? url
    : `${process.env.NEXT_PUBLIC_APP_URL}${url}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    authors: author ? [{ name: author }] : undefined,
    robots: isPublic
      ? { index: true, follow: true, nocache: false }
      : { index: false, follow: false, nocache: true, noarchive: true },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: fullUrl,
    },
  };

  if (isPublic) {
    metadata.openGraph = {
      title,
      description,
      url: fullUrl,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'My Site',
      locale: 'en_US',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: ogType,
    };
  }

  return metadata;
}

/**
 * Клиентский компонент для дополнительных мета-тегов в <head>
 */
export function MetaHead({
  title,
  description,
  isPublic = true,
}: {
  title: string;
  description: string;
  isPublic?: boolean;
}) {
  return (
    <>
      <meta name='description' content={description} />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      {!isPublic && <meta name='robots' content='noindex, nofollow' />}
    </>
  );
}

export const POPULAR_KEYWORDS = [
  'home',
  'store',
  'shop',
  'macbook',
  'mac book',
  'iphone',
  'samsung',
  'online shopping',
];

export const COlLAGE_IMG =
  'https://res.cloudinary.com/dvuo50sjj/image/upload/v1764688568/category-other_ii57rn.avif';
