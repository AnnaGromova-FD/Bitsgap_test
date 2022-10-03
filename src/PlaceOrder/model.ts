export type OrderSide = 'buy' | 'sell';

export type TakeProfitDataType = {
  id: number;
  profit: number;
  targetPrice: number;
  targetAmount: number;
  projectedProfit: any;
};
