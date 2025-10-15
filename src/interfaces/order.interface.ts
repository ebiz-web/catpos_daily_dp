// 전일 입고 상품 목록 조회
export interface OrderDayResponse {
  ORD_CNT: number; // 조회건수
  ORD_P_CNT: number; // 입고건수
  ORD_M_CNT: number; // 반품건수
  ORD_P_AMT: number; // 입고금액
  ORD_M_AMT: number; // 반품금액
  SUB_CNT: number; // 상품건수
  SUB_P_QTY: number; // 상품입고수량
  SUB_M_QTY: number; // 상품반품수량
}

// 전월 입고 상품 목록 조회
export interface OrderMonResponse extends OrderDayResponse {
  INDATE: string; // 입고일
}
