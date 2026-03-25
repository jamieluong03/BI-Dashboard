import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useMemo } from 'react';

export function useDashboardStats() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .neq('status', 'cancelled');
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const stats = useMemo(() => {
    if (!orders) return null;

    const totalRevenue = orders.reduce((acc, o) => acc + Number(o.totalRevenue), 0);
    const totalCost = orders.reduce((acc, o) => acc + Number(o.totalCost), 0);
    const totalAdSpend = orders.reduce((acc, o) => acc + Number(o.adSpend), 0);
    const totalShipping = orders.reduce((acc, o) => acc + Number(o.shippingCost), 0);
    
    const netProfit = totalRevenue - (totalCost + totalAdSpend + totalShipping);
    const aov = totalRevenue / orders.length;

    return {
      totalRevenue,
      netProfit,
      totalOrders: orders.length,
      aov,
      profitMargin: (netProfit / totalRevenue) * 100
    };
  }, [orders]);

  return { stats, isLoading, error };
}