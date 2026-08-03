// ==========================================================
// CURRENCY
// ==========================================================

export const currency = "USD";

// ==========================================================
// CATEGORIES
// ==========================================================

export const categories = [
  "All",
  "Laptops",
  "Smartphones",
  "Audio",
  "Wearables",
  "Accessories",
  "Gaming",
];

// ==========================================================
// PRODUCTS
// ==========================================================

export const products = [
  {
    id: 1,
    name: "MacBook Pro M4",
    brand: "Apple",
    category: "Laptops",
    price: 2499,
    oldPrice: 2699,
    stock: 12,
    rating: 4.9,
    reviews: 352,
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    featured: true,
    newArrival: true,
    bestseller: true,
    description: "Apple MacBook Pro powered by the M4 chip.",
  },
  {
    id: 2,
    name: "Dell XPS 15",
    brand: "Dell",
    category: "Laptops",
    price: 1899,
    oldPrice: 2099,
    stock: 10,
    rating: 4.8,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    featured: true,
    newArrival: false,
    bestseller: true,
    description: "Premium Windows laptop with Intel Core Ultra.",
  },
  {
    id: 3,
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    price: 1399,
    oldPrice: 1499,
    stock: 15,
    rating: 4.9,
    reviews: 480,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    featured: true,
    newArrival: true,
    bestseller: true,
    description: "Samsung flagship smartphone.",
  },
  {
    id: 4,
    name: "iPhone 17 Pro",
    brand: "Apple",
    category: "Smartphones",
    price: 1499,
    oldPrice: 1599,
    stock: 20,
    rating: 5.0,
    reviews: 610,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5",
    featured: true,
    newArrival: true,
    bestseller: true,
    description: "Apple's newest Pro iPhone.",
  },
  {
    id: 5,
    name: "Sony WH-1000XM6",
    brand: "Sony",
    category: "Audio",
    price: 449,
    oldPrice: 499,
    stock: 25,
    rating: 4.8,
    reviews: 265,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    featured: true,
    newArrival: false,
    bestseller: true,
    description: "Premium noise cancelling headphones.",
  },
  {
    id: 6,
    name: "Apple Watch Ultra 3",
    brand: "Apple",
    category: "Wearables",
    price: 899,
    oldPrice: 999,
    stock: 14,
    rating: 4.8,
    reviews: 194,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    featured: false,
    newArrival: true,
    bestseller: false,
    description: "Rugged premium smartwatch.",
  },
  {
    id: 7,
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    category: "Accessories",
    price: 99,
    oldPrice: 119,
    stock: 40,
    rating: 4.9,
    reviews: 510,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    featured: false,
    newArrival: false,
    bestseller: true,
    description: "Professional productivity mouse.",
  },
  {
    id: 8,
    name: "PlayStation 5 Pro",
    brand: "Sony",
    category: "Gaming",
    price: 699,
    oldPrice: 749,
    stock: 8,
    rating: 4.9,
    reviews: 340,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
    featured: true,
    newArrival: true,
    bestseller: true,
    description: "Next-generation gaming console.",
  },
];

// ==========================================================
// FEATURED LISTS
// ==========================================================

export const featuredProducts = products.filter(
  (product) => product.featured
);

export const newArrivals = products.filter(
  (product) => product.newArrival
);

export const bestSellers = products.filter(
  (product) => product.bestseller
);

export const trendingProducts = [...products]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 6);

export default products;