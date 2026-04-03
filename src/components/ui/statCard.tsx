import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardAction, 
  CardDescription 
} from "@/components/ui/card";
import { ExpandIcon } from "./expandIcon";
import { StatCardProps } from '@/types/dataTypes';

export function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardAction>
          <ExpandIcon icon={icon.icon} iconColor={icon.iconColor} display={false} comment="" />
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