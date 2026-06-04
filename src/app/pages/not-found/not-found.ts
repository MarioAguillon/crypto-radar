import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <h1 class="error-code">404</h1>
      <h2 class="error-message">Houston, tenemos un problema en órbita.</h2>
      <p class="error-desc">La señal de esta criptomoneda se perdió en el espacio o la página no existe.</p>
      
      <svg class="rocket" viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
      </svg>

      <a routerLink="/home" class="btn-home">Volver a la Base</a>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 70vh;
      text-align: center;
      padding: 2rem;
    }

    .error-code {
      font-size: 8rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--accent-orange), var(--accent-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .error-message {
      font-size: 1.5rem;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .error-desc {
      color: var(--text-secondary);
      margin-bottom: 3rem;
      max-width: 400px;
    }

    .rocket {
      color: var(--text-secondary);
      margin-bottom: 3rem;
      animation: float 3s ease-in-out infinite;
    }

    .btn-home {
      background-color: var(--bg-card);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      padding: 0.75rem 1.5rem;
      border-radius: var(--border-radius);
      font-weight: 600;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        border-color: var(--text-secondary);
        transform: translateY(-2px);
      }
    }

    @keyframes float {
      0% { transform: translateY(0px) rotate(45deg); }
      50% { transform: translateY(-10px) rotate(45deg); }
      100% { transform: translateY(0px) rotate(45deg); }
    }
  `]
})
export class NotFoundComponent {}
