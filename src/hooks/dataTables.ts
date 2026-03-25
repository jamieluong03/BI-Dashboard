import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useOrders() {
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    }
  });

  return { orders, isLoading, isError, error };
};

export function useCustomers() {
    const { data: customers, isLoading, isError, error } = useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
            if (error) throw new Error(error.message);
            return data;
        }
    });
    return { customers, isLoading, isError, error };
};

export function useProducts() {
    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: ['products'],
        queryFn: async() => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
            if (error) throw new Error(error.message);
            return data;
        }
    });
    return { products, isLoading, isError, error };
}