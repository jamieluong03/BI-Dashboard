import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Label } from "recharts";

const fulfillmentConfig = {
    successful: { label: "Successful", color: "#10b981" },
    cancelled: { label: "Cancelled", color: "#f43f5e" },
    refunded: { label: "Refunded", color: "#fbbf24" },
} satisfies ChartConfig;

type OrdersFulfillment = {
    name: string;
    value: number;
};

type TotalOrdersFulfillment = {
    data: OrdersFulfillment[];
};

export function TotalOrdersFulfillment({ data }: TotalOrdersFulfillment) {
    console.log("Received Orders Fulfillment Data:", data.find(d => d.name === "Successful")?.value);
    const totalOrders = data.reduce((acc, curr) => acc + curr.value, 0);
    const orders = data ? data.find(d => d.name === "Successful")?.value || 0 : 0;
    const successRate = totalOrders > 0 
        ? ((orders / totalOrders) * 100).toFixed(0) 
        : 0;

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Fulfillment Health
            </h3>
            
            <div className="flex-1 min-h-[150px] w-full">
                <ChartContainer config={fulfillmentConfig} className="mx-auto aspect-square max-h-[180px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={45}
                            outerRadius={65}
                            strokeWidth={5}
                            paddingAngle={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-slate-900 text-xl font-bold">
                                                    {successRate}%
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16} className="fill-slate-400 text-[9px] uppercase font-bold">
                                                    Success
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
                {data.map((item) => (
                    <div key={item.name} className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-900">{item.value}</span>
                        <span className="text-[8px] text-slate-400 uppercase font-medium">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}