import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TableService } from '../../services/table.service'
import { GetOrderListParams, GetOrderListResponse } from '../../services/models/table.model'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private tableService: TableService,
    private message: NzMessageService
  ) { }
  // 總金額
  total = 0;
  storeName: string = '';
  // 新增彈窗
  isVisible = false;
  // 刪除彈窗
  deletVisible = false;
  // 編輯彈窗
  editVisible = false;
  // 保存彈窗
  saveVisible = false;
  visible = false;
  // 新訂單
  newOrder = {
    name: '',
    meal: '',
    quantity: null,
    unitPrice: null,
    money: null,
    ps: ''
  };
  deleteIndex: number | null = null;
  editIndex: number | null = null;
  editOrder: any = {};

  orderList: GetOrderListResponse[] = [];


  /**訂單列表 */
  getOrderListParams: GetOrderListParams = {
    shop: ''
  }
  loading = false;

  calculateTotal() {
    this.total = this.orderList.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
  }

  // 新增彈窗
  newModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    if (!this.newOrder.name || !this.newOrder.meal || ((this.newOrder.quantity ?? 0) < 1) || ((this.newOrder.unitPrice ?? 0) < 0)) {
      return;
    }
    const quantity = this.newOrder.quantity!;
    const unitPrice = this.newOrder.unitPrice!;

    const newOrderData = {
      name: this.newOrder.name,
      meal: this.newOrder.meal,
      quantity: quantity,
      unitPrice: unitPrice,
      money: quantity * unitPrice,
      ps: this.newOrder.ps,
      shop: this.storeName,
      date: new Date().toISOString()
    };

    this.loading = true;
    this.tableService.addOrder(newOrderData).subscribe({
      next: () => {
        this.message.success('新增成功');
        this.isVisible = false;
        this.newOrder = { name: '', meal: '', quantity: null, unitPrice: null, money: null, ps: '' };
        this.getOrderList(); // Refresh list
      },
      error: (err) => {
        console.error('Add Order Error:', err);
        this.message.error('新增失敗: ' + (err.error?.errMsg || err.message));
        this.loading = false;
      }
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.deletVisible = false;
    this.deleteIndex = null;
    this.editVisible = false;
    this.editIndex = null;
    this.editOrder = {};
    this.saveVisible = false;
  }
  // 刪除彈窗
  deletModal(index: number): void {
    this.deleteIndex = index;
    this.deletVisible = true;
  }
  deletOk(): void {
    if (this.deleteIndex !== null) {
      const order = this.orderList[this.deleteIndex];
      // Check if order has ID (it should if loaded from backend)
      // Assuming 'orderId' is the field name based on Java entity
      const orderId = (order as any).orderId || (order as any).order_id;

      if (orderId) {
        this.loading = true;
        this.tableService.deleteOrder(orderId, this.storeName).subscribe({
          next: () => {
            this.message.success('刪除成功');
            this.deletVisible = false;
            this.deleteIndex = null;
            this.getOrderList();
          },
          error: (err) => {
            console.error('Delete Order Error:', err);
            this.message.error('刪除失敗: ' + (err.error?.errMsg || err.message));
            this.loading = false;
          }
        });
      } else {
        // Fallback for local-only items (shouldn't happen in real-time mode but good for safety)
        this.orderList.splice(this.deleteIndex, 1);
        this.calculateTotal();
        this.deletVisible = false;
        this.deleteIndex = null;
      }
    }
  }
  // 編輯彈窗
  editModal(index: number) {
    this.editIndex = index;
    this.editOrder = { ...this.orderList[index] }; // 複製該筆資料到暫存物件
    this.editVisible = true;
  }
  editOk() {
    if (!this.editOrder.name || !this.editOrder.meal || ((this.editOrder.quantity ?? 0) < 1) || ((this.editOrder.unitPrice ?? 0) < 0)) {
      return;
    }
    if (this.editIndex !== null) {
      this.editOrder.money = (this.editOrder.quantity || 0) * (this.editOrder.unitPrice || 0);
      this.editOrder.shop = this.storeName; // Ensure shop is set

      this.loading = true;
      this.tableService.editOrder(this.editOrder).subscribe({
        next: () => {
          this.message.success('修改成功');
          this.editVisible = false;
          this.editIndex = null;
          this.editOrder = {};
          this.getOrderList();
        },
        error: (err) => {
          console.error('Edit Order Error:', err);
          this.message.error('修改失敗: ' + (err.error?.errMsg || err.message));
          this.loading = false;
        }
      });
    }
  }
  //保存彈窗
  // saveModal(): void {
  //   this.saveVisible = true;
  // }
  // saveOk(): void {
  //   this.loading = true;
  //   this.tableService.saveOrder(this.orderList, this.storeName, this.total).subscribe({
  //     next: () => {
  //       this.message.success('保存成功');
  //       this.saveVisible = false;
  //       this.loading = false;
  //       this.getOrderList(); // 重新整理列表
  //     },
  //     error: (err) => {
  //       console.error('Save Error:', err);
  //       console.error('Backend Error Details:', err.error);
  //       this.message.error('保存失敗: ' + (err.error?.errMsg || err.message));
  //       this.loading = false;
  //     }
  //   });
  // }
  menuImages: string[] = [];
  shopUrl: string = '';
  clientList: string[] = [];

  ngOnInit(): void {
    this.storeName = this.route.snapshot.paramMap.get('store') || '';
    this.getOrderList();
    this.calculateTotal();
    this.fetchShopInfo();
    this.fetchClientList();
  }

  fetchClientList(): void {
    this.tableService.getClientList({ name: '' }).subscribe({
      next: (data) => {
        console.log('Client List API Response:', data);
        if (data && data.client_info) {
          // Assuming client_info is a list of objects with 'name' or just strings
          this.clientList = data.client_info.map((item: any) => item.name || item);
        } else if (Array.isArray(data)) {
          this.clientList = data.map((item: any) => item.name || item);
        }
      },
      error: (err) => {
        console.error('Get Client List Error:', err);
      }
    });
  }

  fetchShopInfo(): void {
    if (this.storeName) {
      this.tableService.getShopInfo({ shop: this.storeName }).subscribe({
        next: (data) => {
          console.log('Shop Info API Response:', data);
          if (data && data.shop_info && data.shop_info.length > 0) {
            const shopData = data.shop_info[0];
            // Check if menu exists
            if (shopData.menu) {
              // Support comma-separated string for multiple images
              this.menuImages = shopData.menu.split(',').map((img: string) => `assets/image/${img.trim()}`);
            }
            // Check if url exists
            if (shopData.url) {
              this.shopUrl = shopData.url;
            }
            // Read total from shop info
            if (shopData.total !== undefined && shopData.total !== null) {
              this.total = shopData.total;
            }
          }
        },
        error: (err) => {
          console.error('Get Shop Info Error:', err);
        }
      });
    }
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  // 取得訂單清單
  getOrderList() {
    this.loading = true;
    if (!this.storeName) {
      console.warn('請先選擇餐廳');
      return;
    }
    const params = { shop: this.storeName };
    this.tableService.getOrderList(params).subscribe({
      next: (data: GetOrderListResponse[]) => { // 明確型別
        console.log('API 回傳資料:', data);
        this.orderList = data;
        this.calculateTotal();
        this.loading = false;
      },
      error: (err) => {
        console.error("API Error:", err);
        this.loading = false;
      }
    });
  }
}
