import type { Product } from '../lib/products';
import { imageUrl } from './image';

export function mapSanityProducts(rows: any[] = []): Product[] {
  return rows
    .filter((row) => row?.name && row?.slug?.current)
    .map((row) => {
      const images = Array.isArray(row.images)
        ? row.images.map((image: any) => imageUrl(image)).filter(Boolean)
        : [];

      return {
        id: row._id,
        name: row.name,
        slug: row.slug.current,
        brand: row.brand || row.name,
        description: row.description || '',
        price: row.price || 'Цена по запросу',
        priceValue: Number(row.priceValue) || 0,
        images,
        features: Array.isArray(row.features) ? row.features : [],
        specs: {
          'Количество пользователей': row.users ? `до ${row.users} чел` : '',
          Производительность: row.capacity || '',
          'Залповый сброс': row.burstDischargeLiters ? `${row.burstDischargeLiters} л` : '',
          'Тип сброса': row.dischargeType || '',
          Энергопотребление: row.energyUsage || '',
          Гарантия: row.warranty || '',
          Размеры: row.dimensions || '',
          Вес: row.weight || '',
        },
        users: Number(row.users) || 5,
        capacity: row.capacity || '',
        dailyCapacityLiters: Number(row.dailyCapacityLiters) || 0,
        burstDischargeLiters: Number(row.burstDischargeLiters) || 0,
        dischargeType: row.dischargeType || 'Самотечный / Принудительный',
        workPrinciple: row.workPrinciple || '',
        energyUsage: row.energyUsage || '',
        dimensions: row.dimensions || '',
        weight: row.weight || '',
        warranty: row.warranty || '',
        suitableFor: row.suitableFor || '',
        cleaningLevel: row.cleaningLevel || '',
        maintenance: row.maintenance || '',
      };
    });
}

export function mapHomeProjects(rows: any[] = []) {
  return rows.map((row) => ({
    ...row,
    image: imageUrl(row.image, row.image || ''),
  }));
}

export function mapReviews(rows: any[] = []) {
  return rows.map((row) => ({
    id: row._id,
    author: row.author,
    area: row.area,
    value: Number(row.value) || 5,
    text: row.text,
  }));
}
