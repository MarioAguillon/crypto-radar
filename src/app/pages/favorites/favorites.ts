import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-favorites',
  standalone: true,
  template: `
    <div class="container page-placeholder">
      <h2>⭐ Monedas en tu Radar</h2>
      <p>Aquí se mostrarán las monedas guardadas en LocalStorage.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    .page-placeholder {
      padding: 4rem 1.5rem;
      text-align: center;
      h2 { color: #FFD700; margin-bottom: 1rem; }
      p { color: var(--text-secondary); }
    }
  `]
})
export class FavoritesComponent {}
