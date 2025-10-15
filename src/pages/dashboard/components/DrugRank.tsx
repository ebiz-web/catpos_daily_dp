import {
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Flex } from '@/components/elements/Flex.tsx';
import { Fragment, useEffect, useState } from 'react';
import gold from '@/assets/images/gold.png';
import silver from '@/assets/images/silver.png';
import bronze from '@/assets/images/bronze.png';
import Pagination from '@/components/elements/Pagination.tsx';
import {
  BRANCH_OPTION_ITEMS,
  type BranchOptionType,
  RANK_CATEGORY_ITEMS,
  type RankCategoryType,
} from '@/constants/dashboard.options.ts';
import { useGoods } from '@/hooks/goods.hook.ts';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/stores/store.ts';
import { formatNumber } from '@/utils/format.utils.ts';
import { updateGoodsPage } from '@/reducers/goods.slice.ts';
import { initPage } from '@/interfaces/common.interface.ts';
import { useHotGoods } from '@/hooks/hotGoods.hook.ts';
import { updateHotGoodsPage } from '@/reducers/hot.goods.slice.ts';

const DrugRank = () => {
  const [category, setCategory] = useState<RankCategoryType>(
    RANK_CATEGORY_ITEMS[0].itemId,
  );
  const [option, setOption] = useState<BranchOptionType>(
    BRANCH_OPTION_ITEMS[0].itemId,
  );

  const dispatch = useDispatch<AppDispatch>();
  const goods = useGoods();
  const hotGoods = useHotGoods();

  /*
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<GoodItem | null>(null);
   */

  const drugRank = category === 'sale' ? goods.goods : hotGoods[option];
  const condition = category === 'sale' ? goods.condition : hotGoods.condition;

  /*
  const handleOpen = (item: GoodItem) => {
    setOpen(true);
    setSelected(item);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };
   */

  const handleCondition = (page: number) => {
    if (condition.PAGE != page) {
      if (category === 'sale') {
        dispatch(updateGoodsPage(page));
      } else {
        dispatch(updateHotGoodsPage(page));
      }
    }
  };

  useEffect(() => {
    handleCondition(initPage.PAGE);
  }, [category, option]);

  return (
    <>
      <Card id="chart-drug-rank">
        <CardContent>
          <Flex direction="column">
            <Flex justify="space-between" align="center">
              <Typography variant="xxl" color="primary">
                약품 순위
              </Typography>

              {category === 'latest' && (
                <Select
                  displayEmpty
                  value={option}
                  onChange={(e) => setOption(e.target.value)}
                >
                  {BRANCH_OPTION_ITEMS.map((item) => (
                    <MenuItem
                      key={item.itemId}
                      value={item.itemId}
                      selected={option === item.itemId}
                    >
                      <Typography variant="sm">{item.itemName}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Flex>

            <Flex noGap className="category-container">
              {RANK_CATEGORY_ITEMS.map((item, index) => (
                <Button
                  key={`drug-rank.category.${index}`}
                  variant={category === item.itemId ? 'contained' : 'text'}
                  size="smallPill"
                  color={category === item.itemId ? 'primary' : 'info'}
                  fullWidth
                  onClick={() => setCategory(item.itemId)}
                >
                  {item.itemName}
                </Button>
              ))}
            </Flex>

            <Flex direction="column" noGap>
              {drugRank.items.map((item, index) => {
                const no = (condition.PAGE - 1) * initPage.RCNT + index + 1;
                return (
                  <Fragment key={`DrugRank-${no}`}>
                    <Flex
                      justify="space-between"
                      align="center"
                      fullWidth
                      style={{ padding: '10px 0' }}
                    >
                      <Flex gap={5}>
                        <Flex
                          justify="center"
                          align="center"
                          style={{ minWidth: 32 }}
                        >
                          {no === 1 ? (
                            <img src={gold} width={32} height={32} alt="gold" />
                          ) : no === 2 ? (
                            <img
                              src={silver}
                              width={32}
                              height={32}
                              alt="silver"
                            />
                          ) : no === 3 ? (
                            <img
                              src={bronze}
                              width={32}
                              height={32}
                              alt="bronze"
                            />
                          ) : (
                            <Typography variant="xxl" color="info">
                              {no}
                            </Typography>
                          )}
                        </Flex>
                        <Flex direction="column" align="start" gap={3}>
                          <Typography
                            variant="xl"
                            color={`${no < 3 ? 'primary' : ''}`}
                            textAlign="left"
                            sx={{ fontWeight: `${no >= 3 ? 'normal' : ''}` }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            variant="lg"
                            color="info"
                            textAlign="left"
                          >
                            {formatNumber(item.avg)}원
                          </Typography>
                        </Flex>
                      </Flex>
                      <Typography
                        variant="xl"
                        noWrap
                        color={`${no < 3 ? 'primary' : ''}`}
                        sx={{ fontWeight: `${no >= 3 ? 'normal' : ''}` }}
                      >
                        {formatNumber(item.count)}건
                      </Typography>
                    </Flex>
                    {index < drugRank.items.length - 1 && <Divider />}
                  </Fragment>
                );
              })}
            </Flex>

            <Pagination
              page={condition.PAGE}
              total={drugRank.total}
              onChange={(page) => handleCondition(page)}
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
              backgroundColor: customPrimaryColor.main,
              padding: '10px 10px 10px 20px',
            }}
          >
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: 'white' }}>
              약품 상세
            </Typography>
            <IconButton sx={{ padding: 'unset' }} onClick={handleClose}>
              <IconClose />
            </IconButton>
          </Flex>
          <Flex direction="column" style={{ padding: '15px 20px' }}>
            <Typography variant="lg" sx={{ fontWeight: 800 }}>
              {selected?.name}
            </Typography>
            <Typography>· 제조사 : {selected?.make}</Typography>
            {category === 'sale' ? (
              <>
                <Typography>
                  · 구입가 : {formatNumber(selected?.buy ?? 0)}원
                </Typography>
                <Typography>
                  · 판매가 : {formatNumber(selected?.sale ?? 0)}원
                </Typography>
              </>
            ) : (
              <>
                <Typography>
                  · [평균 판매가] : {formatNumber(selected?.avg ?? 0)}원
                </Typography>
              </>
            )}
            <Typography sx={{ fontWeight: 'bold' }}>
              · 재고 : {formatNumber(selected?.stock ?? 0)}개
            </Typography>
          </Flex>
        </Card>
      </Modal>
      */}
    </>
  );
};

export default DrugRank;
