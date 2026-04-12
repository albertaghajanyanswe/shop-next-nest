import { Logo } from '../../mainLayout/header/logo/Logo';
import { Navigation } from './navigation/Navigation';

export function Sidebar() {
  return (
    <div className='bg-shop-light-bg flex h-full flex-col overflow-y-auto border-r px-5 pt-4'>
      <Logo />
      <Navigation />
    </div>
  );
}
