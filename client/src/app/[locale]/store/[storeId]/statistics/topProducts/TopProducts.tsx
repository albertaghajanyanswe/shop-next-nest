'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ITopProduct } from '@/shared/types/statistics.interface';
import { formatPrice } from '@/utils/formatPrice';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ITopProductsProps {
  data: ITopProduct[];
}

export function TopProducts({ data }: ITopProductsProps) {
  const t = useTranslations('MiddleStatistics');
  console.log('data = ', data);
  return (
    <Card className='pt-4 pb-0'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 border-b px-4 [.border-b]:pb-4'>
        <CardTitle className='text-xl font-medium tracking-[0.1px]'>
          {t('top_products')}
        </CardTitle>
      </CardHeader>
      <CardContent className='px-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase'>
                  #
                </th>
                <th className='text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase'>
                  {t('product')}
                </th>
                <th className='text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase'>
                  {t('category')}
                </th>
                <th className='text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase'>
                  {t('price')}
                </th>
                <th className='text-muted-foreground px-4 py-3 text-center text-xs font-semibold tracking-wider uppercase'>
                  {t('sold')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((product, index) => (
                <tr
                  key={product.id}
                  className='hover:bg-muted/50 border-b transition-colors'
                >
                  <td className='px-4 py-3'>
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        index < 3
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={44}
                          height={44}
                          className='rounded-lg object-cover'
                        />
                      ) : (
                        <div className='bg-muted flex h-11 w-11 items-center justify-center rounded-lg'>
                          <span className='text-muted-foreground text-xs'>
                            No img
                          </span>
                        </div>
                      )}
                      <span className='truncate font-medium'>
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-right font-medium'>
                    {product.category}
                  </td>
                  <td className='px-4 py-3 text-right font-medium'>
                    {formatPrice(product.price)}
                  </td>
                  <td className='px-4 py-3 text-center font-medium'>
                    {product.sold.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
