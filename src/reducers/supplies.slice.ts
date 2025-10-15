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
import type { SuppliesResponse } from '@/interfaces/supplies.interface.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import type { UpjongType } from '@/constants/dashboard.options.ts';
import { updateCommon } from '@/reducers/common.slice.ts';

// 101 : 제약사 / 103 : 도매상
interface SuppliesProps extends Page {
  SUP_UPJONG: UpjongType;
}

const initSupplies: SuppliesProps = {
  SUP_UPJONG: '103',
  ...initPage,
};

type State = {
  // 검색 조건
  condition: SuppliesProps;
  // 거래처 목록 조회
  supplies: SuppliesResponse[];
  count: number;
  refresh: boolean;
};

const initState: State = {
  // 검색 조건
  condition: initSupplies,
  // 거래처 목록 조회
  supplies: [],
  count: 0,
  refresh: true,
};

export const fetchSupplies = createAsyncThunk(
  'supplies/fetchSupplies',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const response = await api<ApiCountResult<SuppliesResponse[]>>({
      apiMap: API_MAP.supplies,
      data: {
        TAXNO: state.common.taxno,
        ...state.supplies.condition,
      },
    });

    return {
      response: response?.list ?? [],
      count: response?.count ?? 0,
    };
  },
);

const slice = createSlice({
  name: 'supplies',
  initialState: initState,
  reducers: {
    updateSuppliesPage(state, action: PayloadAction<number>) {
      state.condition.PAGE = action.payload;
      state.refresh = true;
    },
    updateSuppliesUpjong(state, action: PayloadAction<UpjongType>) {
      state.condition.SUP_UPJONG = action.payload;
      state.condition.PAGE = initPage.PAGE;
      state.refresh = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCommon, (state) => {
      state.refresh = true;
    });
    builder.addCase(fetchSupplies.fulfilled, (state, action) => {
      state.supplies = action.payload.response;
      state.count = action.payload.count;
      state.refresh = false;
    });
  },
});

const persistConfig = {
  key: 'supplies',
  storage: localforage,
  whitelist: ['condition', 'supplies', 'count', 'refresh'],
};

export const { updateSuppliesPage, updateSuppliesUpjong } = slice.actions;
export const persistSuppliesReducer = persistReducer(
  persistConfig,
  slice.reducer,
);
