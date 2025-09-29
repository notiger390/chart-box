# Angular Chart Reference Library

## 📊 概要

ハッカソンや実務開発時に素早くチャート実装を行うためのリファレンスプロジェクトです。
オフライン環境でも利用可能で、様々なチャートパターンの実装例を提供しています。

### 🎯 プロジェクトの目的

- **ハッカソン対応**: インターネットがない環境でも、このリポジトリを参照するだけでチャート実装が可能
- **実装リファレンス**: 多様なチャートタイプとその組み合わせ例を提供
- **実務活用**: 実際の業務でも振り返りやテンプレートとして活用可能
- **開発効率化**: コピー&ペーストで即座に実装可能なサンプルコード

## 🛠 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Angular | 20.3.0 | フレームワーク |
| ECharts | 6.0.0 | チャート描画エンジン |
| ngx-echarts | 20.0.2 | Angular用EChartsラッパー |
| PrimeNG | 20.2.0 | UIコンポーネントライブラリ |
| PrimeUI Themes | 1.2.5 | テーマスタイリング |
| TypeScript | 5.9.2 | 型安全な開発 |

## 🚀 セットアップ

### 前提条件
- Node.js (v18以上推奨)
- npm または yarn

### インストール手順

```bash
# リポジトリのクローン
git clone [repository-url]
cd angular-chart

# Angularアプリケーションディレクトリに移動
cd client

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

開発サーバー起動後、`http://localhost:4200/` にアクセスしてください。

### ビルド

```bash
# clientディレクトリで実行
cd client

# プロダクションビルド
npm run build

# 開発ビルド
npm run build -- --configuration development
```

## 📈 実装済みチャート一覧

### 基本チャート
- [x] Bar Chart (棒グラフ) - `client/src/app/charts/bar-chart/`
- [x] ⭐ **Line Chart (折れ線グラフ)** - 豊富な機能実装済み ⭐
  - [x] **Enhanced Line Chart** - 包括的コントロールパネル付き - `client/src/app/charts/line-chart/`
  - [x] **Real-time Line Chart** - リアルタイムデータストリーミング - `client/src/app/charts/line-chart-realtime/`
  - [x] **Step Line Chart** - ステップライン（離散データ対応） - `client/src/app/charts/line-chart-step/`
  - [x] **Time Series Chart** - 高度な時系列データ可視化 - `client/src/app/charts/line-chart-timeseries/`
  - [x] **Stacked Line Chart** - マルチレイヤー積み上げ表示 - `client/src/app/charts/line-chart-stacked/`
- [x] Pie Chart (円グラフ) - `client/src/app/charts/pie-chart/`
- [x] Scatter Chart (散布図) - `client/src/app/charts/scatter-chart/`
- [x] Area Chart (エリアチャート) - `client/src/app/charts/area-chart/`
- [x] Radar Chart (レーダーチャート) - `client/src/app/charts/radar-chart/`

### 応用チャート
- [ ] Candlestick Chart (ローソク足)
- [ ] Heatmap (ヒートマップ)
- [ ] Tree Chart (ツリー図)
- [ ] Sankey Diagram (サンキーダイアグラム)
- [ ] Gauge Chart (ゲージチャート)
- [ ] Funnel Chart (ファネルチャート)

### 複合チャート
- [x] Stacked Line Chart (積み上げ折れ線) - 3モード対応（通常/積み上げ/100%積み上げ）
- [ ] Bar + Line (棒グラフ＋折れ線)
- [ ] Multiple Y-Axis (複数Y軸)

## 📖 使い方

### 1. 基本チャートコンポーネントの実装例

```typescript
// Bar Chartの例 (client/src/app/charts/bar-chart/bar-chart.component.ts)
import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-bar-chart',
  imports: [NgxEchartsModule],
  template: `
    <div echarts [options]="chartOptions()" class="chart"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent {
  // Signalを使用したリアクティブなデータ管理
  private readonly data = signal({
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    values: [120, 200, 150, 80, 70]
  });

  // computedで自動的に更新されるチャートオプション
  protected readonly chartOptions = computed<EChartsOption>(() => ({
    xAxis: { type: 'category', data: this.data().categories },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: this.data().values }]
  }));
}
```

### 2. 高度なLine Chartの実装例

```typescript
// Enhanced Line Chart (client/src/app/charts/line-chart/line-chart.component.ts)
@Component({
  selector: 'app-line-chart',
  imports: [NgxEchartsModule, FormsModule, CommonModule],
  template: `
    <div echarts [options]="chartOptions()" (chartInit)="onChartInit($event)" class="chart"></div>
    <div class="control-panel">
      <!-- インタラクティブなコントロールパネル -->
      <label><input type="checkbox" [(ngModel)]="smooth">Smooth Line</label>
      <label><input type="checkbox" [(ngModel)]="showArea">Show Area</label>
      <label><input type="range" min="1" max="10" [(ngModel)]="lineWidth">Line Width</label>
    </div>
  `
})
export class LineChartComponent {
  // コントロールパネルの設定
  smooth = signal(true);
  showArea = signal(true);
  lineWidth = signal(3);

  // リアルタイム反映されるチャートオプション
  protected readonly chartOptions = computed(() => ({
    series: [{
      type: 'line',
      smooth: this.smooth(),
      lineStyle: { width: this.lineWidth() },
      areaStyle: this.showArea() ? { opacity: 0.3 } : undefined,
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }]
  }));
}
```

### 3. リアルタイムデータ更新の実装

```typescript
// Real-time Line Chart (client/src/app/charts/line-chart-realtime/line-chart-realtime.component.ts)
export class LineChartRealtimeComponent implements OnInit, OnDestroy {
  private dataPoints = signal<DataPoint[]>([]);
  private intervalId: any;

  startRealTimeUpdates() {
    this.intervalId = setInterval(() => {
      const newPoint = {
        time: new Date(),
        value: this.generateRandomValue()
      };
      this.addDataPoint(newPoint);
    }, 1000);
  }

  private addDataPoint(point: DataPoint) {
    const currentData = this.dataPoints();
    const newData = [...currentData, point];
    if (newData.length > 50) newData.shift(); // 最大50点
    this.dataPoints.set(newData);
  }
}
```

### 4. 時系列データチャートの実装

```typescript
// Time Series Chart (client/src/app/charts/line-chart-timeseries/line-chart-timeseries.component.ts)
export class LineChartTimeseriesComponent {
  protected readonly chartOptions = computed(() => ({
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value: number) => new Date(value).toLocaleDateString()
      }
    },
    series: [{
      type: 'line',
      data: this.timeSeriesData().map(d => [d.time, d.value]),
      markPoint: { data: [{ type: 'max' }, { type: 'min' }] },
      markLine: { data: [{ type: 'average' }] }
    }]
  }));
}
```

## 🎨 PrimeNGとの統合

```typescript
// PrimeNGコンポーネントとEChartsの組み合わせ例
import { Button } from 'primeng/button';
import { Dropdown } from 'primeng/dropdown';

@Component({
  template: `
    <p-dropdown
      [options]="chartTypes"
      [(ngModel)]="selectedType"
      (onChange)="onChartTypeChange($event)">
    </p-dropdown>
    <div echarts [options]="chartOptions()" class="chart"></div>
  `
})
```

## 🌟 新機能ハイライト

### 📈 Enhanced Line Chart Features
- **包括的コントロールパネル**: 全ての設定をリアルタイム調整可能
- **マルチシリーズサポート**: 最大3系列の同時表示・個別制御
- **高度なマーク機能**: markPoint (最大/最小値)、markLine (平均/目標値)、markArea (範囲強調)
- **グラデーション塗りつぶし**: 透明度調整可能なLinearGradient
- **エクスポート機能**: ワンクリックでPNG画像保存
- **インタラクティブツールボックス**: データビュー、マジックタイプ、復元機能

### ⚡ Real-time Data Streaming
- **ライブデータ更新**: 100ms〜5秒間隔で調整可能
- **パフォーマンス監視**: FPS計測、データポイント数表示
- **データ管理**: 自動古いデータ削除、volatility制御
- **統計表示**: 最新値、トレンド、データ品質指標

### 📊 Advanced Chart Types
- **Step Line Chart**: start/middle/end/normal の4モード
- **Time Series Chart**: 株価、気象、分析、売上の4データセット
- **Stacked Line Chart**: 通常/積み上げ/100%積み上げの3モード

## 🔄 データのインポート/エクスポート

### ✅ 実装済みエクスポート機能
- **PNG画像エクスポート**: チャートインスタンスから高解像度画像生成
- **データビューエクスポート**: ツールボックスからCSV/Excel形式でデータ出力
- **プログラムエクスポート**: `getDataURL()` APIによる画像取得

### 🚧 実装予定インポート機能
- CSV形式のデータインポート
- JSON形式のデータインポート
- Excel形式のデータインポート

## 📝 プロジェクト構成

```
angular-chart/
├── .github/
│   └── workflows/          # GitHub Actions設定
├── client/                 # Angularアプリケーション
│   ├── src/
│   │   ├── app/
│   │   │   ├── charts/     # チャートコンポーネント
│   │   │   │   ├── bar-chart/
│   │   │   │   ├── line-chart/              # 📈 Enhanced Line Chart
│   │   │   │   ├── line-chart-realtime/     # ⚡ Real-time Line Chart
│   │   │   │   ├── line-chart-step/         # 📶 Step Line Chart
│   │   │   │   ├── line-chart-timeseries/   # 🕒 Time Series Chart
│   │   │   │   ├── line-chart-stacked/      # 📊 Stacked Line Chart
│   │   │   │   └── ...
│   │   │   ├── home/       # ホーム画面
│   │   │   └── ...
│   │   └── styles.scss
│   ├── public/             # 静的ファイル
│   ├── package.json
│   └── angular.json
├── docs/                   # 📚 オフライン対応ドキュメント
│   ├── README.md           # ドキュメントの目次・概要
│   ├── getting-started/    # ECharts入門ガイド
│   │   ├── echarts-basics.md     # ECharts基本概念
│   │   └── angular-integration.md # Angular統合方法
│   ├── primeng/            # 📱 PrimeNG完全ガイド
│   │   ├── getting-started/
│   │   │   └── primeng-basics.md # PrimeNG基本概念・セットアップ
│   │   ├── components/
│   │   │   └── form-components.md # フォームコンポーネント実装例
│   │   ├── theming/
│   │   │   └── theme-customization.md # テーマ・スタイリング
│   │   ├── integration/
│   │   │   └── primeng-echarts.md # PrimeNG + ECharts統合
│   │   └── api-reference/
│   │       └── component-api.md  # PrimeNGコンポーネントAPI
│   ├── examples/           # 実装例
│   │   └── bar-chart.md    # 棒グラフ詳細実装例
│   ├── troubleshooting/    # トラブルシューティング
│   │   └── common-issues.md # よくある問題と解決策
│   └── api-reference/      # APIリファレンス
│       └── echarts-options.md # EChartsオプション完全リファレンス
└── README.md              # このファイル
```

## 🔍 実装のベストプラクティス

### Angular + ECharts

1. **Signalの活用**: データ管理にSignalを使用してリアクティブな更新を実現
2. **Computed関数**: チャートオプションはcomputedで管理して自動更新
3. **OnPush戦略**: パフォーマンス向上のためChangeDetectionStrategy.OnPushを使用
4. **遅延読み込み**: 必要な時のみEChartsライブラリを読み込む

### コード規約

- スタンドアロンコンポーネントを使用（NgModulesは使用しない）
- Reactive Formsを優先（Template-driven formsより）
- 型安全性を重視（any型は避ける）

## 📚 オフライン対応ドキュメント

このプロジェクトには、**オフライン環境でのECharts + Angular開発**を支援する包括的なドキュメントが含まれています。

### 🎯 ドキュメントの特徴

- **完全オフライン対応**: インターネット接続不要で全情報を参照可能
- **初心者フレンドリー**: EChartsが初めての開発者でも理解できる段階的説明
- **実践的**: すぐに使える実装例とトラブルシューティング

### 📖 ドキュメント構成

| カテゴリ | ファイル | 内容 |
|---------|---------|------|
| **ECharts入門** | [docs/getting-started/echarts-basics.md](./docs/getting-started/echarts-basics.md) | EChartsの基本概念、設定構造、データの扱い方 |
| | [docs/getting-started/angular-integration.md](./docs/getting-started/angular-integration.md) | ngx-echartsの統合、Signalsとの連携 |
| **PrimeNG入門** | [docs/primeng/getting-started/primeng-basics.md](./docs/primeng/getting-started/primeng-basics.md) | PrimeNGの基本概念、セットアップ、基本コンポーネント |
| **統合開発** | [docs/primeng/integration/primeng-echarts.md](./docs/primeng/integration/primeng-echarts.md) | PrimeNG + EChartsダッシュボード構築 |
| **実装例** | [docs/examples/bar-chart.md](./docs/examples/bar-chart.md) | 棒グラフの詳細実装例（基本〜高度） |
| | [docs/primeng/components/form-components.md](./docs/primeng/components/form-components.md) | PrimeNGフォームコンポーネント実装例 |
| **スタイリング** | [docs/primeng/theming/theme-customization.md](./docs/primeng/theming/theme-customization.md) | PrimeNGテーマシステム、カスタマイズ方法 |
| **問題解決** | [docs/troubleshooting/common-issues.md](./docs/troubleshooting/common-issues.md) | よくある問題とその解決策 |
| **APIリファレンス** | [docs/api-reference/echarts-options.md](./docs/api-reference/echarts-options.md) | EChartsオプション完全リファレンス |
| | [docs/primeng/api-reference/component-api.md](./docs/primeng/api-reference/component-api.md) | PrimeNGコンポーネントAPI完全リファレンス |

### 🚀 クイックスタート（ドキュメント）

#### ECharts + Angular開発
1. **ECharts基本概念**: [ECharts入門](./docs/getting-started/echarts-basics.md)
2. **Angular統合**: [Angular統合入門](./docs/getting-started/angular-integration.md)
3. **チャート実装**: [棒グラフ実装例](./docs/examples/bar-chart.md)

#### PrimeNG + ECharts統合開発
1. **PrimeNG基本概念**: [PrimeNG入門](./docs/primeng/getting-started/primeng-basics.md)
2. **統合ダッシュボード**: [PrimeNG + ECharts統合](./docs/primeng/integration/primeng-echarts.md)
3. **UIコンポーネント**: [フォームコンポーネント実装](./docs/primeng/components/form-components.md)
4. **テーマカスタマイズ**: [テーマ・スタイリング](./docs/primeng/theming/theme-customization.md)

#### 問題解決・リファレンス
- **トラブルシューティング**: [よくある問題と解決策](./docs/troubleshooting/common-issues.md)
- **ECharts API**: [EChartsオプションリファレンス](./docs/api-reference/echarts-options.md)
- **PrimeNG API**: [PrimeNGコンポーネントAPI](./docs/primeng/api-reference/component-api.md)

> 💡 **ポイント**: オフライン環境では外部ドキュメントにアクセスできないため、`docs/`フォルダをブックマークして開発時の第一参照として活用してください。

## 🚧 今後の実装予定

### チャート実装
- [ ] 応用チャート（Candlestick、Heatmap、Tree、Sankey、Gauge、Funnel）
- [ ] 複合チャート（Bar + Line、Multiple Y-Axis等）

### ドキュメント拡張
- [x] **折れ線グラフ実装例** - 5種類の高度な実装完了
- [ ] 円グラフ実装例
- [ ] 散布図実装例
- [ ] パフォーマンス最適化ガイド
- [ ] メモリリーク対策ガイド
- [x] **レスポンシブデザインガイド** - 全Line Chartでモバイル対応済み

### 機能追加
- [ ] データインポート機能（CSV/JSON/Excel）
- [x] **画像エクスポート機能（PNG）** - Line Charts全てで実装済み
- [ ] SVG/PDFエクスポート機能
- [ ] チャートテンプレートギャラリー
- [x] **リアルタイムデータ更新のサンプル** - Real-time Line Chart実装済み
- [x] **ダークモード対応** - 全Line Chartsで実装済み
- [ ] チャート間のデータ連携サンプル

### 🆕 新規追加機能
- [x] **インタラクティブコントロールパネル** - 全設定のリアルタイム調整
- [x] **マルチチャートモード** - 同一データでの複数表現切り替え
- [x] **高度なマークアノテーション** - 最大/最小値、平均値、目標値ライン
- [x] **時系列データ対応** - Time軸、データズーム、ブラシ選択
- [x] **パフォーマンス監視** - FPS表示、メモリ使用量追跡

## 🚀 デプロイメント

GitHub Pagesを使用して自動デプロイが設定されています。
- **URL**: GitHub Pages URL（設定後に更新）
- **自動デプロイ**: `release`ブランチへのプッシュで自動実行

## 📄 ライセンスと利用について

- **選定**: 基本的に無償利用可能なライブラリを利用する事

### 主要ライブラリのライセンス
- Angular: MIT License
- ECharts: Apache License 2.0
- PrimeNG: MIT License
- ngx-echarts: MIT License

## 🤝 貢献

新しいチャートパターンの追加や改善提案は大歓迎です！

## 📚 参考リソース

### オンライン参考資料（オフライン時は使用不可）
- [ECharts公式ドキュメント](https://echarts.apache.org/)
- [Angular公式ドキュメント](https://angular.dev/)
- [PrimeNG公式ドキュメント](https://primeng.org/)
- [ngx-echarts GitHub](https://github.com/xieziyu/ngx-echarts)

### オフライン時の第一参照
- **メインガイド**: [docs/README.md](./docs/README.md)
- **入門者向け**: [docs/getting-started/](./docs/getting-started/)
- **実装例**: [docs/examples/](./docs/examples/)
- **問題解決**: [docs/troubleshooting/](./docs/troubleshooting/)
- **詳細リファレンス**: [docs/api-reference/](./docs/api-reference/)

---

**Note**: このプロジェクトはオフライン環境でのハッカソンや実務開発を支援するために作成されています。
チャート実装に迷ったら、このリポジトリを参照してください。