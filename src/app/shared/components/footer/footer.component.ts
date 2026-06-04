import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <p class="copyright">CryptoRadar © 2025</p>
        <p class="attribution">Datos proporcionados por <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">CoinGecko API</a></p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      border-top: 1px solid var(--border-color);
      padding: 2rem 0;
      margin-top: 4rem;
      background-color: var(--bg-primary);
    }
    
    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      
      @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    .copyright {
      color: var(--text-primary);
      font-weight: 500;
    }

    .attribution {
      color: var(--text-secondary);
      font-size: 0.875rem;
      
      a {
        color: var(--accent-blue);
        transition: color 0.2s ease;
        &:hover { color: #8C9EFF; }
      }
    }
  `]
})
export class FooterComponent {}
