import { CoreModule } from 'core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClientStorageModule } from 'client-storage';
import { Session } from 'protractor';
import { SessionStorageService } from 'core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // CoreModule.forRoot({
    //   storageService: SessionStorageService,
    // }),
    ClientStorageModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
