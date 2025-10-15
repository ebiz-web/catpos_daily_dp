import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/stores/store.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import { useEffect } from 'react';
import { fetchGoods } from '@/reducers/goods.slice.ts';

export const useGoods = () => {
  const dispatch = useDispatch<AppDispatch>();
  const goods = useSelector((state: RootState) => state.goods, shallowEqual);

  useEffect(() => {
    if (goods.refresh) {
      dispatch(fetchGoods());
    }
  }, [goods, dispatch]);

  return goods;
};
