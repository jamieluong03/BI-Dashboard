import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

export default function AgingCapitalChart({ data }: { data: any[] }) {
    const totalCapital = data.reduce((sum, item) => sum + item.value, 0);

    const formatCurrency = (value: number) => 
        `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

    if (data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No aging data available for this selection.
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between h-full gap-4">
            <div className="w-full md:w-1/2 h-[200px] relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                        />
                        <Tooltip 
                            formatter={(value: any) => formatCurrency(Number(value))}
                            contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute text-center flex flex-col pointer-events-none">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Total Capital</span>
                    <span className="text-xl font-black text-slate-800">{formatCurrency(totalCapital)}</span>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-2">
                {data.map((item, index) => {
                    const percentage = totalCapital > 0 ? ((item.value / totalCapital) * 100).toFixed(1) : 0;
                    return (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                                <span className="text-xs font-semibold text-slate-600">{item.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-slate-900 block">{formatCurrency(item.value)}</span>
                                <span className="text-[10px] font-bold text-slate-400">{percentage}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}