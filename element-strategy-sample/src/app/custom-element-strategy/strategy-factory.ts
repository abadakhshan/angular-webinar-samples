import {
  ComponentFactory,
  ComponentFactoryResolver,
  Type,
  Injector,
} from '@angular/core';
import { NgElementStrategyFactory } from '@angular/elements';
import { CustomComponentNgElementStrategy } from './strategy';

export class CustomComponentNgElementStrategyFactory
  implements NgElementStrategyFactory {
  componentFactory: ComponentFactory<any>;

  constructor(component: Type<any>, injector: Injector) {
    this.componentFactory = injector
      .get(ComponentFactoryResolver)
      .resolveComponentFactory(component);
  }

  create(injector: Injector) {
    return new CustomComponentNgElementStrategy(this.componentFactory, injector);
  }
}
