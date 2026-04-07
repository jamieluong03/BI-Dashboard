import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/lib/supabase';
import { eachDayOfInterval, format } from "date-fns";

const fetchRevenueRange = async (start: Date, end: Date) => {
  const { data, error } = await supabase
    .from("orders")
    .select("total_price, created_at")
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());

  if (error) throw new Error(error.message);

  const days = eachDayOfInterval({ start, end });
  
  return days.map((day, index) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayTotal = data
      .filter(o => format(new Date(o.created_at), "yyyy-MM-dd") === dayStr)
      .reduce((sum, o) => sum + Number(o.total_price), 0);

    return { 
      dayIndex: index, 
      value: dayTotal, 
      date: dayStr 
    };
  });
};

export function useRevenueComparisonQuery(rangeA: { from: Date; to: Date }, rangeB: { from: Date; to: Date }) {
  return useQuery({
    queryKey: ["revenue-comparison", rangeA.from.toISOString(), rangeB.from.toISOString()],
    queryFn: async () => {
      const [current, previous] = await Promise.all([
        fetchRevenueRange(rangeA.from, rangeA.to),
        fetchRevenueRange(rangeB.from, rangeB.to),
      ]);
      return { current, previous };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}