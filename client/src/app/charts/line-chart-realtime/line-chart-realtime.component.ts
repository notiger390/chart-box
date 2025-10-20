import { ChangeDetectionStrategy, Component, computed, signal, OnDestroy, OnInit } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-line-chart-realtime',
  standalone: true,
  imports: [NgxEchartsModule, FormsModule, CommonModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  template: `
    <div class="realtime-container">
      <div
        echarts
        [options]="chartOptions()"
        (chartInit)="onChartInit($event)"
        class="chart">
      </div>

      <div class="controls">
        <h3>リアルタイムラインチャートの設定</h3>

        <div class="control-section">
          <button
            class="control-button"
            [class.active]="isRunning()"
            (click)="toggleAnimation()">
            {{ isRunning() ? '⏸️ 一時停止' : '▶️ 開始' }} リアルタイム更新
          </button>

          <label>
            更新間隔:
            <select [(ngModel)]="updateInterval" (change)="onIntervalChange()">
              <option [value]="100">100ms（超高速）</option>
              <option [value]="500">500ms（高速）</option>
              <option [value]="1000">1秒（標準）</option>
              <option [value]="2000">2秒（やや遅い）</option>
              <option [value]="5000">5秒（低速）</option>
            </select>
          </label>

          <label>
            データ点数:
            <input
              type="range"
              min="20"
              max="200"
              [(ngModel)]="maxDataPoints"
              (input)="onMaxPointsChange()">
            <span>{{ maxDataPoints() }}</span>
          </label>

          <label>
            データの変動幅:
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              [(ngModel)]="volatility">
            <span>{{ volatility() }}倍</span>
          </label>

          <button class="control-button" (click)="resetData()">
            🔄 データをリセット
          </button>
        </div>

        <div class="stats">
          <div class="stat-item">
            <span class="label">現在のFPS:</span>
            <span class="value">{{ fps() }}</span>
          </div>
          <div class="stat-item">
            <span class="label">データ点数:</span>
            <span class="value">{{ dataPoints().length }}</span>
          </div>
          <div class="stat-item">
            <span class="label">最新値:</span>
            <span class="value">
              A: {{ latestValues().series1 }},
              B: {{ latestValues().series2 }},
              C: {{ latestValues().series3 }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./line-chart-realtime.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartRealtimeComponent implements OnInit, OnDestroy {
  echartsInstance: any;
  private intervalId: any;
  private lastTime = Date.now();
  private frameCount = 0;

  // Control signals
  isRunning = signal(false);
  updateInterval = signal(1000);
  maxDataPoints = signal(50);
  volatility = signal(1);
  fps = signal(0);

  // Data signals
  protected dataPoints = signal<{ time: Date; series1: number; series2: number; series3: number; }[]>([]);
  private baseValues = { series1: 100, series2: 80, series3: 60 };

  // Computed values for display
  latestValues = computed(() => {
    const latest = this.dataPoints().slice(-1)[0];
    return latest ? {
      series1: latest.series1.toFixed(1),
      series2: latest.series2.toFixed(1),
      series3: latest.series3.toFixed(1)
    } : { series1: '0', series2: '0', series3: '0' };
  });

  ngOnInit() {
    this.initializeData();
    this.startFpsCounter();
  }

  ngOnDestroy() {
    this.stopAnimation();
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
    }
  }

  private fpsInterval: any;

  private startFpsCounter() {
    this.fpsInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastTime;
      this.fps.set(Math.round((this.frameCount * 1000) / elapsed));
      this.frameCount = 0;
      this.lastTime = now;
    }, 1000);
  }

  initializeData() {
    const initialData = [];
    const now = new Date();

    for (let i = 0; i < this.maxDataPoints(); i++) {
      const time = new Date(now.getTime() - (this.maxDataPoints() - i) * 1000);
      initialData.push({
        time,
        series1: this.baseValues.series1 + (Math.random() - 0.5) * 20,
        series2: this.baseValues.series2 + (Math.random() - 0.5) * 15,
        series3: this.baseValues.series3 + (Math.random() - 0.5) * 10
      });
    }

    this.dataPoints.set(initialData);
  }

  toggleAnimation() {
    if (this.isRunning()) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  }

  startAnimation() {
    this.isRunning.set(true);
    this.intervalId = setInterval(() => {
      this.addDataPoint();
      this.frameCount++;
    }, this.updateInterval());
  }

  stopAnimation() {
    this.isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private addDataPoint() {
    const currentData = this.dataPoints();
    const lastPoint = currentData[currentData.length - 1];

    // Generate new data with trend and noise
    const volatilityFactor = this.volatility();
    const newPoint = {
      time: new Date(),
      series1: this.generateNextValue(lastPoint.series1, this.baseValues.series1, volatilityFactor * 5),
      series2: this.generateNextValue(lastPoint.series2, this.baseValues.series2, volatilityFactor * 4),
      series3: this.generateNextValue(lastPoint.series3, this.baseValues.series3, volatilityFactor * 3)
    };

    const newData = [...currentData, newPoint];

    // Remove old points if we exceed max
    if (newData.length > this.maxDataPoints()) {
      newData.shift();
    }

    this.dataPoints.set(newData);
  }

  private generateNextValue(lastValue: number, baseValue: number, maxChange: number): number {
    // Add some mean reversion and random walk
    const meanReversion = (baseValue - lastValue) * 0.1;
    const randomWalk = (Math.random() - 0.5) * maxChange;
    return Math.max(0, lastValue + meanReversion + randomWalk);
  }

  onIntervalChange() {
    if (this.isRunning()) {
      this.stopAnimation();
      this.startAnimation();
    }
  }

  onMaxPointsChange() {
    const currentData = this.dataPoints();
    const newMax = this.maxDataPoints();

    if (currentData.length > newMax) {
      // Trim data to new max
      this.dataPoints.set(currentData.slice(-newMax));
    } else if (currentData.length < newMax) {
      // Add historical data if needed
      const additionalPoints = newMax - currentData.length;
      const now = currentData.length > 0 ? currentData[0].time : new Date();
      const historicalData = [];

      for (let i = additionalPoints; i > 0; i--) {
        const time = new Date(now.getTime() - i * 1000);
        historicalData.push({
          time,
          series1: this.baseValues.series1 + (Math.random() - 0.5) * 20,
          series2: this.baseValues.series2 + (Math.random() - 0.5) * 15,
          series3: this.baseValues.series3 + (Math.random() - 0.5) * 10
        });
      }

      this.dataPoints.set([...historicalData, ...currentData]);
    }
  }

  resetData() {
    this.stopAnimation();
    this.initializeData();
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  protected readonly chartOptions = computed(() => {
    const data = this.dataPoints();

    return {
      title: {
        text: 'リアルタイムラインチャート',
        subtext: '滑らかなアニメーションでライブデータを表示',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const point = params[0];
          const time = new Date(point.axisValue).toLocaleTimeString('ja-JP');
          let result = `時刻: ${time}<br/>`;
          params.forEach((item: any) => {
            result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
            result += `${item.seriesName}: ${item.value[1].toFixed(1)}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['系列A', '系列B', '系列C'],
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: (value: number) => {
            return new Date(value).toLocaleTimeString('ja-JP');
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '値',
        scale: true,
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '系列A',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#5470c6'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(84, 112, 198, 0.4)' },
                { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
              ]
            }
          },
          data: data.map(point => [point.time, point.series1])
        },
        {
          name: '系列B',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#91cc75'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(145, 204, 117, 0.4)' },
                { offset: 1, color: 'rgba(145, 204, 117, 0.1)' }
              ]
            }
          },
          data: data.map(point => [point.time, point.series2])
        },
        {
          name: '系列C',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#fac858'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(250, 200, 88, 0.4)' },
                { offset: 1, color: 'rgba(250, 200, 88, 0.1)' }
              ]
            }
          },
          data: data.map(point => [point.time, point.series3])
        }
      ],
      animation: false // Disable animation for real-time performance
    };
  });
}