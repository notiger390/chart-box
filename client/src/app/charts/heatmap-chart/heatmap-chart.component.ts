import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heatmap-chart',
  standalone: true,
  imports: [NgxEchartsModule, FormsModule, CommonModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  template: `
    <div class="heatmap-container">
      <div
        echarts
        [options]="chartOptions()"
        (chartInit)="onChartInit($event)"
        class="chart">
      </div>

      <div class="controls">
        <h3>Heatmap Chart Controls</h3>

        <div class="control-section">
          <h4>📊 Data Types</h4>
          <div class="dataset-grid">
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'sales'"
              (click)="switchDataset('sales')">
              <div class="card-icon">💰</div>
              <div class="card-title">Sales Performance</div>
              <div class="card-subtitle">Product × Region</div>
            </button>
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'github'"
              (click)="switchDataset('github')">
              <div class="card-icon">📅</div>
              <div class="card-title">GitHub Activity</div>
              <div class="card-subtitle">Commit Calendar</div>
            </button>
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'correlation'"
              (click)="switchDataset('correlation')">
              <div class="card-icon">🔗</div>
              <div class="card-title">Correlation Matrix</div>
              <div class="card-subtitle">Feature Analysis</div>
            </button>
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'temperature'"
              (click)="switchDataset('temperature')">
              <div class="card-icon">🌡️</div>
              <div class="card-title">Temperature Map</div>
              <div class="card-subtitle">Time × Location</div>
            </button>
          </div>
        </div>

        <div class="control-section">
          <h4>🎨 Visual Settings</h4>
          <div class="visual-controls">
            <div class="control-row">
              <label>
                Color Scheme:
                <select [(ngModel)]="colorScheme">
                  <option value="blues">Blues</option>
                  <option value="greens">Greens</option>
                  <option value="reds">Reds</option>
                  <option value="viridis">Viridis</option>
                  <option value="plasma">Plasma</option>
                  <option value="coolwarm">Cool-Warm</option>
                </select>
              </label>
              <label>
                Cell Size:
                <input type="range" min="15" max="40" [(ngModel)]="cellSize">
                <span>{{ cellSize() }}px</span>
              </label>
            </div>
            <div class="control-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showValues">
                Show Values
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showBorder">
                Cell Borders
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="enableBlur">
                Blur Effect
              </label>
            </div>
          </div>
        </div>

        <div class="control-section">
          <h4>📈 Data Analysis</h4>
          <div class="analysis-controls">
            <div class="control-row">
              <label>
                Min Threshold:
                <input type="range" min="0" max="50" [(ngModel)]="minThreshold">
                <span>{{ minThreshold() }}%</span>
              </label>
              <label>
                Max Threshold:
                <input type="range" min="50" max="100" [(ngModel)]="maxThreshold">
                <span>{{ maxThreshold() }}%</span>
              </label>
            </div>
            <div class="control-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showStatistics">
                Show Statistics Panel
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="highlightExtremes">
                Highlight Extremes
              </label>
            </div>
          </div>
        </div>

        @if (showStatistics()) {
          <div class="stats-panel">
            <h4>📊 Data Statistics</h4>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Data Points</div>
                <div class="stat-value">{{ getStatistics().totalPoints }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Max Value</div>
                <div class="stat-value">{{ getStatistics().maxValue }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Min Value</div>
                <div class="stat-value">{{ getStatistics().minValue }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Average</div>
                <div class="stat-value">{{ getStatistics().average }}</div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./heatmap-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeatmapChartComponent {
  echartsInstance: any;

  // Control signals
  currentDataset = signal<'sales' | 'github' | 'correlation' | 'temperature'>('sales');
  colorScheme = signal<'blues' | 'greens' | 'reds' | 'viridis' | 'plasma' | 'coolwarm'>('blues');
  cellSize = signal(20);
  showValues = signal(true);
  showBorder = signal(true);
  enableBlur = signal(false);
  minThreshold = signal(0);
  maxThreshold = signal(100);
  showStatistics = signal(true);
  highlightExtremes = signal(false);

  // Color schemes definition
  private colorSchemes = {
    blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    viridis: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b'],
    plasma: ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26'],
    coolwarm: ['#3b4cc0', '#5977e3', '#7b9ff0', '#9ebcf5', '#c0d4f7', '#dde5f0', '#f2e5d5', '#f5c5a0', '#ed9b6a']
  };

  // Dataset generation methods
  private generateSalesData() {
    const products = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const data = [];

    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < regions.length; j++) {
        const value = Math.floor(Math.random() * 1000) + 100;
        data.push([j, i, value]);
      }
    }

    return {
      title: 'Sales Performance by Product and Region',
      xAxisData: regions,
      yAxisData: products,
      data,
      unit: 'Sales ($K)'
    };
  }

  private generateGithubData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const data = [];

    for (let i = 0; i < months.length; i++) {
      for (let j = 0; j < weeks.length; j++) {
        // Simulate commit activity (higher in middle of year)
        const baseActivity = Math.abs(6 - i) < 3 ? 0.8 : 0.3;
        const randomFactor = Math.random();
        const commits = Math.floor(baseActivity * randomFactor * 50);
        data.push([i, j, commits]);
      }
    }

    return {
      title: 'GitHub Commit Activity Calendar',
      xAxisData: months,
      yAxisData: weeks,
      data,
      unit: 'Commits'
    };
  }

  private generateCorrelationData() {
    const features = ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E', 'Feature F'];
    const data = [];

    for (let i = 0; i < features.length; i++) {
      for (let j = 0; j < features.length; j++) {
        let correlation;
        if (i === j) {
          correlation = 1; // Perfect correlation with itself
        } else {
          // Generate realistic correlation values
          correlation = (Math.random() - 0.5) * 2;
          correlation = Math.round(correlation * 100) / 100;
        }
        data.push([i, j, correlation]);
      }
    }

    return {
      title: 'Feature Correlation Matrix',
      xAxisData: features,
      yAxisData: features,
      data,
      unit: 'Correlation'
    };
  }

  private generateTemperatureData() {
    const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
    const locations = ['Location A', 'Location B', 'Location C', 'Location D', 'Location E'];
    const data = [];

    for (let i = 0; i < hours.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        // Simulate temperature variation throughout the day
        const baseTemp = 20 + Math.sin((i - 6) / 24 * 2 * Math.PI) * 10;
        const locationVariation = (Math.random() - 0.5) * 10;
        const temperature = Math.round((baseTemp + locationVariation) * 10) / 10;
        data.push([i, j, temperature]);
      }
    }

    return {
      title: 'Temperature Distribution by Time and Location',
      xAxisData: hours,
      yAxisData: locations,
      data,
      unit: 'Temperature (°C)'
    };
  }

  switchDataset(dataset: 'sales' | 'github' | 'correlation' | 'temperature') {
    this.currentDataset.set(dataset);
  }

  getCurrentData() {
    switch (this.currentDataset()) {
      case 'sales': return this.generateSalesData();
      case 'github': return this.generateGithubData();
      case 'correlation': return this.generateCorrelationData();
      case 'temperature': return this.generateTemperatureData();
      default: return this.generateSalesData();
    }
  }

  getStatistics() {
    const data = this.getCurrentData();
    const values = data.data.map(item => item[2]);
    const totalPoints = values.length;
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const average = Math.round((values.reduce((a, b) => a + b, 0) / totalPoints) * 100) / 100;

    return {
      totalPoints,
      maxValue: data.unit.includes('°C') ? `${maxValue}°C` :
               data.unit.includes('$') ? `$${maxValue}K` :
               maxValue.toString(),
      minValue: data.unit.includes('°C') ? `${minValue}°C` :
               data.unit.includes('$') ? `$${minValue}K` :
               minValue.toString(),
      average: data.unit.includes('°C') ? `${average}°C` :
              data.unit.includes('$') ? `$${average}K` :
              average.toString()
    };
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  protected readonly chartOptions = computed(() => {
    const dataset = this.getCurrentData();
    const colorPalette = this.colorSchemes[this.colorScheme()];

    // Apply thresholds
    const values = dataset.data.map(item => item[2]);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal;

    const minThresholdValue = minVal + (range * this.minThreshold() / 100);
    const maxThresholdValue = minVal + (range * this.maxThreshold() / 100);

    const filteredData = dataset.data
      .filter(item => item[2] >= minThresholdValue && item[2] <= maxThresholdValue)
      .map(item => {
        const value = item[2];

        // Highlight extremes
        if (this.highlightExtremes()) {
          if (value === maxVal || value === minVal) {
            return [...item, { itemStyle: { borderColor: '#ff4757', borderWidth: 3 } }];
          }
        }

        return item;
      });

    return {
      title: {
        text: dataset.title,
        subtext: `${dataset.unit} visualization`,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const xLabel = dataset.xAxisData[params.data[0]];
          const yLabel = dataset.yAxisData[params.data[1]];
          const value = params.data[2];
          const unit = dataset.unit;

          let formattedValue = value;
          if (unit.includes('°C')) {
            formattedValue = `${value}°C`;
          } else if (unit.includes('$')) {
            formattedValue = `$${value}K`;
          }

          return `<div style="font-weight: bold;">${xLabel} × ${yLabel}</div>
                  <div>${unit}: ${formattedValue}</div>`;
        }
      },
      grid: {
        height: '60%',
        top: '15%',
        left: '10%',
        right: '10%'
      },
      xAxis: {
        type: 'category',
        data: dataset.xAxisData,
        splitArea: {
          show: true
        },
        axisLabel: {
          interval: 0,
          rotate: dataset.xAxisData.length > 8 ? 45 : 0
        }
      },
      yAxis: {
        type: 'category',
        data: dataset.yAxisData,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: minThresholdValue,
        max: maxThresholdValue,
        calculable: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        inRange: {
          color: colorPalette
        },
        text: ['High', 'Low'],
        textStyle: {
          color: '#333'
        }
      },
      series: [{
        name: dataset.unit,
        type: 'heatmap',
        data: filteredData,
        label: {
          show: this.showValues(),
          formatter: (params: any) => {
            const value = params.data[2];
            if (dataset.unit.includes('°C')) {
              return `${value}°C`;
            } else if (dataset.unit.includes('$')) {
              return `$${value}K`;
            }
            return value;
          },
          fontSize: Math.max(8, this.cellSize() / 3)
        },
        itemStyle: {
          borderColor: this.showBorder() ? '#fff' : 'transparent',
          borderWidth: this.showBorder() ? 1 : 0
        },
        emphasis: {
          itemStyle: {
            shadowBlur: this.enableBlur() ? 10 : 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            borderColor: '#333',
            borderWidth: 2
          }
        }
      }],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicInOut' as const
    };
  });
}