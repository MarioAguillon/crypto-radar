import { Injectable, signal, computed } from '@angular/core';
import { Coin, FavoriteCoin } from '../models/coin.model';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  
  // Signal privado con los favoritos
  private _favorites = signal<FavoriteCoin[]>(this.loadFromStorage());
  
  // Signal público de solo lectura
  favorites = this._favorites.asReadonly();
  
  // Computed: cantidad de favoritos para el badge del header
  favoritesCount = computed(() => this._favorites().length);
  
  // Computed: IDs de favoritos para verificación rápida
  favoriteIds = computed(() => new Set(this._favorites().map(c => c.id)));

  // Sistema de Toast Notifications
  toastMessage = signal<string>('');
  toastType = signal<'success' | 'error' | 'info'>('success');
  showToast = signal<boolean>(false);

  private timeoutId: any;

  isFavorite(id: string): boolean {
    return this.favoriteIds().has(id);
  }

  addFavorite(coin: FavoriteCoin | Coin | any): void {
    if (this.isFavorite(coin.id)) return;

    const newFav: FavoriteCoin = {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image?.large || coin.image, // coin.image can be string from Coin or object from CoinDetail
      current_price: coin.current_price ?? coin.market_data?.current_price?.usd ?? 0,
      price_change_percentage_24h: coin.price_change_percentage_24h ?? coin.market_data?.price_change_percentage_24h ?? 0,
      market_cap: coin.market_cap ?? coin.market_data?.market_cap?.usd ?? 0,
      market_cap_rank: coin.market_cap_rank,
      addedAt: Date.now()
    };

    const updated = [...this._favorites(), newFav];
    this._favorites.set(updated);
    this.saveToStorage(updated);
    this.triggerToast(`⭐ ${coin.name} agregado a tu Radar`, 'success');
  }

  removeFavorite(id: string, name?: string): void {
    const coinToRemove = this._favorites().find(c => c.id === id);
    const coinName = name || (coinToRemove ? coinToRemove.name : 'Moneda');

    const updated = this._favorites().filter(c => c.id !== id);
    this._favorites.set(updated);
    this.saveToStorage(updated);
    this.triggerToast(`✕ ${coinName} eliminado de tu Radar`, 'info');
  }

  toggleFavorite(coin: FavoriteCoin | Coin | any): void {
    if (this.isFavorite(coin.id)) {
      this.removeFavorite(coin.id, coin.name);
    } else {
      this.addFavorite(coin);
    }
  }

  clearAllFavorites(): void {
    this._favorites.set([]);
    this.saveToStorage([]);
    this.triggerToast(`Radar limpiado por completo`, 'info');
  }

  updatePrices(updatedCoins: FavoriteCoin[]): void {
    this._favorites.set(updatedCoins);
    this.saveToStorage(updatedCoins);
  }

  private loadFromStorage(): FavoriteCoin[] {
    try {
      const data = localStorage.getItem('crypto-radar-favorites');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading favorites from localStorage', e);
      return [];
    }
  }

  private saveToStorage(coins: FavoriteCoin[]): void {
    try {
      localStorage.setItem('crypto-radar-favorites', JSON.stringify(coins));
    } catch (e) {
      console.error('Error saving favorites to localStorage', e);
    }
  }

  private triggerToast(message: string, type: 'success' | 'error' | 'info'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }
}
