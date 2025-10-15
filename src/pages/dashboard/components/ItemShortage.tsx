import { Card, CardContent, Divider, Typography } from '@mui/material';
import { Flex } from '@/components/elements/Flex.tsx';
import { Fragment } from 'react';
import Pagination from '@/components/elements/Pagination.tsx';
import { useStock } from '@/hooks/stock.hook.ts';
import { formatNumber } from '@/utils/format.utils.ts';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/stores/store.ts';
import { updateStockPage } from '@/reducers/stock.slice.ts';

const ItemShortage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const data = useStock();
  /*
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<StockResponse | null>(null);

  const handleOpen = (item: StockResponse) => {
    setOpen(true);
    setSelected(item);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };
   */

  return (
    <>
      <Card
        id="chart-item-shortage"
        sx={{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'error.main',
        }}
      >
        <CardContent>
          <Flex direction="column">
            <Typography variant="xxl" color="error">
              재고 부족 주의 ({formatNumber(data.count)}건)
            </Typography>

            <Flex direction="column" noGap>
              {data.stock.map((item, index) => (
                <Fragment key={`ItemShortage-${index}`}>
                  <Flex
                    justify="space-between"
                    align="center"
                    fullWidth
                    style={{ padding: '10px 0' }}
                  >
                    <Flex direction="column" align="start" gap={3}>
                      <Typography variant="xl" sx={{ fontWeight: 'normal' }}>
                        {item.GDS_NAME}
                      </Typography>
                      <Typography variant="lg" color="info">
                        {formatNumber(item.STK_SAMT)}원
                      </Typography>
                    </Flex>
                    <Typography variant="xl" sx={{ fontWeight: 'normal' }}>
                      {item.STK}개
                    </Typography>
                  </Flex>
                  {index < data.stock.length - 1 && <Divider />}
                </Fragment>
              ))}
            </Flex>

            <Pagination
              page={data.condition.PAGE}
              total={data.count}
              onChange={(page) => dispatch(updateStockPage(page))}
            />
          </Flex>
        </CardContent>
      </Card>

      {/*
      <Modal open={open} onClose={handleClose}>
        <Card
          sx={{
            width: 'calc(100% - 40px)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '20px',
          }}
        >
          <Flex
            justify="space-between"
            align="center"
            style={{
              backgroundColor: customErrorColor.main,
              padding: '10px 10px 10px 20px',
            }}
          >
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: 'white' }}>
              재고 부족
            </Typography>
            <IconButton sx={{ padding: 'unset' }} onClick={handleClose}>
              <IconClose />
            </IconButton>
          </Flex>
          <Flex direction="column" style={{ padding: '15px 20px' }}>
            <Typography variant="lg" sx={{ fontWeight: 800 }}>
              {selected?.GDS_NAME}
            </Typography>
            <Typography>· 제조사 : {selected?.MAK_NAME}</Typography>
            <Typography>
              · 구입가 : {formatNumber(selected?.STK_BAMT ?? 0)}원
            </Typography>
            <Typography>
              · 판매가 : {formatNumber(selected?.STK_SAMT ?? 0)}원
            </Typography>
            <Typography color="error" sx={{ fontWeight: 'bold' }}>
              · 재고 : {formatNumber(selected?.STK ?? 0)}개
            </Typography>
          </Flex>
        </Card>
      </Modal>
      */}
    </>
  );
};

export default ItemShortage;
