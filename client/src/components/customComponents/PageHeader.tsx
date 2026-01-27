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
      <h1 className='mb-4 text-xl sm:text-2xl font-semibold tracking-tight'>{title}</h1>
      {description && (
        <p className='leading-relaxed; text-sm text-neutral-600'>
          {description}
        </p>
      )}
    </header>
  );
}
