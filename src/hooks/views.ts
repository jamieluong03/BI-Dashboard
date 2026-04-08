import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getMockRefunds } from '@/lib/utils';

export function useBlendedROAS(startDate: string, endDate: string) {
    const { data: data, isLoading, isError, error } = useQuery({
        queryKey: ['blended-roas', startDate, endDate],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('daily_roas')
                .select('revenue, spend, orders, clicks, impressions')
                .gte('date', startDate)
                .lte('date', endDate);
            if (error) throw error;
            const totalRevenue = data.reduce((sum, row) => sum + row.revenue, 0);
            const totalSpend = data.reduce((sum, row) => sum + row.spend, 0);
            const totalOrders = data.reduce((sum, row) => sum + row.orders, 0);
            const totalClicks = data.reduce((sum, row) => sum + row.clicks, 0);
            const totalImpressions = data.reduce((sum, row) => sum + row.impressions, 0);

            return { 
                roas: totalSpend > 0 ? (totalRevenue / totalSpend) : 0,
                totalRevenue, 
                totalSpend,
                conversionRate: (totalOrders / totalClicks) * 100,
                totalOrders,
                totalClicks,
                clickThroughRate: (totalClicks / totalImpressions) * 100,
                totalImpressions
            };
        }
    });

    return { data, isLoading, isError, error };
};

export function useCLVStats() {
    const { data: clv, isLoading, isError, error } = useQuery({
        queryKey: ['avg-clv'],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('customer_lifetime_value')
                .select('lifetime_profit')
            if (error) throw error;

            const totalProfit = data.reduce((sum, row) => sum + row.lifetime_profit, 0);
            const avgCLV = data.length > 0 ? totalProfit / data.length : 0;

            return { totalProfit, avgCLV };
        }
    });

    return { clv, isLoading, isError, error };
};

export function useSalesStats(startDate: string, endDate: string) {
    const { data: orders, isLoading, isError, error } = useQuery({
        queryKey: ['daily_sales_performance', startDate, endDate],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('daily_sales_performance')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate);
            if (error) throw error;

            const totals = data.reduce((acc, day) => {
                const dailyRevenue = Number(day.totalRevenue || 0);
                
                // Calculate specific refund for THIS specific day
                const dailyRefund = getMockRefunds(
                  dailyRevenue, 
                  new Date(day.date), 
                  day.adSource
                );

                return {
                    revenue: acc.revenue + dailyRevenue,
                    cost: acc.cost + Number(day.totalCost || 0),
                    adSpend: acc.adSpend + Number(day.totalAdSpend || 0),
                    shipping: acc.shipping + Number(day.totalShipping || 0),
                    refunds: acc.refunds + dailyRefund
                };
            }, { revenue: 0, cost: 0, adSpend: 0, shipping: 0, refunds: 0 });
            
            // const totalRevenue = data.reduce((sum, o) => sum + Number(o.totalRevenue || 0), 0);
            // const totalCost = data.reduce((sum, o) => sum + Number(o.totalCost || 0), 0);
            // const totalAdSpend = data.reduce((sum, m) => sum + Number(m.totalAdSpend || 0), 0);
            // const totalShipping = data.reduce((sum, o) => sum + Number(o.totalShipping || 0), 0);
            // const totalRefunds = getMockRefunds(totalRevenue, new Date(endDate));
            const netProfit = totals.revenue - (totals.cost + totals.adSpend + totals.shipping + totals.refunds);
            const profitMargin = totals.revenue > 0 ? (netProfit / totals.revenue) * 100 : 0;
            const averageOrderValue = data.length > 0 ? totals.revenue / data.length : 0;
            const returnOnInvestment = totals.adSpend > 0 ? (netProfit / totals.adSpend) * 100 : 0;
            const marketingEfficiencyRatio = totals.adSpend > 0 ? totals.revenue / totals.adSpend : 0;


            return { 
                totalRevenue: totals.revenue,
                netProfit,
                totalRefunds: totals.refund,
                totalCost: totals.cost,
                totalAdSpend: totals.adSpend,
                profitMargin,
                totalShipping: totals.shipping,
                averageOrderValue,
                totalOrders: data.length,
                returnOnInvestment,
                marketingEfficiencyRatio
             }
        }
    });
    return { orders, isLoading, isError, error };
};

export function useSalesChannelPerformance(startDate: string, endDate: string) {
    const { data: channels, isLoading, isError, error } = useQuery({
        queryKey: ['daily_sales_channel_performance', startDate, endDate],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('daily_sales_channel_performance')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate);
            if (error) throw error;

            const channelStats = data.reduce((acc, row) => {
                const source = row.channel;
                
                if (!acc[source]) {
                    acc[source] = { 
                        name: source, 
                        revenue: 0, 
                        orders: 0, 
                        cost: 0, 
                        shipping: 0
                    };
                }

                acc[source].revenue += row.totalRevenue;
                acc[source].orders += row.ordersLength;
                acc[source].cost += row.totalCost;
                acc[source].shipping += row.totalShipping;

                return acc;
            }, {} as Record<string, any>);

            return channelStats;
        }
    });
    return { channels, isLoading, isError, error };
};

export function useInventoryPerformance() {
    const { data: inventory, isLoading, isError, error } = useQuery({
        queryKey: ['inventory_performance'],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('product_performance_analytics')
                .select('*')
            if (error) throw error;

            const inventoryValue = data.reduce((sum, value) => sum + Number(value.current_inventory_value), 0);
            const sellThroughRate = data.reduce((sum, value) => sum + Number(value.sell_through_rate), 0);
            const lowStockCount = data.filter(product => product.stock_status === "Low Stock").length;

            return { inventoryValue, sellThroughRate, lowStockCount };
        }
    });
    return { inventory, isLoading, isError, error };
};

export function useRegionalData(startDate: string, endDate: string) {
    const { data: regions, isLoading, isError, error } = useQuery({
        queryKey: ['regional_sales', startDate, endDate],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('regional_sales_performance')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate);
            if (error) throw error;

            const regionalSales = data.reduce((acc, row) => {
                const region = row.region || "Unknown";
                if (!acc[region]) {
                    acc[region] = { name: region, value: 0 };
                }

                acc[region].value += Number(row.ordersLength || 0);
                return acc;
            }, {} as Record<string, { name: string, value: number}>);
            return regionalSales;
        }
    });
    return { regions, isLoading, isError, error };
};