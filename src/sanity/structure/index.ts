import type { StructureResolver } from 'sanity/structure';

const singleton = (S: Parameters<StructureResolver>[0], title: string, schemaType: string, documentId: string) =>
  S.listItem()
    .title(title)
    .schemaType(schemaType)
    .child(S.document().schemaType(schemaType).documentId(documentId).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Септус — контент')
    .items([
      singleton(S, 'Главная страница', 'homePage', 'homePage'),
      S.divider(),
      S.documentTypeListItem('product').title('Каталог — серии и модели'),
      S.documentTypeListItem('caseStudy').title('Кейсы / монтажи'),
      S.documentTypeListItem('promotion').title('Акции'),
      S.documentTypeListItem('category').title('Категории'),
      S.documentTypeListItem('priceItem').title('Прайс (строки)'),
      S.documentTypeListItem('review').title('Отзывы'),
      S.divider(),
      singleton(S, 'Контакты', 'contacts', 'contacts'),
      S.documentTypeListItem('seoSettings').title('Глобальное SEO'),
    ]);
