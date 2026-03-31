import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent
} from "@/components/ui/card";

interface InventoryCardProps {
  title: string;
  inventoryValue: number;
  sellThroughRate: number;
  lowStock: string
}

export function InventoryCard({ title, inventoryValue, sellThroughRate, lowStock }: InventoryCardProps) {
  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-500 font-medium">
          {title}
        </CardTitle>
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
      </CardContent>
    </Card>
  );
}