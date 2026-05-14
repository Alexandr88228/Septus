export type PromotionCard = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  imageUrl?: string;
  imageAlt?: string;
  buttonText?: string;
  buttonHref?: string;
  validFrom?: string;
  validUntil?: string;
  discountPercent?: number;
};
/** Редактируйте акции здесь — тексты и заголовки карточек */
export const PROMOTION_CARDS: PromotionCard[] = [
  {
    id: 'pension',
    title: 'Скидка пенсионерам',
    description: 'Специальные условия при предъявлении пенсионного удостоверения. Уточняйте размер скидки у менеджера.',
    badge: '−5%',
  },
  {
    id: 'referral',
    title: 'Скидка по рекомендации',
    description: 'Если вы пришли по рекомендации нашего клиента — скидка на оборудование или монтаж по согласованию.',
    badge: 'Рекомендация',
  },
  {
    id: 'new-client',
    title: 'Скидка новому клиенту',
    description: 'Первый заказ «под ключ» — персональное предложение после бесплатного выезда инженера.',
    badge: 'Новый клиент',
  },
  {
    id: 'builders',
    title: 'Застройщикам и прорабам',
    description: 'Отдельные условия для строителей, прорабов и застройщиков при объёме от нескольких объектов.',
    badge: 'B2B',
  },
];
