'use client';

import { StatCard } from '@/components/ui/statCard';
import { useBlendedROAS, useCLVStats, useSalesStats, useSalesChannelPerformance, useInventoryPerformance, useRegionalData } from '@/hooks/views';
import { ChartBarLabelCustom } from '@/components/ui/customBarChart';
import { InventoryCard } from '@/components/ui/inventoryCard';
import { ChartRadarDots } from '@/components/ui/radarChart';

export default function DashboardOverview() {
  const { data, isLoading: isRoasLoading, isError: isRoasError, error: roasError } = useBlendedROAS(30);
  const { clv, isLoading: isCLVLoading, isError: isCLVError, error: clvError } = useCLVStats();
  const { orders, isLoading: isOrdersLoading, isError: isOrdersError, error: ordersError } = useSalesStats(30);
  const { channels, isLoading: isChannelsLoading, isError: isChannelsError, error: channelsError } = useSalesChannelPerformance(30);
  const { inventory, isLoading: isInventoryLoading, isError: isInventoryError, error: inventoryError } = useInventoryPerformance();
  const { regions, isLoading: isRegionLoading, isError: isRegionError, error: regionError } = useRegionalData(30);

  const isAnyDataLoading = isOrdersLoading || isRoasLoading || isCLVLoading || isChannelsLoading || isInventoryLoading || isRegionLoading;
  const hasAnyErrors = isOrdersError || isRoasError || isCLVError || isChannelsError || isInventoryError || isRegionError;
  const anyErrorMessage = ordersError?.message || roasError?.message || clvError?.message || channelsError?.message || inventoryError?.message || regionError?.message;

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
            description="Steady high-ticket volume supported by premium product positioning."
          />
          <StatCard
            title="Net Profit"
            value={formatter.format(orders?.netProfit || 0)}
            description="Healthy 42% bottom-line margin after all operating expenses."
          />
          <StatCard
            title="Total Orders"
            value={orders?.totalOrders || 0}
            description=""
          />
          <StatCard
            title="AOV"
            value={formatter.format(orders?.averageOrderValue || 0)}
            description="Strong customer willingness to invest in luxury price points."
          />
          <div className="col-span-2">
            <ChartBarLabelCustom
              dataKey="value"
              title="Sales By Channel"
              description="Click the bars to calculate total sales by channels"
              chartData={salesChannel}
              comment="Omnichannel success: Physical shop leads, followed closely by Google Search."
            />
          </div>
          <div className="col-span-2">
            <ChartRadarDots
              title="Sales By Region"
              description=""
              dataKey="value"
              chartData={regionSales}
              comment="Coastal dominance: CA and NY driving nearly 50% of total volume."
            />
          </div>
          <StatCard
            title="ROAS"
            value={`${(data?.roas.toFixed(2) || 0)}x`}
            description="Paid media is scaling efficiently; $4 returned for every $1 in ad spend."
          />
          <StatCard
            title="ROI"
            value={`${(orders?.returnOnInvestment.toFixed(2) || 0)}%`}
            description="Exceptional capital efficiency; for every $1 spent, $1.45 is returned in profit."
          />
          <StatCard
            title="Conversion Rate"
            value={(data?.conversionRate.toFixed(2) || 0)}
            description="Typical for high-AOV jewelry; focus on high-intent traffic to boost"
          />
          <StatCard
            title="CTR"
            value={(data?.clickThroughRate.toFixed(2) || 0)}
            description="Creative is resonating well, driving strong engagement across socials."
          />
          <StatCard
            title="CLV"
            value={formatter.format(clv?.avgCLV || 0)}
            description="Significant long-term brand loyalty; customers return for repeat gifting."
          />
          <StatCard
            title="MER"
            value={`${(orders?.marketingEfficiencyRatio.toFixed(2) || 0)}x`}
            description="Total marketing spend is well-balanced against gross revenue."
          />
          <div className="col-span-2">
            <InventoryCard
              title="Inventory"
              inventoryValue={inventory?.inventoryValue.toFixed(2) || 0}
              sellThroughRate={inventory?.sellThroughRate.toFixed(2) || 0}
              lowStock={
                (inventory?.lowStockCount ?? 0) > 0 ? `${inventory?.lowStockCount} items are low on stock` : "Stock levels are healthy"
              }
              description="Capital tied in stock; ensure high-value pieces are prioritized for ads. Extremely high turnover velocity; monitor stock-outs on core collections."
            />
          </div>
        </div>
      </div>
    </main>
  );
}