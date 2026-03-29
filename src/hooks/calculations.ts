// import { useMemo } from 'react';
// import { useMarketingSpend, useOrders } from '@/hooks/dataTables';

// export function useSalesChannelPerformance() {
//     const { orders, isLoading: ordersLoading, isError, error } = useOrders();
//     const { marketing, isLoading: marketingLoading } = useMarketingSpend();

//     const performance = useMemo(() => {
//         if (!orders || !marketing) return null;

//         const successfulOrders = orders.filter(o => o.status !== 'cancelled');
//         const totalOrders = successfulOrders.length;  
//         const totalRevenue = successfulOrders.reduce((sum, o) => sum + Number(o.totalRevenue || 0), 0);
//         const totalCost = successfulOrders.reduce((sum, o) => sum + Number(o.totalCost || 0), 0);
//         const totalAdSpend = marketing.reduce((sum, m) => sum + Number(m.adSpend || 0), 0);
//         const totalShipping = successfulOrders.reduce((sum, o) => sum + Number(o.totalShipping || 0), 0);
//         const netProfit = totalRevenue - (totalCost + totalAdSpend + totalShipping);
//         const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
//         const aov = successfulOrders.length > 0 ? totalRevenue / successfulOrders.length : 0;

//         return {
//             totalOrders,
//             totalRevenue,
//             netProfit,
//             totalAdSpend,
//             profitMargin,
//             totalShipping,
//             aov,
//             averageOrderValue: totalRevenue / orders.length
//         };
//     }, [orders, marketing]);

//     return { performance, isLoading: ordersLoading || marketingLoading, isError, error };
// }