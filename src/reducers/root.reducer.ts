import { combineReducers } from '@reduxjs/toolkit';
import { persistSalesReducer } from '@/reducers/sales.slice.ts';
import { persistGoodsReducer } from '@/reducers/goods.slice.ts';
import { persistHotGoodsReducer } from '@/reducers/hot.goods.slice.ts';
import { persistStockReducer } from '@/reducers/stock.slice.ts';
import { persistOrderReducer } from '@/reducers/order.slice.ts';
import { persistSuppliesReducer } from '@/reducers/supplies.slice.ts';
import { persistCommonReducer } from '@/reducers/common.slice.ts';

const reducer = combineReducers({
  common: persistCommonReducer,
  sales: persistSalesReducer,
  goods: persistGoodsReducer,
  hotGoods: persistHotGoodsReducer,
  stock: persistStockReducer,
  order: persistOrderReducer,
  supplies: persistSuppliesReducer,
});

const rootReducer = (
  state: ReturnType<typeof reducer> | undefined,
  action: { type: string; payload?: any },
) => {
  return reducer(state, action);
};

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
