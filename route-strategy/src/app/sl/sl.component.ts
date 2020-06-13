import { Component, OnInit } from '@angular/core';

@Component({
  template: 'Sl : {{ counter}}',
})
export class SlComponent implements OnInit {
  static counter = 0;

  get counter() {
    return SlComponent.counter;
  }

  constructor() {
    SlComponent.counter++;
  }

  ngOnInit() {}
}
