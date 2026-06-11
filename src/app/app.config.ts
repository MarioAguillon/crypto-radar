import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { apiKeyInterceptor } from './core/interceptors/api-key.interceptor';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptors([apiKeyInterceptor])),
    provideCharts(withDefaultRegisterables())
  ]
};
