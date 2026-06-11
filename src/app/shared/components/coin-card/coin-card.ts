import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { Coin } from '../../../core/models/coin.model';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
import { PercentagePipe } from '../../pipes/percentage.pipe';
import { PriceColorDirective } from '../../directives/price-color.directive';
import { FavoritesService } from '../../../core/services/favorites.service';

/**
 * Componente de tarjeta reutilizable para mostrar una criptomoneda.
 * Recibe un objeto Coin y muestra sus datos principales de forma visual.
 * Al hacer clic navega al detalle; el botón de favorito emite un evento.
 */
@Component({
  selector: 'app-coin-card',
  standalone: true,
  imports: [UpperCasePipe, FormatCurrencyPipe, PercentagePipe, PriceColorDirective],
  templateUrl: './coin-card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './coin-card.scss'
})
export class CoinCardComponent {
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);

  coin = input.required<Coin>();
  
  isFavorite = computed(() => this.favoritesService.isFavorite(this.coin().id));

  /** Navega a la página de detalle de la moneda */
  navigateToDetail(): void {
    this.router.navigate(['/details', this.coin().id]);
  }

  /** Emite el evento de favorito sin propagar el clic a la card */
  onToggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.coin());
  }

  /** Fallback si la imagen del logo no carga */
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/coin-placeholder.svg';
  }
}
