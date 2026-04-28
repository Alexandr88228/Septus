import type { StructureResolver } from 'sanity/structure';

const singleton = (S: Parameters<StructureResolver>[0], title: string, schemaType: string, documentId: string) =>
  S.listItem()
    .title(title)
    .schemaType(schemaType)
    .child(S.document().schemaType(schemaType).documentId(documentId).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Контент сайта')
    .items([
      singleton(S, 'Главная страница', 'homePage', 'homePage'),
      S.divider(),
      S.documentTypeListItem('product').title('Каталог товаров'),
      S.documentTypeListItem('category').title('Категории'),
      S.documentTypeListItem('priceItem').title('Цены'),
      S.documentTypeListItem('promotion').title('Акции'),
      S.documentTypeListItem('review').title('Отзывы'),
      S.divider(),
      singleton(S, 'Контакты', 'contacts', 'contacts'),
      S.documentTypeListItem('seoSettings').title('SEO'),
    ]);
