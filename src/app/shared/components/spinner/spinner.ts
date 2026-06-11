import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './spinner.scss'
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
