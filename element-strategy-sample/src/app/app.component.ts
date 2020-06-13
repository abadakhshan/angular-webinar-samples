import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'element-strategy-sample';

  @ViewChild('counter')
  counter: ElementRef<
    NgElement &
      WithProperties<{ counterMessage: string; validate: () => boolean }>
  >;

  validateCounter() {
    const isValid = this.counter.nativeElement.validate();
    if (isValid) {
      console.log(this.counter.nativeElement.counterMessage);
    }
  }
}
