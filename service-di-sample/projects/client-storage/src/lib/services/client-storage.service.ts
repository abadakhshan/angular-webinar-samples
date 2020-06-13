import { Injectable } from '@angular/core';
import { StorageService } from 'common';
import { NgForage } from 'ngforage';

@Injectable()
export class ClientStorageService extends StorageService {
  constructor(private ngf: NgForage) {
    super();
  }

  get<T>(key: string): Promise<T> {
    return this.ngf.getItem(key);
  }
  add(key: string, data: any): Promise<void> {
    return this.ngf.setItem(key, data);
  }
  remove(key: string): Promise<void> {
    return this.ngf.removeItem(key);
  }
  clear(): Promise<void> {
    return this.ngf.clear();
  }
}
