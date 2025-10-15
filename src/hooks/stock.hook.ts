import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { type AppDispatch } from '@/stores/store.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import { useEffect } from 'react';
import { fetchStock } from '@/reducers/stock.slice.ts';

export const useStock = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stock = useSelector((state: RootState) => state.stock, shallowEqual);

  useEffect(() => {
    if (stock.refresh) {
      dispatch(fetchStock());
    }
  }, [stock, dispatch]);

  return stock;
};
