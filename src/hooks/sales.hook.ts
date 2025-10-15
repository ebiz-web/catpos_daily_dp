import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { type AppDispatch } from '@/stores/store.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import { useEffect } from 'react';
import { fetchSales } from '@/reducers/sales.slice.ts';

export const useSales = () => {
  const dispatch = useDispatch<AppDispatch>();

  const sales = useSelector((state: RootState) => state.sales, shallowEqual);

  useEffect(() => {
    if (sales.refresh && !sales.loading) {
      dispatch(fetchSales());
    }
  }, [sales.refresh, sales.loading, dispatch]);

  return sales;
};
