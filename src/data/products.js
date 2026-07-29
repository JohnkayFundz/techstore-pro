const products = [
  {
    id: 1,
    sku: "APP-LAP-001",
    name: "MacBook Pro 16-inch",
    brand: "Apple",
    category: "Laptop",
    currency: "$",
    price: 2499,
    oldPrice: 2799,
    discount: 10,
    rating: 4.9,
    reviews: 245,

    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
    ],

    stock: 15,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Apple's powerful 16-inch laptop built for developers, designers, and creators.",

    features: [
      "Apple M4 Pro Chip",
      "16-inch Liquid Retina XDR Display",
      "32GB Unified Memory",
      "1TB SSD Storage",
      "22-hour Battery Life",
    ],
  },

  {
    id: 2,
    sku: "DEL-LAP-002",
    name: "Dell XPS 15",
    brand: "Dell",
    category: "Laptop",
    currency: "$",
    price: 1899,
    oldPrice: 2099,
    discount: 10,
    rating: 4.8,
    reviews: 198,

    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    ],

    stock: 18,
    featured: true,
    newArrival: false,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Premium Windows laptop with stunning display and high-end performance.",

    features: [
      "Intel Core Ultra 7",
      "15.6-inch OLED Display",
      "32GB RAM",
      "1TB SSD",
      "RTX 4060 Graphics",
    ],
  },

  {
    id: 3,
    sku: "HP-LAP-003",
    name: "HP Spectre x360",
    brand: "HP",
    category: "Laptop",
    currency: "$",
    price: 1599,
    oldPrice: 1799,
    discount: 11,
    rating: 4.7,
    reviews: 162,

    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    ],

    stock: 12,
    featured: false,
    newArrival: true,
    bestseller: false,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Convertible 2-in-1 laptop designed for productivity and creativity.",

    features: [
      "Intel Core Ultra 7",
      "14-inch Touch Display",
      "16GB RAM",
      "1TB SSD",
      "360° Convertible Design",
    ],
  },  {
    id: 4,
    sku: "LEN-LAP-004",
    name: "Lenovo ThinkPad X1 Carbon",
    brand: "Lenovo",
    category: "Laptop",
    currency: "$",
    price: 1799,
    oldPrice: 1999,
    discount: 10,
    rating: 4.8,
    reviews: 210,

    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    ],

    stock: 10,
    featured: true,
    newArrival: false,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "3 Years",

    description:
      "Lightweight business laptop with outstanding durability, security, and all-day battery life.",

    features: [
      "Intel Core Ultra 7",
      "14-inch IPS Display",
      "16GB RAM",
      "512GB SSD",
      "Military-Grade Durability",
    ],
  },

  {
    id: 5,
    sku: "ASU-LAP-005",
    name: "ASUS ROG Zephyrus G16",
    brand: "ASUS",
    category: "Laptop",
    currency: "$",
    price: 2199,
    oldPrice: 2399,
    discount: 8,
    rating: 4.9,
    reviews: 185,

    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    ],

    stock: 14,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "2 Years",

    description:
      "Premium gaming laptop engineered for creators and gamers demanding maximum performance.",

    features: [
      "AMD Ryzen 9",
      "RTX 4080 Graphics",
      "32GB DDR5 RAM",
      "1TB SSD",
      "240Hz Display",
    ],
  },

  {
    id: 6,
    sku: "ACE-LAP-006",
    name: "Acer Swift Go 14",
    brand: "Acer",
    category: "Laptop",
    currency: "$",
    price: 1099,
    oldPrice: 1299,
    discount: 15,
    rating: 4.6,
    reviews: 120,

    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    ],

    stock: 22,
    featured: false,
    newArrival: false,
    bestseller: false,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Slim and lightweight laptop designed for students, professionals, and everyday productivity.",

    features: [
      "Intel Core Ultra 5",
      "14-inch IPS Display",
      "16GB RAM",
      "512GB SSD",
      "Fast Charging",
    ],
  },  {
    id: 7,
    sku: "APP-PHN-007",
    name: "iPhone 16 Pro",
    brand: "Apple",
    category: "Phone",
    currency: "$",
    price: 1199,
    oldPrice: 1299,
    discount: 8,
    rating: 4.9,
    reviews: 390,

    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    ],

    stock: 20,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Apple's flagship smartphone with a professional camera system, exceptional performance, and premium titanium design.",

    features: [
      "A18 Pro Chip",
      "6.3-inch Super Retina XDR",
      "256GB Storage",
      "48MP Triple Camera",
      "USB-C",
    ],
  },

  {
    id: 8,
    sku: "SAM-PHN-008",
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    category: "Phone",
    currency: "$",
    price: 1299,
    oldPrice: 1399,
    discount: 7,
    rating: 4.9,
    reviews: 340,

    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    ],

    stock: 18,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Samsung's premium flagship with AI-powered features, S Pen support, and an advanced 200MP camera.",

    features: [
      "Snapdragon 8 Elite",
      "6.9-inch Dynamic AMOLED",
      "256GB Storage",
      "200MP Camera",
      "S Pen Included",
    ],
  },

  {
    id: 9,
    sku: "GOO-PHN-009",
    name: "Google Pixel 10",
    brand: "Google",
    category: "Phone",
    currency: "$",
    price: 999,
    oldPrice: 1099,
    discount: 9,
    rating: 4.8,
    reviews: 220,

    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    ],

    stock: 25,
    featured: false,
    newArrival: true,
    bestseller: false,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Google's AI-powered smartphone delivering outstanding photography and a clean Android experience.",

    features: [
      "Google Tensor Chip",
      "6.3-inch OLED Display",
      "128GB Storage",
      "50MP Camera",
      "Android 17",
    ],
  },  {
    id: 10,
    sku: "ONE-PHN-010",
    name: "OnePlus 13",
    brand: "OnePlus",
    category: "Phone",
    currency: "$",
    price: 899,
    oldPrice: 999,
    discount: 10,
    rating: 4.8,
    reviews: 205,

    image:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    ],

    stock: 24,
    featured: true,
    newArrival: false,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "A flagship Android smartphone delivering exceptional speed, smooth performance, and ultra-fast charging.",

    features: [
      "Snapdragon 8 Elite",
      "120Hz AMOLED Display",
      "256GB Storage",
      "100W SUPERVOOC Charging",
      "50MP Triple Camera",
    ],
  },

  {
    id: 11,
    sku: "XIA-PHN-011",
    name: "Xiaomi 15 Pro",
    brand: "Xiaomi",
    category: "Phone",
    currency: "$",
    price: 799,
    oldPrice: 899,
    discount: 11,
    rating: 4.7,
    reviews: 180,

    image:
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    ],

    stock: 28,
    featured: false,
    newArrival: false,
    bestseller: false,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "A premium smartphone offering flagship performance, Leica-powered cameras, and excellent value.",

    features: [
      "Snapdragon 8 Elite",
      "120Hz AMOLED Display",
      "512GB Storage",
      "Leica Camera System",
      "90W Fast Charging",
    ],
  },

  {
    id: 12,
    sku: "NOT-PHN-012",
    name: "Nothing Phone (3)",
    brand: "Nothing",
    category: "Phone",
    currency: "$",
    price: 699,
    oldPrice: 749,
    discount: 7,
    rating: 4.6,
    reviews: 150,

    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800",
    ],

    stock: 35,
    featured: false,
    newArrival: true,
    bestseller: false,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "A stylish smartphone featuring the iconic Glyph Interface, clean Android experience, and reliable all-day performance.",

    features: [
      "120Hz OLED Display",
      "256GB Storage",
      "50MP Dual Camera",
      "Glyph Interface",
      "Fast Charging",
    ],
  },  {
    id: 13,
    sku: "SON-AUD-013",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Audio",
    currency: "$",
    price: 399,
    oldPrice: 449,
    discount: 11,
    rating: 4.9,
    reviews: 680,

    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    ],

    stock: 40,
    featured: true,
    newArrival: false,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "2 Years",

    description:
      "Industry-leading wireless noise-cancelling headphones with premium sound quality and all-day comfort.",

    features: [
      "Active Noise Cancellation",
      "30-Hour Battery Life",
      "Bluetooth 5.3",
      "Touch Controls",
      "Quick Charge",
    ],
  },

  {
    id: 14,
    sku: "APP-AUD-014",
    name: "Apple AirPods Pro (2nd Gen)",
    brand: "Apple",
    category: "Audio",
    currency: "$",
    price: 249,
    oldPrice: 279,
    discount: 11,
    rating: 4.8,
    reviews: 820,

    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800",
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800",
    ],

    stock: 50,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Premium wireless earbuds featuring Active Noise Cancellation, Spatial Audio, and seamless Apple integration.",

    features: [
      "Active Noise Cancellation",
      "Transparency Mode",
      "Spatial Audio",
      "USB-C Charging",
      "MagSafe Charging Case",
    ],
  },

  {
    id: 15,
    sku: "JBL-AUD-015",
    name: "JBL Charge 5",
    brand: "JBL",
    category: "Audio",
    currency: "$",
    price: 179,
    oldPrice: 199,
    discount: 10,
    rating: 4.7,
    reviews: 420,

    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
      "https://images.unsplash.com/photo-1507878866276-a947ef722fee?w=800",
    ],

    stock: 35,
    featured: true,
    newArrival: false,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Portable Bluetooth speaker with bold sound, long battery life, and IP67 waterproof protection.",

    features: [
      "20-Hour Battery",
      "IP67 Waterproof",
      "Bluetooth 5.1",
      "USB-C Charging",
      "PartyBoost",
    ],
  },

  {
    id: 16,
    sku: "BOS-AUD-016",
    name: "Bose QuietComfort Ultra",
    brand: "Bose",
    category: "Audio",
    currency: "$",
    price: 429,
    oldPrice: 479,
    discount: 10,
    rating: 4.8,
    reviews: 310,

    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    ],

    stock: 22,
    featured: true,
    newArrival: true,
    bestseller: false,
    shipping: "Free Shipping",
    warranty: "2 Years",

    description:
      "Luxury wireless headphones delivering immersive audio, world-class comfort, and premium noise cancellation.",

    features: [
      "Immersive Audio",
      "Noise Cancellation",
      "24-Hour Battery",
      "Bluetooth 5.3",
      "Premium Design",
    ],
  },  {
    id: 17,
    sku: "APP-SWT-017",
    name: "Apple Watch Series 10",
    brand: "Apple",
    category: "Smartwatch",
    currency: "$",
    price: 499,
    oldPrice: 549,
    discount: 9,
    rating: 4.9,
    reviews: 540,

    image:
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    ],

    stock: 30,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Apple's most advanced smartwatch with powerful health monitoring, fitness tracking, and seamless iPhone integration.",

    features: [
      "Always-On Retina Display",
      "ECG & Blood Oxygen",
      "GPS + Cellular",
      "Water Resistant",
      "Fast Charging",
    ],
  },

  {
    id: 18,
    sku: "SAM-SWT-018",
    name: "Samsung Galaxy Watch Ultra",
    brand: "Samsung",
    category: "Smartwatch",
    currency: "$",
    price: 649,
    oldPrice: 699,
    discount: 7,
    rating: 4.8,
    reviews: 310,

    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800",
    ],

    stock: 25,
    featured: true,
    newArrival: true,
    bestseller: false,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "A rugged premium smartwatch built for adventure with advanced health tracking and long battery life.",

    features: [
      "AMOLED Display",
      "GPS Tracking",
      "Heart Rate Monitor",
      "Sleep Tracking",
      "100-Hour Battery",
    ],
  },

  {
    id: 19,
    sku: "GAR-SWT-019",
    name: "Garmin Venu 3",
    brand: "Garmin",
    category: "Smartwatch",
    currency: "$",
    price: 449,
    oldPrice: 499,
    discount: 10,
    rating: 4.8,
    reviews: 210,

    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    ],

    stock: 18,
    featured: false,
    newArrival: false,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "2 Years",

    description:
      "A premium fitness smartwatch with comprehensive health insights, GPS tracking, and exceptional battery life.",

    features: [
      "AMOLED Display",
      "Body Battery",
      "Sleep Coach",
      "Heart Rate Tracking",
      "14-Day Battery",
    ],
  },  {
    id: 20,
    sku: "LOG-KBD-020",
    name: "Logitech MX Keys S",
    brand: "Logitech",
    category: "Keyboard",
    currency: "$",
    price: 119,
    oldPrice: 139,
    discount: 14,
    rating: 4.9,
    reviews: 460,

    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    ],

    stock: 42,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "2 Years",

    description:
      "A premium wireless keyboard built for productivity, comfort, and seamless multi-device workflow.",

    features: [
      "Backlit Keys",
      "USB-C Rechargeable",
      "Bluetooth Multi-Device",
      "Smart Illumination",
      "Windows & macOS Compatible",
    ],
  },

  {
    id: 21,
    sku: "KEY-KBD-021",
    name: "Keychron K8 Pro",
    brand: "Keychron",
    category: "Keyboard",
    currency: "$",
    price: 109,
    oldPrice: 129,
    discount: 15,
    rating: 4.8,
    reviews: 320,

    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800",
    ],

    stock: 35,
    featured: true,
    newArrival: false,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "2 Years",

    description:
      "A mechanical keyboard with hot-swappable switches, wireless connectivity, and premium typing experience.",

    features: [
      "Hot-Swappable Switches",
      "RGB Backlighting",
      "Bluetooth 5.1",
      "Mac & Windows Support",
      "4000mAh Battery",
    ],
  },

  {
    id: 22,
    sku: "COR-KBD-022",
    name: "Corsair K100 RGB",
    brand: "Corsair",
    category: "Keyboard",
    currency: "$",
    price: 229,
    oldPrice: 259,
    discount: 12,
    rating: 4.9,
    reviews: 270,

    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    ],

    stock: 24,
    featured: true,
    newArrival: true,
    bestseller: false,
    shipping: "Free Shipping",
    warranty: "2 Years",

    description:
      "A flagship mechanical gaming keyboard featuring ultra-fast switches, customizable RGB lighting, and dedicated media controls.",

    features: [
      "Cherry MX Switches",
      "Per-Key RGB",
      "Dedicated Media Controls",
      "USB Passthrough",
      "Gaming Mode",
    ],
  },  {
    id: 23,
    sku: "LOG-MSE-023",
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    category: "Mouse",
    currency: "$",
    price: 99,
    oldPrice: 119,
    discount: 17,
    rating: 4.9,
    reviews: 615,

    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    ],

    stock: 45,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "2 Years",

    description:
      "A premium ergonomic wireless mouse designed for professionals, creators, and multitasking workflows.",

    features: [
      "8K DPI Sensor",
      "USB-C Rechargeable",
      "Bluetooth & Logi Bolt",
      "Silent Clicks",
      "Multi-Device Support",
    ],
  },

  {
    id: 24,
    sku: "RAZ-MSE-024",
    name: "Razer DeathAdder V3 Pro",
    brand: "Razer",
    category: "Mouse",
    currency: "$",
    price: 149,
    oldPrice: 169,
    discount: 12,
    rating: 4.9,
    reviews: 432,

    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800",
    ],

    stock: 28,
    featured: true,
    newArrival: false,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "2 Years",

    description:
      "An ultra-lightweight wireless gaming mouse engineered for esports players who demand speed and precision.",

    features: [
      "30K Optical Sensor",
      "63g Ultra-Light Design",
      "90-Hour Battery",
      "Razer HyperSpeed Wireless",
      "Optical Mouse Switches",
    ],
  },  {
    id: 25,
    sku: "LG-MON-025",
    name: "LG UltraFine 32-inch 4K",
    brand: "LG",
    category: "Monitor",
    currency: "$",
    price: 699,
    oldPrice: 799,
    discount: 13,
    rating: 4.8,
    reviews: 281,

    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
      "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800",
    ],

    stock: 16,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "3 Years",

    description:
      "Professional 32-inch 4K monitor delivering exceptional color accuracy and crystal-clear visuals for creators and professionals.",

    features: [
      "32-inch 4K UHD",
      "HDR10",
      "USB-C Connectivity",
      "99% sRGB",
      "Height Adjustable Stand",
    ],
  },

  {
    id: 26,
    sku: "SAM-MON-026",
    name: "Samsung Odyssey G8",
    brand: "Samsung",
    category: "Monitor",
    currency: "$",
    price: 999,
    oldPrice: 1099,
    discount: 9,
    rating: 4.9,
    reviews: 194,

    image:
      "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=800",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    ],

    stock: 12,
    featured: true,
    newArrival: true,
    bestseller: false,
    shipping: "Free Shipping",
    warranty: "3 Years",

    description:
      "Premium curved OLED gaming monitor with ultra-fast refresh rates and stunning HDR visuals.",

    features: [
      "34-inch OLED",
      "175Hz Refresh Rate",
      "0.1ms Response Time",
      "AMD FreeSync Premium",
      "HDR True Black",
    ],
  },

  {
    id: 27,
    sku: "DEL-MON-027",
    name: "Dell UltraSharp U2725QE",
    brand: "Dell",
    category: "Monitor",
    currency: "$",
    price: 649,
    oldPrice: 729,
    discount: 11,
    rating: 4.8,
    reviews: 243,

    image:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=800",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
    ],

    stock: 20,
    featured: true,
    newArrival: false,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "3 Years",

    description:
      "A premium 27-inch 4K productivity monitor with excellent color accuracy and versatile USB-C connectivity.",

    features: [
      "27-inch 4K IPS",
      "USB-C Hub",
      "DisplayHDR 400",
      "ComfortView Plus",
      "99% DCI-P3",
    ],
  },  {
    id: 28,
    sku: "SON-GAM-028",
    name: "PlayStation 5 Slim",
    brand: "Sony",
    category: "Gaming",
    currency: "$",
    price: 499,
    oldPrice: 549,
    discount: 9,
    rating: 4.9,
    reviews: 1250,

    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
      "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800",
    ],

    stock: 18,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Experience ultra-fast loading, immersive gameplay, and breathtaking 4K graphics with the PlayStation 5 Slim.",

    features: [
      "1TB SSD",
      "4K Gaming",
      "Ray Tracing",
      "DualSense Wireless Controller",
      "Ultra HD Blu-ray",
    ],
  },

  {
    id: 29,
    sku: "MIC-GAM-029",
    name: "Xbox Series X",
    brand: "Microsoft",
    category: "Gaming",
    currency: "$",
    price: 499,
    oldPrice: 549,
    discount: 9,
    rating: 4.8,
    reviews: 980,

    image:
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800",
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
    ],

    stock: 16,
    featured: true,
    newArrival: false,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "1 Year",

    description:
      "Microsoft's most powerful Xbox console featuring true 4K gaming, lightning-fast loading, and Quick Resume.",

    features: [
      "1TB NVMe SSD",
      "4K Gaming",
      "Quick Resume",
      "120 FPS Support",
      "Xbox Game Pass Ready",
    ],
  },

  {
    id: 30,
    sku: "ANK-ACC-030",
    name: "Anker 737 GaN Charger",
    brand: "Anker",
    category: "Accessories",
    currency: "$",
    price: 99,
    oldPrice: 119,
    discount: 17,
    rating: 4.8,
    reviews: 560,

    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800",

    gallery: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800",
      "https://images.unsplash.com/photo-1517420879524-86d64ac2f339?w=800",
    ],

    stock: 50,
    featured: true,
    newArrival: true,
    bestseller: true,
    shipping: "Free Shipping",
    warranty: "18 Months",

    description:
      "A compact 120W GaN fast charger capable of charging laptops, smartphones, tablets, and other USB-C devices.",

    features: [
      "120W Fast Charging",
      "GaN Technology",
      "3 USB-C Ports",
      "1 USB-A Port",
      "Universal Compatibility",
    ],
  },
];

export default products;