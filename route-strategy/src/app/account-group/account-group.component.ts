import { Component, OnInit } from '@angular/core';

@Component({
  template: 'Account Group : {{ counter}}',
})
export class AccountGroupComponent implements OnInit {
  static counter = 0;

  get counter() {
    return AccountGroupComponent.counter;
  }

  constructor() {
    AccountGroupComponent.counter++;
  }

  ngOnInit() {}
}
