import { NgModule, ModuleWithProviders, Inject } from '@angular/core';
import { ClientStorageConfig } from './client-storage.config';
import { NgForageConfig, Driver, DriverType } from 'ngforage';
import {
  CLIENT_STORAGE_DB_NAME,
  CLIENT_STORAGE_DRIVER_TYPES,
} from './injectionTokens';
import { StorageService } from 'common';
import { ClientStorageService } from './services/client-storage.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [],
})
export class ClientStorageModule {
  constructor(
    ngfConfig: NgForageConfig,
    @Inject(CLIENT_STORAGE_DB_NAME) dbName: string,
    @Inject(CLIENT_STORAGE_DRIVER_TYPES) driverTypes: DriverType[]
  ) {
    ngfConfig.configure({
      name: dbName,
      storeName: 'data',
      driver: driverTypes,
    });
  }

  static forRoot(
    config?: ClientStorageConfig
  ): ModuleWithProviders<ClientStorageModule> {
    return {
      ngModule: ClientStorageModule,
      providers: [
        {
          provide: StorageService,
          useClass: ClientStorageService,
        },
        {
          provide: CLIENT_STORAGE_DB_NAME,
          useValue: config && config.dbName ? config.dbName : 'clientStorage',
        },
        {
          provide: CLIENT_STORAGE_DRIVER_TYPES,
          useValue:
            config && config.driverTypes
              ? config.driverTypes
              : [Driver.INDEXED_DB, Driver.WEB_SQL, Driver.LOCAL_STORAGE],
        },
      ],
    };
  }
}
