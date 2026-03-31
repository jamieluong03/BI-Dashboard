import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useBlendedROAS(days = 30) {
    const { data: data, isLoading, isError, error } = useQuery({
        queryKey: ['blended-roas'],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('daily_roas')
                .select('revenue, spend, orders, clicks, impressions')
                .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
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

export function useCLVStats(days = 30) {
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

export function useSalesStats(days = 30) {
    const { data: orders, isLoading, isError, error } = useQuery({
        queryKey: ['daily_sales_performance'],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('daily_sales_performance')
                .select('*')
                .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
            if (error) throw error;
            
            const totalRevenue = data.reduce((sum, o) => sum + Number(o.totalRevenue || 0), 0);
            const totalCost = data.reduce((sum, o) => sum + Number(o.totalCost || 0), 0);
            const totalAdSpend = data.reduce((sum, m) => sum + Number(m.totalAdSpend || 0), 0);
            const totalShipping = data.reduce((sum, o) => sum + Number(o.totalShipping || 0), 0);
            const netProfit = totalRevenue - (totalCost + totalAdSpend + totalShipping);
            const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
            const averageOrderValue = data.length > 0 ? totalRevenue / data.length : 0;
            const returnOnInvestment = (netProfit / totalAdSpend) * 100;
            const marketingEfficiencyRatio = totalRevenue / totalAdSpend;

            return { 
                totalRevenue,
                netProfit,
                totalCost,
                totalAdSpend,
                profitMargin,
                totalShipping,
                averageOrderValue,
                totalOrders: data.length,
                returnOnInvestment,
                marketingEfficiencyRatio
             }
        }
    });
    return { orders, isLoading, isError, error };
};

export function useSalesChannelPerformance(days = 30) {
    const { data: channels, isLoading, isError, error } = useQuery({
        queryKey: ['daily_sales_channel_performance'],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('daily_sales_channel_performance')
                .select('*')
                .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
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

export function useRegionalData(days = 30) {
    const { data: regions, isLoading, isError, error } = useQuery({
        queryKey: ['regional_sales'],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('regional_sales_performance')
                .select('*')
                .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
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