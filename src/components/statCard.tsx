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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import TotalRevenueCard from "@/components/cardTotalRevenue";

export function StatCard({ title, value, description, metric }: StatCardProps) {
  const [cardOpen, setCardOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const ModalRoot = isDesktop ? Dialog : Drawer;
  const ModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;
  const ModalContent = isDesktop ? DialogContent : DrawerContent;
  const ModalHeader = isDesktop ? DialogHeader : DrawerHeader;
  const ModalTitle = isDesktop ? DialogTitle : DrawerTitle;

  const renderModalContent = (metric: string) => {
    switch (metric) {
      case "total_revenue":
        return <TotalRevenueCard />;
      default:
        return <p className="p-4 text-center text-slate-500">No Insight Found</p>;
    }
  };

  return (
    <ModalRoot open={cardOpen} onOpenChange={setCardOpen}>
      <Card className="h-full">
        <CardHeader>
          <CardAction>
            <ModalTrigger asChild>
              <ExpandButton display={true} comment="View detailed analysis" />
            </ModalTrigger>
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

      <ModalContent className={isDesktop ? "sm:max-w-[425px]" : "p-6"}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <div className={isDesktop ? "" : "pb-8"}>
            {renderModalContent(metric)}
        </div>
      </ModalContent>
    </ModalRoot>
  );
}