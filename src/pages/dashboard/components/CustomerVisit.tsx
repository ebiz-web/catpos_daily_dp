import { Card, CardContent, Typography } from '@mui/material';
import { Flex } from '@/components/elements/Flex.tsx';
import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import {
  customErrorColor,
  customInfoColor,
  customSecondaryColor,
} from '@/theme.ts';
import { formatNumber } from '@/utils/format.utils.ts';
import { useSales } from '@/hooks/sales.hook.ts';
import dayjs from 'dayjs';
import { UNIT_HUNDRED } from '@/constants/dashboard.options.ts';
import { calcAutoUnit, calcUnit } from '@/utils/calculate.utils.ts';

interface ChartItem {
  name: string;
  value: number;
}

const getBarColor = (v: number, minValue: number, maxValue: number) => {
  if (v === maxValue) return customSecondaryColor.main;
  if (v === minValue) return customErrorColor.main;
  return customInfoColor.main;
};

const CustomerVisit = () => {
  const data = useSales().day;
  const chartRef = useRef(null);

  const chartData = useMemo<ChartItem[]>(() => {
    if (data.length === 0) return [];

    let result: ChartItem[] = [];

    if (data.length <= 7) {
      return data.map((item) => ({
        name: dayjs(item.TRANDATE).format('MM.DD'),
        value: Number(item.SLECNT ?? 0),
      }));
    }

    const chunkSize = 8;

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const startDate = dayjs(chunk[0].TRANDATE).format('MM.DD');
      const endDate = dayjs(chunk[chunk.length - 1].TRANDATE).format('DD');

      result.push({
        name: `${startDate}~${endDate}`,
        value: chunk.reduce((sum, sale) => sum + Number(sale.SLECNT ?? 0), 0),
      });
    }

    return result;
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    const unit = calcAutoUnit({
      values: chartData.map((i) => i.value),
      baseUnit: UNIT_HUNDRED,
      count: true,
    });

    const yTickSize = 5;
    const yPerTick = 3;

    const values = chartData.map((d) => calcUnit(d.value, unit.value));
    const [minValue, maxValue] = [Math.min, Math.max].map((fn) =>
      fn(...values),
    );
    const interval =
      Math.ceil(
        Math.max(Math.abs(minValue), Math.abs(maxValue)) / yPerTick / 10,
      ) * 10;
    const yMin = minValue < 0 ? -Math.ceil(-minValue / interval) * interval : 0;
    const yMax = interval * yTickSize;
    const symbol = Math.ceil(interval * ((yMax - yMin) / interval) * 0.2);

    const minItem = chartData.reduce(
      (acc, cur) => (cur.value < acc.value ? cur : acc),
      chartData.length === 7 ? chartData[0] : chartData[1],
    );

    const chart = echarts.init(chartRef.current);
    const chartOption = {
      grid: {
        top: 40,
        bottom: 0,
        left: 0,
        right: 10,
      },
      title: {
        text: `{title|단위 : ${unit.name}명}   {max|■} 최다방문   {min|■} 최저방문`,
        top: 0,
        right: 0,
        textStyle: {
          fontSize: 12,
          rich: {
            title: {
              color: customInfoColor.main,
            },
            max: {
              color: customSecondaryColor.main,
            },
            min: {
              color: customErrorColor.main,
            },
          },
        },
      },
      xAxis: {
        type: 'category',
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
        type: 'value',
        min: yMin,
        max: yMax,
        interval: interval,
      },
      series: [
        {
          type: 'bar',
          data: values.map((v: number) => ({
            value: v,
            itemStyle: {
              color: getBarColor(v, minValue, maxValue),
              borderRadius: v > 0 ? [6, 6, 0, 0] : [0, 0, 6, 6],
            },
          })),
          barWidth: 20,
          markPoint: {
            symbol:
              'path://M40,0 A40,40 0 1,1 43,80 L43,80 40,87 L37,80 37,80 A40,40 0 1,1 40,0 Z',
            symbolSize: [80, 87],
            data: minItem
              ? [
                  {
                    coord: [
                      minItem.name,
                      minItem.value > 0
                        ? calcUnit(minItem.value, unit.value) + symbol
                        : symbol,
                    ],
                    value: minItem.value,
                    itemStyle: {
                      color: getBarColor(
                        calcUnit(minItem.value, unit.value),
                        minValue,
                        maxValue,
                      ),
                    },
                    label: {
                      formatter: (param: any) => {
                        return `최저방문\n{percent|${formatNumber(param.value)}}명`;
                      },
                      rich: {
                        percent: {
                          fontSize: 20,
                          fontWeight: 900,
                        },
                      },
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 'bold',
                      lineHeight: 18,
                      offset: [0, -3],
                    },
                  },
                ]
              : [],
          },
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
    <Card id="chart-customer-visit">
      <CardContent>
        <Flex direction="column">
          <Typography variant="xxl" color="primary">
            고객 방문
          </Typography>

          <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
        </Flex>
      </CardContent>
    </Card>
  );
};

export default CustomerVisit;
