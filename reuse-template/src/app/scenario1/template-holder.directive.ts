import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { TemplateDirective } from './template.directive';

@Directive({
  selector: '[templateHolder]',
})
export class TemplateHolderDirective {
  templateKey: string;

  @Input()
  set templateHolder(value: string) {
    this.templateKey = value;
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  applyTemplate(template: TemplateDirective) {
    if (template) {
      this.viewContainer.createEmbeddedView(template.templateRef);
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
