import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-line-chart-timeseries',
  standalone: true,
  imports: [NgxEchartsModule, FormsModule, CommonModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  template: `
    <div class="timeseries-container">
      <div
        echarts
        [options]="chartOptions()"
        (chartInit)="onChartInit($event)"
        class="chart">
      </div>

      <div class="controls">
        <h3>Time Series Line Chart Controls</h3>

        <div class="control-section">
          <h4>📊 Data Sets</h4>
          <div class="dataset-grid">
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'stock'"
              (click)="switchDataset('stock')">
              <div class="card-icon">📈</div>
              <div class="card-title">Stock Prices</div>
              <div class="card-subtitle">2024 Daily Data</div>
            </button>
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'weather'"
              (click)="switchDataset('weather')">
              <div class="card-icon">🌡️</div>
              <div class="card-title">Weather Data</div>
              <div class="card-subtitle">Hourly Temperature</div>
            </button>
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'sales'"
              (click)="switchDataset('sales')">
              <div class="card-icon">💰</div>
              <div class="card-title">Sales Revenue</div>
              <div class="card-subtitle">Monthly Performance</div>
            </button>
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'analytics'"
              (click)="switchDataset('analytics')">
              <div class="card-icon">📊</div>
              <div class="card-title">Web Analytics</div>
              <div class="card-subtitle">Daily Visitors</div>
            </button>
          </div>
        </div>

        <div class="control-section">
          <h4>⚙️ Display Options</h4>
          <div class="option-grid">
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="showDataZoom">
              <div class="option-content">
                <div class="option-icon">🔍</div>
                <div class="option-text">Data Zoom</div>
              </div>
            </label>
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="showBrush">
              <div class="option-content">
                <div class="option-icon">🖌️</div>
                <div class="option-text">Brush Selection</div>
              </div>
            </label>
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="showToolbox">
              <div class="option-content">
                <div class="option-icon">🛠️</div>
                <div class="option-text">Toolbox</div>
              </div>
            </label>
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="smoothLines">
              <div class="option-content">
                <div class="option-icon">〰️</div>
                <div class="option-text">Smooth Lines</div>
              </div>
            </label>
          </div>
        </div>

        <div class="control-section">
          <h4>🎨 Styling</h4>
          <div class="styling-controls">
            <div class="control-row">
              <label>
                Line Width:
                <input type="range" min="1" max="6" [(ngModel)]="lineWidth">
                <span>{{ lineWidth() }}px</span>
              </label>
              <label>
                Symbol Size:
                <input type="range" min="0" max="12" [(ngModel)]="symbolSize">
                <span>{{ symbolSize() === 0 ? 'None' : symbolSize() }}</span>
              </label>
            </div>
            <div class="control-row">
              <label>
                Time Format:
                <select [(ngModel)]="timeFormat">
                  <option value="auto">Auto</option>
                  <option value="date">Date Only</option>
                  <option value="time">Time Only</option>
                  <option value="datetime">Date & Time</option>
                  <option value="month">Month/Year</option>
                </select>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showArea">
                Area Fill
              </label>
            </div>
          </div>
        </div>

        <div class="control-section">
          <h4>📈 Data Analysis</h4>
          <div class="analysis-options">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showTrendLine">
              Trend Line
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showMovingAverage">
              Moving Average (7-day)
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showMaxMin">
              Max/Min Points
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showOutliers">
              Outlier Detection
            </label>
          </div>
        </div>

        <div class="info-panel">
          <h4>📊 Dataset Information</h4>
          <div class="info-content">
            <div class="info-item">
              <span class="info-label">Data Points:</span>
              <span class="info-value">{{ getDatasetInfo().pointCount }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Time Range:</span>
              <span class="info-value">{{ getDatasetInfo().timeRange }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Frequency:</span>
              <span class="info-value">{{ getDatasetInfo().frequency }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./line-chart-timeseries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartTimeseriesComponent {
  echartsInstance: any;

  // Control signals
  currentDataset = signal<'stock' | 'weather' | 'sales' | 'analytics'>('stock');
  showDataZoom = signal(true);
  showBrush = signal(false);
  showToolbox = signal(true);
  smoothLines = signal(true);
  lineWidth = signal(2);
  symbolSize = signal(4);
  timeFormat = signal<'auto' | 'date' | 'time' | 'datetime' | 'month'>('auto');
  showArea = signal(false);
  showTrendLine = signal(false);
  showMovingAverage = signal(false);
  showMaxMin = signal(true);
  showOutliers = signal(false);

  // Generate time series data
  private generateTimeSeriesData() {
    const datasets = {
      stock: this.generateStockData(),
      weather: this.generateWeatherData(),
      sales: this.generateSalesData(),
      analytics: this.generateAnalyticsData()
    };
    return datasets;
  }

  private generateStockData() {
    const data: { time: Date; value: number; }[] = [];
    const startDate = new Date('2024-01-01');
    let basePrice = 100;

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Skip weekends for stock data
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      basePrice += (Math.random() - 0.5) * 5;
      basePrice = Math.max(50, Math.min(200, basePrice));

      data.push({
        time: date,
        value: Math.round(basePrice * 100) / 100
      });
    }

    return {
      title: 'Stock Price Movement (AAPL)',
      data,
      yAxisName: 'Price ($)',
      series: [{ name: 'AAPL', color: '#1f77b4' }]
    };
  }

  private generateWeatherData() {
    const data: { time: Date; temp: number; humidity: number; }[] = [];
    const startDate = new Date('2024-09-25');

    for (let i = 0; i < 168; i++) { // 7 days of hourly data
      const date = new Date(startDate);
      date.setHours(date.getHours() + i);

      const hourlyTemp = 20 + Math.sin((i % 24) / 24 * 2 * Math.PI) * 10 + (Math.random() - 0.5) * 3;
      const humidity = 60 + Math.sin((i % 24) / 24 * 2 * Math.PI + Math.PI) * 20 + (Math.random() - 0.5) * 10;

      data.push({
        time: date,
        temp: Math.round(hourlyTemp * 10) / 10,
        humidity: Math.round(humidity * 10) / 10
      });
    }

    return {
      title: 'Weather Data (7-Day Hourly)',
      data,
      yAxisName: 'Temperature (°C) / Humidity (%)',
      series: [
        { name: 'Temperature', color: '#ff7f0e' },
        { name: 'Humidity', color: '#2ca02c' }
      ]
    };
  }

  private generateSalesData() {
    const data: { time: Date; value: number; }[] = [];
    const startDate = new Date('2023-01-01');

    for (let i = 0; i < 24; i++) { // 24 months
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);

      const seasonality = Math.sin((i % 12) / 12 * 2 * Math.PI) * 20000;
      const trend = i * 1000;
      const noise = (Math.random() - 0.5) * 10000;
      const sales = 50000 + seasonality + trend + noise;

      data.push({
        time: date,
        value: Math.round(sales)
      });
    }

    return {
      title: 'Monthly Sales Revenue',
      data,
      yAxisName: 'Revenue ($)',
      series: [{ name: 'Revenue', color: '#d62728' }]
    };
  }

  private generateAnalyticsData() {
    const data: { time: Date; visitors: number; pageViews: number; }[] = [];
    const startDate = new Date('2024-09-01');

    for (let i = 0; i < 30; i++) { // 30 days
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseVisitors = isWeekend ? 800 : 1200;
      const visitors = baseVisitors + (Math.random() - 0.5) * 400;
      const pageViews = visitors * (2 + Math.random());

      data.push({
        time: date,
        visitors: Math.round(visitors),
        pageViews: Math.round(pageViews)
      });
    }

    return {
      title: 'Website Analytics (30 Days)',
      data,
      yAxisName: 'Count',
      series: [
        { name: 'Visitors', color: '#9467bd' },
        { name: 'Page Views', color: '#8c564b' }
      ]
    };
  }

  switchDataset(dataset: 'stock' | 'weather' | 'sales' | 'analytics') {
    this.currentDataset.set(dataset);
  }

  getDatasetInfo() {
    const data = this.generateTimeSeriesData()[this.currentDataset()];
    const pointCount = data.data.length;
    const firstDate = data.data[0]?.time;
    const lastDate = data.data[data.data.length - 1]?.time;

    const frequencies = {
      stock: 'Daily (Trading days)',
      weather: 'Hourly',
      sales: 'Monthly',
      analytics: 'Daily'
    };

    return {
      pointCount,
      timeRange: firstDate && lastDate ?
        `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}` : 'N/A',
      frequency: frequencies[this.currentDataset()]
    };
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  private calculateMovingAverage(data: number[], window: number = 7) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const slice = data.slice(start, i + 1);
      const average = slice.reduce((sum, val) => sum + val, 0) / slice.length;
      result.push(average);
    }
    return result;
  }

  protected readonly chartOptions = computed(() => {
    const dataset = this.generateTimeSeriesData()[this.currentDataset()];
    const series: any[] = [];

    if (this.currentDataset() === 'stock' || this.currentDataset() === 'sales') {
      const values = dataset.data.map((d: any) => d.value);
      series.push({
        name: dataset.series[0].name,
        type: 'line',
        smooth: this.smoothLines(),
        symbol: this.symbolSize() > 0 ? 'circle' : 'none',
        symbolSize: this.symbolSize(),
        lineStyle: {
          width: this.lineWidth(),
          color: dataset.series[0].color
        },
        areaStyle: this.showArea() ? {
          color: dataset.series[0].color + '20'
        } : undefined,
        data: dataset.data.map((d: any) => [d.time, d.value]),
        markPoint: this.showMaxMin() ? {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        } : undefined
      });

      if (this.showMovingAverage()) {
        const ma = this.calculateMovingAverage(values);
        series.push({
          name: '7-Day MA',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: '#ff7f0e',
            type: 'dashed'
          },
          data: dataset.data.map((d: any, i: number) => [d.time, ma[i]])
        });
      }
    } else if (this.currentDataset() === 'weather') {
      series.push({
        name: 'Temperature',
        type: 'line',
        smooth: this.smoothLines(),
        symbol: this.symbolSize() > 0 ? 'circle' : 'none',
        symbolSize: this.symbolSize(),
        lineStyle: {
          width: this.lineWidth(),
          color: '#ff7f0e'
        },
        areaStyle: this.showArea() ? {
          color: '#ff7f0e20'
        } : undefined,
        data: dataset.data.map((d: any) => [d.time, d.temp])
      });
      series.push({
        name: 'Humidity',
        type: 'line',
        smooth: this.smoothLines(),
        symbol: this.symbolSize() > 0 ? 'circle' : 'none',
        symbolSize: this.symbolSize(),
        lineStyle: {
          width: this.lineWidth(),
          color: '#2ca02c'
        },
        data: dataset.data.map((d: any) => [d.time, d.humidity])
      });
    } else if (this.currentDataset() === 'analytics') {
      series.push({
        name: 'Visitors',
        type: 'line',
        smooth: this.smoothLines(),
        symbol: this.symbolSize() > 0 ? 'circle' : 'none',
        symbolSize: this.symbolSize(),
        lineStyle: {
          width: this.lineWidth(),
          color: '#9467bd'
        },
        areaStyle: this.showArea() ? {
          color: '#9467bd20'
        } : undefined,
        data: dataset.data.map((d: any) => [d.time, d.visitors])
      });
      series.push({
        name: 'Page Views',
        type: 'line',
        smooth: this.smoothLines(),
        symbol: this.symbolSize() > 0 ? 'circle' : 'none',
        symbolSize: this.symbolSize(),
        lineStyle: {
          width: this.lineWidth(),
          color: '#8c564b'
        },
        data: dataset.data.map((d: any) => [d.time, d.pageViews])
      });
    }

    return {
      title: {
        text: dataset.title,
        subtext: 'Interactive Time Series Analysis',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: true
        },
        formatter: (params: any) => {
          const time = new Date(params[0].axisValue);
          let result = this.formatTooltipTime(time) + '<br/>';
          params.forEach((item: any) => {
            result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
            result += `${item.seriesName}: ${this.formatTooltipValue(item.value[1])}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: series.map(s => s.name),
        top: '12%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: this.showDataZoom() ? '20%' : '8%',
        top: '20%',
        containLabel: true
      },
      toolbox: this.showToolbox() ? {
        show: true,
        feature: {
          saveAsImage: {},
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          dataZoom: {}
        }
      } : undefined,
      brush: this.showBrush() ? {
        toolbox: ['rect', 'polygon', 'clear'],
        xAxisIndex: 0
      } : undefined,
      dataZoom: this.showDataZoom() ? [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          start: 0,
          end: 100,
          height: 30
        }
      ] : undefined,
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: (value: number) => this.formatAxisTime(new Date(value))
        }
      },
      yAxis: {
        type: 'value',
        name: dataset.yAxisName,
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: (value: number) => this.formatAxisValue(value)
        }
      },
      series: series
    };
  });

  private formatAxisTime(date: Date): string {
    switch (this.timeFormat()) {
      case 'date':
        return date.toLocaleDateString();
      case 'time':
        return date.toLocaleTimeString();
      case 'datetime':
        return date.toLocaleString();
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      default:
        return this.currentDataset() === 'weather' ?
          date.toLocaleDateString() + '\n' + date.toLocaleTimeString() :
          date.toLocaleDateString();
    }
  }

  private formatTooltipTime(date: Date): string {
    return this.currentDataset() === 'weather' ?
      date.toLocaleString() :
      date.toLocaleDateString();
  }

  private formatTooltipValue(value: number): string {
    if (this.currentDataset() === 'stock') {
      return `$${value.toFixed(2)}`;
    } else if (this.currentDataset() === 'weather') {
      return value.toFixed(1);
    } else if (this.currentDataset() === 'sales') {
      return `$${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  }

  private formatAxisValue(value: number): string {
    if (this.currentDataset() === 'stock') {
      return `$${value}`;
    } else if (this.currentDataset() === 'sales') {
      return `$${(value / 1000)}K`;
    } else if (this.currentDataset() === 'analytics') {
      return `${(value / 1000)}K`;
    }
    return value.toString();
  }
}