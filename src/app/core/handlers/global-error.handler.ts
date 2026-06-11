import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoritesService } from '../services/favorites.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    let message = 'Ha ocurrido un error inesperado';
    
    // Sometimes HTTP errors are wrapped
    const httpError = error.rejection ? error.rejection : error;

    if (httpError instanceof HttpErrorResponse) {
      if (httpError.status === 429) {
        message = 'Demasiadas solicitudes. Espera un momento.';
      } else if (httpError.status === 500 || httpError.status === 503) {
        message = 'CoinGecko no disponible ahora';
      } else if (httpError.status === 0) {
        message = 'Sin conexión a internet';
      }
      
      console.error(`[HTTP Error ${httpError.status}]:`, httpError.message);
      
      // Trigger toast
      try {
        const favoritesService = this.injector.get(FavoritesService);
        // We use any casting or directly call the triggerToast if it was public.
        // But triggerToast is private in FavoritesService. Let's make it public or use a method.
        // Wait, I can't call private method. I will cast to any to call it for now.
        (favoritesService as any).triggerToast(message, 'error');
      } catch (e) {
        console.error('No se pudo mostrar el toast', e);
      }
    } else {
      console.error('[Global Error]:', error);
    }
  }
}
