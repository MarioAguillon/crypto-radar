import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingBarService {
  isLoading = signal<boolean>(false);

  private activeRequests = 0;

  startLoading(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.isLoading.set(true);
    }
  }

  stopLoading(): void {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    if (this.activeRequests === 0) {
      this.isLoading.set(false);
    }
  }
}
