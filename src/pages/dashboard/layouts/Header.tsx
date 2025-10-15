import { Flex } from '@/components/elements/Flex.tsx';
import logo from '@/assets/images/logo.png';
import chart from '@/assets/images/chart.png';
import receipt from '@/assets/images/receipt.png';
import { Button, Typography } from '@mui/material';
import {
  CATEGORY_ITEMS,
  type CategoryType,
} from '@/constants/dashboard.options.ts';
import type { Item } from '@/interfaces/common.interface.ts';
import { SelectDate } from '@/pages/dashboard/layouts/SelectDate.tsx';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/reducers/root.reducer.ts';
import type { AppDispatch } from '@/stores/store.ts';
import { updateCommon } from '@/reducers/common.slice.ts';

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const common = useSelector((state: RootState) => state.common, shallowEqual);

  const selectedDate = dayjs(common.date).locale('ko');
  const categoryDayFlag = common.category === 'day';

  const handleCategory = (selected: CategoryType) => {
    dispatch(updateCommon({ category: selected }));
  };

  return (
    <Flex direction="column" align="center" noGap className="header-container">
      <div className="header-wrapper">
        <img src={logo} alt="logo" width={60} className="header-logo" />
        <img src={chart} alt="chart" width={138} className="header-chart" />
        <img
          src={receipt}
          alt="receipt"
          width={156}
          className="header-receipt"
        />
        <Flex direction="column" noGap className="header-content">
          <Typography>
            {categoryDayFlag
              ? selectedDate.format('YYYY.MM')
              : selectedDate.format('YYYY')}
          </Typography>
          <Flex align="baseline">
            <Typography sx={{ fontSize: 64, fontWeight: 900 }}>
              {categoryDayFlag
                ? selectedDate.format('DD')
                : selectedDate.format('MM')}
            </Typography>
            <Typography>({selectedDate.format('ddd')})</Typography>
          </Flex>
          <Typography sx={{ fontSize: 28, fontWeigh: 900 }}>
            팜페이 약국
          </Typography>
          <Typography sx={{ fontSize: 28, color: '#00BBFF' }}>
            {categoryDayFlag ? '일' : '월'}별결산 리포트
          </Typography>
          <Typography variant="sm" color="info">
            by <b>CATPOS</b>
          </Typography>
        </Flex>
      </div>

      <Flex noGap className="closing-container">
        {CATEGORY_ITEMS.map((item: Item<CategoryType>) => (
          <Button
            key={`category-${item.itemId}`}
            color={item.itemId === common.category ? 'primary' : 'info'}
            variant={item.itemId === common.category ? 'contained' : 'text'}
            fullWidth
            onClick={() => handleCategory(item.itemId)}
          >
            {item.itemName}
          </Button>
        ))}
      </Flex>

      <SelectDate />
    </Flex>
  );
};
