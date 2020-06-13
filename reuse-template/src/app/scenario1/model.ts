import { Type, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { TemplateDirective } from './template.directive';

export interface ComponentContainer {
  contentType: Type<ContainerContent>;
}
export interface ContainerContent {
  readonly onViewInit?: Observable<any>;
  readonly sgTemplates?: QueryList<TemplateDirective>;
}
