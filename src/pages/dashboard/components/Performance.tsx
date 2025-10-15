import { Button, Card, CardContent, Divider, Typography } from '@mui/material';
import { Flex } from '@/components/elements/Flex.tsx';
import * as echarts from 'echarts';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  customErrorColor,
  customInfoColor,
  customSecondaryColor,
} from '@/theme.ts';
import {
  AMOUNT_COUNT_ITEMS,
  type AmountCountType,
  PERFORMANCE_CATEGORY_ITEMS,
  type PerformanceCategoryType,
} from '@/constants/dashboard.options.ts';
import { useSales } from '@/hooks/sales.hook.ts';
import { formatNumber } from '@/utils/format.utils.ts';
import { type ChartItem } from '@/interfaces/dashboard.interface.ts';
import { useSelector } from 'react-redux';
import type { RootState } from '@/reducers/root.reducer.ts';
import { IconArrow } from '@/assets/icons/IconArrow.tsx';

const Performance = () => {
  const common = useSelector((state: RootState) => state.common);
  const sales = useSales();
  const performance = sales.performance;

  const [category, setCategory] = useState<PerformanceCategoryType>(
    PERFORMANCE_CATEGORY_ITEMS[0].itemId,
  );
  const [option, setOption] = useState<AmountCountType>(
    AMOUNT_COUNT_ITEMS[0].itemId,
  );
  const [open, setOpen] = useState<boolean>(false);

  const compName = useMemo(() => {
    return common.category === 'day' ? '일' : '월';
  }, [common.category]);

  const chartRef = useRef(null);
  const chartData: ChartItem[] =
    category === 'profit' ? performance.profit : performance[category][option];

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    const yTickSize = 5;
    const yPerTick = 3;

    const values = chartData.map((d) => d.value);
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
      category === 'profit'
        ? '{title|금액기준}'
        : option === 'amount'
          ? `{title|단위 : ${sales.performanceUnit[category]}원}`
          : '{title|단위 : 건}';

    const chart = echarts.init(chartRef.current);
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
          data: chartData.map((d) => ({
            value: d.value,
            itemStyle: {
              color:
                d.rate && d.rate < 0
                  ? customErrorColor.main
                  : customSecondaryColor.main,
              borderRadius: d.value > 0 ? [6, 6, 0, 0] : [0, 0, 6, 6],
            },
          })),
          barWidth: 20,
          markPoint: {
            symbol:
              'path://M40,0 A40,40 0 1,1 43,80 L43,80 40,87 L37,80 37,80 A40,40 0 1,1 40,0 Z',
            symbolSize: [80, 87],
            data: chartData
              .filter((d) => d.rate !== undefined)
              .map((d) => ({
                coord: [d.name, d.value > 0 ? d.value + symbol : symbol],
                value: d.value,
                itemStyle: {
                  color: `${d.rate && d.rate < 0 ? customErrorColor.main : customSecondaryColor.main}`,
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
  }, [chartData]);

  const handleCategory = (selected: PerformanceCategoryType) => {
    if (category === 'profit') {
      setOption('amount');
    }

    setCategory(selected);
  };

  return (
    <Card id="chart-performance">
      <CardContent>
        <Flex direction="column">
          <Flex justify="space-between">
            <Typography variant="xxl" color="primary">
              실적통계
            </Typography>
            {category !== 'profit' && (
              <Flex>
                {AMOUNT_COUNT_ITEMS.map((item, index) => (
                  <Fragment key={`performance.option.${item.itemId}`}>
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
            )}
          </Flex>
          <Flex noGap className="category-container">
            {PERFORMANCE_CATEGORY_ITEMS.map((item) => (
              <Button
                key={`performance.category.${item.itemId}`}
                variant={item.itemId === category ? 'contained' : 'text'}
                size="smallPill"
                color={item.itemId === category ? 'primary' : 'info'}
                fullWidth
                onClick={() => handleCategory(item.itemId)}
              >
                {item.itemName}
              </Button>
            ))}
          </Flex>
          <Flex direction="column" className="space-wrapper">
            <Flex justify="space-between" align="center">
              <Typography variant="lg" color="primary">
                당{compName}
              </Typography>
              <Typography variant="xl" color="primary">
                {category === 'profit' ? (
                  <>{formatNumber(sales.profit.now)}원</>
                ) : (
                  <>
                    {option === 'amount'
                      ? formatNumber(sales[category].now.amount) + '원'
                      : formatNumber(sales[category].now.count) + '건'}
                  </>
                )}
              </Typography>
            </Flex>
            <Divider />
            <Flex justify="space-between" align="center">
              <Typography variant="lg" color="info">
                전{compName}
              </Typography>
              <Typography variant="xl" color="info">
                {category === 'profit' ? (
                  <>{formatNumber(sales.profit.prev)}원</>
                ) : (
                  <>
                    {option === 'amount'
                      ? formatNumber(sales[category].prev.amount) + '원'
                      : formatNumber(sales[category].prev.count) + '건'}
                  </>
                )}
              </Typography>
            </Flex>
          </Flex>

          <div ref={chartRef} style={{ width: '100%', height: '300px' }} />

          <Flex direction="column" className="space-wrapper">
            {sales.sale && (
              <>
                {category === 'profit' ? (
                  <>
                    <Flex justify="space-between" align="center">
                      <Typography variant="lg" color="secondary">
                        판매마진
                      </Typography>
                      <Typography variant="xl" color="secondary">
                        {option === 'amount'
                          ? formatNumber(sales.sale.now.amount) + '원'
                          : formatNumber(sales.sale.now.count) + '건'}
                      </Typography>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between" align="center">
                      <Typography variant="lg" color="error">
                        조제실적
                      </Typography>
                      <Typography variant="xl" color="error">
                        {option === 'amount'
                          ? formatNumber(sales.etc.now.amount) + '원'
                          : formatNumber(sales.etc.now.count) + '건'}
                      </Typography>
                    </Flex>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={() => setOpen(!open)}
                      sx={{
                        backgroundColor: open
                          ? customInfoColor.light
                          : 'transparent',
                      }}
                    >
                      <Flex direction="column" fullWidth>
                        <Flex justify="center" align="center">
                          <Typography variant="md" sx={{ color: 'black' }}>
                            결제 수단별 금액보기
                          </Typography>
                          <Flex style={{ position: 'absolute', right: 5 }}>
                            <IconArrow size={24} rotate={open ? 90 : -90} />
                          </Flex>
                        </Flex>
                        {open && (
                          <>
                            {sales.trans.map((trans, index) => (
                              <Flex
                                key={`trans.${index}`}
                                justify="space-between"
                              >
                                <Typography
                                  variant="sm"
                                  sx={{ color: 'black' }}
                                >{`${trans.name} (${option === 'amount' ? trans[category].amountRate : trans[category].countRate}%)`}</Typography>
                                <Typography
                                  variant="sm"
                                  sx={{ color: 'black' }}
                                >
                                  {option === 'amount'
                                    ? formatNumber(trans[category].amount) +
                                      '원'
                                    : formatNumber(trans[category].count) +
                                      '건'}
                                </Typography>
                              </Flex>
                            ))}
                          </>
                        )}
                      </Flex>
                    </Button>
                  </>
                )}
              </>
            )}
          </Flex>

          {category === 'profit' && (
            <Typography variant="xs" sx={{ color: 'red', textAlign: 'center' }}>
              ※ 순이익은 실제 결산 금액과 다를 수 있습니다.
            </Typography>
          )}
        </Flex>
      </CardContent>
    </Card>
  );
};

export default Performance;
