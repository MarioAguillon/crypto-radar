import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CryptoService } from '../../core/services/crypto.service';
import { Coin } from '../../core/models/coin.model';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar';
import { SpinnerComponent } from '../../shared/components/spinner/spinner';
import { HighlightPipe } from '../../shared/pipes/highlight.pipe';
import { FormatCurrencyPipe } from '../../shared/pipes/format-currency.pipe';

// Definimos la interfaz localmente (idealmente iría en un modelo)
interface SearchResultCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBarComponent, SpinnerComponent, HighlightPipe, FormatCurrencyPipe, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class SearchComponent implements OnInit {
  private cryptoService = inject(CryptoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // --- Estado con Signals ---
  searchTerm = signal<string>('');
  searchResults = signal<SearchResultCoin[]>([]);
  trendingCoins = signal<Coin[]>([]);
  
  isLoading = signal<boolean>(false);
  hasSearched = signal<boolean>(false);
  hasError = signal<boolean>(false);
  
  resultsCount = computed(() => this.searchResults().length);
  
  suggestedTags = ['Bitcoin', 'Ethereum', 'Solana', 'BNB', 'Cardano', 'Dogecoin'];

  constructor() {
    // Sincronizar el signal searchTerm con la URL cada vez que cambia
    effect(() => {
      const term = this.searchTerm();
      if (term.length >= 2) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: term },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      } else if (term.length === 0 && this.hasSearched()) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: null },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  ngOnInit() {
    this.loadTrending();

    // Leer la URL inicial
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q && q.length >= 2 && q !== this.searchTerm()) {
        this.searchTerm.set(q);
        this.executeSearch(q);
      }
    });
  }

  loadTrending() {
    this.cryptoService.getTopCoins().subscribe({
      next: (coins) => this.trendingCoins.set(coins.slice(0, 10))
    });
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
    
    if (term.length >= 2) {
      this.executeSearch(term);
    } else {
      // Limpiar búsqueda
      this.searchResults.set([]);
      this.hasSearched.set(false);
      this.hasError.set(false);
    }
  }

  executeSearch(term: string) {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.hasSearched.set(true);

    this.cryptoService.searchCoins(term).subscribe({
      next: (res: any) => {
        this.searchResults.set(res.coins || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  onTagClick(tag: string) {
    this.onSearchChange(tag);
  }

  clearSearch() {
    this.onSearchChange('');
  }
}
