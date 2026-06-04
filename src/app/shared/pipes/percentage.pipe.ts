import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear porcentajes de cambio.
 * Siempre muestra el signo (+ o -) y máximo 2 decimales.
 * Ejemplos:
 *   2.4523  → "+2.45%"
 *   -1.234  → "-1.23%"
 *   0       → "+0.00%"
 */
@Pipe({
  name: 'percentage',
  standalone: true
})
export class PercentagePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0.00%';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }
}
