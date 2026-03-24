export type AdSource = "Meta" | "Google" | "TikTok" | "Email" | "Organic";
export type Category = "Rings" | "Necklaces" | "Earrings" | "Bracelets";

export interface Product {
  id: string;
  name: string;
  category: Category;
  retailPrice: number;
  costPrice: number;
  stockLevel: number;
  reorderPoint: number;
  targetStockLevel: number;
  daysToRestock: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: { productId: string; quantity: number; priceAtSale: number }[];
  totalRevenue: number; // what customer pays
  totalCost: number;  // total COGS
  adSpend: number;
  shippingCost: number;
  discountAmount: number; // discount reports
  adSource: AdSource;
  region: string;
  status: "shipped" | "processing" | "cancelled"; // operations reports
  createdAt: string;
  channel: "Online Store" | "Google & Youtube" | "Facebook and Instagram by Meta" | "Shop" | "TikTok Shop";
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    isLoyaltyMember: boolean;
}

export interface ProfitMetrics {
  grossRevenue: number; // total units sold x unit price
  totalExpenses: number; // adSpend + shipping + COGS
  netProfit: number; // grossRevenue - (total cost + adSpend + shipping + COGS)
  margin: number; // (netProfit/grossRevenue) x 100
  averageOrderValue: number; // totalRevenue / numberOfOrders
}