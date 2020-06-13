import { CustomComponentNgElementStrategyFactory } from './custom-element-strategy/strategy-factory';
import {
  Injector,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  DoBootstrap,
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomCounterComponent } from './custom-counter/custom-counter.component';

@NgModule({
  declarations: [AppComponent, CustomCounterComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    const el = createCustomElement(CustomCounterComponent, {
      injector: this.injector,
      strategyFactory: new CustomComponentNgElementStrategyFactory(
        CustomCounterComponent,
        injector
      ),
    });
    customElements.define(`custom-counter`, el);
  }

  ngDoBootstrap() {}
}
