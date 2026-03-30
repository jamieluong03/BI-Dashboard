'use client';

import { StatCard } from '@/components/ui/statCard';
import { useBlendedROAS, useCLVStats, useSalesStats, useSalesChannelPerformance } from '@/hooks/views';
import { ChartBarLabelCustom } from '@/components/ui/customBarChart';

export default function DashboardOverview() {
  const { data, isLoading: isRoasLoading, isError: isRoasError, error: roasError } = useBlendedROAS(30);
  const { clv, isLoading: isCLVLoading, isError: isCLVError, error: clvError } = useCLVStats();
  const { orders, isLoading: isOrdersLoading, isError: isOrdersError, error: ordersError } = useSalesStats(30);
  const { channels, isLoading: isChannelsLoading, isError: isChannelsError, error: channelsError } = useSalesChannelPerformance(30);

  const isAnyDataLoading = isOrdersLoading || isRoasLoading || isCLVLoading || isChannelsLoading;
  const hasAnyErrors = isOrdersError || isRoasError || isCLVError || isChannelsError;
  const anyErrorMessage = ordersError?.message || roasError?.message || clvError?.message || channelsError?.message;

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

  const sales_channel = Object.keys(channels).map(source => {
    return {
      name: channels[source].name === "Facebook and Instagram by Meta" ? "Facebook & Instagram" : channels[source].name,
      value: channels[source].orders
    }
  })

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-2">Based on last 30 Days</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          <StatCard
            title="Total Revenue"
            value={formatter.format(orders?.totalRevenue || 0)}
            description=""
          />
          <StatCard
            title="Net Profit"
            value={formatter.format(orders?.netProfit || 0)}
            description={`${orders?.profitMargin.toFixed(2)}% overall margin`}
          />
          <StatCard
            title="Total Orders"
            value={orders?.totalOrders || 0}
            description=""
          />
          <StatCard
            title="Average Order Value (AOV)"
            value={formatter.format(orders?.aov || 0)}
            description=""
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          <StatCard
            title="Blended ROAS"
            value={`${(data?.roas.toFixed(2) || 0)}x`}
            description=""
          />
          <StatCard
            title="Conversion Rate"
            value={(data?.conversionRate.toFixed(2) || 0)}
            description=""
          />
          <StatCard
            title="Click Through Rate (CTR)"
            value={(data?.clickThroughRate.toFixed(2) || 0)}
            description=""
          />
          <StatCard
            title="Customer Lifetime Value (CLV)"
            value={formatter.format(clv?.avgCLV || 0)}
            description=""
          />
        </div>
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-6 p-2">
          <ChartBarLabelCustom 
            dataKey="value"
            title="Sales By Channel"
            description="Click the bars to calculate total sales by channels"
            chartData={sales_channel}
          />
          <StatCard
            title="Return On Investment (ROI)"
            value={`${(orders?.roi.toFixed(2) || 0)}%`}
            description=""
          />
        </div>
      </div>
    </main>
  );
}