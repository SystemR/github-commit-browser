import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

const CACHE_TIME_IN_MS = 15000;

class Cache {
  timestamp: Date = new Date();
  response: HttpResponse<any>;
  isValid(): boolean {
    const currentDate = new Date();
    if (currentDate.getTime() - this.timestamp.getTime() > CACHE_TIME_IN_MS) {
      return false;
    }
    return true;
  }
}

@Injectable()
export class CacheHttpInterceptor implements HttpInterceptor {
  private cache = new Map<string, Cache>();
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const hasNoCacheHeader = req.headers.has('no-cache');
    if (!hasNoCacheHeader) {
      // Load from cache if exist and within limit
      const cachedResponse = this.cache.get(req.urlWithParams);
      if (cachedResponse && cachedResponse.isValid()) {
        return of(cachedResponse.response.clone());
      }
    } else {
      // Force load from back-end, clean no-cache header
      req = req.clone({
        headers: req.headers.delete('no-cache')
      });
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse && !hasNoCacheHeader) {
          const cache = new Cache();
          cache.response = event.clone();
          this.cache.set(req.urlWithParams, cache);
        }
      })
    );
  }
}
