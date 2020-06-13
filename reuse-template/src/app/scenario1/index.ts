import { Provider } from '@angular/core';
import { Container1Component } from './container/container.component';
import { Content1Component } from './content/content.component';
import { TemplateDirective } from './template.directive';
import { LoaderHostDirective } from './loader-host.directive';
import { TemplateHolderDirective } from './template-holder.directive';
import { RouterOutletComponent } from './custom-outlet/custom-outlet.component';

export const Scenario1Components: Provider[] = [
  Container1Component,
  Content1Component,
  TemplateDirective,
  LoaderHostDirective,
  TemplateHolderDirective,
  RouterOutletComponent,
];
