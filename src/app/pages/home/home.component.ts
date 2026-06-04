import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container page-placeholder">
      <h2>🏠 Inicio (Top 20)</h2>
      <p>Aquí irá el dashboard con el listado principal de criptomonedas.</p>
    </div>
  `,
  styles: [`
    .page-placeholder {
      padding: 4rem 1.5rem;
      text-align: center;
      h2 { color: var(--accent-orange); margin-bottom: 1rem; }
      p { color: var(--text-secondary); }
    }
  `]
})
export class HomeComponent {}
