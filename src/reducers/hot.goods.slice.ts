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
import type {
  AmtType,
  HotGoodsResponse,
} from '@/interfaces/goods.interface.ts';
import {
  type DrugRankItem,
  initDrugRankItem,
} from '@/interfaces/dashboard.interface.ts';
import { hotGoodsToDrugRank } from '@/mappers/goods.mappers.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import { updateCommon } from '@/reducers/common.slice.ts';

interface HotGoodsProps extends Page {
  SAMT_GUBN: AmtType;
}

const initHotGoods: HotGoodsProps = {
  SAMT_GUBN: 'A',
  ...initPage,
};

type State = {
  // 검색 조건
  condition: HotGoodsProps;
  // 최근 급등 > 지부 순위 조회
  pharm: DrugRankItem;
  // 최근 급등 > 분회 순위 조회
  branch: DrugRankItem;
  refresh: boolean;
};

const initState: State = {
  // 검색 조건
  condition: initHotGoods,
  // 최근 급등 > 지부 순위 조회
  pharm: initDrugRankItem,
  // 최근 급등 > 분회 순위 조회
  branch: initDrugRankItem,
  refresh: true,
};

export const fetchHotGoods = createAsyncThunk(
  'hotGoods/fetchHotGoods',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const today = state.common.date;

    const data = {
      TAXNO: state.common.taxno,
      SAMT_GUBN: state.hotGoods.condition.SAMT_GUBN,
      SCH_DATE: today,
      PAGE: state.hotGoods.condition.PAGE,
      RCNT: state.hotGoods.condition.RCNT,
    };

    const pharmResponse = await api<ApiCountResult<HotGoodsResponse[]>>({
      apiMap: API_MAP.hotGoods.pharm,
      data: data,
    });

    const branchResponse = await api<ApiCountResult<HotGoodsResponse[]>>({
      apiMap: API_MAP.hotGoods.branch,
      data: data,
    });

    return {
      pharm: {
        items: pharmResponse?.list
          ? hotGoodsToDrugRank(pharmResponse.list)
          : [],
        total: pharmResponse?.count ?? 0,
      } as DrugRankItem,
      branch: {
        items: branchResponse?.list
          ? hotGoodsToDrugRank(branchResponse.list)
          : [],
        total: branchResponse?.count ?? 0,
      } as DrugRankItem,
    };
  },
);

const slice = createSlice({
  name: 'hotGoods',
  initialState: initState,
  reducers: {
    updateHotGoodsPage(state, action: PayloadAction<number>) {
      state.condition.PAGE = action.payload;
      state.refresh = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCommon, (state) => {
      state.refresh = true;
    });
    builder.addCase(fetchHotGoods.fulfilled, (state, action) => {
      state.pharm = action.payload.pharm;
      state.branch = action.payload.branch;
      state.refresh = false;
    });
  },
});

const persistConfig = {
  key: 'hotGoods',
  storage: localforage,
  whitelist: ['condition', 'pharm', 'branch', 'refresh'],
};

export const { updateHotGoodsPage } = slice.actions;
export const persistHotGoodsReducer = persistReducer(
  persistConfig,
  slice.reducer,
);
