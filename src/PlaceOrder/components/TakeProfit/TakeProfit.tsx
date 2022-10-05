/* eslint @typescript-eslint/no-use-before-define: 0 */
import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {HelpSharp} from '@material-ui/icons';

import {useStore} from '../../context';
import {Switch} from 'components';
import {TakeProfitTarget} from '../TakeProfitTarget/TakeProfitTarget';
import {QUOTE_CURRENCY} from 'PlaceOrder/constants';
import {TakeProfitDataType} from '../../model';

import styles from './TakeProfit.module.scss';

const TakeProfit = observer(function TakeProfitForm() {
  const {
    activeOrderSide,
    amount,
    price,
    profit,
    resetProfit,
    setProfit,
    targetAmount,
    targetPrice,
  } = useStore();

  const [profitData, setTargetProfit] = useState<TakeProfitDataType[]>([]);
  const [isChecked, setIsChecked] = useState(!!profitData.length);

  let projectedProfit =
    activeOrderSide === 'buy'
      ? (targetAmount / 100) * targetPrice - price
      : amount * (targetPrice - price);

  const profitBlockData: TakeProfitDataType = {
    id: Math.random(),
    profit,
    targetPrice,
    targetAmount,
    projectedProfit,
  };

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!isChecked);
    isChecked === false && resetProfit();

    setTargetProfit(() => [profitBlockData]);
  };

  const deleteProfitTarget = (id: number) => {
    setTargetProfit(profitData.filter(t => t.id !== id));
    setProfit(profit - 2);
    if (!profitData || profitData.length === 1) setIsChecked(false);
  };

  return (
    <>
      <div className={styles.root}>
        <div className={styles.titleWrapper}>
          <span>
            Take Profit <HelpSharp className={styles.helpSharp} />
          </span>
          <Switch isChecked={isChecked} handleChange={handleChecked} />
        </div>
        {isChecked &&
          profitData.map(({id, profit, targetPrice, targetAmount}) => {
            return (
              <TakeProfitTarget
                id={id}
                key={id}
                targetAmount={targetAmount}
                handleDelete={() => deleteProfitTarget(id)}
              />
            );
          })}
        <div className={styles.projectedProfitWrapper}>
          <span>Projected profit</span>
          <div>
            {isChecked ? projectedProfit : '0'} &nbsp;
            <span>{QUOTE_CURRENCY}</span>
          </div>
        </div>
      </div>
    </>
  );
});

export {TakeProfit};
