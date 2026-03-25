import { useMemo } from 'react';
import { useOrders } from './dataTables';

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