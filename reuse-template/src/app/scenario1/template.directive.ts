import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[key]',
})
export class TemplateDirective {
  @Input('key')
  key: string;

  constructor(public templateRef: TemplateRef<any>) {}
}
