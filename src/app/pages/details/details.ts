import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';

import { CryptoService } from '../../core/services/crypto.service';
import { PriceChartComponent } from '../../shared/components/price-chart/price-chart';
import { FormatCurrencyPipe } from '../../shared/pipes/format-currency.pipe';
import { PercentagePipe } from '../../shared/pipes/percentage.pipe';
import { PriceColorDirective } from '../../shared/directives/price-color.directive';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PriceChartComponent,
    FormatCurrencyPipe,
    PercentagePipe,
    PriceColorDirective
  ],
  templateUrl: './details.html',
  styleUrl: './details.scss'
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private cryptoService = inject(CryptoService);
  private sanitizer = inject(DomSanitizer);

  // --- Estado con Signals ---
  coin = signal<any | null>(null);
  chartData = signal<Array<[number, number]>>([]);
  
  isLoadingCoin = signal<boolean>(true);
  isLoadingChart = signal<boolean>(true);
  hasError = signal<boolean>(false);
  
  selectedPeriod = signal<number>(7);
  selectedCurrency = signal<'usd' | 'eur' | 'cop'>('usd');
  
  // Placeholder para el Favorito
  isFavorite = signal<boolean>(false);

  // --- Conversor Integrado ---
  conversorAmount = signal<number>(1);
  convertedValue = computed(() => {
    const data = this.coin();
    if (!data) return 0;
    const price = data.market_data.current_price[this.selectedCurrency()];
    return this.conversorAmount() * price;
  });

  // HTML sanitizado para la descripción
  safeDescription = computed<SafeHtml>(() => {
    const desc = this.coin()?.description?.en || '';
    return this.sanitizer.bypassSecurityTrustHtml(desc);
  });

  constructor() {
    // Recargar solo la gráfica cuando cambia el periodo
    effect(() => {
      const period = this.selectedPeriod();
      const currentCoin = this.coin();
      
      if (currentCoin && !this.isLoadingCoin()) {
        this.loadChartData(currentCoin.id, period);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadFullCoinData(id);
      } else {
        this.hasError.set(true);
        this.isLoadingCoin.set(false);
      }
    });
  }

  /**
   * Carga paralela de Detalles y Gráfica Inicial usando forkJoin
   */
  loadFullCoinData(id: string): void {
    this.isLoadingCoin.set(true);
    this.isLoadingChart.set(true);
    this.hasError.set(false);

    forkJoin({
      detail: this.cryptoService.getCoinDetail(id),
      chart: this.cryptoService.getCoinMarketChart(id, this.selectedPeriod())
    }).subscribe({
      next: (results) => {
        this.coin.set(results.detail);
        this.chartData.set(results.chart.prices);
        this.isLoadingCoin.set(false);
        this.isLoadingChart.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoadingCoin.set(false);
        this.isLoadingChart.set(false);
      }
    });
  }

  /**
   * Carga solo la gráfica cuando cambia el período
   */
  loadChartData(id: string, days: number): void {
    this.isLoadingChart.set(true);
    this.cryptoService.getCoinMarketChart(id, days).subscribe({
      next: (res) => {
        this.chartData.set(res.prices);
        this.isLoadingChart.set(false);
      },
      error: () => {
        // Fallback silencioso
        this.isLoadingChart.set(false);
      }
    });
  }

  onPeriodChange(days: number): void {
    this.selectedPeriod.set(days);
  }

  onCurrencyChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as 'usd'|'eur'|'cop';
    this.selectedCurrency.set(val);
  }

  toggleFavorite(): void {
    this.isFavorite.update(val => !val);
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
