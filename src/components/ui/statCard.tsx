import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardAction, 
  CardDescription 
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  description: string;
}

export function StatCard({ title, value, trend, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardAction>
          {/* <div className="p-2 bg-indigo-50 rounded-lg">
            <Icon className="w-5 h-5 text-indigo-600" />
          </div> */}
        </CardAction>
        <CardTitle className="text-slate-500 font-medium">
          {title}
        </CardTitle>
        {trend && (
           <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit mt-1">
            {trend}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
        <CardDescription className="mt-1 text-xs">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}