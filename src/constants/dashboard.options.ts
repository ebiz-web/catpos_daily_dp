import type { Item } from '@/interfaces/common.interface.ts';

export const UNIT_MILLION = 1_000_000;
export const UNIT_HUNDRED_THOUSAND = 100_000;
export const UNIT_TEN_THOUSAND = 10_000;
export const UNIT_THOUSAND = 1_000;
export const UNIT_HUNDRED = 100;
export const UNIT_TEN = 10;

export const UNIT_NAMES: Record<number, string> = {
  1_000_000: '백만',
  100_000: '십만',
  10_000: '만',
  1_000: '천',
  100: '백',
  10: '열',
};

export type CategoryType = 'day' | 'mon';
export const CATEGORY_ITEMS: Item<CategoryType>[] = [
  { itemId: 'day', itemName: '일별 결산' },
  { itemId: 'mon', itemName: '월별 결산' },
];

export type PerformanceCategoryType = 'profit' | 'etc' | 'sale';
export const PERFORMANCE_CATEGORY_ITEMS: Item<PerformanceCategoryType>[] = [
  { itemId: 'profit', itemName: '순이익' },
  { itemId: 'etc', itemName: '조제실적' },
  { itemId: 'sale', itemName: '판매실적' },
];

export type ComparisonCategoryType = 'date' | 'pharm' | 'branch';
export const COMPARISON_CATEGORY_ITEMS: Item<ComparisonCategoryType>[] = [
  { itemId: 'date', itemName: '기간대비' },
  { itemId: 'pharm', itemName: '지부대비' },
  { itemId: 'branch', itemName: '분회대비' },
];

export type AmountCountType = 'amount' | 'count';
export const AMOUNT_COUNT_ITEMS: Item<AmountCountType>[] = [
  { itemId: 'amount', itemName: '금액' },
  { itemId: 'count', itemName: '건수' },
];

export type RankCategoryType = 'sale' | 'latest';
export const RANK_CATEGORY_ITEMS: Item<RankCategoryType>[] = [
  { itemId: 'sale', itemName: '판매량' },
  { itemId: 'latest', itemName: '최근 급등' },
];

export type AmountQuantityType = 'amount' | 'quantity';
export const AMOUNT_QUANTITY_ITEMS: Item<AmountQuantityType>[] = [
  { itemId: 'amount', itemName: '금액' },
  { itemId: 'quantity', itemName: '수량' },
];

export type BranchOptionType = 'pharm' | 'branch';
export const BRANCH_OPTION_ITEMS: Item<BranchOptionType>[] = [
  { itemId: 'pharm', itemName: '지부' },
  { itemId: 'branch', itemName: '분회' },
];

export type UpjongType = '101' | '103';
export const UPJONG_ITEMS: Item<UpjongType>[] = [
  { itemId: '103', itemName: '도매상' },
  { itemId: '101', itemName: '제약사' },
];

// 금액/건수 데이터
export type AmountCountItem = Record<AmountCountType, number>;
export const initAmountCountItem: AmountCountItem = {
  amount: 0,
  count: 0,
};
