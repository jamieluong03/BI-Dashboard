import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useBlendedROAS(days = 30) {
    const { data: roas, isLoading, isError, error } = useQuery({
        queryKey: ['blended-roas'],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('daily_roas')
                .select('revenue, spend')
                .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());
        
            if (error) throw error;
            const totalRevenue = data.reduce((sum, row) => sum + row.revenue, 0);
            const totalSpend = data.reduce((sum, row) => sum + row.spend, 0);

            return { 
                roas: totalSpend > 0 ? (totalRevenue / totalSpend) : 0,
                totalRevenue, 
                totalSpend 
            };
        }
    });

    return { roas, isLoading, isError, error };
}