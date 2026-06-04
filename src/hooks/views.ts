import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getMockRefunds } from '@/lib/utils';
import { startOfMonth, endOfMonth, subYears, format, getDate, parseISO, subMonths } from "date-fns";
import { differenceInDays } from 'date-fns';
import { StockoutRiskItem } from '@/types/dataTypes';

export function useBlendedROAS(startDate: string, endDate: string) {
    const { data, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ['blended-roas', startDate, endDate],
        queryFn: async () => {
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
        },
        placeholderData: (prev) => prev,
    });
    return { data, isLoading, isRefreshing: isFetching, isError, error };
}

export function useCLVStats() {
    const { data: clv, isLoading, isError, error } = useQuery({
        queryKey: ['avg-clv'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('customer_lifetime_value')
                .select('lifetime_profit');
            if (error) throw error;
            const totalProfit = data.reduce((sum, row) => sum + row.lifetime_profit, 0);
            const avgCLV = data.length > 0 ? totalProfit / data.length : 0;
            return { totalProfit, avgCLV };
        },
        placeholderData: (prev) => prev,
    });
    return { clv, isLoading, isError, error };
}

export function useSalesStats(startDate: string, endDate: string) {
    const { data: orders, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ['daily_sales_performance', startDate, endDate],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('daily_sales_performance')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: true });
            if (error) throw error;

            const totals = data.reduce((acc, day) => {
                const dailyRevenue = Number(day.totalRevenue || 0);
                const dailyRefund = getMockRefunds(dailyRevenue, new Date(day.date), day.adSource);
                return {
                    revenue: acc.revenue + dailyRevenue,
                    cost: acc.cost + Number(day.totalCost || 0),
                    adSpend: acc.adSpend + Number(day.totalAdSpend || 0),
                    shipping: acc.shipping + Number(day.totalShipping || 0),
                    refunds: acc.refunds + dailyRefund
                };
            }, { revenue: 0, cost: 0, adSpend: 0, shipping: 0, refunds: 0 });

            const netProfit = totals.revenue - (totals.cost + totals.adSpend + totals.shipping + totals.refunds);

            return {
                totalRevenue: totals.revenue,
                netProfit,
                totalRefunds: totals.refunds,
                totalCost: totals.cost,
                totalAdSpend: totals.adSpend,
                profitMargin: totals.revenue > 0 ? (netProfit / totals.revenue) * 100 : 0,
                totalShipping: totals.shipping,
                averageOrderValue: data.length > 0 ? totals.revenue / data.length : 0,
                totalOrders: data.length,
                returnOnInvestment: totals.adSpend > 0 ? (netProfit / totals.adSpend) * 100 : 0,
                marketingEfficiencyRatio: totals.adSpend > 0 ? totals.revenue / totals.adSpend : 0,
                daily: data.map(day => {
                    const revenue = Number(day.totalRevenue || 0);
                    const cost = Number(day.cost || day.totalCost || 0);
                    const adSpend = Number(day.adSpend || day.totalAdSpend || 0);
                    const shipping = Number(day.shipping || day.totalShipping || 0);

                    const refunds = getMockRefunds(
                        revenue,
                        new Date(day.date),
                        day.adSource
                    );

                    const dailyNetProfit = revenue - (cost + adSpend + shipping + refunds);
                    const dailyMargin = revenue > 0 ? (dailyNetProfit / revenue) * 100 : 0;

                    return {
                        date: day.date,
                        revenue,
                        totalOrders: Number(day.ordersLength || 0),
                        margin: parseFloat(dailyMargin.toFixed(2))
                    };
                })
            };
        },
        placeholderData: (prev) => prev,
    });
    return { orders, isLoading, isRefreshing: isFetching, isError, error };
}

export function useSalesChannelPerformance(startDate: string, endDate: string) {
    const { data: channels, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ['daily_sales_channel_performance', startDate, endDate],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('daily_sales_channel_performance')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate);
            if (error) throw error;

            return data.reduce((acc, row) => {
                const source = row.channel;
                if (!acc[source]) {
                    acc[source] = { name: source, revenue: 0, orders: 0, cost: 0, shipping: 0 };
                }
                acc[source].revenue += row.totalRevenue;
                acc[source].orders += row.ordersLength;
                return acc;
            }, {} as Record<string, any>);
        },
        placeholderData: (prev) => prev,
    });
    return { channels, isLoading, isRefreshing: isFetching, isError, error };
}

export function useInventoryPerformance(startDate: string, endDate: string) {
    const { data: inventory, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ['inventory_performance', startDate, endDate],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('product_performance_analytics')
                .select('*')
                .gte('sale_date', startDate)
                .lte('sale_date', endDate);
            if (error) throw error;

            const daysInPeriod = Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)));
            const productMap = data.reduce((acc: any, row: any) => {
                if (!acc[row.id]) {
                    acc[row.id] = { ...row, total_units_sold: 0, total_revenue: 0, earliest_sale: row.sale_date, latest_sale: row.sale_date };
                }
                acc[row.id].total_units_sold += Number(row.units_sold);
                acc[row.id].total_revenue += Number(row.revenue);

                if (new Date(row.sale_date) < new Date(acc[row.id].earliest_sale)) acc[row.id].earliest_sale = row.sale_date;
                if (new Date(row.sale_date) > new Date(acc[row.id].latest_sale)) acc[row.id].latest_sale = row.sale_date;

                return acc;
            }, {});

            const uniqueProducts = Object.values(productMap);
            const totalInventoryValue = uniqueProducts.reduce((sum: number, p: any) => sum + Number(p.current_inventory_value), 0);
            const totalUnitsSold = uniqueProducts.reduce((sum: number, p: any) => sum + p.total_units_sold, 0);
            const totalStockOnHand = uniqueProducts.reduce((sum: number, p: any) => sum + p.stockLevel, 0);

            const sellThroughRate = (totalUnitsSold + totalStockOnHand) > 0
                ? (totalUnitsSold / (totalUnitsSold + totalStockOnHand)) * 100
                : 0;

            const riskData: StockoutRiskItem[] = [];
            const processedProducts = uniqueProducts.map((p: any) => {
                const dailyVelocity = p.total_units_sold / daysInPeriod;

                let simulatedAge = 15; // default to fast-moving
                if (dailyVelocity === 0) {
                    simulatedAge = p.stockLevel > 10 ? 95 : 45;
                } else {
                    const daysOfSupply = p.stockLevel / dailyVelocity;
                    if (daysOfSupply > 90) simulatedAge = 100;
                    else if (daysOfSupply > 60) simulatedAge = 75;
                    else if (daysOfSupply > 30) simulatedAge = 45;
                }

                const finalProduct = {
                    ...p,
                    days_in_stock: simulatedAge
                };

                if (p.stockLevel <= p.reorderPoint && p.stockLevel > 0) {
                    riskData.push({
                        id: p.id,
                        name: p.name,
                        stock: p.stockLevel,
                        daysLeft: dailyVelocity > 0 ? Math.floor(p.stockLevel / dailyVelocity) : 99,
                        weeklyRisk: (p.total_revenue / daysInPeriod) * 7
                    });
                }

                return finalProduct;
            });

            riskData.sort((a, b) => b.weeklyRisk - a.weeklyRisk);

            return {
                inventoryValue: totalInventoryValue,
                sellThroughRate,
                lowStockCount: processedProducts.filter((p: any) => p.stock_status === "Low Stock").length,
                riskData,
                allProducts: processedProducts
            };
        },
        placeholderData: (prev) => prev,
    });
    return { inventory, isLoading, isRefreshing: isFetching, isError, error };
}

export function useRegionalData(startDate: string, endDate: string) {
    const { data: regions, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ['regional_sales', startDate, endDate],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('regional_sales_performance')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate);
            if (error) throw error;
            return data.reduce((acc, row) => {
                const region = row.region || "Unknown";
                if (!acc[region]) acc[region] = { name: region, value: 0 };
                acc[region].value += Number(row.ordersLength || 0);
                return acc;
            }, {} as Record<string, { name: string, value: number }>);
        },
        placeholderData: (prev) => prev,
    });
    return { regions, isLoading, isRefreshing: isFetching, isError, error };
}

export function useRegionalInsight(selectedDate: Date) {
    const start = format(startOfMonth(selectedDate), "yyyy-MM-dd");
    const end = format(endOfMonth(selectedDate), "yyyy-MM-dd");
    const prevDate = subMonths(selectedDate, 1);
    const prevStart = format(startOfMonth(prevDate), "yyyy-MM-dd");
    const prevEnd = format(endOfMonth(prevDate), "yyyy-MM-dd");

    const { data: regions_insight, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ['regional_insights', start, end],
        queryFn: async () => {
            const [currentRes, prevRes] = await Promise.all([
                supabase.from('regional_sales_performance').select('*').gte('date', start).lte('date', end),
                supabase.from('regional_sales_performance').select('*').gte('date', prevStart).lte('date', prevEnd)
            ]);
            if (currentRes.error) throw currentRes.error;
            if (prevRes.error) throw prevRes.error;

            const mapStats = (rows: any[]) => rows.reduce((acc, row) => {
                const key = row.region || "International";
                if (!acc[key]) acc[key] = { revenue: 0, orders: 0, shipping: 0 };
                acc[key].revenue += Number(row.totalRevenue || 0);
                return acc;
            }, {} as Record<string, any>);

            const currentMap = mapStats(currentRes.data || []);
            const prevMap = mapStats(prevRes.data || []);
            const allRegions = Array.from(new Set([...Object.keys(currentMap), ...Object.keys(prevMap)]));

            return allRegions.reduce((acc, name) => {
                const cur = currentMap[name] || { revenue: 0, orders: 0, shipping: 0 };
                const prev = prevMap[name] || { revenue: 0 };
                const growth = prev.revenue > 0 ? ((cur.revenue - prev.revenue) / prev.revenue) * 100 : 0;
                acc[name] = { region: name, revenue: cur.revenue, growthIndex: Number(growth.toFixed(1)) };
                return acc;
            }, {} as Record<string, any>);
        },
        placeholderData: (prev) => prev,
    });
    return { regions_insight, isLoading, isRefreshing: isFetching, isError, error };
}

export function useOrderDistribution(startDate: string, endDate: string) {
    const { data: distribution, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ['order_distribution', startDate, endDate],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('order_surge_distribution')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate);
            if (error) throw error;
            const uniqueDays = new Set(data.map(row => row.date)).size || 1;
            const summary = data.reduce((acc, row) => {
                const dp = row.daypart;
                if (!acc[dp]) acc[dp] = { name: dp, totalOrders: 0 };
                acc[dp].totalOrders += Number(row.totalOrders || 0);
                return acc;
            }, {} as Record<string, any>);
            return ["Morning", "Afternoon", "Evening", "Night"].map(name => ({
                name,
                avgOrders: Number(((summary[name]?.totalOrders || 0) / uniqueDays).toFixed(1))
            }));
        },
        placeholderData: (prev) => prev,
        enabled: !!startDate && !!endDate
    });
    return { distribution, isLoading, isRefreshing: isFetching, isError, error };
}

export function useOrderFulfillment(startDate: string, endDate: string) {
    const { data: fulfillment, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ['order_fulfillment', startDate, endDate],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('order_fulfillment_stats')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate);
            if (error) throw error;
            const summary = data.reduce((acc, row) => {
                const status = row.status.toLowerCase();
                if (status === 'cancelled') acc.cancelled += row.count;
                else if (status === 'refunded') acc.refunded += row.count;
                else acc.successful += row.count;
                return acc;
            }, { successful: 0, cancelled: 0, refunded: 0 });
            return [
                { name: "successful", value: summary.successful },
                { name: "cancelled", value: summary.cancelled },
                { name: "refunded", value: summary.refunded },
            ];
        },
        placeholderData: (prev) => prev,
    });
    return { fulfillment, isLoading, isRefreshing: isFetching, isError, error };
}

export function useAovInsights(selectedDate: Date) {
    const currentStart = startOfMonth(selectedDate);
    const currentEnd = endOfMonth(selectedDate);
    const prevStart = subYears(currentStart, 1);
    const prevEnd = endOfMonth(prevStart);

    const { data: aov_insights, isLoading, isError, error } = useQuery({
        queryKey: ['aov_insights', format(selectedDate, "yyyy-MM")],
        queryFn: async () => {
            const [currentRes, prevRes] = await Promise.all([
                supabase.from('aov_insights_stats').select('*')
                    .gte('date', format(currentStart, "yyyy-MM-dd"))
                    .lte('date', format(currentEnd, "yyyy-MM-dd")),
                supabase.from('aov_insights_stats').select('*')
                    .gte('date', format(prevStart, "yyyy-MM-dd"))
                    .lte('date', format(prevEnd, "yyyy-MM-dd"))
            ]);
            if (currentRes.error) throw currentRes.error;
            if (prevRes.error) throw prevRes.error;

            const aggregateDaily = (rows: any[]) => {
                const map: Record<number, { revenue: number; orders: number }> = {};
                rows.forEach(row => {
                    const day = getDate(parseISO(row.date));
                    if (!map[day]) map[day] = { revenue: 0, orders: 0 };
                    map[day].revenue += Number(row.totalRevenue);
                    map[day].orders += Number(row.orderCount);
                });
                return map;
            };
            const currentMap = aggregateDaily(currentRes.data);
            const prevMap = aggregateDaily(prevRes.data);

            // Pacing Data (The Line Chart)
            const pacingData = Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const cur = currentMap[day] || { revenue: 0, orders: 0 };
                const pre = prevMap[day] || { revenue: 0, orders: 0 };

                return {
                    day,
                    current: cur.orders > 0 ? Number((cur.revenue / cur.orders).toFixed(2)) : 0,
                    previous: pre.orders > 0 ? Number((pre.revenue / pre.orders).toFixed(2)) : 0,
                };
            });
            // Order Value Buckets (Histogram)
            const bucketData = [
                { range: "<$50", value: 0, key: 'under_50' },
                { range: "$50-100", value: 0, key: '50_to_100' },
                { range: "$100-200", value: 0, key: '100_to_200' },
                { range: "$200-500", value: 0, key: '200_to_500' },
                { range: ">$500", value: 0, key: 'over_500' },
            ];

            currentRes.data.forEach(row => {
                bucketData[0].value += Number(row.under_50 || 0);
                bucketData[1].value += Number(row["50_to_100"] || 0);
                bucketData[2].value += Number(row["100_to_200"] || 0);
                bucketData[3].value += Number(row["200_to_500"] || 0);
                bucketData[4].value += Number(row.over_500 || 0);
            });

            // UPT
            const totalItems = currentRes.data.reduce((acc, row) => acc + (Number(row.avgUPT) * Number(row.orderCount)), 0);
            const totalOrders = currentRes.data.reduce((acc, row) => acc + Number(row.orderCount), 0);
            const monthlyUPT = totalOrders > 0 ? (totalItems / totalOrders).toFixed(2) : "0.00";

            return {
                pacingData,
                bucketData,
                totalOrders,
                currentAov: pacingData.reduce((acc, d) => acc + d.current, 0) / (pacingData.filter(d => d.current > 0).length || 1),
                upt: Number(monthlyUPT)
            };
        },
        placeholderData: (prev) => prev,
        enabled: !!selectedDate
    });
    return { aov_insights, isLoading, isError, error };
};

export function useChannelInsights(selectedDate: Date) {
    const start = format(startOfMonth(selectedDate), "yyyy-MM-dd");
    const end = format(endOfMonth(selectedDate), "yyyy-MM-dd");

    // Calculate the comparison dates (Previous Month)
    const prevDate = subMonths(selectedDate, 1);
    const prevStart = format(startOfMonth(prevDate), "yyyy-MM-dd");
    const prevEnd = format(endOfMonth(prevDate), "yyyy-MM-dd");

    const { data: channel_insights, isLoading, isError, error } = useQuery({
        queryKey: ['channel_insights', start, end],
        queryFn: async () => {
            const [currentRes, prevRes] = await Promise.all([
                supabase.from('channel_advanced_stats').select('*').gte('date', start).lte('date', end),
                supabase.from('channel_advanced_stats').select('*').gte('date', prevStart).lte('date', prevEnd)
            ]);

            if (currentRes.error) throw currentRes.error;
            if (prevRes.error) throw prevRes.error;

            const mapStats = (rows: any[]) => {
                return rows.reduce((acc, row) => {
                    const source = row.adSource || 'Organic';

                    if (!acc[source]) acc[source] = {
                        revenue: 0,
                        margin: 0,
                        orders: 0,
                        newCustomerOrders: 0,
                        returningCustomerOrders: 0
                    };

                    acc[source].revenue += Number(row.grossRevenue || 0);
                    acc[source].margin += Number(row.netMargin || 0);
                    acc[source].orders += Number(row.totalOrders || 0);
                    acc[source].newCustomerOrders += Number(row.newCustomerOrders || row.new_orders || 0);
                    acc[source].returningCustomerOrders += Number(row.returningCustomerOrders || row.returning_orders || 0);

                    return acc;
                }, {} as Record<string, { revenue: number; margin: number; orders: number; newCustomerOrders: number; returningCustomerOrders: number }>);
            };

            const currentMap = mapStats(currentRes.data);
            const prevMap = mapStats(prevRes.data);
            const allChannels = Array.from(new Set([...Object.keys(currentMap), ...Object.keys(prevMap)]));

            const profitabilityData = allChannels.map(name => {
                const cur = currentMap[name] || { revenue: 0, margin: 0 };
                const prev = prevMap[name] || { revenue: 0, margin: 0 };

                const growth = prev.revenue > 0
                    ? ((cur.revenue - prev.revenue) / prev.revenue) * 100
                    : 0;

                return {
                    channel: name,
                    revenue: cur.revenue,
                    margin: cur.margin,
                    growth: Number(growth.toFixed(1))
                };
            }).sort((a, b) => b.revenue - a.revenue);

            const attributionData = allChannels.map(name => {
                const stats = currentMap[name];
                return {
                    channel: name,
                    new: stats?.newCustomerOrders || 0,
                    returning: stats?.returningCustomerOrders || 0
                };
            });

            return {
                profitabilityData, // Profitability (Revenue vs Margin)

                // AOV by Channel
                aovData: allChannels.map(name => ({
                    channel: name,
                    aov: currentMap[name]?.orders > 0 ? Number((currentMap[name].revenue / currentMap[name].orders).toFixed(2)) : 0
                })).sort((a, b) => b.aov - a.aov),

                // Acquisition Attribution
                attributionData: allChannels.map(name => ({
                    channel: name,
                    new: currentMap[name]?.newCustomerOrders || 0,
                    returning: currentMap[name]?.returningCustomerOrders || 0
                }))
            };
        },
        placeholderData: (prev) => prev,
        enabled: !!selectedDate
    });

    return { channel_insights, isLoading, isError, error };
};