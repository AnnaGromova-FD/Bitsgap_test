/* eslint @typescript-eslint/no-use-before-define: 0 */
import React from 'react';
import {observer} from 'mobx-react';
import {AddCircle, HelpSharp} from '@material-ui/icons';

import {useStore} from '../../context';
import {Button, Switch} from 'components';
import {TakeProfitRow} from '../TakeProfitTarget/TakeProfitRow';
import {QUOTE_CURRENCY} from 'PlaceOrder/constants';

import styles from './TakeProfit.module.scss';

const TakeProfit = observer(function TakeProfitForm() {
  const {
    addTargetProfit,
    deleteProfitTarget,
    isChecked,
    handleChecked,
    profitRows,
    projectedProfit,
  } = useStore();

  // let projectedProfit =
  //   activeOrderSide === 'buy'
  //     ? (targetAmount / 100) * targetPrice - price
  //     : amount * (targetPrice - price);

  // const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setIsChecked(!isChecked);
  //   isChecked === true ? showTakeProfitRow(false) : showTakeProfitRow(true);
  //   console.log(isChecked);
  //   takeProfitRows.length === 0 && setIsChecked(false);
  // };

  return (
    <>
      <div className={styles.root}>
        <div className={styles.titleWrapper}>
          <span>
            Take Profit <HelpSharp className={styles.helpSharp} />
          </span>
          <Switch isChecked={isChecked} handleChange={e => handleChecked(e)} />
        </div>
        {isChecked &&
          profitRows.map(
            ({
              id,
              profit,
              targetPrice,
              targetAmount,
              profitError,
              targetPriceError,
              amountError,
            }) => {
              return (
                <TakeProfitRow
                  id={id}
                  key={id}
                  targetPrice={targetPrice}
                  profit={profit}
                  targetAmount={targetAmount}
                  handleDelete={() => deleteProfitTarget(id)}
                  profitError={profitError}
                  amountError={amountError}
                  targetPriceError={targetPriceError}
                />
              );
            }
          )}
        {isChecked && (
          <Button
            color={profitRows.length < 5 ? 'transparent' : 'invisible'}
            inactive={false}
            startIcon={<AddCircle />}
            onClick={() => addTargetProfit()}
          >
            Add profit target {profitRows.length} / 5
          </Button>
        )}
        <div className={styles.projectedProfitWrapper}>
          <span>Projected profit</span>
          <div>
            {isChecked ? projectedProfit.toFixed(2) : '0'} &nbsp;
            <span>{QUOTE_CURRENCY}</span>
          </div>
        </div>
      </div>
    </>
  );
});

export {TakeProfit};
