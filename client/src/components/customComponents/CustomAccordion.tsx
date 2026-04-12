'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion';

interface FAQItem {
  title: string;
  content: string;
}

export function CustomAccordion({ items }: { items: FAQItem[] }) {
  return (
    <Accordion type='single' collapsible className='w-full'>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`faq-${index}`}>
          <AccordionTrigger className='px-1 py-4 text-left text-sm font-medium hover:no-underline sm:px-4 sm:text-lg'>
            {item.title}
          </AccordionTrigger>

          <AccordionContent className='text-shop-muted-text-6 px-4 pb-4 leading-relaxed'>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
