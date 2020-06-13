import { NgModule, ModuleWithProviders } from '@angular/core';
import { CoreConfig } from './core.config';
import { StorageService } from 'common';
import { LocalStorageService } from './services/public-api';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    // {
    //   provide: StorageService,
    //   useClass: LocalStorageService,
    // },
  ],
})
export class CoreModule {
  static forRoot(config?: CoreConfig): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: StorageService,
          useClass: config?.storageService || LocalStorageService,
        },
      ],
    };
  }
}
