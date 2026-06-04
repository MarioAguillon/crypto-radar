import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(text: string, search: string): SafeHtml {
    if (!search || !text) {
      return text;
    }

    // Escapar caracteres especiales para evitar errores de Regex
    const cleanSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${cleanSearch})`, 'gi');
    
    // Envolver coincidencia en tag mark
    const highlighted = text.replace(regex, '<mark class="highlight-text">$1</mark>');
    
    // Retornar HTML seguro
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
