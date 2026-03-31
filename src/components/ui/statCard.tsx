import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardAction, 
  CardDescription 
} from "@/components/ui/card";
import { StatCardProps } from '@/types/dataTypes';

export function StatCard({ title, value, description, Icon, iconColor }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardAction>
          <div className="">
            {Icon && (
              <Icon className={`aspect-square w-3 ${iconColor}"}`} />
            )}
          </div>
        </CardAction>
        <CardTitle className="text-slate-700 font-normal">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col justify-between h-full">
        <div className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
        <CardDescription className="mt-1 text-xs">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}