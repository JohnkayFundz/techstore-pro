const orders = [
  {
    id: "ORD-1001",
    date: "2026-07-18",
    status: "Delivered",
    total: 2599,
    payment: "Visa **** 1024",
    shipping: "Express Delivery",
    tracking: "TSP82937482",

    items: [
      {
        id: 1,
        name: "MacBook Pro M4",
        quantity: 1,
        price: 2399,
        image: "/images/macbook.jpg",
      },
      {
        id: 8,
        name: "USB-C Hub",
        quantity: 1,
        price: 200,
        image: "/images/hub.jpg",
      },
    ],
  },

  {
    id: "ORD-1002",
    date: "2026-07-10",
    status: "Shipped",
    total: 1299,
    payment: "Mastercard **** 5521",
    shipping: "Standard Delivery",
    tracking: "TSP29485711",

    items: [
      {
        id: 4,
        name: "iPhone 16 Pro",
        quantity: 1,
        price: 1299,
        image: "/images/iphone.jpg",
      },
    ],
  },

  {
    id: "ORD-1003",
    date: "2026-07-05",
    status: "Processing",
    total: 499,
    payment: "PayPal",
    shipping: "Standard Delivery",
    tracking: "TSP92837456",

    items: [
      {
        id: 12,
        name: "Sony WH-1000XM6",
        quantity: 1,
        price: 499,
        image: "/images/headphones.jpg",
      },
    ],
  },

  {
    id: "ORD-1004",
    date: "2026-06-28",
    status: "Pending",
    total: 179,
    payment: "Visa **** 9981",
    shipping: "Economy Delivery",
    tracking: "Awaiting Shipment",

    items: [
      {
        id: 15,
        name: "Mechanical Keyboard",
        quantity: 1,
        price: 179,
        image: "/images/keyboard.jpg",
      },
    ],
  },
];

export default orders;