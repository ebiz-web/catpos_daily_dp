// 전일/전월 판매 조회
export interface SaleResponse {
  SLE_SUM: SaleStats[]; // 판매별 집계
  TRN_LIST: TransStats[]; // 결제구분별 집계
  PB_SUM: BranchAverageStats[]; // 지부분회 평균매출
  SLE_DAY_LIST: SaleCountStats[]; // 일별 판매건수
  SLE_WEEK_LIST: SaleWeekStats[]; // 요일별 판매현황
}

// 판매별 집계
export interface SaleStats {
  TRANDATE?: string; // 결제일
  TRANYYMM?: string; // 결제월
  SLECNT: number; // 판매건수
  ETCCNT: number; // 조제건수
  ETCAMT: number; // 조제금액
  OTCCNT: number; // 일반건수
  OTCAMT: number; // 일반금액
  DISCAMT: number; // 할인금액
  SUB_MAMT: number; // 상품 매출이익 (할인금액 포함)
  SUB_SMAMT: number; // 상품 순이익 (할인금액 제외)
}

// 결제 구분별 집계
export interface TransStats {
  NO: number; // 순번
  TRANGUBN: string; // 결제구분
  TRANGUBN_NAME: string; // 결제구분명
  TRANCNT: number; // 결제건수
  TRANAMT: number; // 결제금액
  ETCCNT: number; // 조제건수
  ETCAMT: number; // 조제금액
  OTCCNT: number; // 일반건수
  OTCAMT: number; // 일반금액
}

// 지부/분회 평균 매출
export interface BranchAverageStats {
  PHARM_CODE: string; // 지부코드
  PHARM_NAME: string; // 지부명
  BRANCH_CODE: string; // 분회코드
  BRANCH_NAME: string; // 분회명
  AVG_ETCCNT: number; // 조제건수 평균
  AVG_ETCAMT: number; // 조제금액 평균
  AVG_OTCCNT: number; // 일반건수 평균
  AVG_OTCAMT: number; // 일반금액 평균
}

// 일별 판매 건수
export interface SaleCountStats {
  TRANDATE: string; // 결제일자
  SLECNT: number; // 판매건수
}

// 요일별 판매 현황
export interface SaleWeekStats {
  TRANDAY: string; // 결제일자
  SLECNT: number; // 판매건수
  ETCCNT: number; // 조제건수
  ETCAMT: number; // 조제금액
  OTCCNT: number; // 일반건수
  OTCAMT: number; // 일반금액
  DISCAMT: number; // 할인금액
  SUBQTY: number; // 상품수량
  SUBAMT: number; // 상품금액
}
