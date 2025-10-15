import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/stores/store.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import { useEffect } from 'react';
import { fetchOrder } from '@/reducers/order.slice.ts';

export const useOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector((state: RootState) => state.order, shallowEqual);

  useEffect(() => {
    if (order.refresh) {
      dispatch(fetchOrder());
    }
  }, [order, dispatch]);

  return order;
};
