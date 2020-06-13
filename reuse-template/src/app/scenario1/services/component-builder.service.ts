import { ContainerResolverService } from './container-resolver.service';
import { ComponentContainer } from './../model';
import {
  ComponentFactoryResolver,
  Injector,
  Type,
  ViewContainerRef,
  ComponentRef,
  Injectable,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComponentBuilder {
  constructor(
    private containerResolverService: ContainerResolverService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}
  Build<T>(
    componentType: Type<T>,
    resolver: ComponentFactoryResolver,
    injector: Injector,
    location?: ViewContainerRef
  ): ComponentRef<T | ComponentContainer> {
    resolver = resolver || this.resolver;
    injector = injector || this.injector;
    const container = this.containerResolverService.resolveContainer(
      componentType
    );

    let realComponent: Type<any>;
    let componentToCreate: Type<T | ComponentContainer> = componentType;

    if (container) {
      realComponent = componentType;
      componentToCreate = container;
    }

    const factory = resolver.resolveComponentFactory(componentToCreate);

    const component = location.createComponent(
      factory,
      location.length,
      injector
    );

    if (realComponent) {
      this.applyContent(
        component.instance as ComponentContainer,
        realComponent
      );
    }

    return component;
  }

  private applyContent(instance: ComponentContainer, realComponent: Type<any>) {
    instance.contentType = realComponent;
  }
}
