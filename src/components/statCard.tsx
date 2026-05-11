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
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import TotalRevenueCard from "@/components/cardTotalRevenue";
import NetProfitCard from "./cardNetProfit";
import TotalOrdersCard from "./cardTotalOrders";
import AovCard from "./cardAov";

export function StatCard({ title, value, description, metric }: StatCardProps) {
  const [cardOpen, setCardOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const ModalRoot = isDesktop ? Dialog : Drawer;
  const ModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;
  const ModalContent = isDesktop ? DialogContent : DrawerContent;
  const ModalHeader = isDesktop ? DialogHeader : DrawerHeader;
  const ModalTitle = isDesktop ? DialogTitle : DrawerTitle;
  const ModalDescription = isDesktop ? DialogDescription : DrawerDescription;

  const renderModalContent = (metric: string) => {
    switch (metric) {
      case "total_revenue":
        return <TotalRevenueCard />;
      case "net_profit":
        return <NetProfitCard />;
      case "total_orders":
        return <TotalOrdersCard />;
      case "aov":
        return <AovCard />;
      case "roas":
        return 0;
      case "roi":
        return 0;
      case "conversion_rate":
        return 0;
      case "ctr":
        return 0;
      case "clv":
        return 0;
      case "mer":
        return 0;
      default:
        return <p className="p-4 text-center text-slate-500">Insight Coming Soon</p>;
    }
  };

  return (
    <ModalRoot open={cardOpen} onOpenChange={setCardOpen}>
      <Card className="h-[230px] rounded-2xl border-slate-100 flex flex-col">
        <CardHeader>
          <CardAction>
            {renderModalContent(metric) === 0 ? "" : (
              <ModalTrigger asChild>
                <ExpandButton display={true} comment="View detailed analysis" />
              </ModalTrigger>
            )}
          </CardAction>
          <CardTitle className="text-md md:text-base text-slate-700 font-normal">
            {title}
          </CardTitle>
          <ModalDescription className="sr-only">
            Detailed revenue comparison and historical analysis for {title}.
          </ModalDescription>
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

      {renderModalContent(metric) === 0 ? "" : (
        <ModalContent
          className={isDesktop
            ? "sm:max-w-[95vw] lg:max-w-[1200px] h-[90vh] overflow-y-auto p-8"
            : "h-[100dvh] w-screen p-0 flex flex-col"
          }
        >
          <ModalHeader className={isDesktop ? "" : "px-4 pt-6"}>
            <ModalTitle className="text-2xl font-bold">{title}</ModalTitle>
          </ModalHeader>

          <div className={isDesktop ? "" : "flex-1 overflow-y-auto px-6"}>
            {renderModalContent(metric)}
          </div>
        </ModalContent>
      )}
    </ModalRoot>
  );
}