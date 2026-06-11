import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CryptoService } from '../../../core/services/crypto.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DecimalPipe],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  private cryptoService = inject(CryptoService);
  
  marketCap = signal<number | null>(null);
  isMarketUp = signal<boolean>(true);

  ngOnInit() {
    this.cryptoService.getGlobalData().subscribe({
      next: (res) => {
        // Convert to Trillions
        const mcapT = res.data.total_market_cap['usd'] / 1000000000000;
        this.marketCap.set(mcapT);
        this.isMarketUp.set(res.data.market_cap_change_percentage_24h_usd > 0);
      },
      error: () => {
        console.error('Error fetching global data');
      }
    });
  }
}
