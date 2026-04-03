import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { InventoryCardProps } from '@/types/dataTypes';
import { ExpandIcon } from "./expandIcon";

export function InventoryCard({ title, inventoryValue, sellThroughRate, lowStock, description, icon }: InventoryCardProps) {
  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-700 font-normal">
          {title}
        </CardTitle>
        <CardAction>
          <ExpandIcon icon={icon.icon} iconColor={icon.iconColor} display={false} comment="" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex justify-around mb-2">
          <div>
            <div className="text-lg text-slate-500 font-medium tracking-tight">
              Total Inventory Value
            </div>
            <div className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              {currencyFormatter.format(inventoryValue)}
            </div>
          </div>
          <div>
            <div className="text-lg text-slate-500 font-medium tracking-tight">
              Sell Through Rate
            </div>
            <div className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              {sellThroughRate}%
            </div>
          </div>
        </div>
        <div className={`px-2 text-lg font-medium tracking-tight ${lowStock.includes("low") ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}>
          {lowStock}
        </div>
        <CardDescription className="mt-1 text-xs">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}