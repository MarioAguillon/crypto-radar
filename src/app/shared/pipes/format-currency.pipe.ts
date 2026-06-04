import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para formatear valores monetarios grandes de forma legible.
 * Convierte números grandes a formato abreviado con sufijo (T, B, M, K).
 * Ejemplos:
 *   1300000000000 → "$1.30T"
 *   28500000000   → "$28.50B"
 *   1500000       → "$1.50M"
 *   67234.50      → "$67,234.50"
 */
@Pipe({
  name: 'formatCurrency',
  standalone: true
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '$0.00';

    const abs = Math.abs(value);

    if (abs >= 1_000_000_000_000) {
      return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (abs >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (abs >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (abs >= 1_000) {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Para precios pequeños (ej. monedas de centavos)
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
  }
}
