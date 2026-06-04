import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';

/**
 * Directiva que aplica color dinámico según si un valor es positivo o negativo.
 * Verde (--color-up) para positivo, Rojo (--color-down) para negativo.
 * Uso: <span [priceColor]="coin.price_change_percentage_24h">...</span>
 */
@Directive({
  selector: '[priceColor]',
  standalone: true
})
export class PriceColorDirective implements OnChanges {
  @Input() priceColor: number = 0;
  private el = inject(ElementRef);

  ngOnChanges(): void {
    this.el.nativeElement.style.color = this.priceColor >= 0
      ? 'var(--color-up)'
      : 'var(--color-down)';
  }
}
