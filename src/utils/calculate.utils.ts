import type { ChartUnitItem } from '@/interfaces/common.interface.ts';
import {
  UNIT_MILLION,
  UNIT_NAMES,
  UNIT_TEN,
  UNIT_TEN_THOUSAND,
} from '@/constants/dashboard.options.ts';

interface CalcAutoUnitProps {
  values: number[];
  baseUnit?: number;
  count?: boolean;
}

export const calcAutoUnit = ({
  values,
  baseUnit = UNIT_MILLION,
  count = false,
}: CalcAutoUnitProps): ChartUnitItem => {
  const max = Math.max(...values.map((v) => Math.abs(v)));
  let calc = max / baseUnit;
  const limit = count ? UNIT_TEN : UNIT_TEN_THOUSAND;

  while (calc < 30 && baseUnit > limit) {
    baseUnit /= 10;
    calc = max / baseUnit;
  }

  return {
    name: UNIT_NAMES[baseUnit],
    value: baseUnit,
  };
};

// 단위 계산
export const calcUnit = (value: number, unit: number) => {
  return Math.round(value / unit);
};

// prev 대비 now 증감율 계산
export const calcCompRate = (prev: number, now: number) => {
  if (prev > 0) {
    return parseFloat((((now - prev) / prev) * 100).toFixed(1));
  } else {
    return now;
  }
};
