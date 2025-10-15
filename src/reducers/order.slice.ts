import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/hooks/api.hook.ts';
import { API_MAP } from '@/constants/api.maps.ts';
import localforage from 'localforage';
import { persistReducer } from 'redux-persist';
import type { OrderMonResponse } from '@/interfaces/order.interface.ts';
import { updateCommon } from '@/reducers/common.slice.ts';
import type { RootState } from '@/reducers/root.reducer.ts';

type State = {
  // 전일/전월 입고 상품 목록 조회
  order: OrderMonResponse[];
  refresh: boolean;
};

const initState: State = {
  // 전일/전월 입고 상품 목록 조회
  order: [],
  refresh: true,
};

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (_, { getState }) => {
    const data = (getState() as RootState).common;

    /*
    const addData =
      data.category === 'day'
        ? { SCH_DATE: data.date }
        : { SCH_MON: data.date.substring(0, 6) };
     */

    const addData = { SCH_MON: data.date.substring(0, 6) };

    const response: OrderMonResponse[] | null = await api<OrderMonResponse[]>({
      //apiMap: data.category === 'day' ? API_MAP.order.day : API_MAP.order.mon,
      apiMap: API_MAP.order.mon,
      data: {
        TAXNO: data.taxno,
        ...addData,
      },
    });

    return response ?? [];
  },
);

const slice = createSlice({
  name: 'order',
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateCommon, (state) => {
      state.refresh = true;
    });
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.order = action.payload;
      state.refresh = false;
    });
  },
});

const persistConfig = {
  key: 'order',
  storage: localforage,
  whitelist: ['order', 'refresh'],
};

export const persistOrderReducer = persistReducer(persistConfig, slice.reducer);
