import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Rectangle } from "recharts";
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
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartProps } from "@/types/dataTypes";
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

const chartConfig = {
  value: {
    label: "Selected Total",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ChartBarLabelCustom({ dataKey, title, description, comment, chartData }: ChartProps) {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [cardOpen, setCardOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const ModalRoot = isDesktop ? Dialog : Drawer;
  const ModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;
  const ModalContent = isDesktop ? DialogContent : DrawerContent;
  const ModalHeader = isDesktop ? DialogHeader : DrawerHeader;
  const ModalTitle = isDesktop ? DialogTitle : DrawerTitle;
  const ModalDescription = isDesktop ? DialogDescription : DrawerDescription;

  const handleBarClick = (data: any) => {
    if (!data) return;
    const name = data.name;
    setSelectedNames((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  const totalSelected = useMemo(() => {
    return chartData
      .filter((item) => selectedNames.includes(item.name))
      .reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0);
  }, [selectedNames, chartData, dataKey]);

  return (
    <ModalRoot open={cardOpen} onOpenChange={setCardOpen}>
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-slate-700 font-medium">{title}</CardTitle>
            <CardDescription className="text-slate-900 text-xs">{description}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total Sales</p>
            <p className="text-2xl font-black">
              {totalSelected.toLocaleString()}
            </p>
          </div>
          <CardAction>
            <ModalTrigger asChild>
              <ExpandButton display={true} comment="View detailed analysis" />
            </ModalTrigger>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 0, right: 30 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
              <YAxis dataKey="name" type="category" hide />
              <XAxis dataKey={dataKey} type="number" hide />

              <Bar
                dataKey={dataKey}
                radius={4}
                cursor="pointer"
                onClick={handleBarClick}
                shape={(props: any) => {
                  const { x, y, width, height, name } = props;
                  const isActive = selectedNames.includes(name);
                  return (
                    <Rectangle
                      {...props}
                      fill={isActive ? 'var(--color-blue-500)' : 'var(--color-blue-300)'}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  );
                }}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-black font-semibold"
                  fontSize={11}
                />
                <LabelList
                  dataKey={dataKey}
                  position="right"
                  offset={10}
                  className="fill-foreground font-bold"
                  fontSize={11}
                />
              </Bar>
            </BarChart>
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
          {/* Advanced Insight Card */}
        </div>
      </ModalContent>
    </ModalRoot>
  );
}