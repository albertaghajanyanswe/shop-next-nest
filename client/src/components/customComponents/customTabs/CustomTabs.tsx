'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface CustomTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function CustomTabs({
  tabs,
  defaultValue,
  className = 'w-full',
  listClassName = 'flex h-12 space-x-1 rounded-md bg-red-500/10 dark:bg-red-400 p-1',
  triggerClassName = 'h-full w-full text-shop-primary-text',
  contentClassName = '',
}: CustomTabsProps) {
  const activeTab = defaultValue || tabs[0]?.id || '';

  return (
    <Tabs defaultValue={activeTab} className={`${className}`}>
      <TabsList className={listClassName}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={`cursor-pointer ${triggerClassName} px-1 text-xs whitespace-break-spaces sm:px-2 sm:text-sm`}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className={contentClassName}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
