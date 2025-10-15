import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { api, type ApiCountResult } from '@/hooks/api.hook.ts';
import { API_MAP } from '@/constants/api.maps.ts';
import { initPage, type Page } from '@/interfaces/common.interface.ts';
import localforage from 'localforage';
import { persistReducer } from 'redux-persist';
import { type StockResponse } from '@/interfaces/goods.interface.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import { updateCommon } from '@/reducers/common.slice.ts';

interface StockProps extends Page {
  STK: number; // 부족 재고 기준 수량 TODO 영업부에서 논의중
}

const initStock: StockProps = {
  STK: 1,
  ...initPage,
};

type State = {
  // 검색 조건
  condition: StockProps;
  // 부족 재고 목록 조회
  stock: StockResponse[];
  count: number;
  refresh: boolean;
};

const initState: State = {
  // 검색 조건
  condition: initStock,
  // 부족 재고 목록 조회
  stock: [],
  count: 0,
  refresh: true,
};

export const fetchStock = createAsyncThunk(
  'stock/fetchStock',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const response = await api<ApiCountResult<StockResponse[]>>({
      apiMap: API_MAP.stock,
      data: {
        TAXNO: state.common.taxno,
        SCH_DATE: state.common.date,
        STK: state.stock.condition.STK,
        PAGE: state.stock.condition.PAGE,
        RCNT: state.stock.condition.RCNT,
      },
    });

    return {
      stock: response?.list ?? [],
      count: response?.count ?? 0,
    };
  },
);

const slice = createSlice({
  name: 'stock',
  initialState: initState,
  reducers: {
    updateStockPage(state, action: PayloadAction<number>) {
      state.condition.PAGE = action.payload;
      state.refresh = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCommon, (state) => {
      state.condition = initStock;
      state.refresh = true;
    });
    builder.addCase(fetchStock.fulfilled, (state, action) => {
      state.stock = action.payload.stock;
      state.count = action.payload.count;
      state.refresh = false;
    });
  },
});

const persistConfig = {
  key: 'stock',
  storage: localforage,
  whitelist: ['condition', 'stock', 'count', 'refresh'],
};

export const { updateStockPage } = slice.actions;
export const persistStockReducer = persistReducer(persistConfig, slice.reducer);
