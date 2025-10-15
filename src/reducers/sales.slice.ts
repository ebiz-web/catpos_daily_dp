import type {
  SaleCountStats,
  SaleResponse,
  SaleWeekStats,
} from '@/interfaces/sale.interface.ts';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/hooks/api.hook.ts';
import { API_MAP } from '@/constants/api.maps.ts';
import localforage from 'localforage';
import { persistReducer } from 'redux-persist';
import type { RootState } from '@/reducers/root.reducer.ts';
import { updateCommon } from '@/reducers/common.slice.ts';
import { salesToSalesItem, salesToTrans } from '@/mappers/sales.mappers.ts';
import {
  type ComparisonCategoryItem,
  type ComparisonItem,
  type ComparisonUnitItem,
  initComparisonCategoryItem,
  initComparisonItem,
  initComparisonUnitItem,
  initPerformanceCategoryItem,
  initPerformanceUnitItem,
  initPrevNowAmountItem,
  initPrevNowItem,
  initSalesItem,
  type PerformanceCategoryItem,
  type PerformanceTransItem,
  type PerformanceUnitItem,
  type PrevNowAmountItem,
  type PrevNowItem,
  type SalesItem,
} from '@/interfaces/dashboard.interface.ts';

// 전일/전월 판매 조회
type State = {
  // [실적 통계] 순이익/조제실적/판매실적 차트
  performance: PerformanceCategoryItem;
  performanceUnit: PerformanceUnitItem;
  // 조제 실적 데이터
  etc: PrevNowItem;
  // 판매 실적 데이터
  sale: PrevNowItem;
  // 순이익 데이터
  profit: PrevNowAmountItem;
  // [실적 통계] 결제구분별 집계
  trans: PerformanceTransItem[];
  // [매출 비교] 기간대비/지부대비/분회대비 차트
  comparison: ComparisonCategoryItem;
  comparisonItem: ComparisonItem;
  comparisonUnit: ComparisonUnitItem;

  // 일별 판매건수
  day: SaleCountStats[];
  // 요일별 판매현황
  week: SaleWeekStats[];

  refresh: boolean;
  loading: boolean;
};

// 전일/전월 판매 조회
const initState: State = {
  // [실적 통계] 순이익/조제실적/판매실적 차트
  performance: initPerformanceCategoryItem,
  performanceUnit: initPerformanceUnitItem,
  // 조제 실적 데이터
  etc: initPrevNowItem,
  // 판매 실적 데이터
  sale: initPrevNowItem,
  // 순이익 데이터
  profit: initPrevNowAmountItem,
  // 결제구분별 집계
  trans: [],
  // [매출 비교] 기간대비/지부대비/분회대비 차트
  comparison: initComparisonCategoryItem,
  comparisonItem: initComparisonItem,
  comparisonUnit: initComparisonUnitItem,

  // 일별 판매건수
  day: [],
  // 요일별 판매현황
  week: [],

  refresh: true,
  loading: false,
};

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (_, { getState }) => {
    const data = (getState() as RootState).common;

    const addData =
      data.category === 'day'
        ? { SCH_DATE: data.date }
        : { SCH_MON: data.date.substring(0, 6) };

    const response = await api<SaleResponse>({
      apiMap: data.category === 'day' ? API_MAP.sale.day : API_MAP.sale.mon,
      data: {
        TAXNO: data.taxno,
        ...addData,
      },
    });

    const salesItem: SalesItem =
      response?.SLE_SUM && response?.PB_SUM
        ? salesToSalesItem(data.category, response.SLE_SUM, response.PB_SUM)
        : initSalesItem;

    return {
      performance: salesItem.performance,
      performanceUnit: salesItem.performanceUnit,
      etc: salesItem.etc,
      sale: salesItem.sale,
      profit: salesItem.profit,
      trans: response?.TRN_LIST ? salesToTrans(response.TRN_LIST) : [],
      comparison: salesItem.comparison,
      comparisonItem: salesItem.comparisonItem,
      comparisonUnit: salesItem.comparisonUnit,

      day: response?.SLE_DAY_LIST ?? [],
      week: response?.SLE_WEEK_LIST ?? [],
    };
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      return !state.sales.loading;
    },
  },
);

const slice = createSlice({
  name: 'sales',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateCommon, (state) => {
      state.refresh = true;
    });
    builder.addCase(fetchSales.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSales.fulfilled, (state, action) => {
      state.performance = action.payload.performance;
      state.performanceUnit = action.payload.performanceUnit;
      state.etc = action.payload.etc;
      state.sale = action.payload.sale;
      state.profit = action.payload.profit;
      state.trans = action.payload.trans;
      state.comparison = action.payload.comparison;
      state.comparisonItem = action.payload.comparisonItem;
      state.comparisonUnit = action.payload.comparisonUnit;

      state.day = action.payload.day;
      state.week = action.payload.week;

      state.refresh = false;
      state.loading = false;
    });
    builder.addCase(fetchSales.rejected, (state) => {
      state.loading = false;
    });
  },
});

const persistConfig = {
  key: 'sales',
  storage: localforage,
  whitelist: [
    'performance',
    'performanceUnit',
    'etc',
    'sale',
    'profit',
    'trans',
    'comparison',
    'comparisonItem',
    'comparisonUnit',
    'day',
    'week',
    'refresh',
  ],
};

export const persistSalesReducer = persistReducer(persistConfig, slice.reducer);
