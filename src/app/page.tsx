'use client';

import { useSalesPerformance } from '@/hooks/calculations';
import { StatCard } from '@/components/ui/dashboard/statCard';
import { useBlendedROAS } from '@/hooks/views';

export default function DashboardOverview() {
  const { performance, isLoading: isPerformanceLoading, isError: isPerformanceError , error: performanceError } = useSalesPerformance();
  const { data, isLoading: isRoasLoading, isError: isRoasError, error: roasError } = useBlendedROAS(30);

  const isAnyDataLoading = isPerformanceLoading || isRoasLoading;
  const hasAnyErrors = isPerformanceError || isRoasError;
  const anyErrorMessage = performanceError?.message || roasError?.message;

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

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-2"></p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          <StatCard
            title="Total Revenue"
            value={formatter.format(performance?.totalRevenue || 0)}
            description="Gross income before expenses"
          />
          <StatCard
            title="Net Profit"
            value={formatter.format(performance?.netProfit || 0)}
            description={`${performance?.profitMargin.toFixed(2)}% overall margin`}
          />
          <StatCard
            title="Total Orders"
            value={performance?.totalOrders || 0}
            description="Volume for current period"
          />
          <StatCard
            title="Avg. Order Value"
            value={formatter.format(performance?.aov || 0)}
            description="Target: $150.00"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          <StatCard
            title="Blended ROAS"
            value={(data?.roas.toFixed(2) || 0)}
            description=""
          />
          <StatCard
            title="Conversion Rate"
            value={(data?.conversionRate.toFixed(2) || 0)}
            description=""
          />
          <StatCard
            title="Click Through Rate"
            value={(data?.clickThroughRate.toFixed(2) || 0)}
            description=""
          />
        </div>
      </div>
    </main>
  );
}