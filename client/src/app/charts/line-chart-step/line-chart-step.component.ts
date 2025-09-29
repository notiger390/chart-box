import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-line-chart-step',
  standalone: true,
  imports: [NgxEchartsModule, FormsModule, CommonModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  template: `
    <div class="step-chart-container">
      <div
        echarts
        [options]="chartOptions()"
        (chartInit)="onChartInit($event)"
        class="chart">
      </div>

      <div class="controls">
        <h3>Step Line Chart Controls</h3>

        <div class="control-section">
          <h4>Step Types</h4>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="stepType" value="start" [(ngModel)]="stepType">
              Start (⬜️ └─)
            </label>
            <label class="radio-label">
              <input type="radio" name="stepType" value="middle" [(ngModel)]="stepType">
              Middle (⬜️ ⊥─)
            </label>
            <label class="radio-label">
              <input type="radio" name="stepType" value="end" [(ngModel)]="stepType">
              End (⬜️ ─┐)
            </label>
            <label class="radio-label">
              <input type="radio" name="stepType" value="false" [(ngModel)]="stepType">
              No Step (Normal Line)
            </label>
          </div>
        </div>

        <div class="control-section">
          <h4>Line Style</h4>
          <div class="control-row">
            <label>
              Line Width:
              <input type="range" min="1" max="8" [(ngModel)]="lineWidth">
              <span>{{ lineWidth() }}px</span>
            </label>
            <label>
              Symbol Size:
              <input type="range" min="0" max="15" [(ngModel)]="symbolSize">
              <span>{{ symbolSize() === 0 ? 'None' : symbolSize() }}</span>
            </label>
          </div>
          <div class="control-row">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showArea">
              Show Area Fill
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showLabel">
              Show Value Labels
            </label>
          </div>
        </div>

        <div class="control-section">
          <h4>Data Sets</h4>
          <div class="dataset-buttons">
            <button
              class="dataset-button"
              [class.active]="currentDataset() === 'sales'"
              (click)="switchDataset('sales')">
              📊 Sales Data
            </button>
            <button
              class="dataset-button"
              [class.active]="currentDataset() === 'temperature'"
              (click)="switchDataset('temperature')">
              🌡️ Temperature
            </button>
            <button
              class="dataset-button"
              [class.active]="currentDataset() === 'performance'"
              (click)="switchDataset('performance')">
              ⚡ Performance
            </button>
            <button
              class="dataset-button"
              [class.active]="currentDataset() === 'stock'"
              (click)="switchDataset('stock')">
              📈 Stock Price
            </button>
          </div>
        </div>

        <div class="control-section">
          <h4>Animation & Effects</h4>
          <div class="control-row">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="animationEnabled">
              Enable Animation
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="connectNulls">
              Connect Null Values
            </label>
          </div>
        </div>

        <div class="info-section">
          <h4>ℹ️ Step Line Chart Information</h4>
          <div class="info-content">
            <p><strong>Use Cases:</strong></p>
            <ul>
              <li>📊 Sales targets and achievements over time</li>
              <li>🌡️ Temperature readings from sensors</li>
              <li>⚡ Performance metrics and thresholds</li>
              <li>📈 Stock prices at specific intervals</li>
              <li>🎯 Status changes and state transitions</li>
            </ul>
            <p><strong>Step Types:</strong></p>
            <ul>
              <li><strong>Start:</strong> Value changes at the beginning of each period</li>
              <li><strong>Middle:</strong> Value changes at the middle of each period</li>
              <li><strong>End:</strong> Value changes at the end of each period</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./line-chart-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartStepComponent {
  echartsInstance: any;

  // Control signals
  stepType = signal<'start' | 'middle' | 'end' | 'false'>('start');
  lineWidth = signal(3);
  symbolSize = signal(8);
  showArea = signal(true);
  showLabel = signal(false);
  animationEnabled = signal(true);
  connectNulls = signal(false);
  currentDataset = signal<'sales' | 'temperature' | 'performance' | 'stock'>('sales');

  // Data sets
  private datasets = {
    sales: {
      title: 'Monthly Sales Target vs Achievement',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        {
          name: 'Target',
          data: [1000, 1100, 1200, 1150, 1300, 1250, 1400, 1350, 1500, 1450, 1600, 1700],
          color: '#e74c3c'
        },
        {
          name: 'Achievement',
          data: [950, 1150, 1100, 1200, 1280, 1300, 1380, 1420, 1480, 1520, 1580, 1650],
          color: '#2ecc71'
        }
      ]
    },
    temperature: {
      title: 'Daily Temperature Range',
      categories: ['6:00', '9:00', '12:00', '15:00', '18:00', '21:00', '0:00', '3:00'],
      series: [
        {
          name: 'Indoor (°C)',
          data: [18, 20, 24, 26, 25, 22, 20, 18],
          color: '#3498db'
        },
        {
          name: 'Outdoor (°C)',
          data: [12, 16, 22, 28, 26, 20, 16, 14],
          color: '#f39c12'
        }
      ]
    },
    performance: {
      title: 'System Performance Metrics',
      categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      series: [
        {
          name: 'CPU Usage (%)',
          data: [25, 30, 85, 90, 75, 40],
          color: '#9b59b6'
        },
        {
          name: 'Memory Usage (%)',
          data: [45, 48, 65, 70, 68, 52],
          color: '#1abc9c'
        }
      ]
    },
    stock: {
      title: 'Stock Price Movement (Hourly)',
      categories: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      series: [
        {
          name: 'Stock A ($)',
          data: [100, 105, 102, 108, 106, 110, 108, 112],
          color: '#e67e22'
        },
        {
          name: 'Stock B ($)',
          data: [85, 88, 87, 90, 92, 89, 91, 94],
          color: '#34495e'
        }
      ]
    }
  };

  switchDataset(dataset: 'sales' | 'temperature' | 'performance' | 'stock') {
    this.currentDataset.set(dataset);
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  protected readonly chartOptions = computed(() => {
    const dataset = this.datasets[this.currentDataset()];
    const stepValue = this.stepType() === 'false' ? false : (this.stepType() as 'start' | 'middle' | 'end');

    return {
      title: {
        text: dataset.title,
        subtext: `Step Type: ${this.stepType() === 'false' ? 'Normal Line' : this.stepType().toUpperCase()}`,
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
          animation: true,
          label: {
            backgroundColor: '#505765'
          }
        },
        formatter: (params: any) => {
          let result = params[0].name + '<br/>';
          params.forEach((item: any) => {
            result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
            result += `${item.seriesName}: ${item.value}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: dataset.series.map(s => s.name),
        top: '12%',
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: '25%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dataset.categories,
        axisLine: {
          lineStyle: {
            color: '#333'
          }
        },
        axisLabel: {
          fontSize: 11,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: this.getYAxisName(),
        nameLocation: 'middle',
        nameGap: 50,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#333'
          }
        },
        axisLabel: {
          formatter: (value: number) => {
            return this.formatYAxisValue(value);
          },
          fontSize: 11
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#e0e0e0'
          }
        }
      },
      series: dataset.series.map(series => ({
        name: series.name,
        type: 'line',
        step: stepValue,
        symbol: this.symbolSize() > 0 ? 'circle' : 'none',
        symbolSize: this.symbolSize(),
        lineStyle: {
          width: this.lineWidth(),
          color: series.color
        },
        areaStyle: this.showArea() ? {
          color: series.color + '20',
          opacity: 0.3
        } : undefined,
        label: {
          show: this.showLabel(),
          position: 'top',
          formatter: '{c}',
          fontSize: 10,
          color: series.color
        },
        emphasis: {
          focus: 'series',
          blurScope: 'coordinateSystem'
        },
        data: series.data,
        connectNulls: this.connectNulls()
      })),
      animation: this.animationEnabled(),
      animationDuration: 1000,
      animationEasing: 'cubicInOut' as const
    };
  });

  private getYAxisName(): string {
    const names = {
      sales: 'Units',
      temperature: 'Temperature',
      performance: 'Percentage (%)',
      stock: 'Price ($)'
    };
    return names[this.currentDataset()];
  }

  private formatYAxisValue(value: number): string {
    const current = this.currentDataset();
    if (current === 'temperature') {
      return `${value}°C`;
    } else if (current === 'performance') {
      return `${value}%`;
    } else if (current === 'stock') {
      return `$${value}`;
    }
    return value.toString();
  }
}