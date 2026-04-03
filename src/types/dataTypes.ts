import { LucideIcon } from "lucide-react";

export interface IconProps {
  icon?: LucideIcon;
  iconColor?: string;
};

export interface ToolTipProps {
  display: boolean;
  comment: string;
};

export interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: IconProps;
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
  icon: IconProps
  comment: string;
};

export interface InventoryCardProps {
  title: string;
  inventoryValue: number;
  sellThroughRate: number;
  lowStock: string
  icon: IconProps
  description: string;
};