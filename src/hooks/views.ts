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
            const aov = data.length > 0 ? totalRevenue / data.length : 0;

            return { 
                totalRevenue,
                netProfit,
                totalCost,
                totalAdSpend,
                profitMargin,
                totalShipping,
                aov,
                averageOrderValue: totalRevenue / data.length,
                totalOrders: data.length
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

            console.log("CHANNELS", channelStats);

            return channelStats;
        }
    });
    return { channels, isLoading, isError, error };
};