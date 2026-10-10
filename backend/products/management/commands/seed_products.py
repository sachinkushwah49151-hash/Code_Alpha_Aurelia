"""
Management command: seed_products
Idempotent — safe to run multiple times. Uses update_or_create on slug.
Imports the exact product catalog from src/data/products.js (transcribed).
Run: python manage.py seed_products
"""
from django.core.management.base import BaseCommand
from products.models import Category, Product, Review


# ── Categories (from src/data/products.js CATEGORIES) ───────────────────────
CATEGORIES_DATA = [
    {
        'slug':    'electronics',
        'name':    'Electronics',
        'tagline': 'Precision acoustic & desktop hardware',
        'image':   '/images/aurelia-arc.jpg',
    },
    {
        'slug':    'audio',
        'name':    'Audio',
        'tagline': 'Pure reference spatial acoustics',
        'image':   '/images/aurelia-air-x1.jpg',
    },
    {
        'slug':    'fashion',
        'name':    'Fashion',
        'tagline': 'Tailored silhouettes & organic natural fabrics',
        'image':   '/images/sora-overshirt.jpg',
    },
    {
        'slug':    'accessories',
        'name':    'Accessories',
        'tagline': 'Refined leather goods & everyday timepieces',
        'image':   '/images/aurelia-core.jpg',
    },
    {
        'slug':    'home',
        'name':    'Home',
        'tagline': 'Objects for intentional everyday living',
        'image':   '/images/aurelia-forma.jpg',
    },
    {
        'slug':    'lifestyle',
        'name':    'Lifestyle',
        'tagline': 'Daily rituals, hydration & stationery',
        'image':   '/images/apex-thermal-flask.jpg',
    },
    {
        'slug':    'travel',
        'name':    'Travel',
        'tagline': 'Modular luggage & durable road carryalls',
        'image':   '/images/aurelia-terra.jpg',
    },
]

# ── Products (from src/data/products.js PRODUCTS) ───────────────────────────
PRODUCTS_DATA = [
    # ── AUDIO ─────────────────────────────────────────────────────────────────
    {
        'slug':             'aurelia-air-x1',
        'category_slug':    'audio',
        'name':             'Aurelia Air X1 Headphones',
        'short_descriptor': 'Minimal Wireless Spatial Audio',
        'description':      (
            'Engineered for acoustic purity. The Aurelia Air X1 features custom 40mm beryllium '
            'drivers, active hybrid noise cancellation, and breathable lambskin leather ear '
            'cushions for all-day listening fatigue reduction.'
        ),
        'price':            8499,
        'original_price':   10999,
        'rating':           4.9,
        'reviews_count':    142,
        'badge':            'Signature',
        'stock':            18,
        'featured':         True,
        'new_arrival':      False,
        'image':            '/images/aurelia-air-x1.jpg',
        'secondary_image':  '/images/aurelia-air-x1.jpg',
        'gallery':          ['/images/aurelia-air-x1.jpg', '/images/aurelia-air-x1-hero.jpg'],
        'colors': [
            {'name': 'Matte Obsidian',  'hex': '#1c1c1e'},
            {'name': 'Champagne Sand',  'hex': '#ded6c9'},
            {'name': 'Graphite Grey',   'hex': '#58595b'},
        ],
        'specifications': {
            'Driver Size':  '40mm Custom Beryllium Dynamic',
            'Battery Life': '42 hours (ANC Off), 34 hours (ANC On)',
            'Connectivity': 'Bluetooth 5.3 + 3.5mm Analog Audio',
            'Weight':       '248 grams',
            'Charging':     'USB-C Quick Charge (10 min for 5 hours)',
            'Warranty':     '2-Year Manufacturer International Warranty',
        },
        'features': [
            'Hybrid active noise cancellation with 4 acoustic microphones',
            'Ultra-soft memory foam headband and ear cups',
            'Multipoint connection to switch between laptop and phone seamlessly',
            'Integrated tactile rotary volume dial',
        ],
    },
    {
        'slug':             'aurelia-studio-one',
        'category_slug':    'audio',
        'name':             'Aurelia Studio One Speaker',
        'short_descriptor': 'Hi-Fi Waveguide Desktop Monitor',
        'description':      (
            'Cast from structural mineral polymer to eradicate acoustic resonance. '
            'Aurelia Studio One delivers uncolored, lifelike near-field sound staging '
            'with dual passive radiators and silk-dome tweeters.'
        ),
        'price':            12999,
        'original_price':   14999,
        'rating':           4.9,
        'reviews_count':    68,
        'badge':            'Acoustic Award',
        'stock':            12,
        'featured':         True,
        'new_arrival':      False,
        'image':            '/images/aurelia-studio-one.jpg',
        'secondary_image':  '/images/aurelia-studio-one.jpg',
        'gallery':          ['/images/aurelia-studio-one.jpg'],
        'colors': [
            {'name': 'Walnut & Obsidian', 'hex': '#27272a'},
            {'name': 'Nordic Birch',      'hex': '#f4f4f5'},
        ],
        'specifications': {
            'Power':      '60W RMS Pure Class-D Amplification',
            'Frequency':  '48Hz – 22,000Hz (±2dB flat curve)',
            'Inputs':     'Bluetooth 5.2, Optical, USB-C, RCA Analog',
            'Dimensions': '185mm x 120mm x 140mm',
            'Weight':     '3.1 kg per pair',
        },
        'features': [
            'Precision acoustic waveguide ensures wide horizontal dispersion',
            'Custom acoustic tuning presets for desktop boundary reflection',
            'Solid anodized aluminum front baffle and rear controls',
        ],
    },
    # ── ELECTRONICS ───────────────────────────────────────────────────────────
    {
        'slug':             'aurelia-arc',
        'category_slug':    'electronics',
        'name':             'Aurelia Arc Mechanical Keyboard',
        'short_descriptor': 'Precision Machined Wireless Board',
        'description':      (
            'CNC-milled from a solid billet of 6063 aluminum. Features factory-lubricated '
            'linear switches, seamless multi-device wireless pairing, and double-shot PBT '
            'keycaps with custom Aurelia editorial typography.'
        ),
        'price':            7499,
        'original_price':   9499,
        'rating':           4.9,
        'reviews_count':    84,
        'badge':            'Bestseller',
        'stock':            15,
        'featured':         True,
        'new_arrival':      False,
        'image':            '/images/aurelia-arc.jpg',
        'secondary_image':  '/images/aurelia-arc.jpg',
        'gallery':          ['/images/aurelia-arc.jpg'],
        'colors': [
            {'name': 'Silver Anodized', 'hex': '#d1d5db'},
            {'name': 'Space Black',     'hex': '#18181b'},
        ],
        'specifications': {
            'Layout':       '75% Compact (84 keys)',
            'Switches':     'Custom Aurelia Coral Linear (45g actuation)',
            'Connectivity': 'Tri-Mode: 2.4GHz Dongle, BT 5.1 (3 hosts), USB-C',
            'Battery':      '4000mAh Lithium-ion (Up to 180 hours without backlight)',
            'Weight':       '980 grams (solid desk stability)',
        },
        'features': [
            'Gasket-mounted plate structure for dampened, satisfying sound',
            'Hot-swappable PCB supports 3-pin and 5-pin switches',
            'CNC milled magnetic feet for 4° and 8° typing angles',
        ],
    },
    # ── HOME ──────────────────────────────────────────────────────────────────
    {
        'slug':             'aurelia-forma',
        'category_slug':    'home',
        'name':             'Aurelia Forma Desk Lamp',
        'short_descriptor': 'Architectural Workspace Illumination',
        'description':      (
            'A counterbalanced study lamp built from precision extruded aluminum and cast steel. '
            'Employs a museum-grade CRI 97+ LED array with smooth touch-dimming and circadian '
            'tone modulation from 2700K to 5000K.'
        ),
        'price':            4299,
        'original_price':   5499,
        'rating':           4.8,
        'reviews_count':    57,
        'badge':            'Design Icon',
        'stock':            20,
        'featured':         True,
        'new_arrival':      False,
        'image':            '/images/aurelia-forma.jpg',
        'secondary_image':  '/images/aurelia-forma.jpg',
        'gallery':          ['/images/aurelia-forma.jpg'],
        'colors': [
            {'name': 'Matte Graphite',  'hex': '#374151'},
            {'name': 'Warm Champagne',  'hex': '#d4af37'},
            {'name': 'Chalk White',     'hex': '#f3f4f6'},
        ],
        'specifications': {
            'LightSource': 'Custom High-CRI 97+ LED Engine',
            'Brightness':  'Up to 900 Lumens (Continuous stepless dimming)',
            'ColorTemp':   '2700K (Warm Relax) to 5000K (Daylight Focus)',
            'Power':       'USB-C Powered (18W Adapter Included)',
            'ArmReach':    '72 cm total articulated cantilever reach',
        },
        'features': [
            'Patented micro-spring counterbalance maintains exact desired position',
            'Honeycomb anti-glare louvre prevents direct eye exposure',
            'Integrated ambient light sensor automatically compensates for room lighting',
        ],
    },
    {
        'slug':             'kyoto-hinoki-candle',
        'category_slug':    'home',
        'name':             'Kyoto Hinoki Soy Candle',
        'short_descriptor': 'Hand-Poured Japanese Cypress & Cedar',
        'description':      (
            'Crafted in small batches using 100% natural botanical soy and coconut wax. '
            'Delicately scented with cold-pressed Japanese hinoki cypress, aged atlas cedarwood, '
            'black pepper, and smoky Haitian vetiver.'
        ),
        'price':            1499,
        'original_price':   1999,
        'rating':           4.8,
        'reviews_count':    29,
        'badge':            'Artisanal',
        'stock':            35,
        'featured':         False,
        'new_arrival':      False,
        'image':            '/images/kyoto-hinoki-candle.jpg',
        'secondary_image':  '/images/kyoto-hinoki-candle.jpg',
        'gallery':          ['/images/kyoto-hinoki-candle.jpg'],
        'colors': [
            {'name': 'Amber Glass',         'hex': '#92400e'},
            {'name': 'Smoked Charcoal Glass', 'hex': '#1f2937'},
        ],
        'specifications': {
            'Wax':      '100% Biodegradable Soy & Coconut Blend',
            'Wick':     'FSC-Certified Organic Cotton Wick (Lead-free)',
            'BurnTime': 'Approximately 55 hours',
            'Volume':   '280 grams / 9.8 oz',
            'Vessel':   'Heavy mouth-blown borosilicate glass (Reusable)',
        },
        'features': [
            'Clean, soot-free burn with continuous fragrance throw',
            'Infused with 100% pure essential oil extracts',
            'Packaged in an embossed rigid paper tube gift box',
        ],
    },
    # ── TRAVEL ────────────────────────────────────────────────────────────────
    {
        'slug':             'aurelia-terra',
        'category_slug':    'travel',
        'name':             'Aurelia Terra Travel Backpack',
        'short_descriptor': 'Modular Weatherproof Commuter Pack',
        'description':      (
            'Engineered for everyday transit and global travel. Constructed from weatherproof '
            '840D recycled ballistic nylon with YKK AquaGuard zips, dedicated 16-inch suspended '
            'laptop cradle, and magnetic Fidlock closures.'
        ),
        'price':            6999,
        'original_price':   8999,
        'rating':           4.9,
        'reviews_count':    43,
        'badge':            'Carry Goods',
        'stock':            14,
        'featured':         True,
        'new_arrival':      False,
        'image':            '/images/aurelia-terra.jpg',
        'secondary_image':  '/images/aurelia-terra.jpg',
        'gallery':          ['/images/aurelia-terra.jpg'],
        'colors': [
            {'name': 'Stealth Black', 'hex': '#18181b'},
            {'name': 'Slate Olive',   'hex': '#3f4f44'},
        ],
        'specifications': {
            'Capacity':          '22 Liters (Expandable to 26L via top roll-cinch)',
            'LaptopCompartment': 'Fits up to 16" MacBook Pro / ThinkPad',
            'Material':          '840D Ballistic Cordura with DWR water-repellent finish',
            'Zippers':           'Reverse-coil YKK AquaGuard Weatherproof',
            'Weight':            '1.15 kg empty',
        },
        'features': [
            'Luggage pass-through strap locks securely onto rolling suitcase handles',
            'Discreet hidden rear passport security pocket with RFID lining',
            'Ergonomic dual-density EVA shoulder harnesses with sternum strap',
        ],
    },
    # ── ACCESSORIES ───────────────────────────────────────────────────────────
    {
        'slug':             'aurelia-core',
        'category_slug':    'accessories',
        'name':             'Aurelia Core Smart Timepiece',
        'short_descriptor': 'Minimal Modern Studio Timepiece',
        'description':      (
            'A refined contemporary timepiece featuring a sapphire crystal face, matte ceramic '
            'casing, Swiss-engineered quartz caliber, and quick-release surgical silicone '
            'and Italian leather straps.'
        ),
        'price':            14999,
        'original_price':   17999,
        'rating':           5.0,
        'reviews_count':    79,
        'badge':            'Craft & Tech',
        'stock':            11,
        'featured':         True,
        'new_arrival':      False,
        'image':            '/images/aurelia-core.jpg',
        'secondary_image':  '/images/aurelia-core.jpg',
        'gallery':          ['/images/aurelia-core.jpg'],
        'colors': [
            {'name': 'Pure Chalk',    'hex': '#f4f4f5'},
            {'name': 'Obsidian Matte', 'hex': '#18181b'},
        ],
        'specifications': {
            'CaseDiameter':  '40mm',
            'CaseThickness': '8.4mm Ultra-slim Profile',
            'Glass':         'Double-Domed Scratch-Resistant Sapphire Crystal',
            'WaterResistance': '5 ATM (50 meters / 165 feet)',
            'Movement':      'High-Precision Swiss Ronda Caliber',
        },
        'features': [
            'Subtle monochrome dial index with zero superfluous branding',
            'Includes dual interchangeable straps (Sport Silicone + Tuscan Leather)',
            'Hypoallergenic 316L medical-grade stainless steel buckle hardware',
        ],
    },
    {
        'slug':             'atelier-leather-wallet',
        'category_slug':    'accessories',
        'name':             'Atelier Leather Bifold Wallet',
        'short_descriptor': 'Full-Grain Vegetable Tanned Leather',
        'description':      (
            'Hand-cut and saddle-stitched by master artisans from full-grain Tuscan '
            'vegetable-tanned leather. Features 6 card slots, a full bill compartment, '
            'and an ultra-thin RFID protective interior membrane.'
        ),
        'price':            2499,
        'original_price':   3299,
        'rating':           4.9,
        'reviews_count':    64,
        'badge':            'Handmade',
        'stock':            28,
        'featured':         False,
        'new_arrival':      True,
        'image':            '/images/atelier-leather-wallet.jpg',
        'secondary_image':  '/images/atelier-leather-wallet.jpg',
        'gallery':          ['/images/atelier-leather-wallet.jpg'],
        'colors': [
            {'name': 'Cognac Saddle',  'hex': '#9a3412'},
            {'name': 'Espresso Brown', 'hex': '#3e2d24'},
            {'name': 'Black Onyx',     'hex': '#18181b'},
        ],
        'specifications': {
            'Material':   '100% Certified Tuscan Vegetable Tanned Cowhide',
            'Thread':     'Fil Au Chinois Waxed French Linen Thread',
            'Dimensions': '110mm x 85mm x 9mm (Slim Pocket Profile)',
            'Capacity':   'Holds 8–10 cards + 15 cash bills with zero bulk',
        },
        'features': [
            'Develops a deep, rich personal patina unique to your daily usage',
            'Hand-burnished and beeswax-sealed smooth edges',
            'RFID protective lining guards against unauthorized wireless skimming',
        ],
    },
    {
        'slug':             'horizon-sunglasses',
        'category_slug':    'accessories',
        'name':             'Horizon Minimal Sunglasses',
        'short_descriptor': 'Titanium Wireframe & Polarized Lenses',
        'description':      (
            'Ultralight round wireframe handcrafted from Japanese beta-titanium. Fitted with '
            'Category 3 scratch-resistant green polarized lenses that eliminate 99.9% of '
            'reflective glare while maintaining accurate color fidelity.'
        ),
        'price':            4799,
        'original_price':   5999,
        'rating':           4.7,
        'reviews_count':    32,
        'badge':            'Polarized',
        'stock':            19,
        'featured':         False,
        'new_arrival':      True,
        'image':            '/images/horizon-sunglasses.jpg',
        'secondary_image':  '/images/horizon-sunglasses.jpg',
        'gallery':          ['/images/horizon-sunglasses.jpg'],
        'colors': [
            {'name': 'Champagne Gold', 'hex': '#d4af37'},
            {'name': 'Brushed Silver', 'hex': '#9ca3af'},
            {'name': 'Matte Gunmetal', 'hex': '#374151'},
        ],
        'specifications': {
            'FrameMaterial': '100% Japanese Beta-Titanium (Featherweight 16g)',
            'LensRating':    'Category 3 Polarized with 100% UV400 Protection',
            'Dimensions':    '49mm lens width / 20mm bridge / 145mm temple length',
            'Hinges':        'Custom screwless barrel-free tension hinges',
        },
        'features': [
            'Weightless balance prevents red pressure marks on nose bridge',
            'Hydrophobic and oleophobic lens coatings repel water and fingerprints',
            'Includes collapsible vegetable-tanned leather protective travel pouch',
        ],
    },
    # ── FASHION ───────────────────────────────────────────────────────────────
    {
        'slug':             'sora-merino-wool-overshirt',
        'category_slug':    'fashion',
        'name':             'Sora Merino Wool Overshirt',
        'short_descriptor': 'Heavyweight Felted Australian Merino Layer',
        'description':      (
            'Woven from 100% Australian extra-fine merino wool (340 GSM). Features natural '
            'corozo nut buttons, dual chest pockets, and a structured tailored drape designed '
            'for effortless four-season layering.'
        ),
        'price':            6499,
        'original_price':   7999,
        'rating':           4.8,
        'reviews_count':    38,
        'badge':            'Pure Wool',
        'stock':            22,
        'featured':         False,
        'new_arrival':      True,
        'image':            '/images/sora-overshirt.jpg',
        'secondary_image':  '/images/sora-overshirt.jpg',
        'gallery':          ['/images/sora-overshirt.jpg'],
        'colors': [
            {'name': 'Charcoal Melange', 'hex': '#27272a'},
            {'name': 'Oatmeal Natural',  'hex': '#ded6c9'},
            {'name': 'Deep Forest',      'hex': '#2f4233'},
        ],
        'specifications': {
            'Material': '100% Extrafine Australian Merino Wool (340 GSM)',
            'Weave':    'Custom Herringbone Structured Twill',
            'Buttons':  'Natural Matte Corozo Nut Buttons',
            'Fit':      'Relaxed Tailored Silhouette (True to size)',
            'Care':     'Dry Clean or Gentle Cold Handwash',
        },
        'features': [
            'Dual reinforced chest patch pockets with structured flap closure',
            'Naturally temperature regulating from 10°C to 24°C',
            'Internal discreet passport and card pocket for travel convenience',
        ],
    },
    # ── LIFESTYLE ─────────────────────────────────────────────────────────────
    {
        'slug':             'apex-thermal-flask',
        'category_slug':    'lifestyle',
        'name':             'Apex Vacuum Thermal Flask',
        'short_descriptor': 'Copper Vacuum Insulated 18/8 Steel Bottle',
        'description':      (
            'Precision double-wall copper vacuum insulation engineered to maintain icy '
            'liquids for 24 hours and piping-hot brew for 12 hours. Exterior coated in '
            'durable, tactile architectural ceramic matte powder coat.'
        ),
        'price':            1899,
        'original_price':   2499,
        'rating':           4.9,
        'reviews_count':    51,
        'badge':            'Daily Carry',
        'stock':            40,
        'featured':         False,
        'new_arrival':      True,
        'image':            '/images/apex-thermal-flask.jpg',
        'secondary_image':  '/images/apex-thermal-flask.jpg',
        'gallery':          ['/images/apex-thermal-flask.jpg'],
        'colors': [
            {'name': 'Sage Green',      'hex': '#3f4f44'},
            {'name': 'Chalk Stone',     'hex': '#f4f4f5'},
            {'name': 'Basalt Obsidian', 'hex': '#18181b'},
        ],
        'specifications': {
            'Volume':     '650 ml / 22 oz',
            'Insulation': 'Triple-layer Copper Shield Vacuum Core',
            'Steel':      'Food-Grade Pro 18/8 Stainless Steel (BPA & BPS Free)',
            'Cap':        'Machined steel screw cap with food-grade silicone leakproof seal',
            'Dimensions': '240mm height x 72mm diameter (Fits standard cup holders)',
        },
        'features': [
            'Zero condensation exterior prevents sweat puddles on desk surfaces',
            'Rounded interior lip delivers smooth pouring and pleasant sipping',
            'Dishwasher safe body with durable powder-coat finish',
        ],
    },
]

# ── Reviews (from src/data/products.js REVIEWS) ─────────────────────────────
REVIEWS_DATA = [
    {
        'product_slug': 'aurelia-air-x1',
        'author':       'Arjun M.',
        'rating':       5,
        'date_display': '2 weeks ago',
        'title':        'Flawless sound balance and build quality',
        'comment':      (
            'The Aurelia Air X1 exceeded every expectation. The low-end is punchy without '
            'distorting acoustic details. The memory foam pads are featherlight for '
            '8-hour design sessions.'
        ),
        'verified':     True,
    },
    {
        'product_slug': 'aurelia-air-x1',
        'author':       'Elena R.',
        'rating':       5,
        'date_display': '1 month ago',
        'title':        'Better than my previous studio monitor cans',
        'comment':      (
            'The hybrid noise cancellation creates a serene workspace in bustling cafes. '
            'Fast charging is miraculous — 10 minutes gives me half the day of playtime.'
        ),
        'verified':     True,
    },
    {
        'product_slug': 'aurelia-forma',
        'author':       'David K.',
        'rating':       5,
        'date_display': '3 weeks ago',
        'title':        'Pure industrial design poetry',
        'comment':      (
            'The extruded aluminum finish looks like something from a Scandinavian museum. '
            'The warm 2700K light temperature transforms late night work.'
        ),
        'verified':     True,
    },
    {
        'product_slug': 'aurelia-core',
        'author':       'Siddharth P.',
        'rating':       5,
        'date_display': '1 month ago',
        'title':        'Understated luxury at its finest',
        'comment':      (
            'Clean dial, accurate Ronda movement, and the Tuscan leather strap smells '
            'incredible right out of the presentation box.'
        ),
        'verified':     True,
    },
    {
        'product_slug': 'aurelia-studio-one',
        'author':       'Maya S.',
        'rating':       5,
        'date_display': 'Just now',
        'title':        'The acoustic staging is unbelievable',
        'comment':      (
            'Crisp high frequencies and a rich vocal presence. Looks like an architectural '
            'sculpture on my desk beside my Arc keyboard.'
        ),
        'verified':     True,
    },
    {
        'product_slug': 'sora-merino-wool-overshirt',
        'author':       'Marcus L.',
        'rating':       5,
        'date_display': '5 days ago',
        'title':        'The merino fabric weight and drape are exceptional',
        'comment':      (
            'The felted wool is so soft against the skin, yet heavyweight enough to wear as '
            'a standalone jacket in crisp autumn weather. The corozo buttons are a gorgeous '
            'subtle touch.'
        ),
        'verified':     True,
    },
]


class Command(BaseCommand):
    help = (
        'Seed the database with the Aurelia product catalog. '
        'Idempotent — safe to run multiple times (uses update_or_create).'
    )

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('Seeding Aurelia product catalog...'))

        # Seed categories
        cat_objects = {}
        for cat_data in CATEGORIES_DATA:
            cat, created = Category.objects.update_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name':    cat_data['name'],
                    'tagline': cat_data['tagline'],
                    'image':   cat_data['image'],
                }
            )
            cat_objects[cat_data['slug']] = cat
            action = 'Created' if created else 'Updated'
            self.stdout.write(f'  {action} category: {cat.name}')

        # Seed products
        prod_objects = {}
        for p in PRODUCTS_DATA:
            category = cat_objects[p['category_slug']]
            product, created = Product.objects.update_or_create(
                slug=p['slug'],
                defaults={
                    'name':             p['name'],
                    'category':         category,
                    'short_descriptor': p['short_descriptor'],
                    'description':      p['description'],
                    'price':            p['price'],
                    'original_price':   p.get('original_price'),
                    'rating':           p['rating'],
                    'reviews_count':    p['reviews_count'],
                    'badge':            p.get('badge', ''),
                    'stock':            p['stock'],
                    'featured':         p['featured'],
                    'new_arrival':      p['new_arrival'],
                    'image':            p['image'],
                    'secondary_image':  p.get('secondary_image', ''),
                    'gallery':          p.get('gallery', []),
                    'colors':           p.get('colors', []),
                    'specifications':   p.get('specifications', {}),
                    'features':         p.get('features', []),
                    'is_active':        True,
                }
            )
            prod_objects[p['slug']] = product
            action = 'Created' if created else 'Updated'
            self.stdout.write(f'  {action} product: {product.name}')

        # Seed reviews (clear existing first to avoid duplicates)
        Review.objects.all().delete()
        for r in REVIEWS_DATA:
            product = prod_objects.get(r['product_slug'])
            if not product:
                self.stdout.write(
                    self.style.WARNING(f"  [WARN] Product '{r['product_slug']}' not found for review - skipping.")
                )
                continue
            Review.objects.create(
                product=product,
                author=r['author'],
                rating=r['rating'],
                date_display=r['date_display'],
                title=r['title'],
                comment=r['comment'],
                verified=r['verified'],
            )
        # Seed demo user for 1-click reviewer evaluation
        from accounts.models import CustomUser
        demo_user, u_created = CustomUser.objects.get_or_create(
            email='alex.vance@studio-aurelia.co',
            defaults={
                'name': 'Alex Vance',
                'phone': '+91 98765 43210',
            }
        )
        demo_user.set_password('aurelia-demo-password')
        demo_user.save()
        self.stdout.write(f'  [OK] Demo user configured: alex.vance@studio-aurelia.co')

        self.stdout.write(self.style.SUCCESS(
            f'\n[OK] Seeded {len(CATEGORIES_DATA)} categories, '
            f'{len(PRODUCTS_DATA)} products, '
            f'{len(REVIEWS_DATA)} reviews successfully.'
        ))
