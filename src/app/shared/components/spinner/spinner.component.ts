import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container">
      <div class="spinner" [ngClass]="size"></div>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
    }

    .spinner {
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--accent-orange);
      animation: spin 1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
    }

    /* Tamaños */
    .sm { width: 20px; height: 20px; border-width: 2px; }
    .md { width: 40px; height: 40px; border-width: 3px; }
    .lg { width: 60px; height: 60px; border-width: 4px; }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
