import { useState } from "react";
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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import TotalRevenueCard from "@/components/cardTotalRevenue";

export function StatCard({ title, value, description, metric }: StatCardProps) {

  const [cardOpen , setCardOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const CardBody = (
    <Card>
      <CardHeader>
        <CardAction>
                  <DialogTrigger asChild>
          <ExpandButton display={true} comment="" />
          </DialogTrigger>
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

  const renderModalContent = (metric: string) => {
    switch(metric) {
      case "total_revenue":
        return <TotalRevenueCard />;
    }
    return <p>No Insight Found</p>
  }

  if (isDesktop) {
    return (
      <Dialog open={cardOpen} onOpenChange={setCardOpen}>
        <DialogTrigger asChild>
          {CardBody}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {renderModalContent(metric)}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={cardOpen} onOpenChange={setCardOpen}>
      <DrawerTrigger asChild>
        {CardBody}
      </DrawerTrigger>
      <DrawerContent className="p-6">
        <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
        {renderModalContent(metric)}
      </DrawerContent>
    </Drawer>
  );
}