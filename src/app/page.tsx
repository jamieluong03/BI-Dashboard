'use client';

import { StatCard } from '@/components/ui/statCard';
import { useBlendedROAS, useCLVStats, useSalesStats, useSalesChannelPerformance, useInventoryPerformance, useRegionalData } from '@/hooks/views';
import { ChartBarLabelCustom } from '@/components/ui/customBarChart';
import { InventoryCard } from '@/components/ui/inventoryCard';
import { ChartRadarDots } from '@/components/ui/radarChart';
import { Maximize2 } from 'lucide-react';

export default function DashboardOverview() {
  const { data, isLoading: isRoasLoading, isError: isRoasError, error: roasError } = useBlendedROAS(30);
  const { clv, isLoading: isCLVLoading, isError: isCLVError, error: clvError } = useCLVStats();
  const { orders, isLoading: isOrdersLoading, isError: isOrdersError, error: ordersError } = useSalesStats(30);
  const { channels, isLoading: isChannelsLoading, isError: isChannelsError, error: channelsError } = useSalesChannelPerformance(30);
  const { inventory, isLoading: isInventoryLoading, isError: isInventoryError, error: inventoryError } = useInventoryPerformance();
  const { regions, isLoading: isRegionLoading, isError: isRegionError, error: regionError } = useRegionalData(30);

  const isAnyDataLoading = isOrdersLoading || isRoasLoading || isCLVLoading || isChannelsLoading || isInventoryLoading || isRegionLoading;
  const hasAnyErrors = isOrdersError || isRoasError || isCLVError || isChannelsError || isInventoryError || isRegionError;
  const anyErrorMessage = ordersError?.message || roasError?.message || clvError?.message || channelsError?.message|| inventoryError?.message || regionError?.message;

  if (isAnyDataLoading) return <div className="p-8 text-slate-500">Loading stats...</div>;

  if (hasAnyErrors) {
    return (
      <div className="border-red-500 bg-red-50 p-4 rounded-lg">
      <h3 className="text-red-800 font-bold">Failed to load data</h3>
      
      <p className="text-red-600 text-sm">
        Reason: {anyErrorMessage}
      </p>
    </div>
    )
  }

  const salesChannel = Object.keys(channels).map(source => {
    return {
      name: channels[source].name === "Facebook and Instagram by Meta" ? "Facebook & Instagram" : channels[source].name,
      value: channels[source].orders
    }
  });

  const regionSales = Object.keys(regions).map(name => {
    return {
      name: regions[name].name,
      value: regions[name].value
    }
  });

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-2">Based on last 30 Days</p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          <StatCard
            title="Total Revenue"
            value={formatter.format(orders?.totalRevenue || 0)}
            description=""
            Icon={Maximize2}
            iconColor=""
          />
          <StatCard
            title="Net Profit"
            value={formatter.format(orders?.netProfit || 0)}
            description={`${orders?.profitMargin.toFixed(2)}% overall margin`}
            Icon={Maximize2}
            iconColor=""
          />
          <StatCard
            title="Total Orders"
            value={orders?.totalOrders || 0}
            description=""
            Icon={Maximize2}
            iconColor=""
          />
          <StatCard
            title="Average Order Value (AOV)"
            value={formatter.format(orders?.averageOrderValue || 0)}
            description=""
            Icon={Maximize2}
            iconColor=""
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 p-2">
          <ChartBarLabelCustom 
            dataKey="value"
            title="Sales By Channel"
            description="Click the bars to calculate total sales by channels"
            chartData={salesChannel}
            Icon={Maximize2}
            iconColor=""
          />
          <ChartRadarDots
            title="Sales By Region"
            description=""
            dataKey="value"
            chartData={regionSales}
            Icon={Maximize2}
            iconColor=""
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          <StatCard
            title="Return On Ad Spend (ROAS)"
            value={`${(data?.roas.toFixed(2) || 0)}x`}
            description=""
            Icon={Maximize2}
            iconColor=""
          />
          <StatCard
            title="Return On Investment (ROI)"
            value={`${(orders?.returnOnInvestment.toFixed(2) || 0)}%`}
            description=""
            Icon={Maximize2}
            iconColor=""
          />
          <StatCard
            title="Conversion Rate"
            value={(data?.conversionRate.toFixed(2) || 0)}
            description=""
            Icon={Maximize2}
            iconColor=""
          />
          <StatCard
            title="Click Through Rate (CTR)"
            value={(data?.clickThroughRate.toFixed(2) || 0)}
            description=""
            Icon={Maximize2}
            iconColor=""
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr] gap-6 p-2">
          <StatCard
            title="Customer Lifetime Value (CLV)"
            value={formatter.format(clv?.avgCLV || 0)}
            description=""
            Icon={Maximize2}
            iconColor=""
          />
           <StatCard
            title="Marketing Efficiency Ratio (MER)"
            value={`${(orders?.marketingEfficiencyRatio.toFixed(2) || 0)}x`}
            description=""
            Icon={Maximize2}
            iconColor=""
          />
          <InventoryCard
            title="Inventory"
            inventoryValue={inventory?.inventoryValue.toFixed(2) || 0}
            sellThroughRate={inventory?.sellThroughRate.toFixed(2) || 0}
            lowStock={
              (inventory?.lowStockCount ?? 0) > 0 ? `${inventory?.lowStockCount} items are low on stock` : "Stock levels are healthy"
            }
            Icon={Maximize2}
            iconColor=""
          />
        </div>
      </div>
    </main>
  );
}