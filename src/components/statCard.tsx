import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardAction, 
  CardDescription 
} from "@/components/ui/card";
import { ExpandButton } from "./expandIcon";
import { StatCardProps } from '@/types/dataTypes';

export function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardAction>
          <ExpandButton display={true} comment="" />
        </CardAction>
        <CardTitle className="text-md md:text-base text-slate-700 font-normal">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col justify-center h-full gap-2">
        <div className="text-lg md:text-2xl font-bold text-slate-900 tracking-tight text-center">
          {value}
        </div>
        <CardDescription className="mt-1 text-xs">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}