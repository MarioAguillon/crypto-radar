import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class ToastComponent {
  private favoritesService = inject(FavoritesService);

  showToast = this.favoritesService.showToast;
  toastMessage = this.favoritesService.toastMessage;
  toastType = this.favoritesService.toastType;
}
