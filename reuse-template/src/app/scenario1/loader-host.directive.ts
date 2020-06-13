import { Input, Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[loader-host]',
})
export class LoaderHostDirective {
  @Input('loader-host')
  hostId: string;

  constructor(public viewContainerRef: ViewContainerRef) {}
}
