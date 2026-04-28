export const homePageQuery = `*[_type == "homePage"][0]{
  heroBadge,
  heroTitle,
  heroText,
  heroImage,
  heroBadges,
  benefits,
  projects,
  faqs,
  leadTitle,
  leadText
}`;

export const productsQuery = `*[_type == "product"] | order(name asc){
  _id,
  name,
  slug,
  brand,
  description,
  price,
  priceValue,
  images,
  features,
  users,
  capacity,
  dailyCapacityLiters,
  burstDischargeLiters,
  dischargeType,
  workPrinciple,
  energyUsage,
  dimensions,
  weight,
  warranty,
  suitableFor,
  cleaningLevel,
  maintenance,
  models
}`;

export const reviewsQuery = `*[_type == "review" && isPublished != false] | order(_createdAt desc){
  _id,
  author,
  area,
  value,
  text,
  photo
}`;

export const contactsQuery = `*[_type == "contacts"][0]`;
