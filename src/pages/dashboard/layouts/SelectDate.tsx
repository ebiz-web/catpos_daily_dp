import { Flex } from '@/components/elements/Flex.tsx';
import { Button, IconButton, Typography } from '@mui/material';
import { IconArrow } from '@/assets/icons/IconArrow.tsx';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/stores/store.ts';
import type { RootState } from '@/reducers/root.reducer.ts';
import { updateCommon } from '@/reducers/common.slice.ts';

export const SelectDate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const common = useSelector((state: RootState) => state.common, shallowEqual);

  const today = dayjs();
  const selectedDate = dayjs(common.date);

  const prevMonth = selectedDate.subtract(1, 'month');
  const nextMonth = selectedDate.add(1, 'month');

  const isSameMonth = selectedDate.isSame(today, 'month');

  const selectMonth = (month: Dayjs) => {
    const today = dayjs();

    dispatch(
      updateCommon({
        date: month.isAfter(today)
          ? today.format('YYYYMMDD')
          : month.format('YYYYMMDD'),
      }),
    );
  };

  return (
    <Flex direction="column" fullWidth className="condition-container">
      <Flex justify="space-between" align="center">
        <Button size="square" onClick={() => selectMonth(prevMonth)}>
          <IconArrow />
        </Button>
        <Flex justify="space-around" align="center" fullWidth>
          <IconButton onClick={() => selectMonth(prevMonth)}>
            <Typography variant="xl" color="info">
              {prevMonth.format('MM')}
            </Typography>
          </IconButton>

          <Typography variant="xxxl" color="primary">
            {selectedDate.format('YYYY.MM')}
          </Typography>

          <IconButton
            disabled={isSameMonth}
            onClick={() => selectMonth(nextMonth)}
          >
            <Typography
              variant="xl"
              color={nextMonth.isAfter(today, 'month') ? 'info.light' : 'info'}
            >
              {nextMonth.format('MM')}
            </Typography>
          </IconButton>
        </Flex>
        <Button
          size="square"
          disabled={isSameMonth}
          onClick={() => selectMonth(nextMonth)}
        >
          <IconArrow rotate={180} />
        </Button>
      </Flex>
      {common.category === 'day' && <SelectDay />}
    </Flex>
  );
};

interface DayFormat {
  day: string;
  dayOfWeek: string;
  disabled: boolean;
}

export const SelectDay = () => {
  const dispatch = useDispatch<AppDispatch>();
  const common = useSelector((state: RootState) => state.common, shallowEqual);

  const ref = useRef<HTMLButtonElement>(null);

  const today = dayjs().startOf('day');
  const selectedDate = dayjs(common.date);

  const isSameMonth = selectedDate.isSame(today, 'month');

  const startDay = selectedDate.startOf('month');
  const endDay = selectedDate.endOf('month');

  let current = startDay;
  let days: DayFormat[] = [];

  while (current.isBefore(endDay) || current.isSame(endDay)) {
    days.push({
      day: current.format('DD'),
      dayOfWeek: current.format('ddd').toUpperCase(),
      disabled: isSameMonth && current.isAfter(today, 'day'),
    });

    current = current.add(1, 'day');
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedDate]);

  const selectDay = (day: string) => {
    dispatch(
      updateCommon({ date: selectedDate.date(Number(day)).format('YYYYMMDD') }),
    );
  };

  return (
    <Flex
      fullWidth
      style={{
        overflowX: 'scroll',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
      }}
    >
      {days.map((item) => {
        const isSelected = selectedDate.format('DD') === item.day;

        return (
          <Button
            key={item.day}
            ref={isSelected ? ref : null}
            variant={isSelected ? 'contained' : 'text'}
            disabled={item.disabled}
            onClick={() => selectDay(item.day)}
            sx={{ minWidth: 52 }}
          >
            <Flex direction="column" align="center" noGap>
              <Typography
                variant="lg"
                color={isSelected ? 'white' : 'info'}
                sx={{ fontWeight: 'normal' }}
              >
                {item.dayOfWeek}
              </Typography>
              <Typography
                variant="xxxl"
                color={isSelected ? 'white' : 'info'}
                sx={{ lineHeight: 1 }}
              >
                {item.day}
              </Typography>
            </Flex>
          </Button>
        );
      })}
    </Flex>
  );
};
