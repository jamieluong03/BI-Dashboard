import { faker } from "@faker-js/faker";
import { Order, Product, Customer, AdSource, Category, MarketingSpend, SalesChannel } from "@/types/analytics";
import { getSeasonalMultiplier } from "./utils";

faker.seed(123);

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

const channelsMap: Record<string, AdSource[]> = {
  "TikTok Shop": ["TikTok"],
  "Facebook and Instagram by Meta": ["Meta"],
  "Google & Youtube": ["Google"],
  "Shop": ["Organic", "Email"],
  "Online Store": ["Meta", "Google", "TikTok", "Email", "Organic"]
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
  days: number, 
  products: Product[], 
  customers: Customer[]
): Order[] => {
  const allOrders: Order[] = [];
  const regions = Object.keys(regionShippingMap);
  const channels = Object.keys(channelsMap) as SalesChannel[];

  for (let i=0; i<days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const multiplier = getSeasonalMultiplier(date);
    const ordersToGenerate = Math.floor(faker.number.int({ min: 1, max: 4 }) * multiplier);

    for (let j=0; j<ordersToGenerate; j++) {

      const customer = faker.helpers.arrayElement(customers);
      const numItems = faker.number.int({ min: 1, max: 3 });
      const selectedProducts = faker.helpers.arrayElements(products, numItems);
      const orderDate = new Date(date);
      orderDate.setHours(faker.number.int({ min: 0, max: 23 }), faker.number.int({ min: 0, max: 59 }));

      const channel = faker.helpers.arrayElement(channels);
      const validSources = channelsMap[channel];
      const adSource = faker.helpers.arrayElement(validSources);

      const items = selectedProducts.map(p => ({
        productId: p.id,
        quantity: faker.number.int({ min: 1, max: 2 }),
        priceAtSale: p.retailPrice
      }));

      const totalRevenue = items.reduce((sum, item) => sum + (item.priceAtSale * item.quantity), 0);
      const totalCost = selectedProducts.reduce((sum, p) => sum + p.costPrice, 0);
      const region = faker.helpers.arrayElement(regions);

      const getRandomStatus = (): "shipped" | "cancelled" => {
        const roll = Math.random() * 100;
        if (roll <= 85) return "shipped";
        return "cancelled";
      }

      allOrders.push({
        id: faker.string.uuid(),
        customerId: customer.id,
        customerName: customer.name,
        items,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        region,
        adSource,
        shippingCost: regionShippingMap[region],
        discountAmount: faker.helpers.maybe(() => 5, { probability: 0.1 }) ?? 0,
        status: getRandomStatus(),
        createdAt: faker.date.past({ years: 2 }).toISOString(),
        channel
      });
    }
  }
  return allOrders;
};

export const generateMockMarketingSpends = (days: number): MarketingSpend[] => {
  const paidSources: AdSource[] = ["Meta" , "Google" , "TikTok"];
  const spends: MarketingSpend[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(faker.number.int({ min: 0, max: 23 }));
    date.setMinutes(faker.number.int({ min: 0, max: 59 }));

    const dateString = date.toISOString();
    const multiplier = getSeasonalMultiplier(date);

    paidSources.forEach(source => {
      // Meta costs more than TikTok
      const baseMin = source === "Meta" ? 100: 40;
      const baseMax = source === "Meta" ? 600: 300;

      // adding more randomnness to multiplier
      const dailyFlex = faker.number.float({ min: 0.8, max: 1.2 });
      const finalMultiplier = multiplier & dailyFlex;

      const amount = parseFloat((faker.number.float({ min: baseMin, max: baseMax }) * finalMultiplier).toFixed(2));

      // holidays cost per 1k impression goes up
      const baseCpm = source === "Meta" ? 12 : source === "Google" ? 25 : 6;
      const seasonalCpm = baseCpm * (multiplier > 1 ? 1.4 : 1);
      const impressions = Math.floor((amount / seasonalCpm) * 1000);

      // holidays click through rate increases
      const baseCtr = source === "Google" ? 0.04 : 0.015;
      const seasonalCtr = baseCtr * (multiplier > 1 ? 1.2 : 1);
      const clicks = Math.floor(impressions * seasonalCtr);

      spends.push({
        id: faker.string.uuid(),
        date: dateString,
        adSource: source,
        amount,
        impressions,
        clicks,
      });
    });
  }
  return spends;
};

const rawProducts = generateMockProducts(40);
const rawCustomers = generateMockCustomers(250);
const rawOrders = generateMockOrders(730, rawProducts, rawCustomers);

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
export const MOCK_MARKETING_SPENDS = generateMockMarketingSpends(730);