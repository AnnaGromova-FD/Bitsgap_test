import {observable, computed, action, makeObservable} from 'mobx';

import {OrderSide, TakeProfitDataType} from '../model';

export class PlaceOrderStore {
  @observable activeOrderSide: OrderSide = 'buy';
  @observable price: number = 1000;
  @observable amount: number = 1;
  @observable profitRows: TakeProfitDataType[] = [];
  @observable profit: number = 0;
  @observable targetAmount: number = 100;
  @observable projectedProfit: number = 0;

  @observable isChecked: boolean = false;
  @observable isFormValid: boolean = true;

  constructor() {
    makeObservable(this);
  }

  @computed get total(): number {
    return this.price * this.amount;
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
    this.countSumOfProjectedProfit();
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
  public findElement(id: number) {
    return this.profitRows.find(t => t.id === id);
  }

  @action.bound
  public setTargetProfit(id: number, newProfit: number) {
    const profitRowItem = this.findElement(id);

    if (profitRowItem) {
      profitRowItem.profit = newProfit;
      this.setProfit(profitRowItem?.profit);
      this.countTakeProfitPrice(newProfit);
      profitRowItem.targetPrice =
        this.price +
        ((this.activeOrderSide === 'buy' ? this.price : -this.price) *
          newProfit) /
          100;

      this.countSumOfProjectedProfit();
      profitRowItem.targetPriceError = undefined;
    }
    this.profitRows.forEach(row => {
      row.profitError = undefined;
    });
  }

  @action.bound
  public setTargetPrice(id: number, newPrice: number) {
    const profitRowItem = this.findElement(id);

    if (profitRowItem) {
      profitRowItem.targetPrice = newPrice;

      profitRowItem.profit =
        newPrice > 0 ? (newPrice * 100) / this.price - 100 : 0;

      this.countSumOfProjectedProfit();
      profitRowItem.targetPriceError = undefined;
    }
  }

  @action.bound
  public setTargetAmount(id: number, value: number) {
    this.targetAmount = value;
    const profitRowItem = this.findElement(id);

    if (profitRowItem) {
      profitRowItem.targetAmount = value;
      this.countSumOfProjectedProfit();
    }
    this.profitRows.forEach(row => {
      row.amountError = undefined;
    });
  }

  @action.bound
  public handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.isChecked === true
      ? this.showTakeProfitRow(false)
      : this.showTakeProfitRow(true);
  };

  @action.bound
  public showTakeProfitRow(value: boolean) {
    if (value === false) return this.resetProfit();
    this.addTargetProfit();
    this.isChecked = true;
  }

  @action.bound
  public addTargetProfit() {
    const prevProfitPercent =
      this.profitRows[this.profitRows.length - 1]?.profit || 0;
    const profitPercent = prevProfitPercent + 2;

    const newProfitRow: TakeProfitDataType = {
      id: Math.random(),
      profit: profitPercent,
      targetPrice: this.countTakeProfitPrice(profitPercent),
      targetAmount: this.profitRows.length === 0 ? 100 : 20,
      amountError: undefined,
      profitError: undefined,
      targetPriceError: undefined,
    };
    this.profitRows.push(newProfitRow);

    this.recountTargetAmount();
    this.countSumOfProjectedProfit();

    return newProfitRow;
  }

  @action.bound
  public resetProfit() {
    this.profitRows = [];
    this.projectedProfit = 0;
    this.isChecked = false;
  }

  @action.bound
  public deleteProfitTarget = (id: number) => {
    this.profitRows = this.profitRows.filter(t => t.id !== id);

    if (this.profitRows.length === 0) {
      this.showTakeProfitRow(false);
      this.projectedProfit = 0;
    }
    this.countSumOfProjectedProfit();
  };

  @action.bound
  public countTakeProfitResult(
    takeProfit: TakeProfitDataType,
    isBuyOperation = true
  ) {
    return (
      (this.amount *
        (isBuyOperation ? 1 : -1) *
        (takeProfit.targetPrice - this.price) *
        takeProfit.targetAmount) /
      100
    );
  }

  @action.bound
  public countSumOfProjectedProfit() {
    if (this.profitRows.length === 0) return 0;

    this.projectedProfit = this.profitRows.reduce(
      (result, item) => result + this.countTakeProfitResult(item),
      0
    );
  }

  @action.bound
  public countSumOfProfitRows() {
    if (this.profitRows.length === 0) return 0;

    return this.profitRows.reduce((result, item) => result + item.profit, 0);
  }

  public countTakeProfitsTotalAmount() {
    return this.profitRows.reduce((acc, row) => acc + row.targetAmount, 0);
  }

  @action.bound
  public recountTargetAmount() {
    const totalAmount = this.countTakeProfitsTotalAmount();

    if (totalAmount > 100) {
      const profitWithMaxAmount = this.profitRows.reduce((result, item) =>
        result.targetAmount < item.targetAmount ? item : result
      );

      profitWithMaxAmount.targetAmount =
        profitWithMaxAmount.targetAmount - (totalAmount - 100);

      this.setTargetAmount(
        profitWithMaxAmount.id,
        profitWithMaxAmount.targetAmount
      );
    }
  }

  public countTakeProfitPrice(profit: number) {
    return (
      this.price +
      ((this.activeOrderSide === 'buy' ? this.price : -this.price) * profit) /
        100
    );
  }

  @action.bound
  public validateForm() {
    let totalAmount = this.countTakeProfitsTotalAmount();

    this.profitRows.forEach((row, i) => {
      const prevProfitPercent = this.profitRows[i - 1]?.profit || 0;
      const totalProfit = this.countSumOfProfitRows();

      if (row.profit < 0.01) {
        row.profitError = 'Minimum value is 0.01';
        this.isFormValid = false;
      } else if (row.profit < prevProfitPercent) {
        row.profitError = `Each target's profit should be greater than the previous one`;
        this.isFormValid = false;
      } else if (row.profit > 500 || totalProfit > 500) {
        row.profitError = 'Maximum profit sum is 500%';
      }

      if (row.targetPrice <= 0) {
        row.targetPriceError = 'Price must be greater than 0';
        this.isFormValid = false;
      }

      if (totalAmount > 100) {
        row.amountError = `${totalAmount}% out of 100% selected. Please decrease by ${
          totalAmount - 100
        }%`;
        this.isFormValid = false;
      }
    });
  }
}
