import React from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

import {useStore} from '../../context';
import {QUOTE_CURRENCY} from 'PlaceOrder/constants';
import {NumberInput} from 'components';

import styles from './TakeProfitRow.module.scss';

const TakeProfitRow = ({
  id,
  targetAmount,
  targetPrice,
  profit,
  handleDelete,
  profitError,
  targetPriceError,
  amountError,
}: {
  id: number;
  targetAmount: number;
  targetPrice: number;
  profit: number;
  handleDelete: (id: number) => void;
  profitError: any;
  targetPriceError: any;
  amountError: any;
}) => {
  const {activeOrderSide, setTargetPrice, setTargetProfit, setTargetAmount} =
    useStore();
  let isBuyOperation = activeOrderSide === 'buy';
  return (
    <>
      <div className={styles.targetInputsBlock}>
        <div className={styles.targetProfit}>
          <NumberInput
            label='Profit'
            value={profit}
            onChange={value => setTargetProfit(id, Number(value) || 0)}
            error={profitError}
            decimalScale={2}
            InputProps={{endAdornment: '%'}}
            variant='underlined'
          />
        </div>

        <div className={styles.targetPrice}>
          <NumberInput
            label='Target price'
            value={targetPrice}
            onChange={value => setTargetPrice(id, Number(value))}
            error={targetPriceError}
            InputProps={{endAdornment: QUOTE_CURRENCY}}
            variant='underlined'
          />
        </div>
        <div className={styles.targetAmount}>
          <NumberInput
            label={isBuyOperation ? 'Amount to sell' : 'Amount to buy'}
            value={targetAmount}
            onChange={value => setTargetAmount(id, Number(value))}
            error={amountError}
            InputProps={{endAdornment: '%'}}
            variant='underlined'
          />
        </div>
        <span>
          <IconButton
            size='small'
            className={styles.closeIcon}
            onClick={() => handleDelete(id)}
          >
            <CancelIcon style={{width: 14}} />
          </IconButton>
        </span>
      </div>
    </>
  );
};

export {TakeProfitRow};
