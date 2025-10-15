import { Flex } from '@/components/elements/Flex.tsx';
import { Button, Card, CardContent, Divider, Typography } from '@mui/material';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import {
  customErrorColor,
  customInfoColor,
  customSecondaryColor,
} from '@/theme.ts';
import {
  AMOUNT_QUANTITY_ITEMS,
  type AmountQuantityType,
  UNIT_MILLION,
} from '@/constants/dashboard.options.ts';
import { useOrder } from '@/hooks/order.hook.ts';
import dayjs from 'dayjs';
import { calcUnit } from '@/utils/calculate.utils.ts';

interface ChartItem {
  name: string;
  inValue: number;
  outValue: number;
}

const CHUNK_SIZE = 8;

const InOutStatus = () => {
  const data = useOrder();

  const [option, setOption] = useState<AmountQuantityType>(
    AMOUNT_QUANTITY_ITEMS[0].itemId,
  );

  const chartRef = useRef(null);
  const chartData = useMemo<ChartItem[]>(() => {
    const orders = data.order ?? [];
    if (orders.length === 0) return [];

    const result: ChartItem[] = [];

    for (let i = 0; i < orders.length; i += CHUNK_SIZE) {
      const chunk = orders.slice(i, i + CHUNK_SIZE);
      if (chunk.length === 0) continue;
      const startDate = dayjs(chunk[0].INDATE).format('MM.DD');
      const endDate = dayjs(chunk[chunk.length - 1].INDATE).format('DD');

      const title =
        i === 0 || i + CHUNK_SIZE >= orders.length
          ? ''
          : `${startDate}~${endDate}`;

      const item: ChartItem = {
        name: title,
        inValue: 0,
        outValue: 0,
      };

      chunk.forEach((order) => {
        if (option === 'amount') {
          item.inValue += Number(order.ORD_P_AMT ?? 0);
          item.outValue += Number(order.ORD_M_AMT ?? 0);
        } else {
          item.inValue += Number(order.ORD_P_CNT ?? 0);
          item.outValue += Number(order.ORD_M_CNT ?? 0);
        }
      });

      if (option === 'amount') {
        item.inValue = calcUnit(item.inValue, UNIT_MILLION);
        item.outValue = calcUnit(item.outValue, UNIT_MILLION);
      }

      result.push(item);
    }

    return result;
  }, [data.order, option]);

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    const yTickSize = 5;
    const yPerTick = 5;

    const values = chartData.flatMap((d) => [d.inValue, d.outValue]);

    const [minValue, maxValue] = [Math.min, Math.max].map((fn) =>
      fn(...values),
    );
    const interval =
      Math.ceil(
        Math.max(Math.abs(minValue), Math.abs(maxValue)) / yPerTick / 10,
      ) * 10;
    const yMin = minValue < 0 ? -Math.ceil(-minValue / interval) * interval : 0;
    const yMax = interval * yTickSize;

    const chartTitle =
      option === 'amount'
        ? '{title|단위 : 백만원}   {in|■} 입고   {out|■} 출고'
        : '{title|단위 : 건}   {in|■} 입고   {out|■} 출고';
    const chart = echarts.init(chartRef.current);
    const chartOption = {
      grid: {
        top: 40,
        bottom: 0,
        left: 0,
        right: 0,
      },
      title: {
        text: chartTitle,
        top: 0,
        right: 0,
        textStyle: {
          fontSize: 12,
          rich: {
            title: {
              color: customInfoColor.main,
            },
            in: {
              color: customSecondaryColor.main,
            },
            out: {
              color: customErrorColor.main,
            },
          },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.map((d) => d.name),
        axisTick: { show: false },
        axisLine: { lineStyle: { color: customInfoColor.main } },
        axisLabel: {
          fontWeight: 'bold',
          color: 'black',
        },
      },
      yAxis: {
        scale: true,
        interval: interval,
        type: 'value',
        min: yMin,
        max: yMax,
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: customInfoColor.main } },
      },
      series: [
        {
          name: '입고',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: chartData.map((d) => d.inValue),
          lineStyle: { color: customSecondaryColor.main },
        },
        {
          name: '출고',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: chartData.map((d) => d.outValue),
          lineStyle: { color: customErrorColor.main },
        },
      ],
    };

    chart.setOption(chartOption);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [chartData]);

  return (
    <Card id="chart-inout-status">
      <CardContent>
        <Flex direction="column">
          <Flex justify="space-between">
            <Typography variant="xxl" color="primary">
              입출고현황
            </Typography>
            <Flex>
              {AMOUNT_QUANTITY_ITEMS.map((item, index) => (
                <Fragment key={`inout.option.${item.itemId}`}>
                  <Button
                    size="smallFit"
                    color={item.itemId === option ? 'primary' : 'info'}
                    disableTouchRipple
                    onClick={() => setOption(item.itemId)}
                  >
                    {item.itemName}
                  </Button>
                  {index < AMOUNT_QUANTITY_ITEMS.length - 1 && (
                    <Divider orientation="vertical" />
                  )}
                </Fragment>
              ))}
            </Flex>
          </Flex>

          <div ref={chartRef} style={{ width: '100%', height: '250px' }} />
        </Flex>
      </CardContent>
    </Card>
  );
};

export default InOutStatus;
