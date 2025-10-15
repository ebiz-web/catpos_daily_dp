import type { CategoryType } from '@/constants/dashboard.options.ts';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';
import { initCommon } from '@/interfaces/common.interface.ts';
import dayjs from 'dayjs';

const slice = createSlice({
  name: 'common',
  initialState: {
    ...initCommon,
    date: dayjs().startOf('day').format('YYYYMMDD'),
  },
  reducers: {
    updateCommon(
      state,
      action: PayloadAction<{
        taxno?: string;
        date?: string;
        category?: CategoryType;
      }>,
    ) {
      if (action.payload.taxno) {
        state.taxno = action.payload.taxno;
      }

      if (action.payload.date) {
        state.date = action.payload.date;
      }

      if (action.payload.category) {
        state.category = action.payload.category;
      }
    },
  },
});

const persistConfig = {
  key: 'common',
  storage: sessionStorage,
};

export const { updateCommon } = slice.actions;
export const persistCommonReducer = persistReducer(
  persistConfig,
  slice.reducer,
);
