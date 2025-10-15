import {
  type AmountCountItem,
  type AmountCountType,
  type ComparisonCategoryType,
  initAmountCountItem,
} from '@/constants/dashboard.options.ts';

// 전일/현재 데이터
export interface PrevNowAmountItem {
  prev: number;
  now: number;
}
export const initPrevNowAmountItem: PrevNowAmountItem = {
  prev: 0,
  now: 0,
};
export interface PrevNowItem {
  prev: AmountCountItem;
  now: AmountCountItem;
}
export const initPrevNowItem: PrevNowItem = {
  prev: initAmountCountItem,
  now: initAmountCountItem,
};

// 차트 데이터
export interface ChartItem {
  name: string;
  value: number;
  rate?: number;
}

// (금액/건수)별 차트 데이터
export type ChartAmountCountItem = Record<AmountCountType, ChartItem[]>;

// [실적 통계] (순이익/조제실적/판매마진)별 금액/건수 차트 데이터
export interface PerformanceCategoryItem {
  profit: ChartItem[];
  etc: ChartAmountCountItem;
  sale: ChartAmountCountItem;
}

export const initPerformanceCategoryItem: PerformanceCategoryItem = {
  profit: [],
  etc: { amount: [], count: [] },
  sale: { amount: [], count: [] },
};

export interface PerformanceUnitItem {
  profit: string;
  etc: string;
  sale: string;
}
export const initPerformanceUnitItem: PerformanceUnitItem = {
  profit: '백만원',
  etc: '백만원',
  sale: '백만원',
};

// [매출 비교] (기간대비/지부대비/분회대비)별 금액/건수 차트 데이터
export type ComparisonChartType = Record<'etc' | 'sale', ChartAmountCountItem>;
export type ComparisonCategoryItem = Record<
  ComparisonCategoryType,
  ComparisonChartType
>;

export const initComparisonCategoryItem: ComparisonCategoryItem = {
  date: {
    etc: { amount: [], count: [] },
    sale: { amount: [], count: [] },
  },
  pharm: {
    etc: { amount: [], count: [] },
    sale: { amount: [], count: [] },
  },
  branch: {
    etc: { amount: [], count: [] },
    sale: { amount: [], count: [] },
  },
};

export interface ComparisonDetailUnitItem {
  etc: string;
  sale: string;
}

export const initComparisonDetailUnitItem: ComparisonDetailUnitItem = {
  etc: '백만원',
  sale: '백만원',
};

export interface ComparisonUnitItem {
  date: ComparisonDetailUnitItem;
  pharm: ComparisonDetailUnitItem;
  branch: ComparisonDetailUnitItem;
}

export const initComparisonUnitItem: ComparisonUnitItem = {
  date: initComparisonDetailUnitItem,
  pharm: initComparisonDetailUnitItem,
  branch: initComparisonDetailUnitItem,
};

export interface ComparisonItem {
  date: {
    etc: AmountCountItem;
    sale: AmountCountItem;
  };
  pharm: {
    etc: AmountCountItem;
    sale: AmountCountItem;
  };
  branch: {
    etc: AmountCountItem;
    sale: AmountCountItem;
  };
}

export const initComparisonItem: ComparisonItem = {
  date: {
    etc: initAmountCountItem,
    sale: initAmountCountItem,
  },
  pharm: {
    etc: initAmountCountItem,
    sale: initAmountCountItem,
  },
  branch: {
    etc: initAmountCountItem,
    sale: initAmountCountItem,
  },
};

// [실적 통계] : 차트 데이터
// 조제 데이터
// 판매 데이터
// [매출 비교] : 차트 데이터
export interface SalesItem {
  performance: PerformanceCategoryItem;
  performanceUnit: PerformanceUnitItem;
  etc: PrevNowItem;
  sale: PrevNowItem;
  profit: PrevNowAmountItem;
  comparison: ComparisonCategoryItem;
  comparisonItem: ComparisonItem;
  comparisonUnit: ComparisonUnitItem;
}

export const initSalesItem: SalesItem = {
  performance: initPerformanceCategoryItem,
  performanceUnit: initPerformanceUnitItem,
  etc: initPrevNowItem,
  sale: initPrevNowItem,
  profit: initPrevNowAmountItem,
  comparison: initComparisonCategoryItem,
  comparisonItem: initComparisonItem,
  comparisonUnit: initComparisonUnitItem,
};

// [실적 통계] : 결제수단별 집계
export interface TransAmountCountItem extends AmountCountItem {
  amountRate: number;
  countRate: number;
}

export interface PerformanceTransItem extends AmountCountItem {
  name: string;
  etc: TransAmountCountItem;
  sale: TransAmountCountItem;
}

// [약품 순위] : 판매량/최근 급등 > 지부, 분회
export interface GoodItem {
  name: string;
  make: string;
  stock: number;
  buy: number;
  sale: number;
  avg: number;
  count: number;
}

export interface DrugRankItem {
  items: GoodItem[];
  total: number;
}

export const initDrugRankItem: DrugRankItem = {
  items: [],
  total: 0,
};
