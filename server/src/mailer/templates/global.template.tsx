import * as React from 'react';
import {
  Html,
  Head,
  Tailwind,
  pixelBasedPreset,
} from '@react-email/components';

type GlobalTemplateProps = {
  children: any;
};

const TailwindWrapper = Tailwind as React.FC<{
  config: any;
  children: React.ReactNode;
}>;

export function GlobalTemplate({ children }: GlobalTemplateProps) {
  return (
    <Html>
      <Head />
      <TailwindWrapper
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: '#063c28',
              },
            },
          },
        }}
      >
        {children}
      </TailwindWrapper>
    </Html>
  );
}
