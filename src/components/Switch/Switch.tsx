import React from 'react';
import cn from 'classnames';

import styles from './Switch.module.scss';

type Props = {
  isChecked: boolean;
  handleChange: (event: any) => void;
  label?: string;
  disabled?: boolean;
  reversed?: boolean;
  fullWidth?: boolean;
};

const Switch = ({
  isChecked,
  handleChange,
  disabled = false,
  reversed,
  fullWidth,
  label,
}: Props) => {
  return (
    <label
      className={cn(styles.root, {
        [styles.reversed]: reversed,
        [styles.fullWidth]: fullWidth,
      })}
    >
      <input
        className={styles.checkbox}
        type='checkbox'
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
      />
      <div className={styles.switch} />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};

export {Switch};
