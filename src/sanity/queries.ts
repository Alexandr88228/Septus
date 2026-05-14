export const homePageQuery = `*[_type == "homePage"][0]{
  heroBadge,
  heroTitle,
  heroText,
  heroImage,
  heroBadges,
  heroCtaPrimaryLabel,
  heroCtaPrimaryHref,
  heroCtaSecondaryLabel,
  heroCtaSecondaryHref,
  benefits,
  infoBlocks,
  infoBlocksLinkLabel,
  infoBlocksLinkHref,
  "featuredCaseStudies": featuredCaseStudies[]->{
    _id,
    title,
    slug,
    location,
    summary,
    works,
    equipment,
    images,
    seoTitle,
    seoDescription
  },
  projects,
  faqs,
  leadTitle,
  leadText
}`;

export const productsQuery = `*[_type == "product" && (!defined(isPublished) || isPublished != false)] | order(name asc){
  _id,
  isPublished,
  name,
  slug,
  brand,
  description,
  price,
  pricePrefix,
  priceValue,
  priceWas,
  seoTitle,
  seoDescription,
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
  specsExtra,
  models
}`;

export const caseStudiesQuery = `*[_type == "caseStudy" && (!defined(isPublished) || isPublished != false)] | order(sortOrder asc, _createdAt desc){
  _id,
  title,
  slug,
  location,
  summary,
  works,
  equipment,
  images,
  seoTitle,
  seoDescription,
  sortOrder
}`;

export const promotionsQuery = `*[_type == "promotion" && (!defined(isActive) || isActive != false)] | order(sortOrder asc, _createdAt desc){
  _id,
  title,
  description,
  badge,
  discountPercent,
  image,
  validFrom,
  validUntil,
  buttonText,
  buttonHref,
  sortOrder,
  isActive
}`;

export const reviewsQuery = `*[_type == "review" && (!defined(isPublished) || isPublished != false)] | order(_createdAt desc){
  _id,
  author,
  area,
  value,
  text,
  photo
}`;

export const contactsQuery = `*[_type == "contacts"][0]`;
