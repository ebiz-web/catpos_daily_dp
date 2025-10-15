import { Flex } from '@/components/elements/Flex.tsx';
import { Card, CardContent, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { customErrorColor, customInfoColor } from '@/theme.ts';
import { formatNumber } from '@/utils/format.utils.ts';
import { useSales } from '@/hooks/sales.hook.ts';
import { UNIT_TEN_THOUSAND } from '@/constants/dashboard.options.ts';

interface ChartItem {
  name: string;
  value: number;
}

const FocusSalesStatus = () => {
  const data = useSales().week;

  const chartRef = useRef(null);

  const chartData: ChartItem[] = data.map(
    (v) =>
      ({
        name: v.TRANDAY,
        value: Math.ceil(
          (Number(v.OTCAMT) + Number(v.DISCAMT)) / UNIT_TEN_THOUSAND,
        ),
      }) as ChartItem,
  );

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    const yTickSize = 5;
    const yPerTick = 5;

    const maxValue = Math.max(...chartData.map((d) => d.value));
    const interval = Math.ceil(maxValue / yPerTick / 10) * 10;
    const yMax = interval * yTickSize;

    const chart = echarts.init(chartRef.current);

    const chartOption = {
      grid: {
        top: 40,
        bottom: 0,
        left: 0,
        right: 0,
      },
      title: {
        text: '{title|단위 : 만원}   {sales|■} 판매',
        top: 0,
        right: 0,
        textStyle: {
          fontSize: 12,
          rich: {
            title: {
              color: customInfoColor.main,
            },
            sales: {
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
          borderColor: 'white',
          borderWidth: 1,
          borderStyle: 'solid',
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: yMax,
        interval: interval,
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: customInfoColor.main } },
      },
      series: [
        {
          name: '판매',
          type: 'line',
          data: chartData.map((d) => d.value),
          lineStyle: { color: customErrorColor.main, width: 1 },
          symbol: 'circle',
          itemStyle: {
            color: customErrorColor.main,
          },
          label: {
            show: true,
            color: customErrorColor.main,
            fontWeight: 'bold',
            formatter: (params: any) => {
              return formatNumber(params.value);
            },
            position: 'top',
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
    <Card id="chart-focus-sales">
      <CardContent>
        <Flex direction="column">
          <Flex justify="space-between">
            <Typography variant="xxl" color="primary">
              집중매출현황
            </Typography>
          </Flex>

          <div ref={chartRef} style={{ width: '100%', height: '200px' }} />
        </Flex>
      </CardContent>
    </Card>
  );
};

export default FocusSalesStatus;
