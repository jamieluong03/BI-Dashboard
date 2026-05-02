import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

export function UptChart({ value }: { value: number }) {
    const data = [{ value }];

    return (
        <div className="flex flex-col h-full items-center justify-between">
            <div className="relative w-full h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="80%"
                        outerRadius="100%"
                        data={data}
                        startAngle={180}
                        endAngle={0}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 5]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={30}
                            fill="#8b5cf6"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                    <span className="text-3xl font-bold text-slate-900">{value}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Items / Order</span>
                </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed px-4">
                Customers are adding <span className="text-violet-600 font-bold">{value}</span> unique items to their carts on average.
            </p>
        </div>
    );
}