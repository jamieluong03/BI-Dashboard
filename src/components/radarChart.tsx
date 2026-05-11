import { useState } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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
import { ChartProps } from "@/types/dataTypes";
import { ExpandButton } from "./expandIcon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import RegionsCard from "./cardRegions";

const chartConfig = {
  orders: {
    label: "Sales",
    color: "#93c5fd",
  },
} satisfies ChartConfig;

export function ChartRadarDots({ title, description, dataKey, comment, chartData }: ChartProps) {
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
      <Card className="relative overflow-hidden h-full">
        <CardHeader className="items-center">
          <CardTitle className="text-slate-700 font-medium">{title}</CardTitle>
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
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px] md:max-h-[300px] w-full"
          >
            <RadarChart data={chartData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }} outerRadius="75%">
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" hideIndicator />} />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 500 }} tickSize={15} />
              <PolarGrid className="stroke-slate-200" />
              <Radar
                dataKey={dataKey}
                fill="var(--color-blue-300)"
                fillOpacity={0.6}
                dot={{
                  r: 4,
                  fillOpacity: 1,
                }}
              />
            </RadarChart>
          </ChartContainer>
          <CardDescription className="mt-1 text-xs">
            {comment}
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
          {/* insight card */}
          <RegionsCard />
        </div>
      </ModalContent>
    </ ModalRoot>
  )
}
