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
}

export function useCLVStats() {
    const { data: clv, isLoading, isError, error } = useQuery({
        queryKey: ['avg-clv'],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('customer_lifetime_value')
                .select('lifetime_profit');

            if (error) throw error;

            const totalProfit = data.reduce((sum, row) => sum + row.lifetime_profit, 0);
            const avgCLV = data.length > 0 ? totalProfit / data.length : 0;

            return { totalProfit, avgCLV };
        }
    });

    return { clv, isLoading, isError, error };
}