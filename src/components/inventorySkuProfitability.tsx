import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer,ReferenceLine } from 'recharts';

interface ProductData {
  id: string;
  name: string;
  total_units_sold: number;
  total_revenue: number;
  stockLevel: number;
  days_in_stock: number;
}

export default function SkuVelocityProfitabilityChart({ products }: { products: ProductData[] }) {
    
    const chartData = products.map(p => ({
        name: p.name,
        velocity: Number((p.total_units_sold / (p.days_in_stock || 30)).toFixed(2)),
        revenue: p.total_revenue,
        stock: p.stockLevel
    }));

    const avgVelocity = chartData.length > 0 
        ? chartData.reduce((sum, p) => sum + p.velocity, 0) / chartData.length 
        : 0;

    const formatCurrency = (value: number) => 
        `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

    if (chartData.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No product data available for this range.
            </div>
        );
    }

    return (
        <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    
                    {/* X-Axis: Velocity */}
                    <XAxis 
                        type="number" 
                        dataKey="velocity" 
                        name="Velocity" 
                        unit=" units/day"
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                    />
                    
                    {/* Y-Axis: Total Revenue */}
                    <YAxis 
                        type="number" 
                        dataKey="revenue" 
                        name="Revenue" 
                        tickFormatter={formatCurrency}
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                    />
                    
                    {/* Z-Axis: Stock Volume controls bubble size mapping */}
                    <ZAxis 
                        type="number" 
                        dataKey="stock" 
                        range={[20, 400]} 
                        name="Current Stock" 
                    />

                    <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xl text-xs max-w-[240px]">
                                        <p className="font-black text-slate-900 mb-2 break-words">{data.name}</p>
                                        <div className="flex flex-col gap-1 text-slate-600 font-medium">
                                            <p>Velocity: <span className="font-bold text-slate-800">{data.velocity} u/day</span></p>
                                            <p>Period Revenue: <span className="font-bold text-emerald-600">{formatCurrency(data.revenue)}</span></p>
                                            <p>Stock On Hand: <span className="font-bold text-slate-800">{data.stock} units</span></p>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    <ReferenceLine x={avgVelocity} stroke="#cbd5e1" strokeDasharray="5 5" />
                    
                    <Scatter name="SKUs" data={chartData} fill="#3b82f6" opacity={0.75} />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}