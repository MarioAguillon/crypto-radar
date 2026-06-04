import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-wrapper" [class.focused]="isFocused()">
      <div class="search-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      
      <input 
        type="text" 
        [placeholder]="placeholder" 
        [(ngModel)]="inputValue"
        (ngModelChange)="onInputChange($event)"
        (focus)="isFocused.set(true)"
        (blur)="isFocused.set(false)"
        (keyup.enter)="onEnter()"
        class="search-input"
        autocomplete="off"
      />

      @if (inputValue) {
        <button class="clear-btn" (click)="clearInput()" aria-label="Limpiar búsqueda">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      }
    </div>
  `,
  styles: [`
    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 50px;
      padding: 0.5rem 1rem;
      transition: all 0.3s ease;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;

      &.focused {
        border-color: var(--accent-orange);
        box-shadow: 0 0 0 3px rgba(247, 147, 26, 0.15);
        background: var(--bg-card);
      }
    }

    .search-icon {
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
    }

    .focused .search-icon {
      color: var(--accent-orange);
    }

    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-size: 1rem;
      font-family: var(--font-main);
      outline: none;
      width: 100%;

      &::placeholder {
        color: var(--text-secondary);
        opacity: 0.7;
      }
    }

    .clear-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      cursor: pointer;
      margin-left: 0.5rem;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: var(--text-primary);
      }
    }
  `]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Buscar criptomoneda...';
  
  // Setter para recibir valor inicial desde fuera (ej. desde URL)
  @Input() set initialValue(val: string) {
    if (val !== this.inputValue) {
      this.inputValue = val;
    }
  }

  @Output() searchChange = new EventEmitter<string>();
  @Output() enterPressed = new EventEmitter<string>();

  inputValue: string = '';
  isFocused = signal<boolean>(false);
  
  private searchSubject = new Subject<string>();
  private subscription?: Subscription;

  ngOnInit() {
    // Implementación del Debounce de 400ms
    this.subscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchChange.emit(searchTerm);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onInputChange(value: string) {
    this.searchSubject.next(value);
  }

  clearInput() {
    this.inputValue = '';
    this.searchSubject.next('');
    this.searchChange.emit('');
  }

  onEnter() {
    this.enterPressed.emit(this.inputValue);
  }
}
