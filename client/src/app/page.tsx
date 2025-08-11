import Image from 'next/image';

export default function Home() {
  let a: any = 10;
  return (
    <div className='tw:bg-primary-100 tw:hover:bg-primary-300'>
      <main className='row-start-2 flex flex-col items-center gap-[32px] sm:items-start'>
        <Image
          className='dark:invert'
          src='/next.svg'
          alt='Next.js logo'
          width={180}
          height={38}
          priority
        />
      </main>
    </div>
  );
}
