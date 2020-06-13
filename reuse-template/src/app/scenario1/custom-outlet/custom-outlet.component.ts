import { ComponentBuilder } from '../services/component-builder.service';
import {
  Attribute,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import {
  ActivatedRoute,
  ChildrenOutletContexts,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'custom-router-outlet',
  template: '',
})
export class RouterOutletComponent extends RouterOutlet implements OnInit {
  constructor(
    parentContexts: ChildrenOutletContexts,
    location: ViewContainerRef,
    resolver: ComponentFactoryResolver,
    @Attribute('name') name: string,
    changeDetector: ChangeDetectorRef,
    private componentBuilder: ComponentBuilder
  ) {
    super(parentContexts, location, resolver, name, changeDetector);
  }

  activateWith(
    activatedRoute: ActivatedRoute,
    resolver: ComponentFactoryResolver | null
  ) {
    (this as any)._activatedRoute = activatedRoute;
    const snapshot = (activatedRoute as any)._futureSnapshot;
    // tslint:disable-next-line: no-non-null-assertion
    const component = snapshot.routeConfig!.component as any;
    resolver = resolver || (this as any).resolver;

    const childContexts = (this as any).parentContexts.getOrCreateContext(
      (this as any).name
    ).children;
    const injector = new SgOutletInjector(
      activatedRoute,
      childContexts,
      (this as any).location.injector
    );

    (this as any).activated = this.componentBuilder.Build(
      component,
      resolver,
      injector,
      (this as any).location
    );

    // Calling `markForCheck` to make sure we will run the change detection when the
    // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
    (this as any).changeDetector.markForCheck();
    this.activateEvents.emit((this as any).activated.instance);

    (this.activatedRoute
      .snapshot as any).componentInstance = (this as any).activated.instance;
  }
}

class SgOutletInjector implements Injector {
  constructor(
    private route: ActivatedRoute,
    private childContexts: ChildrenOutletContexts,
    private parent: Injector
  ) {}

  get(token: any, notFoundValue?: any): any {
    if (token === ActivatedRoute) {
      return this.route;
    }

    if (token === ChildrenOutletContexts) {
      return this.childContexts;
    }

    return this.parent.get(token, notFoundValue);
  }
}
