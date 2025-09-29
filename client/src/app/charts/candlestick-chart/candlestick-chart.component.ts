import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candlestick-chart',
  standalone: true,
  imports: [NgxEchartsModule, FormsModule, CommonModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  template: `
    <div class="candlestick-container">
      <div
        echarts
        [options]="chartOptions()"
        (chartInit)="onChartInit($event)"
        class="chart">
      </div>

      <div class="controls">
        <h3>Candlestick Chart Controls</h3>

        <div class="control-section">
          <h4>📊 Market Data</h4>
          <div class="dataset-buttons">
            <button
              class="dataset-btn"
              [class.active]="currentStock() === 'AAPL'"
              (click)="switchStock('AAPL')">
              🍎 Apple (AAPL)
            </button>
            <button
              class="dataset-btn"
              [class.active]="currentStock() === 'GOOGL'"
              (click)="switchStock('GOOGL')">
              🔍 Google (GOOGL)
            </button>
            <button
              class="dataset-btn"
              [class.active]="currentStock() === 'TSLA'"
              (click)="switchStock('TSLA')">
              🚗 Tesla (TSLA)
            </button>
            <button
              class="dataset-btn"
              [class.active]="currentStock() === 'MSFT'"
              (click)="switchStock('MSFT')">
              🏢 Microsoft (MSFT)
            </button>
          </div>
        </div>

        <div class="control-section">
          <h4>📈 Technical Analysis</h4>
          <div class="analysis-options">
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="showVolume">
              <div class="option-content">
                <div class="option-icon">📊</div>
                <div class="option-text">Volume Bars</div>
              </div>
            </label>
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="showMA5">
              <div class="option-content">
                <div class="option-icon">📈</div>
                <div class="option-text">MA5 (5-day)</div>
              </div>
            </label>
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="showMA20">
              <div class="option-content">
                <div class="option-icon">📈</div>
                <div class="option-text">MA20 (20-day)</div>
              </div>
            </label>
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="showBollingerBands">
              <div class="option-content">
                <div class="option-icon">📏</div>
                <div class="option-text">Bollinger Bands</div>
              </div>
            </label>
          </div>
        </div>

        <div class="control-section">
          <h4>🎨 Display Options</h4>
          <div class="display-controls">
            <div class="control-row">
              <label>
                Time Period:
                <select [(ngModel)]="timePeriod">
                  <option value="1M">1 Month</option>
                  <option value="3M">3 Months</option>
                  <option value="6M">6 Months</option>
                  <option value="1Y">1 Year</option>
                </select>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="enableDataZoom">
                Data Zoom
              </label>
            </div>
            <div class="control-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showGrid">
                Show Grid
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="enableBrush">
                Brush Tool
              </label>
            </div>
          </div>
        </div>

        <div class="stats-panel">
          <h4>📊 Market Statistics</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Current Price</span>
              <span class="stat-value">{{ getCurrentPrice() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Daily Change</span>
              <span class="stat-value" [class.positive]="getDailyChange() > 0" [class.negative]="getDailyChange() < 0">
                {{ getDailyChangeFormatted() }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Volume</span>
              <span class="stat-value">{{ getCurrentVolume() }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">52W High/Low</span>
              <span class="stat-value">{{ getYearRange() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./candlestick-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandlestickChartComponent {
  echartsInstance: any;

  // Control signals
  currentStock = signal<'AAPL' | 'GOOGL' | 'TSLA' | 'MSFT'>('AAPL');
  showVolume = signal(true);
  showMA5 = signal(true);
  showMA20 = signal(true);
  showBollingerBands = signal(false);
  timePeriod = signal<'1M' | '3M' | '6M' | '1Y'>('3M');
  enableDataZoom = signal(true);
  showGrid = signal(true);
  enableBrush = signal(false);

  // Stock data generation
  private generateStockData() {
    const stocks = {
      AAPL: { basePrice: 150, volatility: 0.02, trend: 0.0005 },
      GOOGL: { basePrice: 2800, volatility: 0.025, trend: 0.0003 },
      TSLA: { basePrice: 200, volatility: 0.04, trend: 0.001 },
      MSFT: { basePrice: 300, volatility: 0.018, trend: 0.0004 }
    };

    const periods = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365
    };

    const stock = stocks[this.currentStock()];
    const days = periods[this.timePeriod()];
    const data: Array<[string, number, number, number, number, number]> = [];

    let currentPrice = stock.basePrice;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Generate OHLC data
      const open = currentPrice;
      const trend = stock.trend * stock.basePrice;
      const volatility = stock.volatility * stock.basePrice;

      const close = open + trend + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = Math.floor(Math.random() * 10000000) + 5000000;

      data.push([
        date.toISOString().split('T')[0],
        Math.round(open * 100) / 100,
        Math.round(close * 100) / 100,
        Math.round(low * 100) / 100,
        Math.round(high * 100) / 100,
        volume
      ]);

      currentPrice = close;
    }

    return data;
  }

  private calculateMA(data: number[], period: number): (number | null)[] {
    const result: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(null);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(Math.round((sum / period) * 100) / 100);
      }
    }
    return result;
  }

  private calculateBollingerBands(data: number[], period: number = 20, multiplier: number = 2) {
    const ma = this.calculateMA(data, period);
    const upper: (number | null)[] = [];
    const lower: (number | null)[] = [];

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        upper.push(null);
        lower.push(null);
      } else {
        const slice = data.slice(i - period + 1, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / period;
        const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
        const stdDev = Math.sqrt(variance);

        upper.push(Math.round((mean + multiplier * stdDev) * 100) / 100);
        lower.push(Math.round((mean - multiplier * stdDev) * 100) / 100);
      }
    }

    return { upper, lower, middle: ma };
  }

  switchStock(stock: 'AAPL' | 'GOOGL' | 'TSLA' | 'MSFT') {
    this.currentStock.set(stock);
  }

  getCurrentPrice(): string {
    const data = this.generateStockData();
    if (data.length === 0) return '$0.00';
    const lastCandle = data[data.length - 1];
    return `$${lastCandle[2].toFixed(2)}`;
  }

  getDailyChange(): number {
    const data = this.generateStockData();
    if (data.length < 2) return 0;
    const lastCandle = data[data.length - 1];
    const prevCandle = data[data.length - 2];
    return lastCandle[2] - prevCandle[2];
  }

  getDailyChangeFormatted(): string {
    const change = this.getDailyChange();
    const data = this.generateStockData();
    if (data.length < 2) return '±$0.00 (0.00%)';
    const lastCandle = data[data.length - 1];
    const percentage = (change / lastCandle[1]) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}$${change.toFixed(2)} (${sign}${percentage.toFixed(2)}%)`;
  }

  getCurrentVolume(): string {
    const data = this.generateStockData();
    if (data.length === 0) return '0';
    const lastCandle = data[data.length - 1];
    return (lastCandle[5] / 1000000).toFixed(1) + 'M';
  }

  getYearRange(): string {
    const data = this.generateStockData();
    if (data.length === 0) return '$0.00 / $0.00';
    const highs = data.map(d => d[4]);
    const lows = data.map(d => d[3]);
    const yearHigh = Math.max(...highs);
    const yearLow = Math.min(...lows);
    return `$${yearHigh.toFixed(2)} / $${yearLow.toFixed(2)}`;
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  protected readonly chartOptions = computed(() => {
    const rawData = this.generateStockData();
    const dates = rawData.map(d => d[0]);
    const candlestickData = rawData.map(d => [d[1], d[2], d[3], d[4]]); // open, close, low, high
    const volumeData = rawData.map((d, i) => [i, d[5], d[2] > d[1] ? 1 : -1]);
    const closePrices = rawData.map(d => d[2]);

    const series: any[] = [
      {
        name: this.currentStock(),
        type: 'candlestick',
        data: candlestickData,
        itemStyle: {
          color: '#00da3c',
          color0: '#ec0000',
          borderColor: '#00da3c',
          borderColor0: '#ec0000'
        },
        markPoint: {
          data: [
            {
              name: 'Highest',
              type: 'max',
              valueDim: 'highest'
            },
            {
              name: 'Lowest',
              type: 'min',
              valueDim: 'lowest'
            }
          ]
        }
      }
    ];

    // Moving Averages
    if (this.showMA5()) {
      const ma5 = this.calculateMA(closePrices, 5);
      series.push({
        name: 'MA5',
        type: 'line',
        data: ma5,
        smooth: true,
        lineStyle: {
          opacity: 0.8,
          width: 2,
          color: '#ff6b35'
        },
        symbol: 'none'
      });
    }

    if (this.showMA20()) {
      const ma20 = this.calculateMA(closePrices, 20);
      series.push({
        name: 'MA20',
        type: 'line',
        data: ma20,
        smooth: true,
        lineStyle: {
          opacity: 0.8,
          width: 2,
          color: '#4dabf7'
        },
        symbol: 'none'
      });
    }

    // Bollinger Bands
    if (this.showBollingerBands()) {
      const bb = this.calculateBollingerBands(closePrices);
      series.push({
        name: 'BB Upper',
        type: 'line',
        data: bb.upper,
        lineStyle: { opacity: 0.5, color: '#9c88ff', type: 'dashed' },
        symbol: 'none'
      });
      series.push({
        name: 'BB Lower',
        type: 'line',
        data: bb.lower,
        lineStyle: { opacity: 0.5, color: '#9c88ff', type: 'dashed' },
        symbol: 'none'
      });
    }

    return {
      title: {
        text: `${this.currentStock()} Stock Price`,
        subtext: `${this.timePeriod()} Period with Technical Analysis`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#505765'
          }
        },
        formatter: (params: any) => {
          const param = params[0];
          const data = rawData[param.dataIndex];
          if (!data) return '';

          const date = data[0];
          const open = data[1];
          const close = data[2];
          const low = data[3];
          const high = data[4];
          const volume = data[5];

          return `
            <div style="font-weight: bold;">${date}</div>
            <div>Open: $${open.toFixed(2)}</div>
            <div>High: $${high.toFixed(2)}</div>
            <div>Low: $${low.toFixed(2)}</div>
            <div>Close: $${close.toFixed(2)}</div>
            <div>Volume: ${(volume / 1000000).toFixed(1)}M</div>
          `;
        }
      },
      legend: {
        data: ['AAPL', 'MA5', 'MA20', 'BB Upper', 'BB Lower'],
        top: '10%'
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          height: this.showVolume() ? '50%' : '65%',
          show: this.showGrid()
        },
        ...(this.showVolume() ? [{
          left: '10%',
          right: '8%',
          top: '70%',
          height: '16%',
          show: this.showGrid()
        }] : [])
      ],
      xAxis: [
        {
          type: 'category',
          data: dates,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        },
        ...(this.showVolume() ? [{
          type: 'category',
          gridIndex: 1,
          data: dates,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        }] : [])
      ],
      yAxis: [
        {
          scale: true,
          splitArea: { show: true },
          axisLabel: {
            formatter: '${value}'
          }
        },
        ...(this.showVolume() ? [{
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false }
        }] : [])
      ],
      dataZoom: this.enableDataZoom() ? [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 20,
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          top: '85%',
          start: 20,
          end: 100
        }
      ] : undefined,
      brush: this.enableBrush() ? {
        xAxisIndex: 'all',
        brushLink: 'all',
        outOfBrush: {
          colorAlpha: 0.1
        }
      } : undefined,
      series: [
        ...series,
        ...(this.showVolume() ? [{
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumeData,
          itemStyle: {
            color: (params: any) => {
              return params.data[2] > 0 ? '#00da3c' : '#ec0000';
            }
          }
        }] : [])
      ]
    };
  });
}