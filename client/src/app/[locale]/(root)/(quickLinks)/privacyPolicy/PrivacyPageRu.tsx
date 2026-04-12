import Breadcrumbs from '@/components/customComponents/Breadcrumbs';
import PageHeader from '@/components/customComponents/PageHeader';
import { SITE_NAME } from '@/utils/constants';

export default function PrivacyPageRu() {
  return (
    <>
      <Breadcrumbs
        items={[{ title: 'Главная', href: '/' }, { title: 'Политика конфиденциальности' }]}
      />
      <PageHeader
        title='Политика конфиденциальности'
        description='Ваша конфиденциальность важна для нас. Эта политика объясняет, как мы обрабатываем ваши данные.'
        classNames='mt-4'
      />
      <section className='leading-relaxed space-y-6 text-shop-muted-text-6'>
        <p className='text-sm'>
          Эта Политика конфиденциальности описывает, как {SITE_NAME} («мы», «наш», «нас»)
          собирает, использует и защищает вашу личную информацию.
        </p>
        <h2 className='mt-4 mb-3 text-xl font-semibold text-shop-primary-text'>1. Информация, которую мы собираем</h2>
        <p className='text-sm'>Мы можем собирать следующие категории личной информации:</p>
        <ul className='list-disc pl-6 text-sm'>
          <li>Контактные данные (имя, адрес электронной почты, номер телефона)</li>
          <li>Информация о заказе (платежные данные и адрес доставки)</li>
          <li>Поведение при просмотре, аналитические данные и информация об устройстве</li>
          <li>Платежные реквизиты (обрабатываются через сторонних поставщиков)</li>
        </ul>
        <h2 className='mt-4 mb-3 text-xl font-semibold text-shop-primary-text'>2. Как мы используем вашу информацию</h2>
        <p className='text-sm'>Ваши данные могут быть использованы для:</p>
        <ul className='list-disc pl-6 text-sm'>
          <li>Обработки заказов и поддержки клиентов</li>
          <li>Создания и аутентификации аккаунта</li>
          <li>Улучшения функциональности веб-сайта и процесса совершения покупок</li>
          <li>Маркетинговых коммуникаций (с вашего согласия)</li>
          <li>Предотвращения мошенничества и обеспечения безопасности платформы</li>
        </ul>
        <h2 className='mt-4 mb-3 text-xl font-semibold text-shop-primary-text'>3. Файлы cookie и технологии отслеживания</h2>
        <p className='text-sm'>Мы используем файлы cookie, аналитические инструменты и подобные технологии для персонализации контента, анализа производительности и улучшения пользовательского опыта.</p>
        <h2 className='mt-4 mb-3 text-xl font-semibold text-shop-primary-text'>4. Пишите нам</h2>
        <p className='text-sm'>
          По вопросам конфиденциальности свяжитесь с нами по адресу{' '}
          <a href='mailto:albert.aghajanyan.mw@gmail.com' className='text-blue-600 underline underline-offset-4 hover:text-blue-800'>
            albert.aghajanyan.mw@gmail.com
          </a>.
        </p>
      </section>
    </>
  );
}
