import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { FavoritesService } from '../../core/services/favorites.service';
import { CryptoService } from '../../core/services/crypto.service';
import { FormatCurrencyPipe } from '../../shared/pipes/format-currency.pipe';
import { PercentagePipe } from '../../shared/pipes/percentage.pipe';
import { PriceColorDirective } from '../../shared/directives/price-color.directive';
import { FavoriteCoin } from '../../core/models/coin.model';

type SortType = 'default' | 'price_desc' | 'perf_desc' | 'perf_asc';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, FormatCurrencyPipe, PercentagePipe, PriceColorDirective, DecimalPipe],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class FavoritesComponent implements OnInit {
  private favoritesService = inject(FavoritesService);
  private cryptoService = inject(CryptoService);

  // Signals del estado
  favorites = this.favoritesService.favorites;
  isUpdatingPrices = signal<boolean>(false);
  lastUpdated = signal<Date | null>(null);
  showClearConfirm = signal<boolean>(false);
  sortBy = signal<SortType>('default');

  // Computed: Favoritos ordenados
  sortedFavorites = computed(() => {
    const currentFavorites = [...this.favorites()];
    const sort = this.sortBy();
    
    switch (sort) {
      case 'price_desc':
        return currentFavorites.sort((a, b) => b.current_price - a.current_price);
      case 'perf_desc':
        return currentFavorites.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      case 'perf_asc':
        return currentFavorites.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
      default:
        // Mantener orden de inserción (addedAt)
        return currentFavorites.sort((a, b) => a.addedAt - b.addedAt);
    }
  });

  // Computed: Métricas para el resumen
  bestPerformer = computed(() => {
    const favs = this.favorites();
    if (favs.length === 0) return null;
    return [...favs].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)[0];
  });

  worstPerformer = computed(() => {
    const favs = this.favorites();
    if (favs.length === 0) return null;
    return [...favs].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)[0];
  });

  averagePerformance = computed(() => {
    const favs = this.favorites();
    if (favs.length === 0) return 0;
    const sum = favs.reduce((acc, curr) => acc + curr.price_change_percentage_24h, 0);
    return sum / favs.length;
  });

  ngOnInit() {
    if (this.favorites().length > 0) {
      this.refreshPrices();
    }
  }

  refreshPrices() {
    const currentFavs = this.favorites();
    if (currentFavs.length === 0) return;

    this.isUpdatingPrices.set(true);
    
    const requests = currentFavs.map(coin => this.cryptoService.getCoinDetail(coin.id));
    
    forkJoin(requests).subscribe({
      next: (responses) => {
        const updatedCoins: FavoriteCoin[] = responses.map((res, index) => {
          const oldCoin = currentFavs[index];
          return {
            ...oldCoin,
            current_price: res.market_data.current_price['usd'],
            price_change_percentage_24h: res.market_data.price_change_percentage_24h,
            market_cap: res.market_data.market_cap['usd']
          };
        });
        
        this.favoritesService.updatePrices(updatedCoins);
        this.lastUpdated.set(new Date());
        this.isUpdatingPrices.set(false);
      },
      error: (err) => {
        console.error('Error actualizando precios de favoritos', err);
        this.isUpdatingPrices.set(false);
      }
    });
  }

  removeFavorite(id: string) {
    this.favoritesService.removeFavorite(id);
  }

  confirmClearAll() {
    this.showClearConfirm.set(true);
  }

  cancelClear() {
    this.showClearConfirm.set(false);
  }

  executeClearAll() {
    this.favoritesService.clearAllFavorites();
    this.showClearConfirm.set(false);
  }

  setSort(type: SortType) {
    this.sortBy.set(type);
  }
}
