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
        <h3>時系列ラインチャートの設定</h3>

        <div class="control-section">
          <h4>📊 データセット</h4>
          <div class="dataset-grid">
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'stock'"
              (click)="switchDataset('stock')">
              <div class="card-icon">📈</div>
              <div class="card-title">株価</div>
              <div class="card-subtitle">2024年の日次データ</div>
            </button>
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'weather'"
              (click)="switchDataset('weather')">
              <div class="card-icon">🌡️</div>
              <div class="card-title">気象データ</div>
              <div class="card-subtitle">毎時の気温</div>
            </button>
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'sales'"
              (click)="switchDataset('sales')">
              <div class="card-icon">💰</div>
              <div class="card-title">売上高</div>
              <div class="card-subtitle">月次パフォーマンス</div>
            </button>
            <button
              class="dataset-card"
              [class.active]="currentDataset() === 'analytics'"
              (click)="switchDataset('analytics')">
              <div class="card-icon">📊</div>
              <div class="card-title">ウェブ解析</div>
              <div class="card-subtitle">日次訪問者数</div>
            </button>
          </div>
        </div>

        <div class="control-section">
          <h4>⚙️ 表示オプション</h4>
          <div class="option-grid">
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="showDataZoom">
              <div class="option-content">
                <div class="option-icon">🔍</div>
                <div class="option-text">データズーム</div>
              </div>
            </label>
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="showBrush">
              <div class="option-content">
                <div class="option-icon">🖌️</div>
                <div class="option-text">ブラシ選択</div>
              </div>
            </label>
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="showToolbox">
              <div class="option-content">
                <div class="option-icon">🛠️</div>
                <div class="option-text">ツールボックス</div>
              </div>
            </label>
            <label class="option-card">
              <input type="checkbox" [(ngModel)]="smoothLines">
              <div class="option-content">
                <div class="option-icon">〰️</div>
                <div class="option-text">スムーズな線</div>
              </div>
            </label>
          </div>
        </div>

        <div class="control-section">
          <h4>🎨 スタイリング</h4>
          <div class="styling-controls">
            <div class="control-row">
              <label>
                線の太さ:
                <input type="range" min="1" max="6" [(ngModel)]="lineWidth">
                <span>{{ lineWidth() }}px</span>
              </label>
              <label>
                シンボルサイズ:
                <input type="range" min="0" max="12" [(ngModel)]="symbolSize">
                <span>{{ symbolSize() === 0 ? 'なし' : symbolSize() }}</span>
              </label>
            </div>
            <div class="control-row">
              <label>
                時間表示:
                <select [(ngModel)]="timeFormat">
                  <option value="auto">自動</option>
                  <option value="date">日付のみ</option>
                  <option value="time">時刻のみ</option>
                  <option value="datetime">日付と時刻</option>
                  <option value="month">年月</option>
                </select>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showArea">
                塗りつぶし
              </label>
            </div>
          </div>
        </div>

        <div class="control-section">
          <h4>📈 データ分析</h4>
          <div class="analysis-options">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showTrendLine">
              トレンドライン
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showMovingAverage">
              移動平均（7日）
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showMaxMin">
              最大値/最小値
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="showOutliers">
              外れ値検出
            </label>
          </div>
        </div>

        <div class="info-panel">
          <h4>📊 データセット情報</h4>
          <div class="info-content">
            <div class="info-item">
              <span class="info-label">データ点数:</span>
              <span class="info-value">{{ getDatasetInfo().pointCount }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">期間:</span>
              <span class="info-value">{{ getDatasetInfo().timeRange }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">頻度:</span>
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

  private readonly datasets = this.generateTimeSeriesData();

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
      title: 'AAPL株価の推移',
      data,
      yAxisName: '株価（ドル）',
      series: [{ name: 'AAPL', color: '#1f77b4', key: 'value' }]
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
      title: '気象データ（7日間・毎時）',
      data,
      yAxisName: '気温（℃）/ 湿度（%）',
      series: [
        { name: '気温', color: '#ff7f0e', key: 'temp' },
        { name: '湿度', color: '#2ca02c', key: 'humidity' }
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
      title: '月次売上高',
      data,
      yAxisName: '売上高（ドル）',
      series: [{ name: '売上高', color: '#d62728', key: 'value' }]
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
      title: 'ウェブ解析（30日間）',
      data,
      yAxisName: '件数',
      series: [
        { name: '訪問者数', color: '#9467bd', key: 'visitors' },
        { name: 'ページビュー', color: '#8c564b', key: 'pageViews' }
      ]
    };
  }

  switchDataset(dataset: 'stock' | 'weather' | 'sales' | 'analytics') {
    this.currentDataset.set(dataset);
  }

  getDatasetInfo() {
    const data = this.datasets[this.currentDataset()];
    const pointCount = data.data.length;
    const firstDate = data.data[0]?.time;
    const lastDate = data.data[data.data.length - 1]?.time;

    const frequencies = {
      stock: '日次（取引日）',
      weather: '毎時',
      sales: '月次',
      analytics: '日次'
    };

    return {
      pointCount,
      timeRange: firstDate && lastDate ?
        `${firstDate.toLocaleDateString('ja-JP')} - ${lastDate.toLocaleDateString('ja-JP')}` : '該当なし',
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
    const dataset = this.datasets[this.currentDataset()];
    const series: any[] = [];
    const legendEntries: string[] = [];

    dataset.series.forEach((seriesInfo: any, index: number) => {
      const timeValues = dataset.data.map((d: any) => d.time);
      const values = dataset.data.map((d: any) => d[seriesInfo.key]);
      const markPointData: any[] = [];

      if (this.showMaxMin()) {
        markPointData.push({ type: 'max', name: '最大値' });
        markPointData.push({ type: 'min', name: '最小値' });
      }

      if (this.showOutliers()) {
        const outliers = this.detectOutliers(values);
        outliers.forEach((isOutlier, dataIndex) => {
          if (!isOutlier) {
            return;
          }
          markPointData.push({
            name: '外れ値',
            coord: [timeValues[dataIndex], values[dataIndex]],
            value: values[dataIndex],
            symbol: 'diamond',
            symbolSize: Math.max(8, this.symbolSize() + 4),
            itemStyle: {
              color: '#d62728',
              borderColor: '#fff',
              borderWidth: 1
            }
          });
        });
      }

      const markPoint = markPointData.length > 0 ? {
        data: markPointData,
        label: {
          formatter: (param: any) => param.data?.name ?? param.name
        },
        tooltip: {
          formatter: (param: any) => {
            const rawValue = Array.isArray(param.value) ? param.value[1] : param.value;
            const label = param.data?.name ?? param.name ?? '';
            const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);
            if (!Number.isFinite(numericValue)) {
              return label ? `${param.seriesName} ${label}` : param.seriesName;
            }
            const valueText = this.formatTooltipValue(numericValue, param.seriesName);
            return label ? `${param.seriesName} ${label}: ${valueText}` : `${param.seriesName}: ${valueText}`;
          }
        }
      } : undefined;

      const markLine = this.showTrendLine() ? this.createTrendLineMarkLine(timeValues, values, seriesInfo.color, seriesInfo.name) : undefined;

      series.push({
        name: seriesInfo.name,
        type: 'line',
        smooth: this.smoothLines(),
        symbol: this.symbolSize() > 0 ? 'circle' : 'none',
        symbolSize: this.symbolSize(),
        lineStyle: {
          width: this.lineWidth(),
          color: seriesInfo.color
        },
        areaStyle: this.showArea() && index === 0 ? {
          color: this.applyAlpha(seriesInfo.color, 0.12)
        } : undefined,
        data: dataset.data.map((d: any) => [d.time, d[seriesInfo.key]]),
        markPoint,
        markLine,
        emphasis: { focus: 'series' }
      });

      legendEntries.push(seriesInfo.name);

      if (this.showMovingAverage()) {
        const movingAverage = this.calculateMovingAverage(values);
        series.push({
          name: `${seriesInfo.name} 移動平均`,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: seriesInfo.color,
            type: 'dashed',
            opacity: 0.7
          },
          data: dataset.data.map((d: any, dataIndex: number) => [d.time, movingAverage[dataIndex]]),
          emphasis: { focus: 'series' }
        });
        legendEntries.push(`${seriesInfo.name} 移動平均`);
      }
    });

    return {
      title: {
        text: dataset.title,
        subtext: 'インタラクティブな時系列分析',
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
            result += `${item.seriesName}: ${this.formatTooltipValue(item.value[1], item.seriesName)}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: legendEntries,
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
          saveAsImage: { title: '画像として保存' },
          dataView: { readOnly: false, title: 'データ表示', lang: ['データ表示', '閉じる', '更新'] },
          magicType: { type: ['line', 'bar'], title: { line: '折れ線', bar: '棒グラフ' } },
          restore: { title: 'リセット' },
          dataZoom: { title: { zoom: 'ズーム', back: 'リセット' } }
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
      series
    };
  });

  private detectOutliers(values: number[], k: number = 2): boolean[] {
    if (values.length === 0) {
      return [];
    }

    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) {
      return values.map(() => false);
    }

    return values.map(value => Math.abs(value - mean) > k * stdDev);
  }

  private createTrendLineMarkLine(times: Date[], values: number[], color: string, seriesName: string) {
    if (times.length < 2) {
      return undefined;
    }

    const xValues = times.map(time => time.getTime());
    const { slope, intercept } = this.calculateLinearRegression(xValues, values);
    const startTime = xValues[0];
    const endTime = xValues[xValues.length - 1];
    const startValue = slope * startTime + intercept;
    const endValue = slope * endTime + intercept;

    return {
      symbol: 'none',
      silent: true,
      lineStyle: {
        color,
        width: 2,
        type: 'dashed',
        opacity: 0.7
      },
      label: {
        formatter: `${seriesName}のトレンド`,
        align: 'right'
      },
      data: [
        [
          { coord: [startTime, startValue] },
          { coord: [endTime, endValue] }
        ]
      ]
    };
  }

  private calculateLinearRegression(xValues: number[], yValues: number[]) {
    const n = xValues.length;

    if (n === 0) {
      return { slope: 0, intercept: 0 };
    }

    const sumX = xValues.reduce((sum, value) => sum + value, 0);
    const sumY = yValues.reduce((sum, value) => sum + value, 0);
    const sumXY = xValues.reduce((sum, value, index) => sum + value * yValues[index], 0);
    const sumXX = xValues.reduce((sum, value) => sum + value * value, 0);

    const denominator = n * sumXX - sumX * sumX;

    if (denominator === 0) {
      return { slope: 0, intercept: sumY / n };
    }

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  private applyAlpha(hexColor: string, alpha: number): string {
    if (/^#([0-9a-fA-F]{6})$/.test(hexColor)) {
      const alphaValue = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
        .toString(16)
        .padStart(2, '0');
      return `${hexColor}${alphaValue}`;
    }
    return hexColor;
  }

  private formatAxisTime(date: Date): string {
    switch (this.timeFormat()) {
      case 'date':
        return date.toLocaleDateString('ja-JP');
      case 'time':
        return date.toLocaleTimeString('ja-JP');
      case 'datetime':
        return date.toLocaleString('ja-JP');
      case 'month':
        return date.toLocaleDateString('ja-JP', { month: 'short', year: 'numeric' });
      default:
        return this.currentDataset() === 'weather' ?
          date.toLocaleDateString('ja-JP') + '\n' + date.toLocaleTimeString('ja-JP') :
          date.toLocaleDateString('ja-JP');
    }
  }

  private formatTooltipTime(date: Date): string {
    return this.currentDataset() === 'weather' ?
      date.toLocaleString('ja-JP') :
      date.toLocaleDateString('ja-JP');
  }

  private formatTooltipValue(value: number, seriesName?: string): string {
    if (this.currentDataset() === 'stock') {
      return `${value.toFixed(2)}ドル`;
    } else if (this.currentDataset() === 'weather') {
      if (seriesName?.includes('気温')) {
        return `${value.toFixed(1)}℃`;
      }
      if (seriesName?.includes('湿度')) {
        return `${value.toFixed(1)}%`;
      }
      return value.toFixed(1);
    } else if (this.currentDataset() === 'sales') {
      return `${value.toLocaleString()}ドル`;
    }
    return `${value.toLocaleString()}件`;
  }

  private formatAxisValue(value: number): string {
    if (this.currentDataset() === 'stock') {
      return `${value}ドル`;
    } else if (this.currentDataset() === 'sales') {
      return `${(value / 1000)}千ドル`;
    } else if (this.currentDataset() === 'analytics') {
      return `${(value / 1000)}千件`;
    }
    return value.toString();
  }
}