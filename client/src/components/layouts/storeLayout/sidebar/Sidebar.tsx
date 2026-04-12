import { Logo } from '../../mainLayout/header/logo/Logo';
import { Navigation } from './navigation/Navigation';

export function Sidebar() {
  return (
    <div className='flex h-full flex-col overflow-y-auto border-r bg-shop-light-bg px-5 pt-4'>
      <Logo />
      <Navigation />
    </div>
  );
}
