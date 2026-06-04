import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <div class="container page-placeholder">
      <h2>🔍 Búsqueda</h2>
      <p>Aquí implementaremos el buscador en tiempo real de monedas.</p>
    </div>
  `,
  styles: [`
    .page-placeholder {
      padding: 4rem 1.5rem;
      text-align: center;
      h2 { color: var(--accent-blue); margin-bottom: 1rem; }
      p { color: var(--text-secondary); }
    }
  `]
})
export class SearchComponent {}
