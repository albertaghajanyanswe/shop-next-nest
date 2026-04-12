import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';

export default function TermsPageRu() {
  return (
    <>
      <Breadcrumbs
        items={[{ title: 'Главная', href: '/' }, { title: 'Правила и условия' }]}
      />

      <PageHeader
        title='Пользовательское соглашение'
        description='Пожалуйста, внимательно ознакомьтесь с нашими условиями перед использованием услуг.'
        classNames='mt-4'
      />

      <p className='mb-4 text-sm text-neutral-500'>
        Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
      </p>

      <div className='space-y-6 text-sm leading-relaxed'>
        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>1. Принятие условий</h2>
          <p className='text-shop-muted-text-7'>
            Получая доступ или используя <b>{SITE_NAME}</b>, вы соглашаетесь соблюдать эти Условия. Если вы не согласны с какой-либо частью данных условий, вы должны прекратить использование платформы.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>2. Ответственность пользователя</h2>
          <p className='text-shop-muted-text-7'>
            Вы несете единоличную ответственность за всю информацию и материалы, которые публикуете на <b>{SITE_NAME}</b>.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>3. Интеллектуальная собственность</h2>
          <p className='text-shop-muted-text-7'>
            Весь контент на <b>{SITE_NAME}</b> защищен авторским правом и принадлежит <b>{SITE_NAME}</b> или соответствующим правообладателям.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>4. Объявления и сделки</h2>
          <p className='text-shop-muted-text-7'>
            <b>{SITE_NAME}</b> — это онлайн-платформа, которая позволяет пользователям размещать объявления о покупке и продаже. Мы не гарантируем качество и законность объявлений.
          </p>
        </section>

        <section className='space-y-2'>
          <h2 className='text-lg font-semibold text-shop-primary-text'>5. Запрещенные действия</h2>
          <ul className='list-disc space-y-1 pl-5 text-shop-muted-text-7'>
            <li>Размещение ложного или незаконного контента</li>
            <li>Использование автоматизированных средств доступа к платформе</li>
            <li>Публикация нелегальных товаров или услуг</li>
          </ul>
        </section>
      </div>
    </>
  );
}
