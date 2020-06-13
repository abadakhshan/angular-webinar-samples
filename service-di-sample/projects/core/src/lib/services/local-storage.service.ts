import { Injectable } from '@angular/core';
import { StorageService } from 'common';

@Injectable()
export class LocalStorageService extends StorageService {
  get<T>(key: string): Promise<T> {
    const data = JSON.parse(localStorage.getItem(key));
    return Promise.resolve(data);
  }
  add(key: string, data: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(data));
    return Promise.resolve();
  }
  remove(key: string): Promise<void> {
    localStorage.removeItem(key);
    return Promise.resolve();
  }
  clear(): Promise<void> {
    localStorage.clear();
    return Promise.resolve();
  }
}
