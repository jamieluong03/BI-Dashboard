export type ChartData = {
  name: string;
  [key: string]: string | number;
};

export interface ChartProps {
  dataKey: string;
  title: number;
  description: string;
  chartData: ChartData[];
};