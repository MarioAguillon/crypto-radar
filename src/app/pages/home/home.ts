import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CryptoService } from '../../core/services/crypto.service';
import { Coin } from '../../core/models/coin.model';
import { GlobalMarket } from '../../core/models/global-market.model';
import { CoinCardComponent } from '../../shared/components/coin-card/coin-card';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card';
import { FormatCurrencyPipe } from '../../shared/pipes/format-currency.pipe';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar';
import { HeroComponent } from '../../shared/components/hero/hero';
import { Router } from '@angular/router';

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
    FormatCurrencyPipe,
    SearchBarComponent,
    HeroComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private cryptoService = inject(CryptoService);
  private router = inject(Router);

  // --- Estado con Signals ---
  allCoins = signal<Coin[]>([]);
  searchQuery = signal<string>('');
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
    let coins = [...this.allCoins()];
    
    // Filtrar localmente por texto si hay búsqueda
    const query = this.searchQuery().toLowerCase();
    if (query) {
      coins = coins.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.symbol.toLowerCase().includes(query)
      );
    }

    // Ordenar según pestaña
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

  /** Handler para la búsqueda local */
  onSearchChange(term: string): void {
    this.searchQuery.set(term);
  }

  /** Navegar a la página de búsqueda completa al presionar Enter */
  onSearchEnter(term: string): void {
    if (term.trim().length > 0) {
      this.router.navigate(['/search'], { queryParams: { q: term.trim() } });
    }
  }
}
