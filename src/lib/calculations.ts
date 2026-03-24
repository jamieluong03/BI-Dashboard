import { Order, ProfitMetrics } from "@/types/analytics";

// functions to calculate:
export const calculateProfitMetrics = (orders: Order[]): ProfitMetrics => {
    
    const validOrders = orders.filter(o => o.status !== "cancelled");

    // grossRevenue
    const grossRevenue = validOrders.reduce((acc, o) => acc + o.totalRevenue, 0);
    
    // totalExpenses
    const totalExpenses = validOrders.reduce((acc, o) => acc + o.totalCost + o.adSpend + o.shippingCost, 0);

    //netProfit
    const netProfit = grossRevenue - totalExpenses;

    //margin
    const margin = (netProfit/grossRevenue) * 100

    //AOV
    const averageOrderValue = validOrders.length > 0 ? grossRevenue / validOrders.length : 0;

    return {
        grossRevenue,
        totalExpenses,
        netProfit,
        margin,
        averageOrderValue
    };
};