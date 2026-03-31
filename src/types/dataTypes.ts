import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  Icon?: LucideIcon;
  iconColor?: string;
}

export type ChartData = {
  name: string;
  [key: string]: string | number;
};

export interface ChartProps {
  dataKey: string;
  title: string;
  description: string;
  chartData: ChartData[];
  Icon?: LucideIcon;
  iconColor?: string;
};

export interface InventoryCardProps {
  title: string;
  inventoryValue: number;
  sellThroughRate: number;
  lowStock: string
  Icon?: LucideIcon;
  iconColor?: string;
};