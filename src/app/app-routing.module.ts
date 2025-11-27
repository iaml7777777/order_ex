import { StoreInformationComponent } from './components/store-information/store-information.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent} from './components/table/table.component'

const routes: Routes = [
  { path: '', component: StoreInformationComponent },   // 選店家頁
  { path: 'order/:store', component: TableComponent } // 訂餐表格頁
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
