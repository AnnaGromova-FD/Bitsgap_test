/* eslint @typescript-eslint/no-use-before-define: 0 */
import React, {useState} from 'react';
import {HelpSharp, AddCircle} from '@material-ui/icons';

import {useStore} from '../../context';
import {Switch, Button} from 'components';
import {TakeProfitTarget} from '../TakeProfitTarget/TakeProfitTarget';
import {QUOTE_CURRENCY} from 'PlaceOrder/constants';
import {TakeProfitDataType} from '../../model';

import styles from './TakeProfit.module.scss';

const TakeProfit = () => {
  const {
    projectedProfit,
    profit,
    setProfit,
    getTargetPrice,
    resetProfit,
    calcProjectedProfit,
    calcAllTargetAmount,
  } = useStore();

  const [profitData, setTargetProfit] = useState<TakeProfitDataType[]>([]);
  const [isChecked, setIsChecked] = useState(!!profitData.length);
  const calculatedProfit = calcProjectedProfit(profitData);
  let sortedProfitData: TakeProfitDataType[] = [];

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(!isChecked);
    !isChecked && resetProfit();
    setTargetProfit([
      {
        id: Math.random(),
        profit,
        targetPrice: getTargetPrice,
        targetAmount: 100,
        projectedProfit,
      },
    ]);
  };

  let targetAmountSum = calcAllTargetAmount(profitData);

  const addTargetProfit = () => {
    setProfit(profit + 2);

    if (targetAmountSum && targetAmountSum + 20 > 100) {
      sortedProfitData = profitData.sort((a, b) =>
        a.targetAmount > b.targetAmount ? -1 : 1
      );
      sortedProfitData[0].targetAmount = 100 - (targetAmountSum - 100);

      setTargetProfit([
        ...sortedProfitData,
        {
          id: Math.random(),
          profit: profit + 2,
          targetPrice: getTargetPrice,
          targetAmount: 20,
          projectedProfit,
        },
      ]);
    } else {
      setTargetProfit([
        ...profitData,
        {
          id: Math.random(),
          profit: profit + 2,
          targetPrice: getTargetPrice,
          targetAmount: 20,
          projectedProfit,
        },
      ]);
    }

    calcProjectedProfit(sortedProfitData);
  };

  const deleteProfitTarget = (id: number) => {
    setTargetProfit(profitData.filter(t => t.id !== id));
    setProfit(profit - 2);
    profitData.length === 0 && setIsChecked(false);
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
                profit={profit}
                targetPrice={targetPrice}
                targetAmount={targetAmount}
                handleDelete={() => deleteProfitTarget(id)}
              />
            );
          })}
        {isChecked && (
          <Button
            color={profitData.length < 5 ? 'transparent' : 'invisible'}
            inactive={false}
            startIcon={<AddCircle />}
            onClick={() => addTargetProfit()}
          >
            Add profit target {profitData.length} / 5
          </Button>
        )}

        <div className={styles.projectedProfitWrapper}>
          <span>Projected profit</span>
          <div>
            {isChecked ? calculatedProfit : '0'} &nbsp;
            <span>{QUOTE_CURRENCY}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export {TakeProfit};
