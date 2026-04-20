// ============================================
// PRODUCT DATA — Laptop Catalog
// ============================================

const products = [
  {
    id: 1,
    name: "ProBook X1 Ultra",
    brand: "TechNova",
    category: "ultrabook",
    price: 1299,
    originalPrice: 1499,
    discount: 13,
    rating: 4.8,
    reviews: 342,
    stock: 15,
    description: "The ProBook X1 Ultra redefines portable computing with its razor-thin profile, stunning 14-inch OLED display, and all-day battery life. Perfect for professionals who demand performance on the go.",
    specs: {
      cpu: "Intel Core i7-14700U",
      ram: "16GB DDR5",
      storage: "512GB NVMe SSD",
      gpu: "Intel Iris Xe",
      display: '14" 2.8K OLED',
      battery: "72Wh, 18hrs"
    },
    color: "#7c8db5",
    images: ["img/laptop1.webp"]
  },
  {
    id: 2,
    name: "StormForce RTX Pro",
    brand: "AeroTech",
    category: "gaming",
    price: 2199,
    originalPrice: 2499,
    discount: 12,
    rating: 4.9,
    reviews: 567,
    stock: 8,
    description: "Dominate every game with the StormForce RTX Pro. Equipped with the latest NVIDIA RTX 4070 GPU, a blazing 240Hz display, and advanced cooling — this is the ultimate gaming machine.",
    specs: {
      cpu: "AMD Ryzen 9 7945HX",
      ram: "32GB DDR5",
      storage: "1TB NVMe SSD",
      gpu: "NVIDIA RTX 4070",
      display: '16" QHD 240Hz',
      battery: "90Wh, 8hrs"
    },
    color: "#6c5ce7",
    images: ["img/laptop2.webp"]
  },
  {
    id: 3,
    name: "EliteBook 360",
    brand: "CoreSys",
    category: "business",
    price: 1599,
    originalPrice: 1799,
    discount: 11,
    rating: 4.7,
    reviews: 289,
    stock: 22,
    description: "Built for the modern workplace, the EliteBook 360 features enterprise-grade security, a versatile 2-in-1 design, and exceptional build quality. MIL-STD-810H certified for durability.",
    specs: {
      cpu: "Intel Core i7-1365U",
      ram: "16GB DDR5",
      storage: "512GB NVMe SSD",
      gpu: "Intel Iris Xe",
      display: '13.5" 3:2 2K IPS Touch',
      battery: "60Wh, 14hrs"
    },
    color: "#4a6fa5",
    images: ["img/laptop3.webp"]
  },
  {
    id: 4,
    name: "SwiftBook Air 15",
    brand: "TechNova",
    category: "ultrabook",
    price: 899,
    originalPrice: 999,
    discount: 10,
    rating: 4.5,
    reviews: 198,
    stock: 30,
    description: "Incredibly light at just 1.2kg, the SwiftBook Air delivers impressive performance for everyday tasks. The vibrant 15.6-inch IPS display and sleek aluminum chassis make it a joy to use.",
    specs: {
      cpu: "AMD Ryzen 5 7535U",
      ram: "8GB DDR5",
      storage: "256GB NVMe SSD",
      gpu: "AMD Radeon Graphics",
      display: '15.6" FHD IPS',
      battery: "54Wh, 12hrs"
    },
    color: "#b0b8c4",
    images: ["img/laptop4.webp"]
  },
  {
    id: 5,
    name: "TitanForce X17",
    brand: "AeroTech",
    category: "gaming",
    price: 3299,
    originalPrice: 3599,
    discount: 8,
    rating: 4.9,
    reviews: 421,
    stock: 5,
    description: "The TitanForce X17 is the pinnacle of gaming laptops. With an RTX 4090 GPU, a massive 17.3-inch 4K mini-LED display, and per-key RGB keyboard, it delivers desktop-class power in a portable form.",
    specs: {
      cpu: "Intel Core i9-14900HX",
      ram: "64GB DDR5",
      storage: "2TB NVMe SSD",
      gpu: "NVIDIA RTX 4090",
      display: '17.3" 4K Mini-LED 120Hz',
      battery: "99Wh, 6hrs"
    },
    color: "#2d3436",
    images: ["img/laptop5.webp"]
  },
  {
    id: 6,
    name: "BudgetBook Essential",
    brand: "ValueTech",
    category: "budget",
    price: 449,
    originalPrice: 549,
    discount: 18,
    rating: 4.2,
    reviews: 856,
    stock: 50,
    description: "Great performance without breaking the bank. The BudgetBook Essential is perfect for students and daily users who need a reliable laptop for browsing, documents, and streaming.",
    specs: {
      cpu: "Intel Core i3-1315U",
      ram: "8GB DDR4",
      storage: "256GB SSD",
      gpu: "Intel UHD Graphics",
      display: '15.6" FHD IPS',
      battery: "42Wh, 10hrs"
    },
    color: "#636e72",
    images: ["img/laptop6.webp"]
  },
  {
    id: 7,
    name: "CreatorPro Studio",
    brand: "CoreSys",
    category: "business",
    price: 2499,
    originalPrice: 2799,
    discount: 11,
    rating: 4.8,
    reviews: 178,
    stock: 12,
    description: "Designed for creative professionals, the CreatorPro Studio features a color-accurate 4K OLED display, powerful GPU for rendering, and Thunderbolt 4 connectivity for your workflow.",
    specs: {
      cpu: "Intel Core i9-14900H",
      ram: "32GB DDR5",
      storage: "1TB NVMe SSD",
      gpu: "NVIDIA RTX 4060",
      display: '16" 4K OLED DCI-P3',
      battery: "84Wh, 10hrs"
    },
    color: "#0984e3",
    images: ["img/laptop7.webp"]
  },
  {
    id: 8,
    name: "NoteBook Go 14",
    brand: "ValueTech",
    category: "budget",
    price: 349,
    originalPrice: 399,
    discount: 13,
    rating: 4.0,
    reviews: 1203,
    stock: 75,
    description: "The most affordable way to get things done. NoteBook Go 14 offers a compact design, full-day battery, and smooth performance for web browsing and office work.",
    specs: {
      cpu: "AMD Ryzen 3 7320U",
      ram: "4GB DDR4",
      storage: "128GB eMMC",
      gpu: "AMD Radeon Graphics",
      display: '14" HD IPS',
      battery: "38Wh, 11hrs"
    },
    color: "#a4b0be",
    images: ["img/laptop8.webp"]
  },
  {
    id: 9,
    name: "PhantomBook Stealth",
    brand: "TechNova",
    category: "ultrabook",
    price: 1799,
    originalPrice: 1999,
    discount: 10,
    rating: 4.7,
    reviews: 245,
    stock: 10,
    description: "Disappear into your work with the PhantomBook Stealth. Nearly invisible bezels, whisper-quiet operation, and stunning performance make this the ultimate ultrabook experience.",
    specs: {
      cpu: "Intel Core Ultra 7 155H",
      ram: "32GB DDR5",
      storage: "1TB NVMe SSD",
      gpu: "Intel Arc Graphics",
      display: '14" 2.8K OLED Touch',
      battery: "75Wh, 16hrs"
    },
    color: "#2d3436",
    images: ["img/laptop9.webp"]
  },
  {
    id: 10,
    name: "BattleStation Omega",
    brand: "AeroTech",
    category: "gaming",
    price: 1799,
    originalPrice: 1999,
    discount: 10,
    rating: 4.6,
    reviews: 388,
    stock: 18,
    description: "Enter the arena with confidence. The BattleStation Omega delivers solid gaming performance with its RTX 4060 GPU, 165Hz display, and eye-catching RGB design.",
    specs: {
      cpu: "AMD Ryzen 7 7745HX",
      ram: "16GB DDR5",
      storage: "512GB NVMe SSD",
      gpu: "NVIDIA RTX 4060",
      display: '15.6" QHD 165Hz',
      battery: "68Wh, 7hrs"
    },
    color: "#e84393",
    images: ["img/laptop10.webp"]
  },
  {
    id: 11,
    name: "SecureBook Pro",
    brand: "CoreSys",
    category: "business",
    price: 1399,
    originalPrice: 1599,
    discount: 13,
    rating: 4.6,
    reviews: 312,
    stock: 20,
    description: "Security meets productivity. The SecureBook Pro features a built-in fingerprint reader, IR camera for facial recognition, TPM 2.0, and SmartCard reader for enterprise security.",
    specs: {
      cpu: "Intel Core i7-1365U",
      ram: "16GB DDR5",
      storage: "512GB NVMe SSD",
      gpu: "Intel Iris Xe",
      display: '14" FHD IPS Anti-Glare',
      battery: "57Wh, 15hrs"
    },
    color: "#2d3436",
    images: ["img/laptop11.webp"]
  },
  {
    id: 12,
    name: "EduBook Lite",
    brand: "ValueTech",
    category: "budget",
    price: 279,
    originalPrice: 349,
    discount: 20,
    rating: 3.9,
    reviews: 2045,
    stock: 100,
    description: "The perfect first laptop for students. EduBook Lite is built to handle schoolwork with its durable chassis, spill-resistant keyboard, and long-lasting battery.",
    specs: {
      cpu: "Intel Celeron N5100",
      ram: "4GB DDR4",
      storage: "64GB eMMC",
      gpu: "Intel UHD Graphics",
      display: '11.6" HD TN',
      battery: "36Wh, 12hrs"
    },
    color: "#55a3e8",
    images: ["img/laptop12.webp"]
  }
];

export default products;
