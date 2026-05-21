export interface IMainStatistics {
  id: number;
  name: string;
  value: number;
}

export interface IMonthlySales {
  date: string;
  value: number;
}

export interface ILastUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  total: number;
}

export interface IMiddleStatistics {
  monthlySales: IMonthlySales[];
  lastUsers: ILastUser[];
}

export interface ITopProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  sold: number;
  revenue: number;
}

export interface ICategorySales {
  id: string;
  name: string;
  revenue: number;
  percentage: number;
}

export interface ChartDataItem {
  title: string;
  value: number;
  percentage: number;
  revenue: number;
  fill?: string;
}

export interface ISalesHistory {
  date: string;
  profit: number;
  profitLabel: string;
  timestamp: number;
}
