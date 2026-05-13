import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { InventoryCardProps } from '@/types/dataTypes';
import { ExpandButton } from "./expandIcon";
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

export function InventoryCard({ title, inventoryValue, sellThroughRate, lowStock, description }: InventoryCardProps) {

  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const [cardOpen, setCardOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const ModalRoot = isDesktop ? Dialog : Drawer;
  const ModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;
  const ModalContent = isDesktop ? DialogContent : DrawerContent;
  const ModalHeader = isDesktop ? DialogHeader : DrawerHeader;
  const ModalTitle = isDesktop ? DialogTitle : DrawerTitle;
  const ModalDescription = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <ModalRoot open={cardOpen} onOpenChange={setCardOpen}>
      <Card className="h-[230px] rounded-2xl border-slate-100 flex flex-col">
        <CardHeader>
          <CardTitle className="text-slate-700 font-normal">
            {title}
          </CardTitle>
          <CardAction>
            <ModalTrigger asChild>
              <ExpandButton display={true} comment="View detailed analysis" />
            </ModalTrigger>
          </CardAction>
          <ModalDescription className="sr-only">
            Detailed revenue comparison and historical analysis for {title}.
          </ModalDescription>
        </CardHeader>

        <CardContent>
          <div className="flex justify-around mb-2">
            <div>
              <div className="text-md md:text-lg text-slate-500 font-medium tracking-tight">
                Total Inventory Value
              </div>
              <div className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mb-2">
                {currencyFormatter.format(inventoryValue)}
              </div>
            </div>
            <div>
              <div className="text-md md:text-lg text-slate-500 font-medium tracking-tight">
                Sell Through Rate
              </div>
              <div className="text-lg md:text-xl  font-bold text-slate-900 tracking-tight mb-2">
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
          
        </div>
      </ModalContent>
    </ModalRoot>
  );
}