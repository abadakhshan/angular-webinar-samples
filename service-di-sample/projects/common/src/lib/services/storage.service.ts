export abstract class StorageService {
  abstract add(key: string, data: any): Promise<void>;
  abstract get<T>(key: string): Promise<T>;
  abstract remove(key: string): Promise<void>;
  abstract clear(): Promise<void>;
}
