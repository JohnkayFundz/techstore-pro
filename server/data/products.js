// ==========================================================
// TECHSTORE PRO
// PRODUCT SEED DATA
// ==========================================================

const products = [
  // ========================================================
  // 1. MACBOOK PRO M4
  // ========================================================

  {
    name: "MacBook Pro M4 16-inch",

    description:
      "Apple MacBook Pro powered by the M4 chip, featuring exceptional performance, a stunning Liquid Retina XDR display, and long battery life.",

    price: 2499,
    oldPrice: 2699,
    discount: 7,
    currency: "USD",

    category: "Laptops",
    brand: "Apple",
    sku: "APP-MBP-M4-16",

    image: "/products/macbook-pro-m4.jpg",

    images: ["/products/macbook-pro-m4.jpg"],

    features: [
      "Apple M4 Chip",
      "16-inch Liquid Retina XDR Display",
      "24GB Unified Memory",
      "512GB SSD",
      "Up to 24 hours battery life",
    ],

    stock: 12,

    shipping: "Free shipping",
    warranty: "1 Year Apple Warranty",

    rating: 5,
    numReviews: 0,

    featured: true,
    bestseller: true,
    newArrival: true,
  },

  // ========================================================
  // 2. DELL XPS 15
  // ========================================================

  {
    name: "Dell XPS 15",

    description:
      "Premium Dell XPS 15 laptop designed for professionals, creators, and demanding everyday workloads.",

    price: 1899,
    oldPrice: 2099,
    discount: 10,
    currency: "USD",

    category: "Laptops",
    brand: "Dell",
    sku: "DEL-XPS15-001",

    image: "/products/dell-xps-15.jpg",

    images: ["/products/dell-xps-15.jpg"],

    features: [
      "Intel Core i7 Processor",
      "15.6-inch Display",
      "16GB RAM",
      "1TB SSD",
      "Premium Aluminum Design",
    ],

    stock: 18,

    shipping: "Free shipping",
    warranty: "1 Year Dell Warranty",

    rating: 4.8,
    numReviews: 0,

    featured: true,
    bestseller: true,
    newArrival: false,
  },

  // ========================================================
  // 3. SAMSUNG GALAXY S25
  // ========================================================

  {
    name: "Samsung Galaxy S25",

    description:
      "Samsung Galaxy S25 flagship smartphone with powerful performance, advanced cameras, and a premium display.",

    price: 1199,
    oldPrice: 1299,
    discount: 8,
    currency: "USD",

    category: "Smartphones",
    brand: "Samsung",
    sku: "SAM-S25-001",

    image: "/products/galaxy-s25.jpg",

    images: ["/products/galaxy-s25.jpg"],

    features: [
      "6.2-inch AMOLED Display",
      "Advanced Triple Camera",
      "256GB Storage",
      "12GB RAM",
      "5G Connectivity",
    ],

    stock: 30,

    shipping: "Free shipping",
    warranty: "1 Year Samsung Warranty",

    rating: 4.7,
    numReviews: 0,

    featured: true,
    bestseller: true,
    newArrival: true,
  },

  // ========================================================
  // 4. IPHONE 16 PRO
  // ========================================================

  {
    name: "iPhone 16 Pro",

    description:
      "Apple iPhone 16 Pro with titanium design, powerful performance, professional camera system, and advanced features.",

    price: 1299,
    oldPrice: 1399,
    discount: 7,
    currency: "USD",

    category: "Smartphones",
    brand: "Apple",
    sku: "APP-IP16P-001",

    image: "/products/iphone-16-pro.jpg",

    images: ["/products/iphone-16-pro.jpg"],

    features: [
      "A18 Pro Chip",
      "6.3-inch Super Retina XDR Display",
      "48MP Main Camera",
      "256GB Storage",
      "5G Connectivity",
    ],

    stock: 0,

    shipping: "Free shipping",
    warranty: "1 Year Apple Warranty",

    rating: 4.9,
    numReviews: 0,

    featured: true,
    bestseller: true,
    newArrival: true,
  },

  // ========================================================
  // 5. SONY WH-1000XM6
  // ========================================================

  {
    name: "Sony WH-1000XM6 Wireless Headphones",

    description:
      "Premium wireless noise-cancelling headphones with immersive sound, comfortable design, and long battery life.",

    price: 449,
    oldPrice: 499,
    discount: 10,
    currency: "USD",

    category: "Audio",
    brand: "Sony",
    sku: "SON-WH1000XM6",

    image: "/products/sony-wh1000xm6.jpg",

    images: ["/products/sony-wh1000xm6.jpg"],

    features: [
      "Advanced Noise Cancellation",
      "Wireless Bluetooth",
      "High-Resolution Audio",
      "Up to 30 Hours Battery",
      "Premium Comfort",
    ],

    stock: 25,

    shipping: "Free shipping",
    warranty: "1 Year Sony Warranty",

    rating: 4.8,
    numReviews: 0,

    featured: true,
    bestseller: true,
    newArrival: true,
  },

  // ========================================================
  // 6. APPLE WATCH SERIES 10
  // ========================================================

  {
    name: "Apple Watch Series 10",

    description:
      "Apple Watch Series 10 with a sleek design, advanced health features, fitness tracking, and smart notifications.",

    price: 499,
    oldPrice: 549,
    discount: 9,
    currency: "USD",

    category: "Wearables",
    brand: "Apple",
    sku: "APP-WATCH10-001",

    image: "/products/apple-watch-series-10.jpg",

    images: ["/products/apple-watch-series-10.jpg"],

    features: [
      "Advanced Fitness Tracking",
      "Heart Rate Monitoring",
      "Sleep Tracking",
      "Water Resistant",
      "Smart Notifications",
    ],

    stock: 20,

    shipping: "Free shipping",
    warranty: "1 Year Apple Warranty",

    rating: 4.7,
    numReviews: 0,

    featured: true,
    bestseller: false,
    newArrival: true,
  },

  // ========================================================
  // 7. AIRPODS PRO 2
  // ========================================================

  {
    name: "AirPods Pro 2",

    description:
      "Apple AirPods Pro with active noise cancellation, immersive audio, and a compact wireless charging case.",

    price: 249,
    oldPrice: 279,
    discount: 11,
    currency: "USD",

    category: "Audio",
    brand: "Apple",
    sku: "APP-APP2-001",

    image: "/products/airpods-pro-2.jpg",

    images: ["/products/airpods-pro-2.jpg"],

    features: [
      "Active Noise Cancellation",
      "Transparency Mode",
      "Spatial Audio",
      "USB-C Charging",
      "Wireless Charging Case",
    ],

    stock: 35,

    shipping: "Free shipping",
    warranty: "1 Year Apple Warranty",

    rating: 4.8,
    numReviews: 0,

    featured: true,
    bestseller: true,
    newArrival: false,
  },

  // ========================================================
  // 8. ASUS ROG STRIX G16
  // ========================================================

  {
    name: "ASUS ROG Strix G16",

    description:
      "High-performance ASUS gaming laptop designed for serious gamers with powerful graphics and fast refresh rates.",

    price: 1799,
    oldPrice: 1999,
    discount: 10,
    currency: "USD",

    category: "Gaming",
    brand: "ASUS",
    sku: "ASU-ROG-G16",

    image: "/products/asus-rog-strix-g16.jpg",

    images: ["/products/asus-rog-strix-g16.jpg"],

    features: [
      "Intel Core i9 Processor",
      "NVIDIA GeForce RTX Graphics",
      "16GB RAM",
      "1TB SSD",
      "165Hz Gaming Display",
    ],

    stock: 15,

    shipping: "Free shipping",
    warranty: "1 Year ASUS Warranty",

    rating: 4.8,
    numReviews: 0,

    featured: true,
    bestseller: true,
    newArrival: true,
  },

  // ========================================================
  // 9. LOGITECH MX MASTER 3S
  // ========================================================

  {
    name: "Logitech MX Master 3S",

    description:
      "Advanced wireless mouse designed for productivity with precision tracking, ergonomic comfort, and multi-device support.",

    price: 99,
    oldPrice: 119,
    discount: 17,
    currency: "USD",

    category: "Accessories",
    brand: "Logitech",
    sku: "LOG-MX3S-001",

    image: "/products/logitech-mx-master-3s.jpg",

    images: ["/products/logitech-mx-master-3s.jpg"],

    features: [
      "8K DPI Tracking",
      "Wireless Connectivity",
      "Multi-Device Support",
      "Ergonomic Design",
      "USB-C Charging",
    ],

    stock: 40,

    shipping: "Free shipping",
    warranty: "1 Year Logitech Warranty",

    rating: 4.7,
    numReviews: 0,

    featured: false,
    bestseller: true,
    newArrival: false,
  },

  // ========================================================
  // 10. IPAD PRO M4
  // ========================================================

  {
    name: "iPad Pro M4",

    description:
      "Powerful Apple iPad Pro powered by the M4 chip with an advanced display and professional-level performance.",

    price: 1099,
    oldPrice: 1199,
    discount: 8,
    currency: "USD",

    category: "Tablets",
    brand: "Apple",
    sku: "APP-IPAD-M4",

    image: "/products/ipad-pro-m4.jpg",

    images: ["/products/ipad-pro-m4.jpg"],

    features: [
      "Apple M4 Chip",
      "Ultra Retina XDR Display",
      "256GB Storage",
      "12MP Camera",
      "USB-C Connectivity",
    ],

    stock: 16,

    shipping: "Free shipping",
    warranty: "1 Year Apple Warranty",

    rating: 4.9,
    numReviews: 0,

    featured: true,
    bestseller: false,
    newArrival: true,
  },

  // ========================================================
  // 11. SAMSUNG GALAXY WATCH 7
  // ========================================================

  {
    name: "Samsung Galaxy Watch 7",

    description:
      "Smartwatch with advanced health monitoring, fitness tracking, GPS, and seamless Android integration.",

    price: 349,
    oldPrice: 399,
    discount: 13,
    currency: "USD",

    category: "Wearables",
    brand: "Samsung",
    sku: "SAM-WATCH7-001",

    image: "/products/galaxy-watch-7.jpg",

    images: ["/products/galaxy-watch-7.jpg"],

    features: [
      "Advanced Health Tracking",
      "Heart Rate Monitoring",
      "Built-in GPS",
      "Sleep Tracking",
      "Water Resistant",
    ],

    stock: 22,

    shipping: "Free shipping",
    warranty: "1 Year Samsung Warranty",

    rating: 4.6,
    numReviews: 0,

    featured: false,
    bestseller: false,
    newArrival: true,
  },

  // ========================================================
  // 12. ANKER USB-C 7-IN-1 HUB
  // ========================================================

  {
    name: "Anker USB-C 7-in-1 Hub",

    description:
      "Compact USB-C hub with multiple ports for connecting displays, storage devices, accessories, and peripherals.",

    price: 69,
    oldPrice: 89,
    discount: 22,
    currency: "USD",

    category: "Accessories",
    brand: "Anker",
    sku: "ANK-USBC7-001",

    image: "/products/anker-usbc-hub.jpg",

    images: ["/products/anker-usbc-hub.jpg"],

    features: [
      "7-in-1 Connectivity",
      "USB-C Power Delivery",
      "HDMI Output",
      "USB 3.0 Ports",
      "SD Card Reader",
    ],

    stock: 50,

    shipping: "Free shipping",
    warranty: "18 Month Anker Warranty",

    rating: 4.6,
    numReviews: 0,

    featured: false,
    bestseller: true,
    newArrival: false,
  },
];

// ==========================================================
// EXPORT
// ==========================================================

export default products;