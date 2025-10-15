import type {
  BranchAverageStats,
  SaleStats,
  TransStats,
} from '@/interfaces/sale.interface.ts';
import {
  type PerformanceCategoryItem,
  type PrevNowItem,
  type PerformanceTransItem,
  type SalesItem,
  type ComparisonCategoryItem,
  type PrevNowAmountItem,
  type ComparisonItem,
  type PerformanceUnitItem,
  type ComparisonUnitItem,
} from '@/interfaces/dashboard.interface.ts';
import {
  calcAutoUnit,
  calcCompRate,
  calcUnit,
} from '@/utils/calculate.utils.ts';
import {
  type AmountCountItem,
  type CategoryType,
} from '@/constants/dashboard.options.ts';
import dayjs from 'dayjs';
import type { ChartUnitItem } from '@/interfaces/common.interface.ts';

export const salesToSalesItem = (
  category: CategoryType,
  sales: SaleStats[],
  pbs: BranchAverageStats[],
): SalesItem => {
  const [prevSales, nowSales] = sales;

  const prevPerformanceName = '조제실적';
  const nowPerformanceName = '판매실적';
  const prevDateName =
    category === 'day'
      ? dayjs(prevSales.TRANDATE).format('MM.DD')
      : dayjs(prevSales.TRANYYMM).format('YYYY.MM');
  const nowDateName =
    category === 'day'
      ? dayjs(nowSales.TRANDATE).format('MM.DD')
      : dayjs(nowSales.TRANYYMM).format('YYYY.MM');

  const etc: PrevNowItem = {
    prev: {
      amount: Number(prevSales.ETCAMT),
      count: Number(prevSales.ETCCNT),
    },
    now: {
      amount: Number(nowSales.ETCAMT),
      count: Number(nowSales.ETCCNT),
    },
  };

  const etcRate: AmountCountItem = {
    amount: calcCompRate(etc.prev.amount, etc.now.amount),
    count: calcCompRate(etc.prev.count, etc.now.count),
  };

  const etcUnitItem: ChartUnitItem = calcAutoUnit({
    values: [etc.prev.amount, etc.now.amount],
  });

  const sale: PrevNowItem = {
    prev: {
      amount: Number(prevSales.OTCAMT) + Number(prevSales.DISCAMT),
      count: Number(prevSales.OTCCNT),
    },
    now: {
      amount: Number(nowSales.OTCAMT) + Number(nowSales.DISCAMT),
      count: Number(nowSales.OTCCNT),
    },
  };

  const saleRate: AmountCountItem = {
    amount: calcCompRate(sale.prev.amount, sale.now.amount),
    count: calcCompRate(sale.prev.count, sale.now.count),
  };

  const saleUnitItem: ChartUnitItem = calcAutoUnit({
    values: [sale.prev.amount, sale.now.amount],
  });

  const profit: PrevNowAmountItem = {
    prev: Number(prevSales.SUB_MAMT),
    now: Number(nowSales.SUB_MAMT),
  };

  const profitUnitItem: ChartUnitItem = calcAutoUnit({
    values: [
      etc.prev.amount + etc.now.amount,
      sale.prev.amount + sale.now.amount,
    ],
  });

  const performanceUnit: PerformanceUnitItem = {
    profit: profitUnitItem.name,
    etc: etcUnitItem.name,
    sale: saleUnitItem.name,
  };

  const performanceCategoryItem: PerformanceCategoryItem = {
    profit: [
      {
        name: prevPerformanceName,
        value: etcRate.amount,
        rate: etcRate.amount,
      },
      {
        name: nowPerformanceName,
        value: saleRate.amount,
        rate: saleRate.amount,
      },
    ],
    etc: {
      amount: [
        {
          name: prevDateName,
          value: calcUnit(etc.prev.amount, etcUnitItem.value),
        },
        {
          name: nowDateName,
          value: calcUnit(etc.now.amount, etcUnitItem.value),
          rate: etcRate.amount,
        },
      ],
      count: [
        {
          name: prevDateName,
          value: etc.prev.count,
        },
        {
          name: nowDateName,
          value: etc.now.count,
          rate: etcRate.count,
        },
      ],
    },
    sale: {
      amount: [
        {
          name: prevDateName,
          value: calcUnit(sale.prev.amount, saleUnitItem.value),
        },
        {
          name: nowDateName,
          value: calcUnit(sale.now.amount, saleUnitItem.value),
          rate: saleRate.amount,
        },
      ],
      count: [
        {
          name: prevDateName,
          value: sale.prev.count,
        },
        {
          name: nowDateName,
          value: sale.now.count,
          rate: saleRate.count,
        },
      ],
    },
  };

  const pharmRes = pbs.find((d) => d.PHARM_NAME);
  const pharmName = pharmRes?.PHARM_NAME ?? '지부';

  const branchRes = pbs.find((d) => d.BRANCH_NAME);
  const branchName = branchRes?.BRANCH_NAME ?? '분회';

  const comparisonItem: ComparisonItem = {
    date: {
      etc: etc.prev,
      sale: sale.prev,
    },
    pharm: {
      etc: {
        amount: Number(pharmRes?.AVG_ETCAMT ?? 0),
        count: Number(pharmRes?.AVG_ETCCNT ?? 0),
      },
      sale: {
        amount: Number(pharmRes?.AVG_OTCAMT ?? 0),
        count: Number(pharmRes?.AVG_OTCCNT ?? 0),
      },
    },
    branch: {
      etc: {
        amount: Number(branchRes?.AVG_ETCAMT ?? 0),
        count: Number(branchRes?.AVG_ETCCNT ?? 0),
      },
      sale: {
        amount: Number(branchRes?.AVG_OTCAMT ?? 0),
        count: Number(branchRes?.AVG_OTCCNT ?? 0),
      },
    },
  };

  const pharmEtcUnitItem = calcAutoUnit({
    values: [comparisonItem.pharm.etc.amount, etc.now.amount],
  });
  const pharmSaleUnitItem = calcAutoUnit({
    values: [comparisonItem.pharm.sale.amount, sale.now.amount],
  });
  const branchEtcUnitItem = calcAutoUnit({
    values: [comparisonItem.branch.etc.amount, etc.now.amount],
  });
  const branchSaleUnitItem = calcAutoUnit({
    values: [comparisonItem.branch.sale.amount, sale.now.amount],
  });

  const comparisonCategoryItem: ComparisonCategoryItem = {
    date: {
      etc: performanceCategoryItem.etc,
      sale: performanceCategoryItem.sale,
    },
    pharm: {
      etc: {
        amount: [
          {
            name: pharmName,
            value: calcUnit(
              comparisonItem.pharm.etc.amount,
              pharmEtcUnitItem.value,
            ),
          },
          {
            name: 'MY',
            value: calcUnit(etc.now.amount, pharmEtcUnitItem.value),
            rate: calcCompRate(comparisonItem.pharm.etc.amount, etc.now.amount),
          },
        ],
        count: [
          {
            name: pharmName,
            value: comparisonItem.pharm.etc.count,
          },
          {
            name: 'MY',
            value: etc.now.count,
            rate: calcCompRate(comparisonItem.pharm.etc.count, etc.now.count),
          },
        ],
      },
      sale: {
        amount: [
          {
            name: pharmName,
            value: calcUnit(
              comparisonItem.pharm.sale.amount,
              pharmSaleUnitItem.value,
            ),
          },
          {
            name: 'MY',
            value: calcUnit(sale.now.amount, pharmSaleUnitItem.value),
            rate: calcCompRate(
              comparisonItem.pharm.sale.amount,
              sale.now.amount,
            ),
          },
        ],
        count: [
          {
            name: pharmName,
            value: comparisonItem.pharm.sale.count,
          },
          {
            name: 'MY',
            value: sale.now.count,
            rate: calcCompRate(comparisonItem.pharm.sale.count, sale.now.count),
          },
        ],
      },
    },
    branch: {
      etc: {
        amount: [
          {
            name: branchName,
            value: calcUnit(
              comparisonItem.branch.etc.amount,
              branchEtcUnitItem.value,
            ),
          },
          {
            name: 'MY',
            value: calcUnit(etc.now.amount, branchEtcUnitItem.value),
            rate: calcCompRate(
              comparisonItem.branch.etc.amount,
              etc.now.amount,
            ),
          },
        ],
        count: [
          {
            name: branchName,
            value: comparisonItem.branch.etc.count,
          },
          {
            name: 'MY',
            value: etc.now.count,
            rate: calcCompRate(comparisonItem.branch.etc.count, etc.now.count),
          },
        ],
      },
      sale: {
        amount: [
          {
            name: branchName,
            value: calcUnit(
              comparisonItem.branch.sale.amount,
              branchSaleUnitItem.value,
            ),
          },
          {
            name: 'MY',
            value: calcUnit(sale.now.amount, branchSaleUnitItem.value),
            rate: calcCompRate(
              comparisonItem.branch.sale.amount,
              sale.now.amount,
            ),
          },
        ],
        count: [
          {
            name: branchName,
            value: comparisonItem.branch.sale.count,
          },
          {
            name: 'MY',
            value: sale.now.count,
            rate: calcCompRate(
              comparisonItem.branch.sale.count,
              sale.now.count,
            ),
          },
        ],
      },
    },
  };

  const comparisonUnit: ComparisonUnitItem = {
    date: {
      etc: etcUnitItem.name,
      sale: saleUnitItem.name,
    },
    pharm: {
      etc: pharmEtcUnitItem.name,
      sale: pharmSaleUnitItem.name,
    },
    branch: {
      etc: branchEtcUnitItem.name,
      sale: branchSaleUnitItem.name,
    },
  };

  return {
    performance: performanceCategoryItem,
    performanceUnit: performanceUnit,
    etc: etc,
    sale: sale,
    profit: profit,
    comparison: comparisonCategoryItem,
    comparisonItem: comparisonItem,
    comparisonUnit: comparisonUnit,
  };
};

export const salesToTrans = (
  transList: TransStats[],
): PerformanceTransItem[] => {
  const totalEtcAmount = transList.reduce(
    (sum, trans) => sum + Number(trans.ETCAMT),
    0,
  );
  const totalEtcCount = transList.reduce(
    (sum, trans) => sum + Number(trans.ETCCNT),
    0,
  );
  const totalSaleAmount = transList.reduce(
    (sum, trans) => sum + Number(trans.OTCAMT),
    0,
  );
  const totalSaleCount = transList.reduce(
    (sum, trans) => sum + Number(trans.OTCCNT),
    0,
  );

  return transList.map((trans) => {
    const etcAmount = Number(trans.ETCAMT);
    const etcCount = Number(trans.ETCCNT);
    const saleAmount = Number(trans.OTCAMT);
    const saleCount = Number(trans.OTCCNT);

    return {
      name: trans.TRANGUBN_NAME,
      etc: {
        amount: etcAmount,
        amountRate: parseFloat(((etcAmount / totalEtcAmount) * 100).toFixed(1)),
        count: etcCount,
        countRate: parseFloat(((etcCount / totalEtcCount) * 100).toFixed(1)),
      },
      sale: {
        amount: saleAmount,
        amountRate: parseFloat(
          ((saleAmount / totalSaleAmount) * 100).toFixed(1),
        ),
        count: saleCount,
        countRate: parseFloat(((saleCount / totalSaleCount) * 100).toFixed(1)),
      },
    } as PerformanceTransItem;
  });
};
