import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { InventoryCardProps } from '@/types/dataTypes';

export function InventoryCard({ title, inventoryValue, sellThroughRate, lowStock, description, Icon, iconColor }: InventoryCardProps) {
  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-700 font-normal">
          {title}
        </CardTitle>
        <CardAction>
          <div className="">
            {Icon && (
              <Icon className={`aspect-square w-3 ${iconColor}"}`} />
            )}
          </div>
        </CardAction>
      </CardHeader>
      
      <CardContent>
        <div className="text-md text-slate-500 font-medium tracking-tight">
          Total Inventory Value
        </div>
        <div className="text-lg font-bold text-slate-900 tracking-tight mb-2">
          {currencyFormatter.format(inventoryValue)}
        </div>
        <div className="text-md text-slate-500 font-medium tracking-tight">
          Sell Through Rate
        </div>
        <div className="text-lg font-bold text-slate-900 tracking-tight mb-2">
          {sellThroughRate}%
        </div>
        <div className={`text-lg font-medium tracking-tight ${lowStock.includes("low") ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}>
          {lowStock}
        </div>
        <CardDescription className="mt-1 text-xs">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}