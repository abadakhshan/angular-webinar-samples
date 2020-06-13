import { ComponentContainer } from './../model';
import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContainerResolverService {
  constructor() {}
  resolveContainer(component: Type<any>): Type<ComponentContainer> {
    return (component as any).$$$container;
  }
}
