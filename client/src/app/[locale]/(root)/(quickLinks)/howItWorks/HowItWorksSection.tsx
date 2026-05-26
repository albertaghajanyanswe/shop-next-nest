import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import { memo, useRef, useEffect } from 'react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !videoSrc) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [videoSrc]);

  return (
    <section
      ref={sectionRef}
      className='grid grid-cols-1 items-center gap-6 sm:gap-12 lg:grid-cols-2'
    >
      {/* Left – instructions */}
      <div className='space-y-6'>
        <h2 className='text-xl font-semibold'>{title}</h2>

        <Card className='bg-shop-bg-default border border-neutral-200'>
          <CardContent className=''>
            <ol className='text-shop-muted-text-7 list-inside list-decimal space-y-2 text-xs sm:space-y-4 sm:text-sm'>
              {steps.map((step, index) => (
                <li
                  key={index}
                  className='text-shop-muted-text-7 text-xs leading-relaxed font-medium sm:text-sm'
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
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            className='h-full w-full object-cover'
            preload='metadata'
            poster='/images/poster.png'
          />
        )}
      </div>
    </section>
  );
}

export default memo(HowItWorksSection);
