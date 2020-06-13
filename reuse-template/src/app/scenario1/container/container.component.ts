import { TemplateHolderDirective } from './../template-holder.directive';
import { ComponentContainer } from './../model';
import {
  Component,
  OnInit,
  Type,
  Input,
  ViewChild,
  ComponentFactory,
  ComponentFactoryResolver,
  Injector,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { LoaderHostDirective } from '../loader-host.directive';
import { isObservable } from 'rxjs';
import { TemplateDirective } from './../template.directive';

@Component({
  selector: 'container1',
  templateUrl: 'container.component.html',
})
export class Container1Component implements ComponentContainer, OnInit {
  // tslint:disable-next-line:variable-name
  _contentType: Type<any>;
  // tslint:disable-next-line:variable-name
  _host: LoaderHostDirective;

  content: any;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  @Input()
  set contentType(value: Type<any>) {
    this._contentType = value;
    this.applyContent();
  }

  get contentType(): Type<any> {
    return this._contentType;
  }

  @ViewChild(LoaderHostDirective, { static: false })
  set host(value: LoaderHostDirective) {
    if (!this._host) {
      this._host = value;
      this.applyContent();
    }
  }

  @ViewChildren(TemplateHolderDirective)
  templateHolders: QueryList<TemplateHolderDirective>;

  ngOnInit() {}

  applyContent() {
    const host = this._host;
    if (this.contentType && host) {
      const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(
        this.contentType
      );

      const localInjector = Injector.create({
        providers: [],
        parent: this.injector,
      });

      setTimeout(() => {
        const contentRef = host.viewContainerRef.createComponent(
          factory,
          undefined,
          localInjector
        );

        this.content = contentRef.instance;

        if (isObservable(this.content.viewInit$)) {
          this.content.viewInit$.subscribe(() => {
            this.applyContentTemplates();
          });
        } else {
          this.applyContentTemplates();
        }
      }, 0);
    }
  }
  applyContentTemplates() {
    if (this.templateHolders && this.templateHolders.length !== 0) {
      if (this.content.templates) {
        const templates = (this.content.templates as QueryList<
          TemplateDirective
        >).toArray();
        for (const holder of this.templateHolders.toArray()) {
          const template = templates.filter(
            (t) => t.key === holder.templateKey
          )[0];
          holder.applyTemplate(template);
        }
      } else {
        for (const holder of this.templateHolders.toArray()) {
          holder.applyTemplate(undefined);
        }
      }
    }
  }
}
