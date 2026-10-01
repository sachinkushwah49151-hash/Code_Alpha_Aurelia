/**
 * AURELIA — Canonical Product Dataset & Categories
 *
 * Deterministic Product Data Model:
 * Every product strictly maps:
 * PRODUCT -> NAME -> CATEGORY -> DESCRIPTION -> PRICE -> IMAGE -> SECONDARY IMAGE
 *
 * All image assets are stored locally under /images/ to guarantee 100% deterministic,
 * offline-safe, high-speed rendering with ZERO mismatches or broken external CDNs.
 */

export const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    tagline: 'Precision acoustic & desktop hardware',
    image: '/images/aurelia-arc.jpg',
    itemCount: '1 Object',
    gridSpan: 'col-span-1 md:col-span-2 row-span-2',
    accentColor: '#c5a880',
  },
  {
    id: 'audio',
    name: 'Audio',
    tagline: 'Pure reference spatial acoustics',
    image: '/images/aurelia-air-x1.jpg',
    itemCount: '2 Objects',
    gridSpan: 'col-span-1 md:col-span-2 row-span-1',
    accentColor: '#bfa074',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    tagline: 'Tailored silhouettes & organic natural fabrics',
    image: '/images/sora-overshirt.jpg',
    itemCount: '1 Object',
    gridSpan: 'col-span-1 md:col-span-1 row-span-2',
    accentColor: '#9e815b',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    tagline: 'Refined leather goods & everyday timepieces',
    image: '/images/aurelia-core.jpg',
    itemCount: '3 Objects',
    gridSpan: 'col-span-1 md:col-span-1 row-span-1',
    accentColor: '#c5a880',
  },
  {
    id: 'home',
    name: 'Home',
    tagline: 'Objects for intentional everyday living',
    image: '/images/aurelia-forma.jpg',
    itemCount: '2 Objects',
    gridSpan: 'col-span-1 md:col-span-1 row-span-1',
    accentColor: '#a8895b',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    tagline: 'Daily rituals, hydration & stationery',
    image: '/images/apex-thermal-flask.jpg',
    itemCount: '1 Object',
    gridSpan: 'col-span-1 md:col-span-1 row-span-1',
    accentColor: '#c5a880',
  },
  {
    id: 'travel',
    name: 'Travel',
    tagline: 'Modular luggage & durable road carryalls',
    image: '/images/aurelia-terra.jpg',
    itemCount: '1 Object',
    gridSpan: 'col-span-1 md:col-span-1 row-span-1',
    accentColor: '#bfa074',
  },
];

export const PRODUCTS = [
  // ==========================================
  // 1. AUDIO & SOUND
  // ==========================================
  {
    id: 'aurelia-air-x1',
    name: 'Aurelia Air X1 Headphones',
    category: 'Audio',
    categoryId: 'audio',
    shortDescriptor: 'Minimal Wireless Spatial Audio',
    description:
      'Engineered for acoustic purity. The Aurelia Air X1 features custom 40mm beryllium drivers, active hybrid noise cancellation, and breathable lambskin leather ear cushions for all-day listening fatigue reduction.',
    price: 8499,
    originalPrice: 10999,
    rating: 4.9,
    reviews: 142,
    badge: 'Signature',
    stock: 18,
    featured: true,
    newArrival: false,
    image: '/images/aurelia-air-x1.jpg',
    secondaryImage: '/images/aurelia-air-x1.jpg',
    gallery: [
      '/images/aurelia-air-x1.jpg',
      '/images/aurelia-air-x1-hero.jpg',
    ],
    colors: [
      { name: 'Matte Obsidian', hex: '#1c1c1e' },
      { name: 'Champagne Sand', hex: '#ded6c9' },
      { name: 'Graphite Grey', hex: '#58595b' },
    ],
    specifications: {
      'Driver Size': '40mm Custom Beryllium Dynamic',
      'Battery Life': '42 hours (ANC Off), 34 hours (ANC On)',
      Connectivity: 'Bluetooth 5.3 + 3.5mm Analog Audio',
      Weight: '248 grams',
      Charging: 'USB-C Quick Charge (10 min for 5 hours)',
      Warranty: '2-Year Manufacturer International Warranty',
    },
    features: [
      'Hybrid active noise cancellation with 4 acoustic microphones',
      'Ultra-soft memory foam headband and ear cups',
      'Multipoint connection to switch between laptop and phone seamlessly',
      'Integrated tactile rotary volume dial',
    ],
  },
  {
    id: 'aurelia-studio-one',
    name: 'Aurelia Studio One Speaker',
    category: 'Audio',
    categoryId: 'audio',
    shortDescriptor: 'Hi-Fi Waveguide Desktop Monitor',
    description:
      'Cast from structural mineral polymer to eradicate acoustic resonance. Aurelia Studio One delivers uncolored, lifelike near-field sound staging with dual passive radiators and silk-dome tweeters.',
    price: 12999,
    originalPrice: 14999,
    rating: 4.9,
    reviews: 68,
    badge: 'Acoustic Award',
    stock: 12,
    featured: true,
    newArrival: false,
    image: '/images/aurelia-studio-one.jpg',
    secondaryImage: '/images/aurelia-studio-one.jpg',
    gallery: [
      '/images/aurelia-studio-one.jpg',
    ],
    colors: [
      { name: 'Walnut & Obsidian', hex: '#27272a' },
      { name: 'Nordic Birch', hex: '#f4f4f5' },
    ],
    specifications: {
      Power: '60W RMS Pure Class-D Amplification',
      Frequency: '48Hz – 22,000Hz (±2dB flat curve)',
      Inputs: 'Bluetooth 5.2, Optical, USB-C, RCA Analog',
      Dimensions: '185mm x 120mm x 140mm',
      Weight: '3.1 kg per pair',
    },
    features: [
      'Precision acoustic waveguide ensures wide horizontal dispersion',
      'Custom acoustic tuning presets for desktop boundary reflection',
      'Solid anodized aluminum front baffle and rear controls',
    ],
  },

  // ==========================================
  // 2. ELECTRONICS & DESK
  // ==========================================
  {
    id: 'aurelia-arc',
    name: 'Aurelia Arc Mechanical Keyboard',
    category: 'Electronics',
    categoryId: 'electronics',
    shortDescriptor: 'Precision Machined Wireless Board',
    description:
      'CNC-milled from a solid billet of 6063 aluminum. Features factory-lubricated linear switches, seamless multi-device wireless pairing, and double-shot PBT keycaps with custom Aurelia editorial typography.',
    price: 7499,
    originalPrice: 9499,
    rating: 4.9,
    reviews: 84,
    badge: 'Bestseller',
    stock: 15,
    featured: true,
    newArrival: false,
    image: '/images/aurelia-arc.jpg',
    secondaryImage: '/images/aurelia-arc.jpg',
    gallery: [
      '/images/aurelia-arc.jpg',
    ],
    colors: [
      { name: 'Silver Anodized', hex: '#d1d5db' },
      { name: 'Space Black', hex: '#18181b' },
    ],
    specifications: {
      Layout: '75% Compact (84 keys)',
      Switches: 'Custom Aurelia Coral Linear (45g actuation)',
      Connectivity: 'Tri-Mode: 2.4GHz Dongle, BT 5.1 (3 hosts), USB-C',
      Battery: '4000mAh Lithium-ion (Up to 180 hours without backlight)',
      Weight: '980 grams (solid desk stability)',
    },
    features: [
      'Gasket-mounted plate structure for dampened, satisfying sound',
      'Hot-swappable PCB supports 3-pin and 5-pin switches',
      'CNC milled magnetic feet for 4° and 8° typing angles',
    ],
  },

  // ==========================================
  // 3. HOME & LIGHTING
  // ==========================================
  {
    id: 'aurelia-forma',
    name: 'Aurelia Forma Desk Lamp',
    category: 'Home',
    categoryId: 'home',
    shortDescriptor: 'Architectural Workspace Illumination',
    description:
      'A counterbalanced study lamp built from precision extruded aluminum and cast steel. Employs a museum-grade CRI 97+ LED array with smooth touch-dimming and circadian tone modulation from 2700K to 5000K.',
    price: 4299,
    originalPrice: 5499,
    rating: 4.8,
    reviews: 57,
    badge: 'Design Icon',
    stock: 20,
    featured: true,
    newArrival: false,
    image: '/images/aurelia-forma.jpg',
    secondaryImage: '/images/aurelia-forma.jpg',
    gallery: [
      '/images/aurelia-forma.jpg',
    ],
    colors: [
      { name: 'Matte Graphite', hex: '#374151' },
      { name: 'Warm Champagne', hex: '#d4af37' },
      { name: 'Chalk White', hex: '#f3f4f6' },
    ],
    specifications: {
      LightSource: 'Custom High-CRI 97+ LED Engine',
      Brightness: 'Up to 900 Lumens (Continuous stepless dimming)',
      ColorTemp: '2700K (Warm Relax) to 5000K (Daylight Focus)',
      Power: 'USB-C Powered (18W Adapter Included)',
      ArmReach: '72 cm total articulated cantilever reach',
    },
    features: [
      'Patented micro-spring counterbalance maintains exact desired position',
      'Honeycomb anti-glare louvre prevents direct eye exposure',
      'Integrated ambient light sensor automatically compensates for room lighting',
    ],
  },
  {
    id: 'kyoto-hinoki-candle',
    name: 'Kyoto Hinoki Soy Candle',
    category: 'Home',
    categoryId: 'home',
    shortDescriptor: 'Hand-Poured Japanese Cypress & Cedar',
    description:
      'Crafted in small batches using 100% natural botanical soy and coconut wax. Delicately scented with cold-pressed Japanese hinoki cypress, aged atlas cedarwood, black pepper, and smoky Haitian vetiver.',
    price: 1499,
    originalPrice: 1999,
    rating: 4.8,
    reviews: 29,
    badge: 'Artisanal',
    stock: 35,
    featured: false,
    newArrival: false,
    image: '/images/kyoto-hinoki-candle.jpg',
    secondaryImage: '/images/kyoto-hinoki-candle.jpg',
    gallery: [
      '/images/kyoto-hinoki-candle.jpg',
    ],
    colors: [
      { name: 'Amber Glass', hex: '#92400e' },
      { name: 'Smoked Charcoal Glass', hex: '#1f2937' },
    ],
    specifications: {
      Wax: '100% Biodegradable Soy & Coconut Blend',
      Wick: 'FSC-Certified Organic Cotton Wick (Lead-free)',
      BurnTime: 'Approximately 55 hours',
      Volume: '280 grams / 9.8 oz',
      Vessel: 'Heavy mouth-blown borosilicate glass (Reusable)',
    },
    features: [
      'Clean, soot-free burn with continuous fragrance throw',
      'Infused with 100% pure essential oil extracts',
      'Packaged in an embossed rigid paper tube gift box',
    ],
  },

  // ==========================================
  // 4. TRAVEL & CARRY
  // ==========================================
  {
    id: 'aurelia-terra',
    name: 'Aurelia Terra Travel Backpack',
    category: 'Travel',
    categoryId: 'travel',
    shortDescriptor: 'Modular Weatherproof Commuter Pack',
    description:
      'Engineered for everyday transit and global travel. Constructed from weatherproof 840D recycled ballistic nylon with YKK AquaGuard zips, dedicated 16-inch suspended laptop cradle, and magnetic Fidlock closures.',
    price: 6999,
    originalPrice: 8999,
    rating: 4.9,
    reviews: 43,
    badge: 'Carry Goods',
    stock: 14,
    featured: true,
    newArrival: false,
    image: '/images/aurelia-terra.jpg',
    secondaryImage: '/images/aurelia-terra.jpg',
    gallery: [
      '/images/aurelia-terra.jpg',
    ],
    colors: [
      { name: 'Stealth Black', hex: '#18181b' },
      { name: 'Slate Olive', hex: '#3f4f44' },
    ],
    specifications: {
      Capacity: '22 Liters (Expandable to 26L via top roll-cinch)',
      LaptopCompartment: 'Fits up to 16” MacBook Pro / ThinkPad',
      Material: '840D Ballistic Cordura with DWR water-repellent finish',
      Zippers: 'Reverse-coil YKK AquaGuard Weatherproof',
      Weight: '1.15 kg empty',
    },
    features: [
      'Luggage pass-through strap locks securely onto rolling suitcase handles',
      'Discreet hidden rear passport security pocket with RFID lining',
      'Ergonomic dual-density EVA shoulder harnesses with sternum strap',
    ],
  },

  // ==========================================
  // 5. ACCESSORIES
  // ==========================================
  {
    id: 'aurelia-core',
    name: 'Aurelia Core Smart Timepiece',
    category: 'Accessories',
    categoryId: 'accessories',
    shortDescriptor: 'Minimal Modern Studio Timepiece',
    description:
      'A refined contemporary timepiece featuring a sapphire crystal face, matte ceramic casing, Swiss-engineered quartz caliber, and quick-release surgical silicone and Italian leather straps.',
    price: 14999,
    originalPrice: 17999,
    rating: 5.0,
    reviews: 79,
    badge: 'Craft & Tech',
    stock: 11,
    featured: true,
    newArrival: false,
    image: '/images/aurelia-core.jpg',
    secondaryImage: '/images/aurelia-core.jpg',
    gallery: [
      '/images/aurelia-core.jpg',
    ],
    colors: [
      { name: 'Pure Chalk', hex: '#f4f4f5' },
      { name: 'Obsidian Matte', hex: '#18181b' },
    ],
    specifications: {
      CaseDiameter: '40mm',
      CaseThickness: '8.4mm Ultra-slim Profile',
      Glass: 'Double-Domed Scratch-Resistant Sapphire Crystal',
      WaterResistance: '5 ATM (50 meters / 165 feet)',
      Movement: 'High-Precision Swiss Ronda Caliber',
    },
    features: [
      'Subtle monochrome dial index with zero superfluous branding',
      'Includes dual interchangeable straps (Sport Silicone + Tuscan Leather)',
      'Hypoallergenic 316L medical-grade stainless steel buckle hardware',
    ],
  },
  {
    id: 'atelier-leather-wallet',
    name: 'Atelier Leather Bifold Wallet',
    category: 'Accessories',
    categoryId: 'accessories',
    shortDescriptor: 'Full-Grain Vegetable Tanned Leather',
    description:
      'Hand-cut and saddle-stitched by master artisans from full-grain Tuscan vegetable-tanned leather. Features 6 card slots, a full bill compartment, and an ultra-thin RFID protective interior membrane.',
    price: 2499,
    originalPrice: 3299,
    rating: 4.9,
    reviews: 64,
    badge: 'Handmade',
    stock: 28,
    featured: false,
    newArrival: true,
    image: '/images/atelier-leather-wallet.jpg',
    secondaryImage: '/images/atelier-leather-wallet.jpg',
    gallery: [
      '/images/atelier-leather-wallet.jpg',
    ],
    colors: [
      { name: 'Cognac Saddle', hex: '#9a3412' },
      { name: 'Espresso Brown', hex: '#3e2d24' },
      { name: 'Black Onyx', hex: '#18181b' },
    ],
    specifications: {
      Material: '100% Certified Tuscan Vegetable Tanned Cowhide',
      Thread: 'Fil Au Chinois Waxed French Linen Thread',
      Dimensions: '110mm x 85mm x 9mm (Slim Pocket Profile)',
      Capacity: 'Holds 8–10 cards + 15 cash bills with zero bulk',
    },
    features: [
      'Develops a deep, rich personal patina unique to your daily usage',
      'Hand-burnished and beeswax-sealed smooth edges',
      'RFID protective lining guards against unauthorized wireless skimming',
    ],
  },
  {
    id: 'horizon-sunglasses',
    name: 'Horizon Minimal Sunglasses',
    category: 'Accessories',
    categoryId: 'accessories',
    shortDescriptor: 'Titanium Wireframe & Polarized Lenses',
    description:
      'Ultralight round wireframe handcrafted from Japanese beta-titanium. Fitted with Category 3 scratch-resistant green polarized lenses that eliminate 99.9% of reflective glare while maintaining accurate color fidelity.',
    price: 4799,
    originalPrice: 5999,
    rating: 4.7,
    reviews: 32,
    badge: 'Polarized',
    stock: 19,
    featured: false,
    newArrival: true,
    image: '/images/horizon-sunglasses.jpg',
    secondaryImage: '/images/horizon-sunglasses.jpg',
    gallery: [
      '/images/horizon-sunglasses.jpg',
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#d4af37' },
      { name: 'Brushed Silver', hex: '#9ca3af' },
      { name: 'Matte Gunmetal', hex: '#374151' },
    ],
    specifications: {
      FrameMaterial: '100% Japanese Beta-Titanium (Featherweight 16g)',
      LensRating: 'Category 3 Polarized with 100% UV400 Protection',
      Dimensions: '49mm lens width / 20mm bridge / 145mm temple length',
      Hinges: 'Custom screwless barrel-free tension hinges',
    },
    features: [
      'Weightless balance prevents red pressure marks on nose bridge',
      'Hydrophobic and oleophobic lens coatings repel water and fingerprints',
      'Includes collapsible vegetable-tanned leather protective travel pouch',
    ],
  },

  // ==========================================
  // 6. FASHION & APPAREL
  // ==========================================
  {
    id: 'sora-merino-wool-overshirt',
    name: 'Sora Merino Wool Overshirt',
    category: 'Fashion',
    categoryId: 'fashion',
    shortDescriptor: 'Heavyweight Felted Australian Merino Layer',
    description:
      'Woven from 100% Australian extra-fine merino wool (340 GSM). Features natural corozo nut buttons, dual chest pockets, and a structured tailored drape designed for effortless four-season layering.',
    price: 6499,
    originalPrice: 7999,
    rating: 4.8,
    reviews: 38,
    badge: 'Pure Wool',
    stock: 22,
    featured: false,
    newArrival: true,
    image: '/images/sora-overshirt.jpg',
    secondaryImage: '/images/sora-overshirt.jpg',
    gallery: [
      '/images/sora-overshirt.jpg',
    ],
    colors: [
      { name: 'Charcoal Melange', hex: '#27272a' },
      { name: 'Oatmeal Natural', hex: '#ded6c9' },
      { name: 'Deep Forest', hex: '#2f4233' },
    ],
    specifications: {
      Material: '100% Extrafine Australian Merino Wool (340 GSM)',
      Weave: 'Custom Herringbone Structured Twill',
      Buttons: 'Natural Matte Corozo Nut Buttons',
      Fit: 'Relaxed Tailored Silhouette (True to size)',
      Care: 'Dry Clean or Gentle Cold Handwash',
    },
    features: [
      'Dual reinforced chest patch pockets with structured flap closure',
      'Naturally temperature regulating from 10°C to 24°C',
      'Internal discreet passport and card pocket for travel convenience',
    ],
  },

  // ==========================================
  // 7. LIFESTYLE & HYDRATION
  // ==========================================
  {
    id: 'apex-thermal-flask',
    name: 'Apex Vacuum Thermal Flask',
    category: 'Lifestyle',
    categoryId: 'lifestyle',
    shortDescriptor: 'Copper Vacuum Insulated 18/8 Steel Bottle',
    description:
      'Precision double-wall copper vacuum insulation engineered to maintain icy liquids for 24 hours and piping-hot brew for 12 hours. Exterior coated in durable, tactile architectural ceramic matte powder coat.',
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 51,
    badge: 'Daily Carry',
    stock: 40,
    featured: false,
    newArrival: true,
    image: '/images/apex-thermal-flask.jpg',
    secondaryImage: '/images/apex-thermal-flask.jpg',
    gallery: [
      '/images/apex-thermal-flask.jpg',
    ],
    colors: [
      { name: 'Sage Green', hex: '#3f4f44' },
      { name: 'Chalk Stone', hex: '#f4f4f5' },
      { name: 'Basalt Obsidian', hex: '#18181b' },
    ],
    specifications: {
      Volume: '650 ml / 22 oz',
      Insulation: 'Triple-layer Copper Shield Vacuum Core',
      Steel: 'Food-Grade Pro 18/8 Stainless Steel (BPA & BPS Free)',
      Cap: 'Machined steel screw cap with food-grade silicone leakproof seal',
      Dimensions: '240mm height x 72mm diameter (Fits standard cup holders)',
    },
    features: [
      'Zero condensation exterior prevents sweat puddles on desk surfaces',
      'Rounded interior lip delivers smooth pouring and pleasant sipping',
      'Dishwasher safe body with durable powder-coat finish',
    ],
  },
];

// ============================================================
// VERIFIED REVIEWS LINKED BY CANONICAL PRODUCT ID
// ============================================================
export const REVIEWS = [
  {
    id: 1,
    productId: 'aurelia-air-x1',
    author: 'Arjun M.',
    rating: 5,
    date: '2 weeks ago',
    title: 'Flawless sound balance and build quality',
    comment:
      'The Aurelia Air X1 exceeded every expectation. The low-end is punchy without distorting acoustic details. The memory foam pads are featherlight for 8-hour design sessions.',
    verified: true,
  },
  {
    id: 2,
    productId: 'aurelia-air-x1',
    author: 'Elena R.',
    rating: 5,
    date: '1 month ago',
    title: 'Better than my previous studio monitor cans',
    comment:
      'The hybrid noise cancellation creates a serene workspace in bustling cafes. Fast charging is miraculous — 10 minutes gives me half the day of playtime.',
    verified: true,
  },
  {
    id: 3,
    productId: 'aurelia-forma',
    author: 'David K.',
    rating: 5,
    date: '3 weeks ago',
    title: 'Pure industrial design poetry',
    comment:
      'The extruded aluminum finish looks like something from a Scandinavian museum. The warm 2700K light temperature transforms late night work.',
    verified: true,
  },
  {
    id: 4,
    productId: 'aurelia-core',
    author: 'Siddharth P.',
    rating: 5,
    date: '1 month ago',
    title: 'Understated luxury at its finest',
    comment:
      'Clean dial, accurate Ronda movement, and the Tuscan leather strap smells incredible right out of the presentation box.',
    verified: true,
  },
  {
    id: 5,
    productId: 'aurelia-studio-one',
    author: 'Maya S.',
    rating: 5,
    date: 'Just now',
    title: 'The acoustic staging is unbelievable',
    comment:
      'Crisp high frequencies and a rich vocal presence. Looks like an architectural sculpture on my desk beside my Arc keyboard.',
    verified: true,
  },
  {
    id: 6,
    productId: 'sora-merino-wool-overshirt',
    author: 'Marcus L.',
    rating: 5,
    date: '5 days ago',
    title: 'The merino fabric weight and drape are exceptional',
    comment:
      'The felted wool is so soft against the skin, yet heavyweight enough to wear as a standalone jacket in crisp autumn weather. The corozo buttons are a gorgeous subtle touch.',
    verified: true,
  },
];

// For backward compatibility: CoverFlow receives canonical flagship products
export const COVERFLOW_COLLECTION = PRODUCTS.filter((p) => p.featured).slice(0, 6);
