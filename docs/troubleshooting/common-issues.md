# よくある問題と解決策

オフライン環境でのECharts + Angular開発でよく遭遇する問題と、その解決策をまとめています。

## 📖 目次

1. [環境構築の問題](#環境構築の問題)
2. [インポートとモジュールの問題](#インポートとモジュールの問題)
3. [チャート表示の問題](#チャート表示の問題)
4. [データバインディングの問題](#データバインディングの問題)
5. [パフォーマンスの問題](#パフォーマンスの問題)
6. [レスポンシブデザインの問題](#レスポンシブデザインの問題)
7. [メモリリークの問題](#メモリリークの問題)

## 環境構築の問題

### 🔧 問題: ngx-echartsが正しく動作しない

**症状:**
- チャートが表示されない
- "echarts is not defined"エラー
- モジュールが見つからないエラー

**原因と解決策:**

#### 1. 依存関係の確認
```bash
# パッケージが正しくインストールされているか確認
npm list echarts ngx-echarts

# 期待される出力:
# ├── echarts@6.0.0
# └── ngx-echarts@20.0.2
```

#### 2. app.config.tsの設定確認
```typescript
// ❌ 間違った設定
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // ngx-echartsの設定が抜けている
  ],
};

// ✅ 正しい設定
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts')
      })
    ),
  ],
};
```

#### 3. コンポーネントでのインポート確認
```typescript
// ❌ 間違ったインポート
import { Component } from '@angular/core';
// NgxEchartsModuleがインポートされていない

// ✅ 正しいインポート
import { Component } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  standalone: true,
  imports: [NgxEchartsModule], // 重要: imports配列に追加
  // ...
})
```

### 🔧 問題: TypeScriptエラーが発生する

**症状:**
- EChartsOptionでTypeScriptエラー
- 型定義が見つからない

**解決策:**

#### 1. 型定義の正しいインポート
```typescript
// ❌ 間違った型インポート
import { EChartsOption } from 'echarts/types/option';

// ✅ 正しい型インポート
import type { EChartsOption } from 'echarts';
```

#### 2. tsconfig.jsonの確認
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true
  }
}
```

## インポートとモジュールの問題

### 🔧 問題: バンドルサイズが大きすぎる

**症状:**
- アプリケーションの読み込みが遅い
- バンドルサイズが数MB以上

**解決策:**

#### 1. 必要なチャートタイプのみインポート
```typescript
// ❌ 全てのEChartsをインポート
import * as echarts from 'echarts';

// ✅ 必要な部分のみインポート
import { init } from 'echarts';
import 'echarts/lib/chart/bar';      // 棒グラフのみ
import 'echarts/lib/chart/line';     // 折れ線グラフのみ
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
```

#### 2. 遅延読み込みの設定
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts') // 遅延読み込み
      })
    ),
  ],
};
```

### 🔧 問題: "echarts is not a function"エラー

**症状:**
- ランタイムでechartsが関数でないエラー
- チャートが初期化されない

**解決策:**

```typescript
// ❌ 問題のあるインポート
import echarts from 'echarts';

// ✅ 正しいインポート
import * as echarts from 'echarts';

// または
import { init } from 'echarts';
```

## チャート表示の問題

### 🔧 問題: チャートが表示されない

**症状:**
- 空の領域だけ表示される
- エラーは出ないが何も見えない

**解決策:**

#### 1. CSSの高さ設定確認
```css
/* ❌ 高さが設定されていない */
.chart-container {
  width: 100%;
  /* height設定なし */
}

/* ✅ 明示的な高さ設定 */
.chart-container {
  width: 100%;
  height: 400px; /* 必須 */
}
```

#### 2. コンテナのサイズ確認
```typescript
@Component({
  template: `
    <!-- ❌ サイズが0になる可能性 -->
    <div echarts [options]="chartOptions"></div>

    <!-- ✅ 明示的なサイズ指定 -->
    <div echarts [options]="chartOptions"
         style="width: 100%; height: 400px;"></div>
  `
})
```

#### 3. データの確認
```typescript
// デバッグ用: データの内容を確認
ngAfterViewInit() {
  console.log('Chart options:', this.chartOptions);
  console.log('Chart data:', this.chartOptions.series?.[0]?.data);
}
```

### 🔧 問題: チャートのリサイズが正しく動作しない

**症状:**
- ウィンドウサイズ変更時にチャートが追従しない
- チャートが切れて表示される

**解決策:**

#### 1. 自動リサイズの設定
```typescript
@Component({
  template: `
    <div echarts
         [options]="chartOptions"
         [autoResize]="true"
         class="chart"></div>
  `
})
export class ResizableChartComponent {
  // autoResize="true"で自動リサイズ有効
}
```

#### 2. 手動リサイズの実装
```typescript
import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  template: `
    <div #chartContainer echarts [options]="chartOptions"></div>
  `
})
export class ManualResizeChartComponent {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  private chart: any;

  @HostListener('window:resize')
  onWindowResize() {
    if (this.chart) {
      // 次のフレームで実行して正確なサイズを取得
      setTimeout(() => {
        this.chart.resize();
      }, 100);
    }
  }

  onChartInit(chart: any) {
    this.chart = chart;
  }
}
```

## データバインディングの問題

### 🔧 問題: データ更新時にチャートが更新されない

**症状:**
- データを変更してもチャートが変わらない
- 手動で再描画が必要

**解決策:**

#### 1. Signalsを使用した正しいリアクティブ実装
```typescript
// ❌ オブジェクトの直接変更（検知されない）
updateData() {
  this.chartOptions.series[0].data.push(newValue); // NG
}

// ✅ Signalsを使用した正しい更新
@Component({})
export class ReactiveChartComponent {
  private readonly data = signal([1, 2, 3]);

  readonly chartOptions = computed(() => ({
    series: [{ type: 'bar', data: this.data() }]
  }));

  updateData() {
    this.data.update(current => [...current, newValue]); // OK
  }
}
```

#### 2. 強制的な更新方法
```typescript
// 緊急時の解決策（推奨されない）
@Component({
  template: `
    <div echarts
         [options]="chartOptions"
         [merge]="mergeOptions"
         #chart></div>
  `
})
export class ForceUpdateChartComponent {
  @ViewChild('chart') chart: any;

  forceUpdate() {
    // 強制的にチャートを更新
    this.chart.refreshChart();
  }
}
```

### 🔧 問題: 非同期データでチャートが表示されない

**症状:**
- APIからのデータでチャートが空
- データ取得前にチャートが描画される

**解決策:**

#### 1. ローディング状態の管理
```typescript
@Component({
  template: `
    <div echarts
         [options]="chartOptions()"
         [loading]="isLoading()"
         [loadingOpts]="loadingOptions">
    </div>
  `
})
export class AsyncDataChartComponent {
  private readonly isLoading = signal(true);
  private readonly data = signal<number[]>([]);

  readonly chartOptions = computed(() => ({
    series: [{ type: 'bar', data: this.data() }]
  }));

  readonly loadingOptions = {
    text: 'データ読み込み中...',
    color: '#c23531'
  };

  async ngOnInit() {
    try {
      const apiData = await this.dataService.fetchData();
      this.data.set(apiData);
    } finally {
      this.isLoading.set(false);
    }
  }
}
```

#### 2. 条件付きレンダリング
```typescript
@Component({
  template: `
    <div *ngIf="hasData(); else loading">
      <div echarts [options]="chartOptions()"></div>
    </div>

    <ng-template #loading>
      <div class="loading">データを読み込んでいます...</div>
    </ng-template>
  `
})
export class ConditionalRenderChartComponent {
  private readonly data = signal<number[]>([]);

  readonly hasData = computed(() => this.data().length > 0);
  readonly chartOptions = computed(() => ({
    series: [{ type: 'bar', data: this.data() }]
  }));
}
```

## パフォーマンスの問題

### 🔧 問題: 大量データでチャートが重い

**症状:**
- チャートの描画が遅い
- スクロールやズームが重い

**解決策:**

#### 1. 大量データモードの有効化
```typescript
const optimizedOptions: EChartsOption = {
  series: [{
    type: 'line',
    large: true,           // 大量データモード
    largeThreshold: 5000,  // 閾値
    data: largeDataset,

    // データサンプリング
    sampling: 'lttb',      // Largest Triangle Three Buckets

    // プログレッシブレンダリング
    progressive: 1000,
    progressiveThreshold: 3000
  }]
};
```

#### 2. Canvas描画の使用
```typescript
// 大量データの場合はCanvasを使用
@Component({
  template: `
    <div echarts
         [options]="chartOptions"
         [initOpts]="{ renderer: 'canvas' }">
    </div>
  `
})
export class HighPerformanceChartComponent {}
```

#### 3. アニメーションの無効化
```typescript
const fastOptions: EChartsOption = {
  animation: false,  // アニメーション無効
  series: [{
    type: 'line',
    data: data,
    animationDuration: 0  // 個別設定も可能
  }]
};
```

### 🔧 問題: メモリ使用量が多い

**症状:**
- アプリケーションが重くなる
- ブラウザが応答しなくなる

**解決策:**

#### 1. データの制限
```typescript
@Component({})
export class MemoryEfficientChartComponent {
  private readonly maxDataPoints = 1000;
  private readonly data = signal<number[]>([]);

  addDataPoint(newValue: number) {
    this.data.update(current => {
      const updated = [...current, newValue];
      // 古いデータを削除
      return updated.length > this.maxDataPoints
        ? updated.slice(-this.maxDataPoints)
        : updated;
    });
  }
}
```

#### 2. チャートインスタンスの適切な破棄
```typescript
@Component({})
export class ProperCleanupChartComponent implements OnDestroy {
  private chart: any;

  onChartInit(chart: any) {
    this.chart = chart;
  }

  ngOnDestroy() {
    if (this.chart && !this.chart.isDisposed()) {
      this.chart.dispose(); // 重要: インスタンスを破棄
    }
  }
}
```

## レスポンシブデザインの問題

### 🔧 問題: モバイルでチャートが見づらい

**症状:**
- 文字が小さすぎる
- タッチ操作ができない

**解決策:**

#### 1. レスポンシブ設定
```typescript
const responsiveOptions: EChartsOption = {
  media: [
    {
      query: { maxWidth: 768 },
      option: {
        title: {
          textStyle: { fontSize: 14 }
        },
        legend: {
          bottom: 0,
          orient: 'horizontal'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%'
        }
      }
    },
    {
      query: { minWidth: 768 },
      option: {
        title: {
          textStyle: { fontSize: 18 }
        },
        legend: {
          right: 0,
          orient: 'vertical'
        }
      }
    }
  ]
};
```

#### 2. タッチ対応
```typescript
const touchFriendlyOptions: EChartsOption = {
  brush: {
    toolbox: ['rect', 'polygon', 'keep', 'clear'],
    xAxisIndex: 0,
    throttleType: 'debounce', // タッチ性能向上
    throttleDelay: 300
  },
  dataZoom: [{
    type: 'inside',
    throttle: 100
  }]
};
```

## メモリリークの問題

### 🔧 問題: チャートコンポーネントが破棄されてもメモリが解放されない

**症状:**
- ページ遷移後もメモリ使用量が減らない
- 時間が経つにつれて重くなる

**解決策:**

#### 1. 完全なクリーンアップ
```typescript
@Component({})
export class MemoryLeakFreeChartComponent implements OnDestroy {
  private chart: any;
  private eventListeners: Array<() => void> = [];
  private intervals: number[] = [];
  private resizeObserver?: ResizeObserver;

  ngOnDestroy() {
    // 1. イベントリスナーの削除
    this.eventListeners.forEach(cleanup => cleanup());

    // 2. インターバルの削除
    this.intervals.forEach(id => clearInterval(id));

    // 3. ResizeObserverの削除
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // 4. チャートインスタンスの破棄
    if (this.chart && !this.chart.isDisposed()) {
      this.chart.clear();
      this.chart.dispose();
    }
  }
}
```

## 💡 デバッグのコツ

### 1. ブラウザ開発者ツールの活用
```typescript
// チャートの状態確認
onChartInit(chart: any) {
  // グローバルに公開してコンソールからアクセス可能に
  (window as any).debugChart = chart;

  console.log('Chart initialized:', {
    width: chart.getWidth(),
    height: chart.getHeight(),
    option: chart.getOption()
  });
}
```

### 2. エラーハンドリング
```typescript
@Component({
  template: `
    <div echarts
         [options]="chartOptions"
         (chartInit)="onChartInit($event)"
         (chartError)="onChartError($event)">
    </div>
  `
})
export class ErrorHandlingChartComponent {
  onChartError(error: any) {
    console.error('Chart error:', error);
    // エラー通知やフォールバック処理
  }
}
```

### 3. オプションの検証
```typescript
function validateChartOption(option: EChartsOption): boolean {
  // 必須プロパティの確認
  if (!option.series || option.series.length === 0) {
    console.error('Series is required');
    return false;
  }

  // データの確認
  for (const series of option.series) {
    if (!series.data || series.data.length === 0) {
      console.warn('Empty data in series:', series.name);
    }
  }

  return true;
}
```

## 次のステップ

1. **パフォーマンス最適化**: [パフォーマンス最適化ガイド](./performance.md)
2. **メモリリーク対策**: [メモリリーク対策](./memory-leaks.md)
3. **APIリファレンス**: [EChartsオプション](../api-reference/echarts-options.md)

---

> 💡 **ポイント**: オフライン環境では外部リソースに頼れないため、このトラブルシューティングガイドをブックマークして、問題発生時の第一参照として活用してください。