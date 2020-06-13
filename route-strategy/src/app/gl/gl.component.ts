import { Component, OnInit } from '@angular/core';

@Component({
  template: 'Gl : {{ counter}}',
})
export class GlComponent implements OnInit {
  static counter = 0;

  get counter() {
    return GlComponent.counter;
  }

  constructor() {
    GlComponent.counter++;
  }

  ngOnInit() {}
}
