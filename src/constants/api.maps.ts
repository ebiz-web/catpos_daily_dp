export const API_MAP = {
  sale: {
    // 전일 판매 조회
    day: { method: 'GET', url: 'report/sale/day' },
    // 전월 판매 조회
    mon: { method: 'GET', url: 'report/sale/mon' },
  },
  goods: {
    // 전일 상품판매량 순위 조회
    day: { method: 'GET', url: 'report/goods/day' },
    // 전월 상품판매량 순위 조회
    mon: { method: 'GET', url: 'report/goods/mon' },
  },
  hotGoods: {
    // 지부 급등상품 판매량 순위 조회
    pharm: { method: 'GET', url: 'report/hotgoods/pharm' },
    // 분회 급등상품 판매량 순위 조회
    branch: { method: 'GET', url: 'report/hotgoods/branch' },
  },
  // 부족 재고 목록 조회
  stock: { method: 'GET', url: 'report/stock' },
  order: {
    // 전일 입고 상품 목록 조회
    day: { method: 'GET', url: 'report/order/day' },
    // 전월 입고 상품 목록 조회
    mon: { method: 'GET', url: 'report/order/mon' },
  },
  // 거래처 목록 조회
  supplies: { method: 'GET', url: 'report/supplies' },
};
