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
          <AccordionTrigger className='px-4 py-4 text-left text-lg font-medium hover:no-underline'>
            {item.title}
          </AccordionTrigger>

          <AccordionContent className='px-4 pb-4 leading-relaxed text-neutral-600'>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
