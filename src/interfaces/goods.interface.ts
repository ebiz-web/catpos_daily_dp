// A : 통합 / U : 5,000원 이상 / D: 5,000원 미만
export type AmtType = 'A' | 'U' | 'D';

// 전일/전월 상품 판매량 순위 조회
export interface GoodsResponse {
  NO: number; // 순번
  GDS_CODE: string; // 상품코드
  GDS_NAME: string; // 상품명
  MAK_NAME: string; // 제조사명
  STOCK: number; // 재고
  SAMT: number; // 평균 판매가
  BAMT: number; // 구입가 합
  SLE_QTY: number; // 판매수량
  SLE_AMT: number; // 판매금액
  DISC_AMT: number; // 할인금액
  MAMT: number; // 순이익
  MAMT_PER: number; // 순이익률
}

// 지부/분회 급등 상품 판매량 순위 조회
export interface HotGoodsResponse {
  NO: number; // 순번
  GDS_CODE: string; // 상품코드
  GDS_NAME: string; // 	상품명
  MAK_NAME: string; // 	제조사명
  FROM_QTY: number; // 이전수량
  TO_QTY: number; // 이후수량
  DIFF_QTY: number; // 차이수량
  SAMT: number; // 평균판매가
}

// 부족 재고 목록 조회
export interface StockResponse {
  NO: number; // 순번
  GDS_CODE: string; // 상품코드
  GDS_NAME: string; // 	상품명
  MAK_NAME: string; // 	제조사명
  STK: number; // 재고
  STK_BAMT: number; // 재고 구입금액
  STK_SAMT: number; // 재고 판매금액
  STK_AMT: number; // 재고 금액
  GDS_POSITION: string; // 상품 위치(메모)
}
