import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetOrderListParams, GetOrderListResponse } from './models/table.model';
import { environment } from '../../environments/environment';

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

    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.http.get<any>(environment.apiUrl + "/service/saaat/AgentDemo/Order", { params: httpParams, headers })
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
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.http.post<any>(environment.apiUrl + "/service/saaat/AgentDemo/SaveOrder", payload, { headers })
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
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.http.post<any>(environment.apiUrl + "/service/saaat/AgentDemo/AddOrder", payload, { headers })
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
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.http.post<any>(environment.apiUrl + "/service/saaat/AgentDemo/EditOrder", payload, { headers })
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
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.http.post<any>(environment.apiUrl + "/service/saaat/AgentDemo/DeleteOrder", payload, { headers })
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
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.http.get<any>(environment.apiUrl + "/service/saaat/AgentDemo/Shop", { params: httpParams, headers })
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
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    return this.http.get<any>(environment.apiUrl + "/service/saaat/AgentDemo/Client", { params: httpParams, headers })
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
