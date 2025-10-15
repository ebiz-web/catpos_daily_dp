import { Button, Card, CardContent, Divider, Typography } from '@mui/material';
import { Flex } from '@/components/elements/Flex.tsx';
import { Fragment } from 'react';
import Pagination from '@/components/elements/Pagination.tsx';
import { UPJONG_ITEMS } from '@/constants/dashboard.options.ts';
import { useSupplies } from '@/hooks/supplies.hook.ts';
import { formatNumber } from '@/utils/format.utils.ts';
import {
  updateSuppliesPage,
  updateSuppliesUpjong,
} from '@/reducers/supplies.slice.ts';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/stores/store.ts';

const ClientBalance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const supplies = useSupplies();

  return (
    <Card id="chart-client-balance">
      <CardContent>
        <Flex direction="column">
          <Flex justify="space-between">
            <Typography variant="xxl" color="primary">
              거래처 잔액
            </Typography>

            <Flex>
              {UPJONG_ITEMS.map((item, index) => (
                <Fragment key={`client.balance.option.${item.itemId}`}>
                  <Button
                    size="smallFit"
                    color={
                      item.itemId === supplies.condition.SUP_UPJONG
                        ? 'primary'
                        : 'info'
                    }
                    disableTouchRipple
                    onClick={() => dispatch(updateSuppliesUpjong(item.itemId))}
                  >
                    {item.itemName}
                  </Button>
                  {index < UPJONG_ITEMS.length - 1 && (
                    <Divider orientation="vertical" />
                  )}
                </Fragment>
              ))}
            </Flex>
          </Flex>

          <Flex direction="column" className="space-wrapper">
            {supplies.supplies.map((item, index) => (
              <Fragment key={`ClientBalance-${index}`}>
                <Flex justify="space-between" align="center">
                  <Flex direction="column" gap={3}>
                    <Typography variant="xl" sx={{ fontWeight: 'normal' }}>
                      {item.SUP_NAME}
                    </Typography>
                    <Typography variant="lg" color="info">
                      {`[입고건수] ${formatNumber(item.ORD_CNT)}건`}
                    </Typography>
                  </Flex>
                  <Typography variant="xl" sx={{ fontWeight: 'normal' }}>
                    {formatNumber(item.SUP_BLC)}원
                  </Typography>
                </Flex>
                {index < supplies.supplies.length - 1 && <Divider />}
              </Fragment>
            ))}
          </Flex>

          <Pagination
            page={supplies.condition.PAGE}
            total={supplies.count}
            onChange={(page) => dispatch(updateSuppliesPage(page))}
          />
        </Flex>
      </CardContent>
    </Card>
  );
};

export default ClientBalance;
