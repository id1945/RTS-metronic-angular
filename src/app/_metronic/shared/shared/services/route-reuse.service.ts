import { Injectable } from '@angular/core';

import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteReuseService implements RouteReuseStrategy {

  public storedRoutes = {};
  public routeLeftFrom = '';

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    this.routeLeftFrom = route.routeConfig.path;
    return route.data.reuse || false
  }

  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    let storedRoute = {
      snapshot: route,
      handle: handle
    }
    this.storedRoutes[route.routeConfig.path] = storedRoute;
  }

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (this.storedRoutes[route.routeConfig.path] && route.routeConfig.data && route.routeConfig.data.reuseWhenLeftFrom.indexOf(this.routeLeftFrom) > -1)
      return true
    else return false
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig || !this.storedRoutes[route.routeConfig.path])
      return null
    else return this.storedRoutes[route.routeConfig.path].handle
  }

  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.data.reuse || false
  }
}