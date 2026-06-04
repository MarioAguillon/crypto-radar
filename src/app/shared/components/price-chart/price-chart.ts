import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartOptions, TooltipItem, ScriptableContext } from 'chart.js';

@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './price-chart.html',
  styleUrl: './price-chart.scss'
})
export class PriceChartComponent implements OnChanges {
  @Input() chartData: Array<[number, number]> = [];
  @Input() coinName: string = '';
  @Input() isPositive: boolean = true;
  @Input() isLoading: boolean = false;
  @Input() currentPeriod: number = 7;
  
  @Output() periodChange = new EventEmitter<number>();

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @ViewChild('chartCanvas', { static: false }) chartCanvas?: ElementRef<HTMLCanvasElement>;

  // Variables para ng2-charts
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 2
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1C2128', // var(--bg-card)
        titleColor: '#8B949E', // var(--text-secondary)
        bodyColor: '#E6EDF3', // var(--text-primary)
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            let label = context.parsed.y || '';
            if (label) {
              label = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(label));
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { color: '#8B949E', maxTicksLimit: 6 }
      },
      y: {
        display: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          color: '#8B949E',
          callback: function(value) {
            if (Number(value) >= 1000) {
              return '$' + (Number(value) / 1000).toFixed(1) + 'k';
            }
            return '$' + value;
          }
        }
      }
    }
  };

  periods = [
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
    { label: '1Y', value: 365 }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['isPositive']) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (!this.chartData || this.chartData.length === 0) return;

    const labels = this.chartData.map(d => {
      const date = new Date(d[0]);
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    });
    const dataPoints = this.chartData.map(d => d[1]);
    const lineColor = this.isPositive ? '#00D4A1' : '#FF4757';

    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          data: dataPoints,
          label: this.coinName,
          borderColor: lineColor,
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height || 300);
            
            // Hex a RGBA para opacidad
            const hex = lineColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            return gradient;
          },
          fill: true,
          pointBackgroundColor: lineColor,
          pointBorderColor: '#fff'
        }
      ]
    };
  }

  onPeriodSelect(days: number): void {
    if (this.currentPeriod !== days && !this.isLoading) {
      this.periodChange.emit(days);
    }
  }
}
