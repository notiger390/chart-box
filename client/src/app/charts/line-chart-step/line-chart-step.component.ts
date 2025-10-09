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
        <h3>ステップラインチャートの設定</h3>

        <div class="control-section">
          <h4>ステップの種類</h4>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" name="stepType" value="start" [(ngModel)]="stepType">
              開始位置（⬜️ └─）
            </label>
            <label class="radio-label">
              <input type="radio" name="stepType" value="middle" [(ngModel)]="stepType">
              中央（⬜️ ⊥─）
            </label>
            <label class="radio-label">
              <input type="radio" name="stepType" value="end" [(ngModel)]="stepType">
              終了位置（⬜️ ─┐）
            </label>
            <label class="radio-label">
              <input type="radio" name="stepType" value="false" [(ngModel)]="stepType">
              ステップなし（通常の線）
            </label>
          </div>
        </div>

        <div class="control-section">
          <h4>ラインスタイル</h4>
          <div class="control-row">
            <label>
              線の太さ:
              <input type="range" min="1" max="8" [(ngModel)]="lineWidth">
              <span>{{ lineWidth() }}px</span>
            </label>
            <label>
              シンボルサイズ:
              <input type="range" min="0" max="15" [(ngModel)]="symbolSize">
              <span>{{ symbolSize() === 0 ? 'なし' : symbolSize() }}</span>
            </label>
          </div>
          <div class="control-row">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showArea">
              塗りつぶしを表示
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showLabel">
              値ラベルを表示
            </label>
          </div>
        </div>

        <div class="control-section">
          <h4>データセット</h4>
          <div class="dataset-buttons">
            <button
              class="dataset-button"
              [class.active]="currentDataset() === 'sales'"
              (click)="switchDataset('sales')">
              📊 売上データ
            </button>
            <button
              class="dataset-button"
              [class.active]="currentDataset() === 'temperature'"
              (click)="switchDataset('temperature')">
              🌡️ 気温データ
            </button>
            <button
              class="dataset-button"
              [class.active]="currentDataset() === 'performance'"
              (click)="switchDataset('performance')">
              ⚡ パフォーマンス
            </button>
            <button
              class="dataset-button"
              [class.active]="currentDataset() === 'stock'"
              (click)="switchDataset('stock')">
              📈 株価
            </button>
          </div>
        </div>

        <div class="control-section">
          <h4>アニメーションと効果</h4>
          <div class="control-row">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="animationEnabled">
              アニメーションを有効化
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="connectNulls">
              欠損値を連結
            </label>
          </div>
        </div>

        <div class="info-section">
          <h4>ℹ️ ステップラインチャートの活用例</h4>
          <div class="info-content">
            <p><strong>活用シーン:</strong></p>
            <ul>
              <li>📊 売上目標と達成状況の推移</li>
              <li>🌡️ センサーによる温度計測</li>
              <li>⚡ 性能指標やしきい値の管理</li>
              <li>📈 時間帯別の株価推移</li>
              <li>🎯 ステータスの変化や状態遷移</li>
            </ul>
            <p><strong>ステップの意味:</strong></p>
            <ul>
              <li><strong>開始:</strong> 各区間の開始時点で値が変化</li>
              <li><strong>中央:</strong> 各区間の中間で値が変化</li>
              <li><strong>終了:</strong> 各区間の終了時点で値が変化</li>
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
      title: '月次の売上目標と実績',
      categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      series: [
        {
          name: '目標',
          data: [1000, 1100, 1200, 1150, 1300, 1250, 1400, 1350, 1500, 1450, 1600, 1700],
          color: '#e74c3c'
        },
        {
          name: '実績',
          data: [950, 1150, 1100, 1200, 1280, 1300, 1380, 1420, 1480, 1520, 1580, 1650],
          color: '#2ecc71'
        }
      ]
    },
    temperature: {
      title: '1日の温度推移',
      categories: ['6:00', '9:00', '12:00', '15:00', '18:00', '21:00', '0:00', '3:00'],
      series: [
        {
          name: '室内（℃）',
          data: [18, 20, 24, 26, 25, 22, 20, 18],
          color: '#3498db'
        },
        {
          name: '屋外（℃）',
          data: [12, 16, 22, 28, 26, 20, 16, 14],
          color: '#f39c12'
        }
      ]
    },
    performance: {
      title: 'システム性能指標',
      categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      series: [
        {
          name: 'CPU使用率（%）',
          data: [25, 30, 85, 90, 75, 40],
          color: '#9b59b6'
        },
        {
          name: 'メモリ使用率（%）',
          data: [45, 48, 65, 70, 68, 52],
          color: '#1abc9c'
        }
      ]
    },
    stock: {
      title: '株価推移（時間ごと）',
      categories: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      series: [
        {
          name: '銘柄A（ドル）',
          data: [100, 105, 102, 108, 106, 110, 108, 112],
          color: '#e67e22'
        },
        {
          name: '銘柄B（ドル）',
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
        subtext: `ステップタイプ: ${this.formatStepTypeLabel(this.stepType())}`,
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
      sales: '数量',
      temperature: '温度（℃）',
      performance: '割合（%）',
      stock: '価格（ドル）'
    };
    return names[this.currentDataset()];
  }

  private formatYAxisValue(value: number): string {
    const current = this.currentDataset();
    if (current === 'temperature') {
      return `${value}℃`;
    } else if (current === 'performance') {
      return `${value}%`;
    } else if (current === 'stock') {
      return `${value}ドル`;
    }
    return value.toString();
  }

  private formatStepTypeLabel(step: 'start' | 'middle' | 'end' | 'false'): string {
    switch (step) {
      case 'start':
        return '開始';
      case 'middle':
        return '中央';
      case 'end':
        return '終了';
      case 'false':
        return '通常線';
    }
    return '通常線';
  }
}