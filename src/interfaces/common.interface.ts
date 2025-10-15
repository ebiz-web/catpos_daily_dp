import type { CategoryType } from '@/constants/dashboard.options.ts';

export interface Item<T> {
  itemId: T;
  itemName: string;
}

export interface ChartUnitItem {
  name: string;
  value: number;
}

export interface CommonProps {
  taxno: string;
  category: CategoryType;
  date: string;
}

export const initCommon: CommonProps = {
  taxno: '',
  date: '',
  category: 'day',
};

export interface Page {
  PAGE: number; // 페이지
  RCNT: number; // 행 개수
}

export const initPage: Page = {
  PAGE: 1,
  RCNT: 5,
};

export interface ListPage {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const initListPage: ListPage = {
  number: 0,
  size: 5,
  totalElements: 0,
  totalPages: 0,
};
