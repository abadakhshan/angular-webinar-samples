import { Component } from '@angular/core';
import { StorageService } from 'common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'service-di-sample';

  constructor(private storage: StorageService) {
    this.storage.get('value0').then((result) => {
      this.value = result;
    });
  }

  value: any;
  saveOnStorage(value) {
    this.storage.add('value0', value);
  }
}
