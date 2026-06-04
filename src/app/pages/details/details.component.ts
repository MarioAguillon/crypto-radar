import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: true,
  template: `
    <div class="container page-placeholder">
      <h2>📊 Detalle de la moneda</h2>
      <p>Mostrando detalles para el ID: <strong>{{ coinId }}</strong></p>
      <p>Aquí mostraremos la gráfica histórica y datos completos.</p>
    </div>
  `,
  styles: [`
    .page-placeholder {
      padding: 4rem 1.5rem;
      text-align: center;
      h2 { color: var(--color-up); margin-bottom: 1rem; }
      p { color: var(--text-secondary); margin-bottom: 0.5rem; }
      strong { color: var(--text-primary); }
    }
  `]
})
export class DetailsComponent {
  private route = inject(ActivatedRoute);
  coinId = this.route.snapshot.paramMap.get('id');
}
