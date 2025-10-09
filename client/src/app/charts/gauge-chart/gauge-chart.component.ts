import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface GaugeData {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
}

@Component({
  selector: 'app-gauge-chart',
  standalone: true,
  imports: [NgxEchartsModule, FormsModule, CommonModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  template: `
    <div class="gauge-container">
      <div
        echarts
        [options]="chartOptions()"
        (chartInit)="onChartInit($event)"
        class="chart">
      </div>

      <div class="controls">
        <h3>Gauge Chart Controls</h3>

        <div class="control-section">
          <h4>📊 Gauge Types</h4>
          <div class="gauge-grid">
            <button
              class="gauge-card"
              [class.active]="currentGauge() === 'performance'"
              (click)="switchGauge('performance')">
              <div class="card-icon">⚡</div>
              <div class="card-title">Performance</div>
              <div class="card-subtitle">System Metrics</div>
            </button>
            <button
              class="gauge-card"
              [class.active]="currentGauge() === 'speed'"
              (click)="switchGauge('speed')">
              <div class="card-icon">🚗</div>
              <div class="card-title">Speed</div>
              <div class="card-subtitle">Vehicle Dashboard</div>
            </button>
            <button
              class="gauge-card"
              [class.active]="currentGauge() === 'temperature'"
              (click)="switchGauge('temperature')">
              <div class="card-icon">🌡️</div>
              <div class="card-title">Temperature</div>
              <div class="card-subtitle">Climate Monitor</div>
            </button>
            <button
              class="gauge-card"
              [class.active]="currentGauge() === 'progress'"
              (click)="switchGauge('progress')">
              <div class="card-icon">📈</div>
              <div class="card-title">Progress</div>
              <div class="card-subtitle">Project Status</div>
            </button>
          </div>
        </div>

        <div class="control-section">
          <h4>🎨 Visual Settings</h4>
          <div class="visual-controls">
            <div class="control-row">
              <label>
                Gauge Style:
                <select [(ngModel)]="gaugeStyle">
                  <option value="default">Default</option>
                  <option value="arc">Arc Style</option>
                  <option value="minimal">Minimal</option>
                  <option value="modern">Modern</option>
                </select>
              </label>
              <label>
                Color Theme:
                <select [(ngModel)]="colorTheme">
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="orange">Orange</option>
                  <option value="red">Red</option>
                  <option value="purple">Purple</option>
                  <option value="gradient">Gradient</option>
                </select>
              </label>
            </div>
            <div class="control-row">
              <label>
                Start Angle:
                <input type="range" min="180" max="270" [(ngModel)]="startAngle">
                <span>{{ startAngle() }}°</span>
              </label>
              <label>
                End Angle:
                <input type="range" min="270" max="360" [(ngModel)]="endAngle">
                <span>{{ endAngle() }}°</span>
              </label>
            </div>
          </div>
        </div>

        <div class="control-section">
          <h4>⚙️ Display Options</h4>
          <div class="display-controls">
            <div class="control-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showTitle">
                Show Title
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showDetail">
                Show Details
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showProgress">
                Show Progress Ring
              </label>
            </div>
            <div class="control-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="enableAnimation">
                Enable Animation
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showPointer">
                Show Pointer
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showAnchor">
                Show Anchor
              </label>
            </div>
          </div>
        </div>

        <div class="control-section">
          <h4>🎛️ Value Control</h4>
          <div class="value-controls">
            <div class="control-row">
              <label>
                Current Value:
                <input
                  type="range"
                  [min]="getCurrentData().min"
                  [max]="getCurrentData().max"
                  [(ngModel)]="currentValue">
                <span>{{ currentValue() }} {{ getCurrentData().unit }}</span>
              </label>
            </div>
            <div class="control-row">
              <button class="simulate-btn" (click)="simulateRealTimeData()">
                {{ isSimulating() ? 'Stop Simulation' : 'Start Simulation' }}
              </button>
            </div>
          </div>
        </div>

        @if (showDetail()) {
          <div class="stats-panel">
            <h4>📊 Gauge Statistics</h4>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Current</div>
                <div class="stat-value">{{ currentValue() }} {{ getCurrentData().unit }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Percentage</div>
                <div class="stat-value">{{ getPercentage() }}%</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Min Value</div>
                <div class="stat-value">{{ getCurrentData().min }} {{ getCurrentData().unit }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Max Value</div>
                <div class="stat-value">{{ getCurrentData().max }} {{ getCurrentData().unit }}</div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./gauge-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GaugeChartComponent {
  echartsInstance: any;
  private intervalId: any;

  currentGauge = signal<'performance' | 'speed' | 'temperature' | 'progress'>('performance');
  gaugeStyle = signal<'default' | 'arc' | 'minimal' | 'modern'>('default');
  colorTheme = signal<'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gradient'>('blue');
  startAngle = signal(225);
  endAngle = signal(315);
  showTitle = signal(true);
  showDetail = signal(true);
  showProgress = signal(true);
  enableAnimation = signal(true);
  showPointer = signal(true);
  showAnchor = signal(true);
  currentValue = signal(75);
  isSimulating = signal(false);

  private colorThemes = {
    blue: {
      color: ['#91d5ff', '#40a9ff', '#1890ff', '#0050b3'],
      backgroundColor: '#f0f9ff'
    },
    green: {
      color: ['#b7eb8f', '#73d13d', '#52c41a', '#237804'],
      backgroundColor: '#f6ffed'
    },
    orange: {
      color: ['#ffd591', '#ffb366', '#fa8c16', '#ad4e00'],
      backgroundColor: '#fff7e6'
    },
    red: {
      color: ['#ffb3b3', '#ff7875', '#ff4d4f', '#a8071a'],
      backgroundColor: '#fff2f0'
    },
    purple: {
      color: ['#d3adf7', '#b37feb', '#9254de', '#391085'],
      backgroundColor: '#f9f0ff'
    },
    gradient: {
      color: [
        { offset: 0, color: '#667eea' },
        { offset: 0.5, color: '#764ba2' },
        { offset: 1, color: '#f093fb' }
      ],
      backgroundColor: '#f8f9ff'
    }
  };

  private gaugeConfigs = {
    performance: { name: 'CPU Usage', value: 75, unit: '%', min: 0, max: 100 },
    speed: { name: 'Speed', value: 85, unit: 'km/h', min: 0, max: 200 },
    temperature: { name: 'Temperature', value: 23, unit: '°C', min: -20, max: 50 },
    progress: { name: 'Project Progress', value: 68, unit: '%', min: 0, max: 100 }
  };

  switchGauge(gauge: 'performance' | 'speed' | 'temperature' | 'progress') {
    this.currentGauge.set(gauge);
    const config = this.gaugeConfigs[gauge];
    this.currentValue.set(config.value);
  }

  getCurrentData(): GaugeData {
    return this.gaugeConfigs[this.currentGauge()];
  }

  getPercentage(): number {
    const data = this.getCurrentData();
    const percentage = ((this.currentValue() - data.min) / (data.max - data.min)) * 100;
    return Math.round(percentage * 10) / 10;
  }

  simulateRealTimeData() {
    if (this.isSimulating()) {
      clearInterval(this.intervalId);
      this.isSimulating.set(false);
    } else {
      this.isSimulating.set(true);
      const data = this.getCurrentData();

      this.intervalId = setInterval(() => {
        const currentVal = this.currentValue();
        const change = (Math.random() - 0.5) * (data.max - data.min) * 0.1;
        let newValue = currentVal + change;

        newValue = Math.max(data.min, Math.min(data.max, newValue));
        this.currentValue.set(Math.round(newValue * 10) / 10);
      }, 1000);
    }
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  protected readonly chartOptions = computed(() => {
    const data = this.getCurrentData();
    const theme = this.colorThemes[this.colorTheme()];
    const value = this.currentValue();
    const percentage = this.getPercentage();

    const getGaugeStyle = () => {
      const baseStyle = {
        min: data.min,
        max: data.max,
        startAngle: this.startAngle(),
        endAngle: this.endAngle(),
        clockwise: true,
        radius: '75%',
        center: ['50%', '60%']
      };

      switch (this.gaugeStyle()) {
        case 'arc':
          return {
            ...baseStyle,
            radius: '85%',
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                width: 30,
                color: Array.isArray(theme.color) ? [
                  [0.3, theme.color[0]],
                  [0.7, theme.color[1]],
                  [1, theme.color[2]]
                ] : theme.color
              }
            }
          };
        case 'minimal':
          return {
            ...baseStyle,
            splitNumber: 5,
            axisLine: {
              lineStyle: {
                width: 2,
                color: [[1, '#e0e0e0']]
              }
            }
          };
        case 'modern':
          return {
            ...baseStyle,
            radius: '70%',
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 20,
                color: Array.isArray(theme.color) ? [
                  [percentage / 100, theme.color[2] || theme.color],
                  [1, '#f0f0f0']
                ] : [[percentage / 100, theme.color], [1, '#f0f0f0']]
              }
            }
          };
        default:
          return {
            ...baseStyle,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                width: 10,
                color: Array.isArray(theme.color) ? [
                  [0.2, theme.color[0]],
                  [0.8, theme.color[1]],
                  [1, theme.color[2]]
                ] : theme.color
              }
            }
          };
      }
    };

    return {
      backgroundColor: theme.backgroundColor,
      title: this.showTitle() ? {
        text: data.name,
        left: 'center',
        top: '10%',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333'
        }
      } : undefined,
      series: [
        {
          type: 'gauge',
          ...getGaugeStyle(),
          pointer: {
            show: this.showPointer(),
            length: '60%',
            width: 6,
            itemStyle: {
              color: Array.isArray(theme.color) ? theme.color[2] : theme.color
            }
          },
          anchor: {
            show: this.showAnchor(),
            showAbove: true,
            size: 18,
            itemStyle: {
              borderWidth: 8,
              borderColor: Array.isArray(theme.color) ? theme.color[2] : theme.color,
              color: '#fff'
            }
          },
          axisTick: {
            distance: -30,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          axisLabel: {
            color: '#333',
            distance: 40,
            fontSize: 12,
            formatter: (value: number) => {
              if (data.unit === '°C') return `${value}°`;
              if (data.unit === '%') return `${value}%`;
              return value.toString();
            }
          },
          detail: {
            valueAnimation: this.enableAnimation(),
            width: 60,
            height: 40,
            fontSize: 24,
            color: Array.isArray(theme.color) ? theme.color[2] : theme.color,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: Array.isArray(theme.color) ? theme.color[1] : theme.color,
            borderWidth: 2,
            borderRadius: 8,
            offsetCenter: [0, '35%'],
            formatter: (value: number) => {
              return `{value|${value}}{unit|${data.unit}}`;
            },
            rich: {
              value: {
                fontSize: 20,
                fontWeight: 'bold',
                color: Array.isArray(theme.color) ? theme.color[2] : theme.color
              },
              unit: {
                fontSize: 14,
                color: '#666',
                padding: [0, 0, 0, 4]
              }
            }
          },
          data: [{
            value: value,
            name: data.name
          }],
          animation: this.enableAnimation(),
          animationDuration: this.enableAnimation() ? 1000 : 0,
          animationEasing: 'cubicInOut' as const
        },
        // Progress ring (if enabled)
        ...(this.showProgress() ? [{
          type: 'gauge',
          radius: '90%',
          center: ['50%', '60%'],
          min: 0,
          max: 100,
          startAngle: 225,
          endAngle: 315,
          splitNumber: 4,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [percentage / 100, Array.isArray(theme.color) ? theme.color[1] : theme.color],
                [1, '#f0f0f0']
              ]
            }
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          anchor: { show: false },
          detail: { show: false },
          data: [{ value: percentage }]
        }] : [])
      ],
      animation: this.enableAnimation(),
      animationDuration: this.enableAnimation() ? 1000 : 0
    };
  });
}