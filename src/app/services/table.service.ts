import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetOrderListParams, GetOrderListResponse } from './models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private http: HttpClient) { }

  getOrderList(params: GetOrderListParams): Observable<GetOrderListResponse[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value);
      }
    });

    return this.http.get<any>("/restful/service/saaat/AgentDemo/Order", { params: httpParams })
      .pipe(
        map(res => {
          if (res.std_data.execution.code !== "0") {
            throw new Error(res.errMsg);
          }
          return res.std_data.parameter.order_info;
        })
      );
  }
  saveOrder(orderList: GetOrderListResponse[], shop: string, total: number): Observable<any> {
    const formattedList = orderList.map(item => ({
      ...item,
      unit_price: item.unitPrice
    }));

    const payload = {
      std_data: {
        parameter: {
          shop: shop,
          total: total,
          save_order_info: formattedList
        }
      }
    };
    console.log('Saving Order Payload:', JSON.stringify(payload, null, 2));
    return this.http.post<any>("/restful/service/saaat/AgentDemo/SaveOrder", payload)
      .pipe(
        map(res => {
          if (res.std_data.execution.code !== "0") {
            throw new Error(res.errMsg);
          }
          return res.std_data;
        })
      );
  }

  addOrder(order: any): Observable<any> {
    const payload = {
      std_data: {
        parameter: order
      }
    };
    return this.http.post<any>("/restful/service/saaat/AgentDemo/AddOrder", payload)
      .pipe(
        map(res => {
          if (res.std_data.execution.code !== "0") {
            throw new Error(res.errMsg);
          }
          return res.std_data;
        })
      );
  }

  editOrder(order: any): Observable<any> {
    const payload = {
      std_data: {
        parameter: order
      }
    };
    return this.http.post<any>("/restful/service/saaat/AgentDemo/EditOrder", payload)
      .pipe(
        map(res => {
          if (res.std_data.execution.code !== "0") {
            throw new Error(res.errMsg);
          }
          return res.std_data;
        })
      );
  }

  deleteOrder(orderId: number, shop: string): Observable<any> {
    const payload = {
      std_data: {
        parameter: {
          orderId: orderId,
          shop: shop
        }
      }
    };
    return this.http.post<any>("/restful/service/saaat/AgentDemo/DeleteOrder", payload)
      .pipe(
        map(res => {
          if (res.std_data.execution.code !== "0") {
            throw new Error(res.errMsg);
          }
          return res.std_data;
        })
      );
  }

  getShopInfo(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value);
      }
    });
    return this.http.get<any>("/restful/service/saaat/AgentDemo/Shop", { params: httpParams })
      .pipe(
        map(res => {
          if (res.std_data.execution.code !== "0") {
            throw new Error(res.errMsg);
          }
          return res.std_data.parameter; // Assuming parameter contains shop info
        })
      );
  }

  getClientList(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value);
      }
    });
    return this.http.get<any>("/restful/service/saaat/AgentDemo/Client", { params: httpParams })
      .pipe(
        map(res => {
          if (res.std_data.execution.code !== "0") {
            throw new Error(res.errMsg);
          }
          return res.std_data.parameter; // Assuming parameter contains client info
        })
      );
  }
}
