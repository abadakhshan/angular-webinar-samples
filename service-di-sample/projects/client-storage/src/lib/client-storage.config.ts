import { DriverType } from 'ngforage';

export interface ClientStorageConfig {
  dbName?: string;
  driverTypes?: DriverType[];
}
