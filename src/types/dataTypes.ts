export type ChartData = {
  name: string;
  [key: string]: string | number;
};

export interface ChartProps {
  dataKey: string;
  title: string;
  description: string;
  chartData: ChartData[];
};