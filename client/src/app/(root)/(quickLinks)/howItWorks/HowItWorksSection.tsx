import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import { memo } from 'react';

function HowItWorksSection({
  title,
  steps,
  videoSrc,
  imageSrc,
}: {
  title: string;
  steps: string[];
  videoSrc?: string;
  imageSrc?: string;
}) {
  return (
    <section className='grid grid-cols-1 items-center gap-6 sm:gap-12 lg:grid-cols-2'>
      {/* Left – instructions */}
      <div className='space-y-6'>
        <h2 className='text-xl font-semibold'>{title}</h2>

        <Card>
          <CardContent className=''>
            <ol className='list-inside list-decimal space-y-2 text-xs text-neutral-700 sm:space-y-4 sm:text-sm'>
              {steps.map((step, index) => (
                <li
                  key={index}
                  className='text-xs leading-relaxed font-medium text-neutral-700 sm:text-sm'
                >
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Right – video */}
      <div className='bg-muted relative overflow-hidden rounded-xl border shadow-sm'>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            width={600}
            height={500}
            className='static h-full w-full object-cover'
          />
        ) : (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className='h-full w-full object-cover'
          />
        )}
      </div>
    </section>
  );
}

export default memo(HowItWorksSection);
