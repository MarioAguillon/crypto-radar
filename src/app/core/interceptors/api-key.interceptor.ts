import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoadingBarService } from '../services/loading-bar.service';

export const apiKeyInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const loadingBar = inject(LoadingBarService);
  const startTime = Date.now();

  // Activar loading bar
  loadingBar.startLoading();

  // Clonar la petición para agregar API Key y Cache-Control (para detalle de moneda y mercados)
  let headers = req.headers.set('x-cg-demo-api-key', environment.apiKey);
  
  if (req.url.includes('/coins/')) {
    headers = headers.set('Cache-Control', 'public, max-age=300'); // 5 minutos de caché
  }

  const modifiedReq = req.clone({ headers });

  return next(modifiedReq).pipe(
    tap(() => {
      const elapsed = Date.now() - startTime;
      console.log(`[CryptoRadar] ${req.method} ${req.url} → ${elapsed}ms ✓`);
    }),
    retry({ count: 2, delay: 1000 }),
    catchError((error: HttpErrorResponse) => {
      const elapsed = Date.now() - startTime;
      console.error(`[CryptoRadar] ${req.method} ${req.url} → ${elapsed}ms ✗`, error.message);
      return throwError(() => error);
    }),
    finalize(() => {
      loadingBar.stopLoading();
    })
  );
};
