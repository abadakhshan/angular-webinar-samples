import { InjectionToken } from '@angular/core';
import { DriverType } from 'ngforage';

export const CLIENT_STORAGE_DB_NAME = new InjectionToken<string>(
  'CLIENT_STORAGE_DB_NAME'
);

export const CLIENT_STORAGE_DRIVER_TYPES = new InjectionToken<DriverType[]>(
  'CLIENT_STORAGE_DB_NAME'
);
