import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo inyectamos la key si la petición va a la API de CoinGecko
  if (req.url.startsWith(environment.apiUrl)) {
    const clonedRequest = req.clone({
      setParams: {
        x_cg_demo_api_key: environment.apiKey
      }
    });
    return next(clonedRequest);
  }
  
  return next(req);
};
