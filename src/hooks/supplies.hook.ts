import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/stores/store.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import { useEffect } from 'react';
import { fetchSupplies } from '@/reducers/supplies.slice.ts';

export const useSupplies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const supplies = useSelector(
    (state: RootState) => state.supplies,
    shallowEqual,
  );

  useEffect(() => {
    if (supplies.refresh) {
      dispatch(fetchSupplies());
    }
  }, [supplies, dispatch]);

  return supplies;
};
