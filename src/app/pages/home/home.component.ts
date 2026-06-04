import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CryptoService } from '../../core/services/crypto.service';
import { Coin } from '../../core/models/coin.model';
import { GlobalMarket } from '../../core/models/global-market.model';
import { CoinCardComponent } from '../../shared/components/coin-card/coin-card.component';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card.component';
import { FormatCurrencyPipe } from '../../shared/pipes/format-currency.pipe';

/**
 * Página principal del dashboard CryptoRadar.
 * Muestra métricas globales del mercado, pestañas de filtrado
 * y un grid responsivo con tarjetas de las Top 20 criptomonedas.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DecimalPipe,
    CoinCardComponent,
    SkeletonCardComponent,
    FormatCurrencyPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private cryptoService = inject(CryptoService);

  // --- Estado con Signals ---
  allCoins = signal<Coin[]>([]);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  activeTab = signal<'top' | 'gainers' | 'losers'>('top');
  globalData = signal<GlobalMarket | null>(null);

  // Array auxiliar para renderizar 20 skeleton cards
  skeletonItems = Array.from({ length: 20 }, (_, i) => i);

  /**
   * Computed signal que filtra/ordena las monedas según la pestaña activa.
   * Se recalcula automáticamente cuando allCoins o activeTab cambian.
   */
  filteredCoins = computed(() => {
    const coins = [...this.allCoins()];
    switch (this.activeTab()) {
      case 'gainers':
        return coins.sort(
          (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
        );
      case 'losers':
        return coins.sort(
          (a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)
        );
      default:
        return coins; // Ya vienen ordenadas por market_cap_desc de la API
    }
  });

  ngOnInit(): void {
    this.loadCoins();
    this.loadGlobalData();
  }

  /** Carga las Top 20 monedas desde la API */
  loadCoins(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.cryptoService.getTopCoins().subscribe({
      next: (data) => {
        this.allCoins.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  /** Carga los datos globales del mercado */
  loadGlobalData(): void {
    this.cryptoService.getGlobalData().subscribe({
      next: (res) => this.globalData.set(res),
      error: () => console.error('Error cargando datos globales')
    });
  }

  /** Cambia la pestaña activa (el computed se recalcula solo) */
  setActiveTab(tab: 'top' | 'gainers' | 'losers'): void {
    this.activeTab.set(tab);
  }

  /** Handler para cuando el usuario toglea un favorito */
  onToggleFavorite(coin: Coin): void {
    // Se implementará en el Día 7 con FavoritesService + LocalStorage
    console.log('Toggle favorito:', coin.name);
  }
}
