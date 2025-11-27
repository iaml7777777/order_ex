export interface ApiResponse<T> {
  data: T;
  errMsg: string;
  code: string;
};
export interface ApiResponseFile {
  config: any;
  data: Blob,
  headers: any;
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}
export class ApiResponse<T> {
  constructor(public data: T, public errMsg: string, public code: string) { }
}


export interface ApiResponseFromIssueservice<T> {
  response: T;
  statusDescription: string;
  status: Number | string;
}

export class ApiResponseFromIssueservice<T> {
  constructor(public response: T, public statusDescription: string, public status: Number | string) { }
}
export interface GetOrderListParams {
  shop: string;
}
export interface GetOrderListResponse {
  order_id?: number;
  name: string;
  meal: string;
  quantity: number;
  unitPrice: number;
  money: number;
  ps: string;
  shop: string;
  date: string;
}

export interface GetShopInfoParams {
  shop: string;
}

export interface GetShopInfoResponse {
  images: string[]; // List of filenames
  url: string;
}