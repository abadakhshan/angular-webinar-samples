import { StorageService } from 'common';
import { Type } from '@angular/core';

export interface CoreConfig {
  storageService?: Type<StorageService>;
}
