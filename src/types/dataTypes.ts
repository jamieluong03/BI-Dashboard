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
};