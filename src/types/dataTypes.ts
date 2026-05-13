import { DateRange } from "react-day-picker";

export type ViewType = "month" | "quarter" | "year";

export interface ToolTipProps {
  display: boolean;
  comment: string;
};

export interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  metric: string;
};

export type ChartData = {
  name: string;
  [key: string]: string | number;
};

export interface ChartProps {
  dataKey: string;
  title: string;
  description: string;
  chartData: ChartData[];
  comment: string;
};

export interface InventoryCardProps {
  title: string;
  inventoryValue: number;
  sellThroughRate: number;
  lowStock: string
  description: string;
  dateContext: DashboardDateContext;
};

export interface ChannelStats {
    name: string;
    revenue: number;
    margin: number;
    orders: number;
    newOrders: number;
    returningOrders: number;
};

export interface DashboardDateContext {
  activeFrom: string;
  activeTo: string;
  range: DateRange | undefined;
  preset: string;
  onRangeChange: (range: DateRange | undefined) => void;
  onPresetChange: (preset: string) => void;
};