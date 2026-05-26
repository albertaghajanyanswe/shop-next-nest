import Loading from '@/components/customComponents/loading/Loading';

export default function StoreLoading() {
  return (
    <div className='bg-shop-bg my-6 flex min-h-50 w-full flex-col items-center justify-center space-y-3 rounded-md py-8 text-center'>
      <Loading />
    </div>
  );
}
