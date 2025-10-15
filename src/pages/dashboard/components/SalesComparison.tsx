import { Button, Card, CardContent, Divider, Typography } from '@mui/material';
import { Flex } from '@/components/elements/Flex.tsx';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import {
  customErrorColor,
  customInfoColor,
  customSecondaryColor,
  customWarningColor,
} from '@/theme.ts';
import {
  AMOUNT_COUNT_ITEMS,
  type AmountCountType,
  COMPARISON_CATEGORY_ITEMS,
  type ComparisonCategoryType,
} from '@/constants/dashboard.options.ts';
import { useSelector } from 'react-redux';
import type { RootState } from '@/reducers/root.reducer.ts';
import { useSales } from '@/hooks/sales.hook.ts';
import type { ChartItem } from '@/interfaces/dashboard.interface.ts';
import { formatNumber } from '@/utils/format.utils.ts';

const SalesComparison = () => {
  const common = useSelector((state: RootState) => state.common);
  const sales = useSales();
  const comparison = sales.comparison;

  const etcChartRef = useRef(null);
  const saleChartRef = useRef(null);

  const [category, setCategory] = useState<ComparisonCategoryType>(
    COMPARISON_CATEGORY_ITEMS[0].itemId,
  );
  const [option, setOption] = useState<AmountCountType>(
    AMOUNT_COUNT_ITEMS[0].itemId,
  );

  const compName = useMemo(() => {
    return common.category === 'day' ? '일' : '월';
  }, [common.category]);

  const etcChartData: ChartItem[] = comparison[category].etc[option];
  const saleChartData: ChartItem[] = comparison[category].sale[option];

  useEffect(() => {
    if (!etcChartRef.current || etcChartData.length === 0) return;

    const yTickSize = 5;
    const yPerTick = 3;

    const values = etcChartData.map((d) => d.value);
    const [minValue, maxValue] = [Math.min, Math.max].map((fn) =>
      fn(...values),
    );
    const interval =
      maxValue > 0
        ? Math.ceil(
            Math.max(Math.abs(minValue), Math.abs(maxValue)) / yPerTick / 10,
          ) * 10
        : 10;
    const yMin = minValue < 0 ? -Math.ceil(-minValue / interval) * interval : 0;
    const yMax = interval * yTickSize;
    const symbol = Math.ceil(interval * ((yMax - yMin) / interval) * 0.2);

    const chartTitle =
      option === 'amount'
        ? `{title|단위 : ${sales.comparisonUnit[category].etc}원}`
        : '{title|단위 : 건}';

    const chart = echarts.init(etcChartRef.current);
    const chartOption = {
      grid: {
        top: 20,
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
          },
        },
      },
      xAxis: {
        type: 'category',
        data: etcChartData.map((d) => d.name),
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
          data: values.map((v: number, index: number) => ({
            value: v,
            itemStyle: {
              color:
                index === 0 ? customErrorColor.main : customSecondaryColor.main,
              borderRadius: v > 0 ? [6, 6, 0, 0] : [0, 0, 6, 6],
            },
          })),
          barWidth: 20,
          markPoint: {
            symbol:
              'path://M40,0 A40,40 0 1,1 43,80 L43,80 40,87 L37,80 37,80 A40,40 0 1,1 40,0 Z',
            symbolSize: [80, 87],
            data: etcChartData
              .filter((d) => d.rate !== undefined)
              .map((d) => ({
                coord: [d.name, d.value > 0 ? d.value + symbol : symbol],
                value: d.value,
                itemStyle: {
                  color: customSecondaryColor.main,
                },
                label: {
                  formatter: () => {
                    const sign = d.rate && d.rate > 0 ? '+' : '';
                    return `전${compName}대비\n${sign}{percent|${d.rate}}%`;
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
              })),
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
  }, [etcChartData]);

  useEffect(() => {
    if (!saleChartRef.current || saleChartData.length === 0) return;

    const yTickSize = 5;
    const yPerTick = 3;

    const values = saleChartData.map((d) => d.value);
    const [minValue, maxValue] = [Math.min, Math.max].map((fn) =>
      fn(...values),
    );
    const interval =
      maxValue > 0
        ? Math.ceil(
            Math.max(Math.abs(minValue), Math.abs(maxValue)) / yPerTick / 10,
          ) * 10
        : 10;
    const yMin = minValue < 0 ? -Math.ceil(-minValue / interval) * interval : 0;
    const yMax = interval * yTickSize;
    const symbol = Math.ceil(interval * ((yMax - yMin) / interval) * 0.2);

    const chartTitle =
      option === 'amount'
        ? `{title|단위 : ${sales.comparisonUnit[category].sale}원}`
        : '{title|단위 : 건}';

    const chart = echarts.init(saleChartRef.current);
    const chartOption = {
      grid: {
        top: 20,
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
          },
        },
      },
      xAxis: {
        type: 'category',
        data: saleChartData.map((d) => d.name),
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
          data: values.map((v: number, index: number) => ({
            value: v,
            itemStyle: {
              color:
                index === 0 ? customErrorColor.main : customWarningColor.main,
              borderRadius: v > 0 ? [6, 6, 0, 0] : [0, 0, 6, 6],
            },
          })),
          barWidth: 20,
          markPoint: {
            symbol:
              'path://M40,0 A40,40 0 1,1 43,80 L43,80 40,87 L37,80 37,80 A40,40 0 1,1 40,0 Z',
            symbolSize: [80, 87],
            data: saleChartData
              .filter((d) => d.rate !== undefined)
              .map((d) => ({
                coord: [d.name, d.value > 0 ? d.value + symbol : symbol],
                value: d.value,
                itemStyle: {
                  color: customWarningColor.main,
                },
                label: {
                  formatter: () => {
                    const sign = d.rate && d.rate > 0 ? '+' : '';
                    return `전${compName}대비\n${sign}{percent|${d.rate}}%`;
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
              })),
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
  }, [saleChartData]);

  return (
    <Card id="chart-comparison">
      <CardContent>
        <Flex direction="column">
          <Flex justify="space-between">
            <Typography variant="xxl" color="primary">
              매출 비교
            </Typography>
            <Flex>
              {AMOUNT_COUNT_ITEMS.map((item, index) => (
                <Fragment key={`comparison.option.${item.itemId}`}>
                  <Button
                    size="smallFit"
                    color={item.itemId === option ? 'primary' : 'info'}
                    disableTouchRipple
                    onClick={() => setOption(item.itemId)}
                  >
                    {item.itemName}
                  </Button>
                  {index < AMOUNT_COUNT_ITEMS.length - 1 && (
                    <Divider orientation="vertical" />
                  )}
                </Fragment>
              ))}
            </Flex>
          </Flex>

          <Flex noGap className="category-container">
            {COMPARISON_CATEGORY_ITEMS.map((item) => (
              <Button
                key={`comparison.category.${item.itemId}`}
                variant={item.itemId === category ? 'contained' : 'text'}
                size="smallPill"
                color={item.itemId === category ? 'primary' : 'info'}
                fullWidth
                onClick={() => setCategory(item.itemId)}
              >
                {item.itemName}
              </Button>
            ))}
          </Flex>

          <Typography variant="lg" color="primary">
            조제
          </Typography>

          <div ref={etcChartRef} style={{ width: '100%', height: '300px' }} />

          <Flex direction="column" className="space-wrapper">
            <Flex justify="space-between" align="center">
              <Typography variant="lg" color="secondary">
                {category === 'date' ? `당${compName}` : 'MY'}
              </Typography>
              <Typography variant="xl" color="secondary">
                {formatNumber(sales.etc.now[option])}
                {option === 'amount' ? '원' : '건'}
              </Typography>
            </Flex>
            <Divider />
            <Flex justify="space-between" align="center">
              <Typography variant="lg" color="info">
                {category === 'date'
                  ? `전${compName}`
                  : category === 'pharm'
                    ? '지부'
                    : '분회'}
              </Typography>
              <Typography variant="xl" color="info">
                {formatNumber(sales.comparisonItem[category].etc[option])}
                {option === 'amount' ? '원' : '건'}
              </Typography>
            </Flex>
          </Flex>

          <Typography variant="lg" color="primary">
            판매
          </Typography>

          <div ref={saleChartRef} style={{ width: '100%', height: '300px' }} />

          <Flex direction="column" className="space-wrapper">
            <Flex justify="space-between" align="center">
              <Typography variant="lg" color="warning">
                {category === 'date' ? `당${compName}` : 'MY'}
              </Typography>
              <Typography variant="xl" color="warning">
                {formatNumber(sales.sale.now[option])}
                {option === 'amount' ? '원' : '건'}
              </Typography>
            </Flex>
            <Divider />
            <Flex justify="space-between" align="center">
              <Typography variant="lg" color="info">
                {category === 'date'
                  ? `전${compName}`
                  : category === 'pharm'
                    ? '지부'
                    : '분회'}
              </Typography>
              <Typography variant="xl" color="info">
                {formatNumber(sales.comparisonItem[category].sale[option])}
                {option === 'amount' ? '원' : '건'}
              </Typography>
            </Flex>
          </Flex>
        </Flex>
      </CardContent>
    </Card>
  );
};

export default SalesComparison;
