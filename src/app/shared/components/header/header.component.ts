import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CryptoService } from '../../../core/services/crypto.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DecimalPipe],
  template: `
    <header class="header">
      <div class="container header-content">
        <!-- Logo -->
        <a routerLink="/home" class="logo">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <span class="logo-text">Crypto<span class="highlight">Radar</span></span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="nav-links">
          <a routerLink="/home" routerLinkActive="active" class="nav-link">Inicio</a>
          <a routerLink="/search" routerLinkActive="active" class="nav-link">Buscar</a>
          <a routerLink="/favorites" routerLinkActive="active" class="nav-link">Favoritos</a>
        </nav>

        <!-- Right Side: Global Market Data -->
        <div class="market-badge">
          <span class="live-indicator"></span>
          @if (marketCap()) {
            <span class="mcap" [class.up]="isMarketUp()" [class.down]="!isMarketUp()">
              Mcap: $\{{ marketCap() | number:'1.0-1' }}T
            </span>
          } @else {
            <span class="mcap loading">Cargando...</span>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: rgba(13, 17, 23, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 100;
      height: 64px;
      display: flex;
      align-items: center;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-primary);
      
      svg { color: var(--accent-orange); }
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      
      .highlight { color: var(--accent-orange); }
    }

    .nav-links {
      display: none;
      
      @media (min-width: 768px) {
        display: flex;
        gap: 2rem;
      }
    }

    .nav-link {
      color: var(--text-secondary);
      font-weight: 500;
      transition: color 0.2s ease;
      position: relative;
      
      &:hover { color: var(--text-primary); }
      
      &.active {
        color: var(--text-primary);
        &::after {
          content: '';
          position: absolute;
          bottom: -22px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--accent-orange);
          border-radius: 2px 2px 0 0;
        }
      }
    }

    .market-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.03);
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      border: 1px solid var(--border-color);
      font-size: 0.85rem;
      font-weight: 600;
    }

    .live-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--color-up);
      animation: pulse 2s infinite;
    }

    .mcap {
      &.up { color: var(--color-up); }
      &.down { color: var(--color-down); }
      &.loading { color: var(--text-secondary); }
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0, 212, 161, 0.4); }
      70% { box-shadow: 0 0 0 6px rgba(0, 212, 161, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 212, 161, 0); }
    }
  `]
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
