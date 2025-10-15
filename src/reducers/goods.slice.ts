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
import type { AmtType, GoodsResponse } from '@/interfaces/goods.interface.ts';
import { updateCommon } from '@/reducers/common.slice.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import {
  type DrugRankItem,
  initDrugRankItem,
} from '@/interfaces/dashboard.interface.ts';
import { goodsToDrugRank } from '@/mappers/goods.mappers.ts';

interface GoodsProps extends Page {
  SAMT_GUBN: AmtType;
}

const initGoods: GoodsProps = {
  SAMT_GUBN: 'A',
  ...initPage,
};

type State = {
  // 검색 조건
  condition: GoodsProps;
  // 전일/전월 상품 판매량 순위 조회
  goods: DrugRankItem;
  refresh: boolean;
};

const initState: State = {
  // 검색 조건
  condition: initGoods,
  // 전일/전월 상품 판매량 순위 조회
  goods: initDrugRankItem,
  refresh: true,
};

export const fetchGoods = createAsyncThunk(
  'goods/fetchGoods',
  async (_, { getState }) => {
    const state = getState() as RootState;

    const addData =
      state.common.category === 'day'
        ? { SCH_DATE: state.common.date }
        : { SCH_MON: state.common.date.substring(0, 6) };

    const response = await api<ApiCountResult<GoodsResponse[]>>({
      apiMap:
        state.common.category === 'day' ? API_MAP.goods.day : API_MAP.goods.mon,
      data: {
        TAXNO: state.common.taxno,
        ...addData,
        SAMT_GUBN: state.goods.condition.SAMT_GUBN,
        PAGE: state.goods.condition.PAGE,
        RCNT: state.goods.condition.RCNT,
      },
    });

    return {
      items: response?.list ? goodsToDrugRank(response?.list) : [],
      total: response?.count ?? 0,
    } as DrugRankItem;
  },
);

const slice = createSlice({
  name: 'goods',
  initialState: initState,
  reducers: {
    updateGoodsPage(state, action: PayloadAction<number>) {
      state.condition.PAGE = action.payload;
      state.refresh = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCommon, (state) => {
      state.refresh = true;
    });
    builder.addCase(fetchGoods.fulfilled, (state, action) => {
      state.goods = action.payload;
      state.refresh = false;
    });
  },
});

const persistConfig = {
  key: 'goods',
  storage: localforage,
  whitelist: ['condition', 'goods', 'refresh'],
};

export const { updateGoodsPage } = slice.actions;
export const persistGoodsReducer = persistReducer(persistConfig, slice.reducer);
