import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Coin } from '../models/coin.model';
import { CoinDetail } from '../models/coin-detail.model';
import { GlobalMarket } from '../models/global-market.model';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Obtiene el listado de criptomonedas ordenadas por capitalización de mercado.
   */
  getTopCoins(currency: string = 'usd', page: number = 1): Observable<Coin[]> {
    const params = new HttpParams()
      .set('vs_currency', currency)
      .set('order', 'market_cap_desc')
      .set('per_page', 20)
      .set('page', page);

    return this.http.get<Coin[]>(`${this.apiUrl}/coins/markets`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Busca criptomonedas por término.
   */
  searchCoins(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any>(`${this.apiUrl}/search`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene el detalle completo de una criptomoneda.
   */
  getCoinDetail(id: string): Observable<CoinDetail> {
    return this.http.get<CoinDetail>(`${this.apiUrl}/coins/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene el historial del mercado (precios, market cap, volumen) para gráficos.
   */
  getCoinMarketChart(id: string, days: number): Observable<any> {
    const params = new HttpParams()
      .set('vs_currency', 'usd')
      .set('days', days);
    
    return this.http.get<any>(`${this.apiUrl}/coins/${id}/market_chart`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene los datos globales del mercado.
   */
  getGlobalData(): Observable<GlobalMarket> {
    return this.http.get<GlobalMarket>(`${this.apiUrl}/global`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Manejador centralizado de errores HTTP.
   */
  private handleError(error: any) {
    console.error('Error en la API de CoinGecko:', error);
    return throwError(() => new Error('Hubo un problema al comunicarse con la API de criptomonedas. Por favor, intenta nuevamente más tarde.'));
  }
}
