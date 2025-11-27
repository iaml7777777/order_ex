import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableService } from '../../services/table.service';

@Component({
  selector: 'app-store-information',
  templateUrl: './store-information.component.html',
  styleUrls: ['./store-information.component.less']
})
export class StoreInformationComponent implements OnInit {

  public storeData: string[] = [];

  inputValue?: string;
  filteredOptions: string[] = [];

  constructor(
    private router: Router,
    private tableService: TableService
  ) { }

  ngOnInit(): void {
    this.getShopList();
  }

  getShopList() {
    this.tableService.getShopInfo({ shop: '' }).subscribe({
      next: (data) => {
        console.log('Shop List API Response:', data);
        if (data && data.shop_info) {
          this.storeData = data.shop_info.map((item: any) => item.shop || item);
          this.filteredOptions = this.storeData;
        } else if (Array.isArray(data)) {
          // Assuming data is an array of objects with a 'shop' property or just strings
          // Adjust mapping based on actual response
          this.storeData = data.map((item: any) => item.shop || item);
          this.filteredOptions = this.storeData;
        }
      },
      error: (err) => {
        console.error('Get Shop List Error:', err);
      }
    });
  }

  onChange(value: string): void {
    this.inputValue = value;
  }
  onSelectStore(store: any) {
    console.log('選中店家', store);
    this.router.navigate(['/order', store as string]);  // 導到訂餐頁面
  }
  selectStore() {
    if (this.inputValue && this.storeData.includes(this.inputValue)) {
      this.router.navigate(['/order', this.inputValue]);
    } else {
      alert('請選擇店家');
    }
  }

}
