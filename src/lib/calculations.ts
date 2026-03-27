import { Order, ProfitMetrics } from "@/types/analytics";
import { useMemo } from 'react';
import { useOrders } from '@/hooks/dataTables';

// functions to calculate:
export const calculateProfitMetrics = (orders: Order[]): ProfitMetrics => {

    const validOrders = orders.filter(o => o.status !== "cancelled");
    // grossRevenue
    const grossRevenue = validOrders.reduce((acc, o) => acc + o.totalRevenue, 0);
    // totalExpenses
    const totalExpenses = validOrders.reduce((acc, o) => acc + o.totalCost + o.shippingCost, 0);
    // netProfit
    const netProfit = grossRevenue - totalExpenses;
    // margin
    const margin = (netProfit/grossRevenue) * 100
    // AOV
    const averageOrderValue = validOrders.length > 0 ? grossRevenue / validOrders.length : 0;

    return {
        grossRevenue,
        totalExpenses,
        netProfit,
        margin,
        averageOrderValue
    };
};

export function useSalesPerformance() {
    const { orders, isLoading, isError, error } = useOrders();

    const performance = useMemo(() => {
        if (!orders) return null;

        const successfulOrders = orders.filter(o => o.status !== 'cancelled');
        const totalRevenue = successfulOrders.reduce((sum, o) => sum + Number(o.totalRevenue), 0);
        const totalCost = successfulOrders.reduce((sum, o) => sum + Number(o.totalCost), 0);
        const totalAdSpend = successfulOrders.reduce((sum, o) => sum + Number(o.adSpend), 0);
        const totalShipping = successfulOrders.reduce((sum, o) => sum + Number(o.totalShipping), 0);
        const netProfit = totalRevenue - (totalCost + totalAdSpend);
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
        const aov = successfulOrders.length > 0 ? totalRevenue / successfulOrders.length : 0;

        return {
        totalRevenue,
        netProfit,
        profitMargin,
        totalShipping,
        aov,
        averageOrderValue: totalRevenue / orders.length,
        orderCount: orders.length
        };
    }, [orders]);

    return { performance, isLoading, isError, error };
}
