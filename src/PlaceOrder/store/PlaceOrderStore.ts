import {observable, computed, action, makeObservable} from 'mobx';

import {OrderSide, TakeProfitDataType} from '../model';

export class PlaceOrderStore {
  @observable activeOrderSide: OrderSide = 'buy';
  @observable price: number = 1000;
  @observable amount: number = 1;
  @observable profit: number = 2;
  @observable targetAmount: number = 100;
  @observable targetPrice: number = 0;

  constructor() {
    makeObservable(this);
  }

  @computed get total(): number {
    return this.price * this.amount;
  }

  @computed get getTargetPrice(): number {
    return this.price + this.price * (this.profit / 100);
  }

  @computed get projectedProfit(): number {
    return (this.targetAmount / 100) * (this.getTargetPrice - this.price);
  }

  @action.bound
  public setOrderSide(side: OrderSide) {
    this.activeOrderSide = side;
  }

  @action.bound
  public setPrice(price: number) {
    this.price = price;
  }

  @action.bound
  public setAmount(amount: number) {
    this.amount = amount;
  }

  @action.bound
  public setTotal(total: number) {
    this.amount = this.price > 0 ? total / this.price : 0;
  }

  @action.bound
  public setProfit(profit: number) {
    this.profit = profit;
  }

  @action.bound
  public resetProfit() {
    this.profit = 2;
    this.targetAmount = 100;
  }

  @action.bound
  public calcProjectedProfit(profitData: TakeProfitDataType[]) {
    if (!profitData) return;
    return profitData.reduce((acc: number, item: {projectedProfit: number}) => {
      return acc + item.projectedProfit;
    }, 0);
  }

  @action.bound
  public calcAllTargetAmount(profitData: TakeProfitDataType[]) {
    if (!profitData) return;
    const calculatedTargetAmount = profitData.reduce(
      (acc: number, item: {targetAmount: number}) => {
        return acc + item.targetAmount;
      },
      0
    );
    return calculatedTargetAmount;
  }
}
