import { Card, CardContent } from '@/components/ui/Card';
import { memo } from 'react';

function HowItWorksSection({
  title,
  steps,
  videoSrc,
}: {
  title: string;
  steps: string[];
  videoSrc: string;
}) {
  return (
    <section className='grid grid-cols-1 items-center gap-6 sm:gap-12 lg:grid-cols-2'>
      {/* Left – instructions */}
      <div className='space-y-6'>
        <h2 className='text-xl font-semibold'>{title}</h2>

        <Card>
          <CardContent className=''>
            <ol className='list-inside list-decimal space-y-4 text-neutral-700'>
              {steps.map((step, index) => (
                <li
                  key={index}
                  className='text-base leading-relaxed text-neutral-700'
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
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className='h-full w-full object-cover'
        />
      </div>
    </section>
  );
}

export default memo(HowItWorksSection);
