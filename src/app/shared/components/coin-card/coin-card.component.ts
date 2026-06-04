import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { Coin } from '../../../core/models/coin.model';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
import { PercentagePipe } from '../../pipes/percentage.pipe';
import { PriceColorDirective } from '../../directives/price-color.directive';

/**
 * Componente de tarjeta reutilizable para mostrar una criptomoneda.
 * Recibe un objeto Coin y muestra sus datos principales de forma visual.
 * Al hacer clic navega al detalle; el botón de favorito emite un evento.
 */
@Component({
  selector: 'app-coin-card',
  standalone: true,
  imports: [UpperCasePipe, FormatCurrencyPipe, PercentagePipe, PriceColorDirective],
  templateUrl: './coin-card.component.html',
  styleUrl: './coin-card.component.scss'
})
export class CoinCardComponent {
  @Input() coin!: Coin;
  @Input() isFavorite: boolean = false;
  @Output() toggleFavorite = new EventEmitter<Coin>();

  private router = inject(Router);

  /** Navega a la página de detalle de la moneda */
  navigateToDetail(): void {
    this.router.navigate(['/details', this.coin.id]);
  }

  /** Emite el evento de favorito sin propagar el clic a la card */
  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavorite.emit(this.coin);
  }

  /** Fallback si la imagen del logo no carga */
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40?text=?';
  }
}
