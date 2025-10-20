import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-line-chart-stacked',
  standalone: true,
  imports: [NgxEchartsModule, FormsModule, CommonModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  template: `
    <div class="stacked-container">
      <div
        echarts
        [options]="chartOptions()"
        (chartInit)="onChartInit($event)"
        class="chart">
      </div>

      <div class="controls">
        <h3>積み上げラインチャートの設定</h3>

        <div class="control-section">
          <h4>🎛️ 表示モード</h4>
          <div class="mode-selector">
            <label class="mode-option">
              <input type="radio" name="chartMode" value="stacked" [(ngModel)]="chartMode">
              <div class="mode-content">
                <div class="mode-icon">📊</div>
                <div class="mode-text">
                  <div class="mode-title">積み上げ</div>
                  <div class="mode-desc">面を積み上げ表示</div>
                </div>
              </div>
            </label>
            <label class="mode-option">
              <input type="radio" name="chartMode" value="normal" [(ngModel)]="chartMode">
              <div class="mode-content">
                <div class="mode-icon">📈</div>
                <div class="mode-text">
                  <div class="mode-title">通常</div>
                  <div class="mode-desc">線を個別表示</div>
                </div>
              </div>
            </label>
            <label class="mode-option">
              <input type="radio" name="chartMode" value="percentage" [(ngModel)]="chartMode">
              <div class="mode-content">
                <div class="mode-icon">📋</div>
                <div class="mode-text">
                  <div class="mode-title">割合</div>
                  <div class="mode-desc">100%積み上げ</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div class="control-section">
          <h4>📊 データセット</h4>
          <div class="dataset-buttons">
            <button
              class="dataset-btn"
              [class.active]="currentDataset() === 'revenue'"
              (click)="switchDataset('revenue')">
              💰 収益内訳
            </button>
            <button
              class="dataset-btn"
              [class.active]="currentDataset() === 'traffic'"
              (click)="switchDataset('traffic')">
              🌐 流入チャネル
            </button>
            <button
              class="dataset-btn"
              [class.active]="currentDataset() === 'energy'"
              (click)="switchDataset('energy')">
              ⚡ エネルギー利用状況
            </button>
            <button
              class="dataset-btn"
              [class.active]="currentDataset() === 'portfolio'"
              (click)="switchDataset('portfolio')">
              📈 投資ポートフォリオ
            </button>
          </div>
        </div>

        <div class="control-section">
          <h4>🎨 ビジュアルスタイル</h4>
          <div class="style-controls">
            <div class="control-group">
              <label class="toggle-label">
                <input type="checkbox" [(ngModel)]="showArea">
                <div class="toggle-content">
                  <span class="toggle-icon">🎨</span>
                  塗りつぶし
                </div>
              </label>
              <label class="toggle-label">
                <input type="checkbox" [(ngModel)]="smoothLines">
                <div class="toggle-content">
                  <span class="toggle-icon">〰️</span>
                  スムーズな線
                </div>
              </label>
              <label class="toggle-label">
                <input type="checkbox" [(ngModel)]="showSymbols">
                <div class="toggle-content">
                  <span class="toggle-icon">⭕</span>
                  シンボル表示
                </div>
              </label>
              <label class="toggle-label">
                <input type="checkbox" [(ngModel)]="showLabels">
                <div class="toggle-content">
                  <span class="toggle-icon">🏷️</span>
                  値ラベル
                </div>
              </label>
            </div>

            <div class="slider-controls">
              <div class="slider-group">
                <label>
                  <span class="slider-label">線の太さ</span>
                  <input type="range" min="1" max="6" [(ngModel)]="lineWidth">
                  <span class="slider-value">{{ lineWidth() }}px</span>
                </label>
              </div>
              <div class="slider-group">
                <label>
                  <span class="slider-label">不透明度</span>
                  <input type="range" min="0.3" max="1" step="0.1" [(ngModel)]="areaOpacity">
                  <span class="slider-value">{{ (areaOpacity() * 100).toFixed(0) }}%</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="control-section">
          <h4>🛠️ インタラクティブ機能</h4>
          <div class="feature-grid">
            <label class="feature-card">
              <input type="checkbox" [(ngModel)]="enableDataZoom">
              <div class="feature-content">
                <div class="feature-icon">🔍</div>
                <div class="feature-text">データズーム</div>
              </div>
            </label>
            <label class="feature-card">
              <input type="checkbox" [(ngModel)]="enableBrush">
              <div class="feature-content">
                <div class="feature-icon">🖌️</div>
                <div class="feature-text">ブラシツール</div>
              </div>
            </label>
            <label class="feature-card">
              <input type="checkbox" [(ngModel)]="enableAnimation">
              <div class="feature-content">
                <div class="feature-icon">✨</div>
                <div class="feature-text">アニメーション</div>
              </div>
            </label>
            <label class="feature-card">
              <input type="checkbox" [(ngModel)]="showTotalLine">
              <div class="feature-content">
                <div class="feature-icon">📊</div>
                <div class="feature-text">合計ライン</div>
              </div>
            </label>
          </div>
        </div>

        <div class="stats-panel">
          <h4>📈 統計情報</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">系列数</div>
              <div class="stat-value">{{ getCurrentData().series.length }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">データ点数</div>
              <div class="stat-value">{{ getCurrentData().categories.length }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">モード</div>
              <div class="stat-value">{{ modeLabel() }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">最大合計値</div>
              <div class="stat-value">{{ getMaxTotal() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./line-chart-stacked.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartStackedComponent {
  echartsInstance: any;

  // Control signals
  chartMode = signal<'stacked' | 'normal' | 'percentage'>('stacked');
  currentDataset = signal<'revenue' | 'traffic' | 'energy' | 'portfolio'>('revenue');
  showArea = signal(true);
  smoothLines = signal(true);
  showSymbols = signal(false);
  showLabels = signal(false);
  lineWidth = signal(2);
  areaOpacity = signal(0.6);
  enableDataZoom = signal(true);
  enableBrush = signal(false);
  enableAnimation = signal(true);
  showTotalLine = signal(false);
  protected readonly modeLabel = computed(() => this.formatModeLabel(this.chartMode()));

  // Data sets
  private datasets = {
    revenue: {
      title: '収益源の推移',
      categories: ['第1四半期', '第2四半期', '第3四半期', '第4四半期', '第1四半期', '第2四半期', '第3四半期', '第4四半期'],
      series: [
        { name: '製品販売', data: [120, 140, 160, 180, 200, 220, 240, 260], color: '#3498db' },
        { name: 'サブスクリプション', data: [80, 90, 110, 130, 150, 170, 190, 210], color: '#2ecc71' },
        { name: 'サービス', data: [40, 50, 60, 70, 80, 90, 100, 110], color: '#f39c12' },
        { name: 'ライセンス', data: [20, 25, 30, 35, 40, 45, 50, 55], color: '#9b59b6' }
      ]
    },
    traffic: {
      title: 'サイト流入チャネル',
      categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      series: [
        { name: '自然検索', data: [4500, 4800, 5200, 5800, 6200, 6800, 7200, 7600, 8000, 8400, 8800, 9200], color: '#e74c3c' },
        { name: 'ダイレクト', data: [2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400], color: '#3498db' },
        { name: 'ソーシャルメディア', data: [1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000], color: '#2ecc71' },
        { name: '広告', data: [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300], color: '#f39c12' },
        { name: 'メール', data: [800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350], color: '#9b59b6' }
      ]
    },
    energy: {
      title: 'エネルギー源別消費量',
      categories: ['6時', '9時', '12時', '15時', '18時', '21時', '0時', '3時'],
      series: [
        { name: '太陽光', data: [0, 20, 40, 45, 35, 10, 0, 0], color: '#f1c40f' },
        { name: '風力', data: [15, 18, 22, 25, 28, 30, 25, 20], color: '#16a085' },
        { name: '水力', data: [25, 25, 25, 25, 25, 25, 25, 25], color: '#3498db' },
        { name: '原子力', data: [35, 35, 35, 35, 35, 35, 35, 35], color: '#e67e22' },
        { name: '石炭', data: [45, 40, 35, 30, 35, 40, 45, 50], color: '#34495e' }
      ]
    },
    portfolio: {
      title: '投資ポートフォリオの推移',
      categories: ['2020', '2021', '2022', '2023', '2024'],
      series: [
        { name: '株式', data: [45000, 52000, 48000, 55000, 62000], color: '#e74c3c' },
        { name: '債券', data: [25000, 27000, 29000, 31000, 33000], color: '#3498db' },
        { name: '不動産', data: [15000, 16500, 18000, 20000, 22000], color: '#2ecc71' },
        { name: 'コモディティ', data: [8000, 9000, 7500, 8500, 9500], color: '#f39c12' },
        { name: '暗号資産', data: [2000, 8000, 3000, 12000, 18000], color: '#9b59b6' }
      ]
    }
  };

  switchDataset(dataset: 'revenue' | 'traffic' | 'energy' | 'portfolio') {
    this.currentDataset.set(dataset);
  }

  getCurrentData() {
    return this.datasets[this.currentDataset()];
  }

  getMaxTotal(): string {
    const data = this.getCurrentData();
    const totals = data.categories.map((_, index) =>
      data.series.reduce((sum, series) => sum + series.data[index], 0)
    );
    const max = Math.max(...totals);

    if (this.currentDataset() === 'revenue') {
      return `${max}百万ドル`;
    } else if (this.currentDataset() === 'portfolio') {
      return `${(max / 1000).toFixed(0)}千ドル`;
    } else if (this.currentDataset() === 'traffic') {
      return `${(max / 1000).toFixed(1)}千人`;
    } else {
      return `${max}MW`;
    }
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  protected readonly chartOptions = computed<EChartsOption>(() => {
    const data = this.getCurrentData();
    const stackId = this.chartMode() === 'normal' ? undefined : 'total';

    // Calculate totals for total line
    const totals = data.categories.map((_, index) =>
      data.series.reduce((sum, series) => sum + series.data[index], 0)
    );

    const series: any[] = data.series.map(seriesData => ({
      name: seriesData.name,
      type: 'line',
      stack: stackId,
      smooth: this.smoothLines(),
      symbol: this.showSymbols() ? 'circle' : 'none',
      symbolSize: 6,
      lineStyle: {
        width: this.lineWidth(),
        color: seriesData.color
      },
      areaStyle: this.showArea() ? {
        color: seriesData.color,
        opacity: this.areaOpacity()
      } : undefined,
      label: {
        show: this.showLabels(),
        position: 'top',
        formatter: '{c}',
        fontSize: 10
      },
      emphasis: {
        focus: 'series'
      },
      data: this.chartMode() === 'percentage'
        ? this.convertToPercentage(seriesData.data, totals)
        : seriesData.data
    }));

    // Add total line if enabled and not in stacked mode
    if (this.showTotalLine() && this.chartMode() === 'normal') {
      series.push({
        name: '合計',
        type: 'line',
        smooth: this.smoothLines(),
        symbol: 'diamond',
        symbolSize: 8,
        lineStyle: {
          width: this.lineWidth() + 1,
          color: '#2c3e50',
          type: 'dashed'
        },
        label: {
          show: this.showLabels(),
          position: 'top',
          formatter: '{c}',
          fontSize: 10
        },
        data: totals,
        z: 10
      });
    }

    return {
      title: {
        text: data.title,
        subtext: `モード: ${this.formatModeLabel(this.chartMode())}`,
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
          let result = params[0].name + '<br/>';
          let total = 0;

          params.forEach((item: any) => {
            if (item.seriesName !== '合計') {
              total += item.value;
            }
            result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
            result += `${item.seriesName}: ${this.formatTooltipValue(item.value)}<br/>`;
          });

          if (this.chartMode() !== 'percentage' && params.some((p: any) => p.seriesName !== '合計')) {
            result += `<hr style="margin:5px 0;border:none;border-top:1px solid #ddd;"/>`;
            result += `<strong>合計: ${this.formatTooltipValue(total)}</strong>`;
          }

          return result;
        }
      },
      legend: {
        data: series.map(s => s.name),
        top: '12%',
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: this.enableDataZoom() ? '20%' : '8%',
        top: '25%',
        containLabel: true
      },
      brush: this.enableBrush() ? {
        toolbox: ['rect', 'polygon', 'clear'],
        xAxisIndex: 0
      } : undefined,
      dataZoom: this.enableDataZoom() ? [
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
        type: 'category',
        boundaryGap: false,
        data: data.categories,
        axisLabel: {
          fontSize: 11,
          interval: 0,
          rotate: data.categories.length > 8 ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        name: this.getYAxisName(),
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: (value: number) => this.formatAxisValue(value),
          fontSize: 11
        },
        max: this.chartMode() === 'percentage' ? 100 : undefined
      },
      series: series,
      animation: this.enableAnimation(),
      animationDuration: 1000,
      animationEasing: 'cubicInOut' as const
    };
  });

  private convertToPercentage(data: number[], totals: number[]): number[] {
    return data.map((value, index) => {
      const total = totals[index];
      return total > 0 ? Math.round((value / total) * 100 * 10) / 10 : 0;
    });
  }

  private getYAxisName(): string {
    if (this.chartMode() === 'percentage') {
      return '割合（%）';
    }

    const names = {
      revenue: '収益（百万ドル）',
      traffic: '訪問者数',
      energy: '出力（MW）',
      portfolio: '資産額（ドル）'
    };
    return names[this.currentDataset()];
  }

  private formatAxisValue(value: number): string {
    if (this.chartMode() === 'percentage') {
      return `${value}%`;
    }

    const current = this.currentDataset();
    if (current === 'revenue') {
      return `${value}百万ドル`;
    } else if (current === 'traffic') {
      return `${(value / 1000).toFixed(0)}千人`;
    } else if (current === 'energy') {
      return `${value}MW`;
    } else if (current === 'portfolio') {
      return `${(value / 1000).toFixed(0)}千ドル`;
    }
    return value.toString();
  }

  private formatTooltipValue(value: number): string {
    if (this.chartMode() === 'percentage') {
      return `${value}%`;
    }

    const current = this.currentDataset();
    if (current === 'revenue') {
      return `${value}百万ドル`;
    } else if (current === 'traffic') {
      return `${value.toLocaleString()}人`;
    } else if (current === 'energy') {
      return `${value}MW`;
    } else if (current === 'portfolio') {
      return `${value.toLocaleString()}ドル`;
    }
    return value.toString();
  }

  private formatModeLabel(mode: 'stacked' | 'normal' | 'percentage'): string {
    switch (mode) {
      case 'stacked':
        return '積み上げ';
      case 'normal':
        return '通常';
      case 'percentage':
        return '割合';
    }
    return '通常';
  }
}