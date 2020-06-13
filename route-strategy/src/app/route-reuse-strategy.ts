import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  storedRouteHandles = new Map<string, Map<string, DetachedRouteHandle>>();
  curr: ActivatedRouteSnapshot;
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!this.cachableContext(route);
  }
  store(
    route: ActivatedRouteSnapshot,
    detachedTree: DetachedRouteHandle
  ): void {
    if (!this.curr || this.cachableContext(this.curr)) {
      this.storeOnCache(route, detachedTree);
    }
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (!!this.cachableContext(route)) {
      return this.isRouteInCache(route);
    }
    return false;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.getRouteFromCache(route) as DetachedRouteHandle;
  }
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    this.curr = curr;
    const result =
      future.routeConfig === curr.routeConfig ||
      (future && curr && future.component === curr.component);

    if (!result) {
      const oldCachableKey = this.cachableKey(future);
      if (oldCachableKey) {
        if (oldCachableKey !== this.cachableContext(curr)) {
          this.storedRouteHandles.delete(oldCachableKey);
        }
      }
    }
    return result;
  }

  private getPath(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig !== null && route.routeConfig.path !== null) {
      return route.routeConfig.path;
    }
    return '';
  }

  private cachableKey(route: ActivatedRouteSnapshot): string {
    if (route && route.data && route.data.cacheChildren) {
      return route.routeConfig.path;
    }
    return undefined;
  }
  private cachableContext(route: ActivatedRouteSnapshot): string {
    if (
      route &&
      route.parent &&
      route.parent.data &&
      route.parent.data.cacheChildren
    ) {
      return route.parent.routeConfig.path;
    }
    return undefined;
  }

  private storeOnCache(
    route: ActivatedRouteSnapshot,
    detachedTree: DetachedRouteHandle
  ) {
    const contextKey = this.cachableContext(route);
    if (contextKey) {
      const contextData =
        this.storedRouteHandles.get(contextKey) ||
        new Map<string, DetachedRouteHandle>();
      contextData.set(this.getPath(route), detachedTree);
      this.storedRouteHandles.set(contextKey, contextData);
    }
  }

  private isRouteInCache(route: ActivatedRouteSnapshot) {
    const contextKey = this.cachableContext(route);
    if (contextKey) {
      return (
        this.storedRouteHandles.has(contextKey) &&
        this.storedRouteHandles.get(contextKey).has(this.getPath(route))
      );
    }
  }
  private getRouteFromCache(route: ActivatedRouteSnapshot) {
    const contextKey = this.cachableContext(route);
    if (contextKey) {
      if (this.storedRouteHandles.has(contextKey)) {
        const result = this.storedRouteHandles
          .get(contextKey)
          .get(this.getPath(route));

        return result;
      }
    }
    return undefined;
  }
}
