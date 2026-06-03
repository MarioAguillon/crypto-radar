import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { CryptoService } from './core/services/crypto.service';
import { Coin } from './core/models/coin.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UpperCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  // Señales para el estado
  public coins = signal<Coin[]>([]);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string>('');

  // Inyección del servicio de forma moderna
  private cryptoService = inject(CryptoService);

  ngOnInit(): void {
    // Prueba visual básica: Traer el top de monedas al iniciar
    this.cryptoService.getTopCoins().subscribe({
      next: (data) => {
        // Tomamos solo las primeras 5 para la prueba
        this.coins.set(data.slice(0, 5));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }
}
