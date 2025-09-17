import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false; // nunca guarda a rota
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // não faz nada
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false; // nunca reaproveita rota armazenada
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
