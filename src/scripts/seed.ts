import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('Checking Env:', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ MISSING',
  key: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Found' : '❌ MISSING'
});

async function seedDatabase() {
  const { supabaseAdmin } = await import('../lib/supabase');
  const { MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_ORDERS, MOCK_MARKETING_SPENDS } = await import('../lib/mockData');

  if (!supabaseAdmin) return;

  console.log('🚀 Starting the cleanup & seed...');

  // 1. Seed Products (usually works fine)
  await supabaseAdmin.from('products').insert(MOCK_PRODUCTS);
  console.log('✅ Products seeded');

  // 2. SANITIZE & Seed Customers
  const sanitizedCustomers = MOCK_CUSTOMERS.map(customer => ({
    ...customer,
    lastOrderDate: customer.lastOrderDate === "No orders" ? null : customer.lastOrderDate
  }));

  const { error: cError } = await supabaseAdmin.from('customers').insert(sanitizedCustomers);

  if (cError) {
    console.error('❌ Customers Error:', cError.message);
    return; // STOP HERE if customers fail, or orders will always fail FK check
  }
  console.log('✅ Customers seeded');

  // 3. Seed Orders
  const batchSize = 100;
  for (let i = 0; i < MOCK_ORDERS.length; i += batchSize) {
    const batch = MOCK_ORDERS.slice(i, i + batchSize);
    const { error: oError } = await supabaseAdmin.from('orders').insert(batch);
    if (oError) {
      console.error(`❌ Batch Error at ${i}:`, oError.message);
      break;
    }
    console.log(`📦 Progress: ${i + batch.length}/${MOCK_ORDERS.length} orders...`);
  }

  // 4. Seed Marketing Spends
  console.log('🚀 Seeding marketing spends...');
  const marketingBatchSize = 100;

  for (let i = 0; i < MOCK_MARKETING_SPENDS.length; i += marketingBatchSize) {
    const batch = MOCK_MARKETING_SPENDS.slice(i, i + marketingBatchSize);
    const { error: mError } = await supabaseAdmin.from('marketing_spends').insert(batch);

    if (mError) {
      console.error(`❌ Marketing Batch Error at ${i}:`, mError.message);
      break;
    }
    console.log(`📊 Marketing Progress: ${i + batch.length}/${MOCK_MARKETING_SPENDS.length} records...`);
  }

  console.log('✨ All tables synchronized and seeded!');

  console.log('✨ Database population complete!');
}

seedDatabase();