import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './search-bar.scss'
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
