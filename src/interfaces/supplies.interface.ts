// 거래처 목록 조회
export interface SuppliesResponse {
  RN: number; // 순번
  SUP_CODE: string; // 거래처코드
  SUP_TAXNO: string; // 거래처사업자번호
  SUP_NAME: string; // 거래처이름
  ORD_CNT: number; // 입고건수
  SUP_BLC: number; // 거래처잔액
  SUP_UPJONG: string; // 거래처업종코드
  SUP_UPJONG_NAME: string; // 거래처업종이름
}
