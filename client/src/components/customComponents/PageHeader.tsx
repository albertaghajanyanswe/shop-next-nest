export default function PageHeader({
  title,
  description,
  classNames = '',
}: {
  title: string;
  description?: string;
  classNames?: string;
}) {
  return (
    <header className={`mb-6 ${classNames}`}>
      <h1 className='mb-4 text-xl font-semibold tracking-tight sm:text-2xl'>
        {title}
      </h1>
      {description && (
        <p className='leading-relaxed; text-sm text-shop-muted-text-6'>
          {description}
        </p>
      )}
    </header>
  );
}
