import { Component, OnInit, Input } from '@angular/core';
import 'reflect-metadata';

@Component({
  selector: 'app-custom-counter',
  templateUrl: 'custom-counter.component.html',
})
@Reflect.metadata('custom-element-methods', ['validate', 'counterMessage'])
export class CustomCounterComponent implements OnInit {
  @Input()
  value = 0;

  @Input()
  max = 100000;

  @Input()
  min = 0;

  constructor() {}

  ngOnInit() {}

  validate() {
    if (this.value > this.max || this.value < this.min) {
      console.log('invalid value');
      return false;
    }
    console.log('valid value');
    return true;
  }

  get counterMessage(): string {
    return `Value is ${this.value}`;
  }
}
