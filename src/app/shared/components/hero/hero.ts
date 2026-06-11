import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormatCurrencyPipe } from '../../../shared/pipes/format-currency.pipe';
import { GlobalMarket } from '../../../core/models/global-market.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormatCurrencyPipe],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero.scss'
})
export class HeroComponent {
  @Input() globalData: GlobalMarket | null = null;
}
