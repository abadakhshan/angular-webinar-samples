import { AccountGroupComponent } from './account-group/account-group.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoaComponent } from './coa/coa.component';
import { GlComponent } from './gl/gl.component';
import { SlComponent } from './sl/sl.component';
import { TreeModule } from 'angular-tree-component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './route-reuse-strategy';
import { OtherComponent } from './other/other.component';

@NgModule({
  declarations: [
    AppComponent,
    CoaComponent,
    SlComponent,
    GlComponent,
    AccountGroupComponent,
    OtherComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, TreeModule.forRoot()],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
