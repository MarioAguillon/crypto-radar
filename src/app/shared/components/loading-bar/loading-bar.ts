import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingBarService } from '../../../core/services/loading-bar.service';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <div class="loading-bar"></div>
    }
  `,
  styles: [`
    .loading-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--accent-orange);
      z-index: 10000;
      transform-origin: left;
      animation: indeterminate 2s infinite ease-in-out;
    }
    
    @keyframes indeterminate {
      0% {
        transform: translateX(-100%) scaleX(0.2);
      }
      50% {
        transform: translateX(0) scaleX(0.5);
      }
      100% {
        transform: translateX(100%) scaleX(0.2);
      }
    }
  `]
})
export class LoadingBarComponent {
  private loadingBarService = inject(LoadingBarService);
  isLoading = this.loadingBarService.isLoading;
}
