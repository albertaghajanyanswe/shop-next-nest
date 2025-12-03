import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // or your local VisuallyHidden component
import { DialogDescription } from '@/components/ui/Dialog';

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className='hover-opacity-75 pr-4 transition lg:hidden'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='bg-white p-0'>
        <VisuallyHidden>
          <SheetTitle />
        </VisuallyHidden>
        <VisuallyHidden>
          <DialogDescription>Mobile sidebar dialog</DialogDescription>
        </VisuallyHidden>

        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
