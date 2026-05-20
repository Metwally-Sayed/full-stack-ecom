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
