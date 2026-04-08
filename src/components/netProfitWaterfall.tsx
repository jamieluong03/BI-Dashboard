import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  Rectangle 
} from 'recharts';
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

interface WaterfallProps {
  data: any[];
  config: ChartConfig;
}

export function NetProfitWaterfall({ data, config }: WaterfallProps) {
  return (
    <ChartContainer config={config} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
          barSize={55}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickFormatter={(val) => `$${Intl.NumberFormat('en', { notation: 'compact' }).format(val)}`}
          />
          
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-white border border-slate-200 shadow-xl p-2 rounded-lg text-[11px]">
                    <p className="font-bold text-slate-900 mb-0.5">{item.name}</p>
                    <p className="text-slate-600 font-medium">
                      Amount: <span className="text-slate-900 font-bold">
                        ${Math.abs(item.displayValue).toLocaleString()}
                      </span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* THE BRIDGE BAR */}
          <Bar 
            dataKey="waterfallRange" 
            isAnimationActive={false}
            // We use a custom shape to pull the color from your 'config' prop
            shape={(props: any) => {
              const { fill, ...rest } = props;
              // configKey is passed from the parent (e.g., 'revenue', 'cogs')
              const configKey = props.payload.configKey;
              const barColor = config[configKey]?.color || fill;
              return <Rectangle {...rest} fill={barColor} radius={[4, 4, 4, 4]} />;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}