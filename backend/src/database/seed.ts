import 'dotenv/config';
import { supabaseAdmin, supabaseAnon } from '../config/supabase.js';
import { env } from '../config/env.js';

// ─── Storage Bucket ───────────────────────────────────────────────────────────

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === env.SUPABASE_STORAGE_BUCKET);
  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(
      env.SUPABASE_STORAGE_BUCKET,
      { public: true },
    );
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`✅ Created storage bucket: ${env.SUPABASE_STORAGE_BUCKET}`);
  } else {
    console.log(`ℹ️  Storage bucket already exists: ${env.SUPABASE_STORAGE_BUCKET}`);
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

async function seedCategories() {
  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home', slug: 'home' },
  ];

  const { error } = await supabaseAdmin
    .from('categories')
    .upsert(categories, { onConflict: 'slug' });

  if (error) throw new Error(`Failed to seed categories: ${error.message}`);
  console.log('✅ Categories seeded');
}

// ─── Products ─────────────────────────────────────────────────────────────────

async function seedProducts() {
  const { data: cats } = await supabaseAdmin.from('categories').select('id, slug');
  const catMap = new Map((cats ?? []).map((c) => [c.slug as string, c.id as string]));

  const products = [
    {
      name: 'Wireless Headphones',
      description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
      price: 79.99,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Smart Watch',
      description: 'Feature-packed smartwatch with heart rate monitor, GPS, and 7-day battery.',
      price: 129.99,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof speaker with 360° sound and 12-hour playtime.',
      price: 49.99,
      image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Cotton T-Shirt',
      description: 'Classic fit 100% organic cotton t-shirt, available in multiple colors.',
      price: 19.99,
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Running Shoes',
      description: 'Lightweight mesh running shoes with responsive cushioning sole.',
      price: 89.99,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Backpack',
      description: '28L waterproof backpack with laptop compartment and USB charging port.',
      price: 59.99,
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Coffee Mug',
      description: 'Double-wall insulated 350ml ceramic mug, keeps drinks hot for 6 hours.',
      price: 14.99,
      image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with 5 brightness levels, USB charging port, and touch control.',
      price: 34.99,
      image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Notebook Set',
      description: 'Set of 3 A5 dotted notebooks with 160 pages each, lay-flat binding.',
      price: 22.99,
      image_url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Water Bottle',
      description: '750ml stainless steel insulated water bottle, keeps cold 24h / hot 12h.',
      price: 27.99,
      image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    // Electronics (extra)
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with 4K HDMI, 100W PD, SD card reader, and 3 USB-A ports.',
      price: 44.99,
      image_url: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Mechanical Keyboard',
      description: 'Compact TKL mechanical keyboard with RGB backlight and tactile brown switches.',
      price: 99.99,
      image_url: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with 6 programmable buttons and silent click.',
      price: 39.99,
      image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Webcam 1080p',
      description: 'Full HD webcam with built-in microphone and auto-focus for video calls.',
      price: 69.99,
      image_url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Portable Charger',
      description: '20000mAh power bank with 65W fast charging and dual USB-C output.',
      price: 54.99,
      image_url: 'https://images.unsplash.com/photo-1609592806596-b47b3e668d68?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Laptop Stand',
      description: 'Aluminium adjustable laptop stand, compatible with 10–17 inch laptops.',
      price: 34.99,
      image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Smart Plug',
      description: 'Wi-Fi smart plug with energy monitoring, works with Alexa and Google Home.',
      price: 17.99,
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Noise-Cancelling Earbuds',
      description: 'True wireless earbuds with ANC, 8h playtime, and IPX4 water resistance.',
      price: 89.99,
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'E-Reader',
      description: '6-inch e-ink display e-reader with built-in warm light and weeks of battery.',
      price: 119.99,
      image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    {
      name: 'Action Camera',
      description: '4K action camera with image stabilisation, waterproof to 30m.',
      price: 149.99,
      image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
      category_id: catMap.get('electronics'),
      is_active: true,
    },
    // Fashion (extra)
    {
      name: 'Slim Fit Jeans',
      description: 'Stretch denim slim-fit jeans with five-pocket styling, available in 3 washes.',
      price: 49.99,
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Leather Wallet',
      description: 'Slim genuine leather bifold wallet with RFID blocking and 8 card slots.',
      price: 29.99,
      image_url: 'https://images.unsplash.com/photo-1627123424574-724758594785?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Sunglasses',
      description: 'Polarised UV400 sunglasses with lightweight acetate frame.',
      price: 24.99,
      image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Hoodie',
      description: 'Pullover fleece hoodie with kangaroo pocket, unisex relaxed fit.',
      price: 44.99,
      image_url: 'https://images.unsplash.com/photo-1542396601-dca920ea2807?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Canvas Sneakers',
      description: 'Classic low-top canvas sneakers with rubber sole, available in 10 colours.',
      price: 34.99,
      image_url: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Baseball Cap',
      description: 'Adjustable 100% cotton baseball cap with embroidered logo.',
      price: 18.99,
      image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Denim Jacket',
      description: 'Classic denim jacket with button front and two chest pockets.',
      price: 64.99,
      image_url: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Sport Socks Pack',
      description: 'Pack of 6 cushioned ankle socks with moisture-wicking fabric.',
      price: 12.99,
      image_url: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Wrist Watch Classic',
      description: 'Minimalist quartz watch with stainless steel case and leather strap.',
      price: 74.99,
      image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    {
      name: 'Scarf',
      description: 'Soft merino wool scarf, 180cm long, available in multiple patterns.',
      price: 22.99,
      image_url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
      category_id: catMap.get('fashion'),
      is_active: true,
    },
    // Home (extra)
    {
      name: 'Scented Candle',
      description: 'Hand-poured soy wax candle with cedarwood & vanilla scent, 45h burn time.',
      price: 16.99,
      image_url: 'https://images.unsplash.com/photo-1608181831718-c9abb7b89ee8?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Throw Blanket',
      description: 'Super-soft knit throw blanket, 130×160cm, machine washable.',
      price: 38.99,
      image_url: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Indoor Plant Pot',
      description: 'Set of 3 ceramic plant pots with drainage holes, various sizes.',
      price: 19.99,
      image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Kitchen Scale',
      description: 'Digital kitchen scale with 5kg capacity, 1g precision, tare function.',
      price: 21.99,
      image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'French Press',
      description: '1L borosilicate glass French press with stainless steel plunger.',
      price: 26.99,
      image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Cutting Board',
      description: 'Large bamboo cutting board with juice groove, 40×28cm.',
      price: 23.99,
      image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Desk Organiser',
      description: 'Bamboo desktop organiser with 5 compartments and phone stand.',
      price: 18.99,
      image_url: 'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Yoga Mat',
      description: 'Non-slip 6mm thick TPE yoga mat with alignment lines, 183×61cm.',
      price: 32.99,
      image_url: 'https://images.unsplash.com/photo-1601925228008-0d4c8a01899c?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Picture Frame Set',
      description: 'Set of 6 black wooden picture frames in various sizes (4×6, 5×7, 8×10).',
      price: 28.99,
      image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
    {
      name: 'Storage Basket',
      description: 'Set of 3 woven seagrass storage baskets with handles.',
      price: 35.99,
      image_url: 'https://images.unsplash.com/photo-1558618047-f67f7f6c3f21?w=400',
      category_id: catMap.get('home'),
      is_active: true,
    },
  ];

  const { data: existing } = await supabaseAdmin.from('products').select('name');
  const existingNames = new Set((existing ?? []).map((p) => p.name as string));
  const toInsert = products.filter((p) => !existingNames.has(p.name));

  if (toInsert.length > 0) {
    const { error } = await supabaseAdmin.from('products').insert(toInsert);
    if (error) throw new Error(`Failed to seed products: ${error.message}`);
    console.log(`✅ Inserted ${toInsert.length} products`);
  } else {
    console.log('ℹ️  All products already exist, skipping');
  }
}

// ─── Users ────────────────────────────────────────────────────────────────────

async function seedUser(opts: {
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
}) {
  const { data: signInData } = await supabaseAnon.auth.signInWithPassword({
    email: opts.email,
    password: opts.password,
  });

  let userId: string;

  if (signInData?.user) {
    userId = signInData.user.id;
    console.log(`ℹ️  User already exists: ${opts.email}`);
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: opts.email,
      password: opts.password,
      email_confirm: true,
      user_metadata: { name: opts.name },
    });
    if (error) throw new Error(`Failed to create user ${opts.email}: ${error.message}`);
    userId = data.user!.id;
    console.log(`✅ Created user: ${opts.email}`);
  }

  const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
    { id: userId, email: opts.email, name: opts.name, role: opts.role },
    { onConflict: 'id' },
  );

  if (profileError) {
    throw new Error(`Failed to upsert profile for ${opts.email}: ${profileError.message}`);
  }
  console.log(`✅ Profile upserted: ${opts.email} (role: ${opts.role})`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting seed...\n');

  try {
    await ensureBucket();
    await seedCategories();
    await seedProducts();

    await seedUser({ email: 'customer@test.com', password: 'Password123!', name: 'Test Customer', role: 'customer' });
    await seedUser({ email: 'admin@test.com', password: 'Password123!', name: 'Test Admin', role: 'admin' });

    console.log('\n✅ Seed complete!');
    console.log('\n📋 Test credentials:');
    console.log('  Customer: customer@test.com / Password123!');
    console.log('  Admin:    admin@test.com    / Password123!');
  } catch (err) {
    console.error('\n❌ Seed failed:', err);
    process.exit(1);
  }
}

main();
