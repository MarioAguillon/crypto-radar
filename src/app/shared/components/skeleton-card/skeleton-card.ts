import { Component } from '@angular/core';

/**
 * Componente de tarjeta esqueleto (skeleton card).
 * Se muestra mientras los datos reales cargan desde la API.
 * Usa animación shimmer CSS para dar sensación de carga activa.
 */
@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  templateUrl: './skeleton-card.html',
  styleUrl: './skeleton-card.scss'
})
export class SkeletonCardComponent {}
