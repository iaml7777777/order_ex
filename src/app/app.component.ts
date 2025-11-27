import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'my-angular-app';

  public storeData = ["麥當勞", "星巴克", "肯德基", "漢堡王", "摩斯漢堡", "85度C"];

  inputValue?: string;
  filteredOptions: string[] = [];
  constructor(private router: Router) {
    this.filteredOptions = this.storeData;
  }

  ngOnInit():void {

  }

  onChange(value: string): void {
    this.filteredOptions = this.storeData.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
}
