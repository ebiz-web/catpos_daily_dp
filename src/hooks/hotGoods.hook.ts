import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/stores/store.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import { useEffect } from 'react';
import { fetchHotGoods } from '@/reducers/hot.goods.slice.ts';

export const useHotGoods = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hotGoods = useSelector(
    (state: RootState) => state.hotGoods,
    shallowEqual,
  );

  useEffect(() => {
    if (hotGoods.refresh) {
      dispatch(fetchHotGoods());
    }
  }, [hotGoods, dispatch]);

  return hotGoods;
};
