# Angular + ECharts統合ガイド

AngularでEChartsを効果的に使用するための包括的なガイドです。ngx-echartsライブラリを使用した統合方法と、Angular 20の新機能（Signals）との連携について説明します。

## 📖 目次

1. [ngx-echartsとは](#ngx-echartsとは)
2. [セットアップ](#セットアップ)
3. [基本的な統合](#基本的な統合)
4. [Angular Signalsとの統合](#angular-signalsとの統合)
5. [ライフサイクル管理](#ライフサイクル管理)
6. [パフォーマンス最適化](#パフォーマンス最適化)

## ngx-echartsとは

ngx-echartsは、EChartsをAngularで使用するための公式ラッパーライブラリです。

### 💡 なぜngx-echartsを使うのか？

- **Angular統合**: Angularのライフサイクルと自動連携
- **型安全性**: TypeScriptの型定義が充実
- **変更検知**: Angularの変更検知と自動同期
- **メモリ管理**: コンポーネント破棄時の自動クリーンアップ
- **テーマ対応**: Angularのテーマシステムとの連携

## セットアップ

### 1. 必要な依存関係の確認

```bash
# プロジェクトルートのpackage.jsonで確認
cd client
npm list echarts ngx-echarts
```

期待される出力:
```
├── echarts@6.0.0
└── ngx-echarts@20.0.2
```

### 2. EChartsの初期化設定

`src/main.ts`での設定:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

// EChartsの初期化
import * as echarts from 'echarts';

// 必要なチャートタイプを個別にインポート（バンドルサイズ最適化）
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

bootstrapApplication(AppComponent, appConfig);
```

### 3. アプリケーション設定

`src/app/app.config.ts`:

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [
    // ngx-echartsプロバイダの設定
    importProvidersFrom(
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'), // 遅延読み込み
      })
    ),
    // その他のプロバイダ...
  ],
};
```

## 基本的な統合

### 1. 最小限のチャートコンポーネント

```typescript
// basic-chart.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-basic-chart',
  standalone: true,
  imports: [NgxEchartsModule],
  template: `
    <div echarts
         [options]="chartOptions"
         class="chart-container">
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 400px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicChartComponent {
  chartOptions: EChartsOption = {
    title: {
      text: '基本的なチャート'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }]
  };
}
```

### 2. ngx-echartsディレクティブのオプション

```typescript
@Component({
  template: `
    <div echarts
         [options]="chartOptions"
         [merge]="mergeOptions"
         [loading]="isLoading"
         [loadingOpts]="loadingOptions"
         [theme]="'dark'"
         [initOpts]="initOptions"
         (chartInit)="onChartInit($event)"
         (chartClick)="onChartClick($event)"
         class="chart">
    </div>
  `
})
export class AdvancedChartComponent {
  // チャートオプション
  chartOptions: EChartsOption = { /* ... */ };

  // マージ用オプション（部分更新）
  mergeOptions: EChartsOption = { /* ... */ };

  // ローディング状態
  isLoading = false;

  // ローディングオプション
  loadingOptions = {
    text: '読み込み中...',
    color: '#c23531',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)'
  };

  // 初期化オプション
  initOptions = {
    renderer: 'canvas', // 'canvas' | 'svg'
    width: 'auto',
    height: 'auto'
  };

  // イベントハンドラ
  onChartInit(chart: any) {
    console.log('チャート初期化完了:', chart);
  }

  onChartClick(event: any) {
    console.log('チャートクリック:', event);
  }
}
```

## Angular Signalsとの統合

### 1. Signalsを使用したリアクティブチャート

```typescript
import { Component, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-reactive-chart',
  standalone: true,
  imports: [NgxEchartsModule],
  template: `
    <div class="controls">
      <button (click)="addData()">データ追加</button>
      <button (click)="removeData()">データ削除</button>
      <button (click)="updateTheme()">テーマ変更</button>
    </div>

    <div echarts
         [options]="chartOptions()"
         [theme]="theme()"
         class="chart">
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveChartComponent {
  // リアクティブなデータ
  private readonly rawData = signal([
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 200 },
    { name: 'Wed', value: 150 }
  ]);

  // テーマ選択
  private readonly currentTheme = signal<'light' | 'dark'>('light');

  // Computed Signals
  readonly categories = computed(() =>
    this.rawData().map(item => item.name)
  );

  readonly values = computed(() =>
    this.rawData().map(item => item.value)
  );

  readonly theme = computed(() => this.currentTheme());

  readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'リアクティブチャート',
      textStyle: {
        color: this.theme() === 'dark' ? '#fff' : '#333'
      }
    },
    xAxis: {
      type: 'category',
      data: this.categories()
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'bar',
      data: this.values(),
      itemStyle: {
        color: this.theme() === 'dark' ? '#91cc75' : '#5470c6'
      }
    }]
  }));

  // デバッグ用Effect
  constructor() {
    effect(() => {
      console.log('データ更新:', {
        categories: this.categories(),
        values: this.values(),
        theme: this.theme()
      });
    });
  }

  // インタラクションメソッド
  addData() {
    const days = ['Thu', 'Fri', 'Sat', 'Sun'];
    const currentData = this.rawData();

    if (currentData.length < 7) {
      const newDay = days[currentData.length - 3];
      const newValue = Math.floor(Math.random() * 200) + 50;

      this.rawData.set([
        ...currentData,
        { name: newDay, value: newValue }
      ]);
    }
  }

  removeData() {
    const currentData = this.rawData();
    if (currentData.length > 1) {
      this.rawData.set(currentData.slice(0, -1));
    }
  }

  updateTheme() {
    this.currentTheme.update(theme => theme === 'light' ? 'dark' : 'light');
  }
}
```

### 2. 複数チャート間でのデータ共有

```typescript
// shared-data.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface ChartData {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
    type: 'bar' | 'line' | 'pie';
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  // 共有データストア
  private readonly dataStore = signal<ChartData>({
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    series: [
      {
        name: '売上',
        data: [820, 932, 901, 934, 1290],
        type: 'bar'
      },
      {
        name: '利益',
        data: [180, 232, 201, 234, 390],
        type: 'line'
      }
    ]
  });

  // 読み取り専用アクセス
  readonly data = this.dataStore.asReadonly();

  // 計算されたプロパティ
  readonly barChartData = computed(() => ({
    categories: this.data().categories,
    values: this.data().series.find(s => s.type === 'bar')?.data || []
  }));

  readonly lineChartData = computed(() => ({
    categories: this.data().categories,
    values: this.data().series.find(s => s.type === 'line')?.data || []
  }));

  // データ更新メソッド
  updateData(newData: Partial<ChartData>) {
    this.dataStore.update(current => ({
      ...current,
      ...newData
    }));
  }

  addDataPoint(category: string, values: Record<string, number>) {
    this.dataStore.update(current => ({
      categories: [...current.categories, category],
      series: current.series.map(series => ({
        ...series,
        data: [...series.data, values[series.name] || 0]
      }))
    }));
  }
}
```

### 3. サービスを使用したコンポーネント

```typescript
// dashboard.component.ts
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ChartDataService } from './shared-data.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <app-bar-chart [data]="chartService.barChartData()"></app-bar-chart>
      <app-line-chart [data]="chartService.lineChartData()"></app-line-chart>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly chartService = inject(ChartDataService);
}
```

## ライフサイクル管理

### 1. コンポーネントのライフサイクル

```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-chart-lifecycle',
  template: `
    <div #chartContainer echarts [options]="chartOptions"></div>
  `
})
export class ChartLifecycleComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef;

  private chart: any;
  private resizeObserver?: ResizeObserver;

  ngOnInit() {
    // リサイズ監視の設定
    this.setupResizeObserver();
  }

  ngOnDestroy() {
    // リソースのクリーンアップ
    this.cleanup();
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chart && !this.chart.isDisposed()) {
          this.chart.resize();
        }
      });

      this.resizeObserver.observe(this.chartContainer.nativeElement);
    }
  }

  private cleanup() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.chart && !this.chart.isDisposed()) {
      this.chart.dispose();
    }
  }

  onChartInit(chart: any) {
    this.chart = chart;
  }
}
```

### 2. 動的データ更新の管理

```typescript
import { Component, signal, effect, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'app-realtime-chart',
  template: `
    <div echarts [options]="chartOptions()"></div>
  `
})
export class RealtimeChartComponent {
  private readonly destroyRef = inject(DestroyRef);

  private readonly data = signal<number[]>([]);
  private readonly maxDataPoints = 20;

  readonly chartOptions = computed(() => ({
    xAxis: { type: 'category', data: this.generateCategories() },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: this.data() }]
  }));

  constructor() {
    // リアルタイムデータ更新
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.addDataPoint();
      });
  }

  private addDataPoint() {
    const newValue = Math.random() * 100;

    this.data.update(current => {
      const updated = [...current, newValue];
      // 最大データポイント数を制限
      return updated.length > this.maxDataPoints
        ? updated.slice(-this.maxDataPoints)
        : updated;
    });
  }

  private generateCategories(): string[] {
    return Array.from({ length: this.data().length }, (_, i) =>
      new Date(Date.now() - (this.data().length - 1 - i) * 1000)
        .toLocaleTimeString()
    );
  }
}
```

## パフォーマンス最適化

### 1. 変更検知の最適化

```typescript
@Component({
  // OnPush戦略で不要な変更検知を回避
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div echarts [options]="chartOptions()"></div>
  `
})
export class OptimizedChartComponent {
  // Signalsは自動的にOnPush戦略と連携
  private readonly data = signal(this.generateLargeDataset());

  readonly chartOptions = computed(() => ({
    // computedは依存関係が変更された時のみ再計算
    series: [{ type: 'scatter', data: this.data() }]
  }));

  private generateLargeDataset() {
    return Array.from({ length: 10000 }, () => [
      Math.random() * 100,
      Math.random() * 100
    ]);
  }
}
```

### 2. 大量データの処理

```typescript
@Component({
  template: `
    <div echarts
         [options]="chartOptions()"
         [loading]="isProcessing()"
         [initOpts]="{ renderer: 'canvas' }">
    </div>
  `
})
export class LargeDatasetComponent {
  private readonly rawData = signal<number[][]>([]);
  private readonly isProcessing = signal(false);

  readonly chartOptions = computed(() => {
    const data = this.rawData();

    return {
      // 大量データ用の最適化設定
      animation: false,
      useUTC: true,

      series: [{
        type: 'scatter',
        large: true,  // 大量データモード
        largeThreshold: 5000,  // 閾値
        data: data,

        // サンプリング設定
        sampling: 'lttb',  // Largest Triangle Three Buckets

        // レンダリング最適化
        progressive: 5000,  // プログレッシブレンダリング
        progressiveThreshold: 10000
      }]
    };
  });

  async loadLargeDataset() {
    this.isProcessing.set(true);

    try {
      // WebWorkerを使用した重い計算の例
      const data = await this.processDataInWorker();
      this.rawData.set(data);
    } finally {
      this.isProcessing.set(false);
    }
  }

  private async processDataInWorker(): Promise<number[][]> {
    return new Promise((resolve) => {
      // 実際のWebWorker実装は省略
      setTimeout(() => {
        resolve(Array.from({ length: 100000 }, () => [
          Math.random() * 1000,
          Math.random() * 1000
        ]));
      }, 1000);
    });
  }
}
```

### 3. メモリリーク対策

```typescript
@Component({
  template: `<div echarts [options]="chartOptions()" (chartInit)="onChartInit($event)"></div>`
})
export class MemoryEfficientComponent implements OnDestroy {
  private chart?: any;
  private intervals: number[] = [];
  private eventListeners: Array<() => void> = [];

  onChartInit(chart: any) {
    this.chart = chart;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.chart) return;

    // イベントリスナーの管理
    const clickHandler = (params: any) => {
      console.log('Chart clicked:', params);
    };

    this.chart.on('click', clickHandler);

    // クリーンアップ用に保存
    this.eventListeners.push(() => {
      this.chart?.off('click', clickHandler);
    });
  }

  ngOnDestroy() {
    // 全てのリソースをクリーンアップ
    this.intervals.forEach(id => clearInterval(id));
    this.eventListeners.forEach(cleanup => cleanup());

    if (this.chart && !this.chart.isDisposed()) {
      this.chart.dispose();
    }
  }
}
```

## 💡 オフライン開発のベストプラクティス

### 1. 型定義の最大活用
```typescript
import type {
  EChartsOption,
  SeriesOption,
  XAXisOption,
  YAXisOption
} from 'echarts';

// 型安全な開発
const createChartOption = (data: number[]): EChartsOption => ({
  series: [{
    type: 'bar',
    data
  } as SeriesOption]
});
```

### 2. デバッグ用ヘルパー
```typescript
// chart-debug.util.ts
export class ChartDebugUtil {
  static logChartInfo(chart: any) {
    if (!chart) return;

    console.group('Chart Debug Info');
    console.log('Size:', {
      width: chart.getWidth(),
      height: chart.getHeight()
    });
    console.log('Option:', chart.getOption());
    console.log('Is Disposed:', chart.isDisposed());
    console.groupEnd();
  }

  static validateOption(option: EChartsOption): boolean {
    const required = ['xAxis', 'yAxis', 'series'];
    return required.every(key => key in option);
  }
}
```

### 3. 共通コンポーネントの作成
```typescript
// base-chart.component.ts
@Component({
  selector: 'app-base-chart',
  template: `
    <div echarts
         [options]="options()"
         [theme]="theme"
         [loading]="loading"
         (chartInit)="chartInit.emit($event)"
         class="chart-container">
    </div>
  `,
  styles: [`
    .chart-container { width: 100%; height: 400px; }
  `]
})
export class BaseChartComponent {
  @Input() options = input.required<EChartsOption>();
  @Input() theme = input<string>('');
  @Input() loading = input<boolean>(false);

  @Output() chartInit = new EventEmitter<any>();
}
```

## 次のステップ

1. **実装練習**: [基本的なチャート作成](../guides/basic-charts.md)で実際にチャートを作成
2. **具体例確認**: [棒グラフの実装例](../examples/bar-chart.md)でコード例を参照
3. **パフォーマンス**: [パフォーマンス最適化](../troubleshooting/performance.md)で高速化テクニックを学習

---

> 💡 **ポイント**: Angular 20のSignalsとngx-echartsの組み合わせは非常に強力です。リアクティブなデータフローと型安全性を活用して、保守性の高いチャートアプリケーションを構築できます。