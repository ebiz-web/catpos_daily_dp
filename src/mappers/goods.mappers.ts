import type {
  GoodsResponse,
  HotGoodsResponse,
} from '@/interfaces/goods.interface.ts';
import type { GoodItem } from '@/interfaces/dashboard.interface.ts';

export const goodsToDrugRank = (goods: GoodsResponse[]): GoodItem[] => {
  return goods.map((good) => ({
    name: good.GDS_NAME,
    make: good.MAK_NAME,
    stock: good.STOCK,
    buy: good.BAMT,
    sale: good.SLE_AMT,
    avg: good.SAMT,
    count: good.SLE_QTY,
  }));
};

export const hotGoodsToDrugRank = (goods: HotGoodsResponse[]): GoodItem[] => {
  return goods.map((good) => ({
    name: good.GDS_NAME,
    make: good.MAK_NAME,
    stock: good.TO_QTY,
    buy: good.SAMT,
    sale: good.SAMT,
    avg: good.SAMT,
    count: good.TO_QTY,
  }));
};
