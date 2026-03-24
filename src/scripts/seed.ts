import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../lib/supabase';
import { MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_ORDERS } from '../lib/mockData';

async function seedDatabase() {
  if (!supabaseAdmin) return;

  console.log('🚀 Starting sanitized seed process...');

  // 1. Seed Products first
  await supabaseAdmin.from('products').insert(MOCK_PRODUCTS);
  console.log('✅ Products seeded');

  // 2. Clean and Seed Customers
  const sanitizedCustomers = MOCK_CUSTOMERS.map(c => ({
    ...c,
    // Replace "No orders" string with actual null for the DB
    lastOrderDate: c.lastOrderDate === "No orders" ? null : c.lastOrderDate
  }));

  const { error: cError } = await supabaseAdmin.from('customers').insert(sanitizedCustomers);
  if (cError) {
    console.error('❌ Customers Error:', cError.message);
    return; // Stop if customers fail, or orders will fail too!
  }
  console.log('✅ Customers seeded');

  // 3. Seed Orders (after customers are definitely there)
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

  console.log('✨ Database seeding complete!');
}

seedDatabase();