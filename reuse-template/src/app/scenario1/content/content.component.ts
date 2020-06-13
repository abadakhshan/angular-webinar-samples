import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { TemplateDirective } from '../template.directive';
import { Subject, Observable } from 'rxjs';
import { Container } from '../container.decorator';
import { Container1Component } from '../container/container.component';

@Container(Container1Component)
@Component({
  selector: 'content',
  templateUrl: 'content.component.html',
})
export class Content1Component implements OnInit, AfterViewInit {
  protected onViewInitSubject: Subject<any> = new Subject();
  viewInit$: Observable<any> = this.onViewInitSubject.asObservable();

  @ViewChildren(TemplateDirective)
  templates: QueryList<TemplateDirective>;

  model: any = {};
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.onViewInitSubject.next();
  }

  save() {}
  new() {}
}
