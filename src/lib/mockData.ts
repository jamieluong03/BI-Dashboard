import { faker } from "@faker-js/faker";
import { Order, Product, Customer, AdSource, Category } from "@/types/analytics";

faker.seed(123);

const categories: Category[] = ["Rings", "Necklaces", "Earrings", "Bracelets"];

const jewelryNames = {
  Rings: ['Band', 'Solitaire', 'Stackable Ring', 'Signet Ring', 'Cocktail Ring', 'Eternity Band'],
  Necklaces: ['Choker', 'Pendant', 'Chain', 'Lariat', 'Collar', 'Lockett'],
  Earrings: ['Studs', 'Hoops', 'Ear Cuffs', 'Drop Earrings', 'Chandeliers'],
  Bracelets: ['Bangle', 'Cuff', 'Tennis Bracelet', 'Charm Bracelet', 'Link Bracelet']
};

const materials = ['Gold', 'Silver', 'Rose Gold', 'Platinum', 'Diamond', 'Pearl', 'Opal'];

const regionShippingMap: Record<string, number> = {
  "California": 15.50,
  "New York": 8.25,
  "Texas": 12.00,
  "Florida": 11.00,
  "International": 35.00
};

export const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, () => {
    const retailPrice = faker.number.float({ min: 20, max: 300, fractionDigits: 2 });
    const stockLevel = faker.number.int({ min: 5, max: 150 });
    const category = faker.helpers.arrayElement(Object.keys(jewelryNames)) as Category;
    const productNames = faker.helpers.arrayElement(jewelryNames[category]);
    const name = `${faker.commerce.productAdjective()} ${faker.helpers.arrayElement(materials)} ${productNames}`;
    return {
      id: faker.string.uuid(),
      name: name,
      category: category,
      retailPrice,
      costPrice: parseFloat((retailPrice * faker.number.float({ min: 0.3, max: 0.5 })).toFixed(2)),
      stockLevel,
      reorderPoint: 20, 
      targetStockLevel: 100,
      daysToRestock: faker.number.int({ min: 3, max: 14 })
    };
  });
};

export const generateMockCustomers = (count: number): Customer[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    totalOrders: 0, 
    totalSpent: 0,
    lastOrderDate: null,
    isLoyaltyMember: false
  }));
};

export const generateMockOrders = (
  orderCount: number, 
  products: Product[], 
  customers: Customer[]
): Order[] => {
  return Array.from({ length: orderCount }, () => {
    const customer = faker.helpers.arrayElement(customers);
    const numItems = faker.number.int({ min: 1, max: 3 });
    const selectedProducts = faker.helpers.arrayElements(products, numItems);

    const items = selectedProducts.map(p => ({
      productId: p.id,
      quantity: faker.number.int({ min: 1, max: 2 }),
      priceAtSale: p.retailPrice
    }));

    const totalRevenue = items.reduce((sum, item) => sum + (item.priceAtSale * item.quantity), 0);
    const totalCost = selectedProducts.reduce((sum, p) => sum + p.costPrice, 0);
    const adSource = faker.helpers.arrayElement<AdSource>(["Meta", "Google", "TikTok", "Email", "Organic"]);
    
    const regions = Object.keys(regionShippingMap);
    const region = faker.helpers.arrayElement(regions);

    return {
      id: faker.string.uuid(),
      customerId: customer.id,
      customerName: customer.name,
      items,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      adSpend: (adSource === "Organic" || adSource === "Email") ? 0 : parseFloat((totalRevenue * 0.12).toFixed(2)),
      region,
      shippingCost: regionShippingMap[region],
      discountAmount: faker.helpers.maybe(() => 5, { probability: 0.1 }) ?? 0,
      adSource,
      status: faker.helpers.arrayElement(["shipped", "shipped", "processing", "cancelled"]),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      channel: faker.helpers.arrayElement([
        "Online Store", 
        "Google & Youtube", 
        "Facebook and Instagram by Meta", 
        "Shop", 
        "TikTok Shop"
      ])
    };
  });
};

const rawProducts = generateMockProducts(40);
const rawCustomers = generateMockCustomers(250);
const rawOrders = generateMockOrders(1200, rawProducts, rawCustomers);

export const MOCK_CUSTOMERS: Customer[] = rawCustomers.map(c => {
  const customerOrders = rawOrders.filter(o => o.customerId === c.id && o.status !== "cancelled");
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalRevenue, 0);
  const sortedOrders = [...customerOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    ...c,
    totalOrders: customerOrders.length,
    totalSpent: parseFloat(totalSpent.toFixed(2)),
    lastOrderDate: sortedOrders[0]?.createdAt || "No orders",
    isLoyaltyMember: totalSpent > 400
  };
});

export const MOCK_PRODUCTS = rawProducts;
export const MOCK_ORDERS = rawOrders;