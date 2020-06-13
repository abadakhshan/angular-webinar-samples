import { Injectable } from '@angular/core';
import { StorageService } from 'common';

@Injectable()
export class SessionStorageService extends StorageService {
  get<T>(key: string): Promise<T> {
    const data = JSON.parse(sessionStorage.getItem(key));
    return Promise.resolve(data);
  }
  add(key: string, data: any): Promise<void> {
    sessionStorage.setItem(key, JSON.stringify(data));
    return Promise.resolve();
  }
  remove(key: string): Promise<void> {
    sessionStorage.removeItem(key);
    return Promise.resolve();
  }
  clear(): Promise<void> {
    sessionStorage.clear();
    return Promise.resolve();
  }
}
