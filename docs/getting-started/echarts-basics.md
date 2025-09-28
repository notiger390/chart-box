# ECharts入門ガイド

EChartsは、Baiduが開発したオープンソースのJavaScriptチャートライブラリです。豊富なチャートタイプと高いカスタマイズ性を持ち、WebGLによる高性能な描画が可能です。

## 📖 目次

1. [EChartsとは](#echartsとは)
2. [主な特徴](#主な特徴)
3. [基本概念](#基本概念)
4. [チャートの構成要素](#チャートの構成要素)
5. [設定オプションの構造](#設定オプションの構造)
6. [データの扱い方](#データの扱い方)

## EChartsとは

EChartsは、データ可視化のためのオープンソースJavaScriptライブラリです。

### 💡 なぜEChartsを選ぶのか？

- **豊富なチャートタイプ**: 基本的なグラフから複雑な地理的可視化まで
- **高性能**: WebGLを活用した大量データの処理
- **カスタマイズ性**: 細かいスタイリングと動作の制御
- **モバイル対応**: タッチデバイスでのインタラクション
- **アクセシビリティ**: スクリーンリーダー対応

## 主な特徴

### チャートタイプ
```
基本チャート:
├── 棒グラフ (Bar Chart)
├── 折れ線グラフ (Line Chart)
├── 円グラフ (Pie Chart)
├── 散布図 (Scatter Chart)
└── エリアチャート (Area Chart)

高度なチャート:
├── ローソク足 (Candlestick)
├── ヒートマップ (Heatmap)
├── ツリーマップ (Treemap)
├── サンキーダイアグラム (Sankey)
├── レーダーチャート (Radar)
└── 地理的可視化 (Geo/Map)
```

### 描画方式
- **Canvas**: 高性能、大量データ対応
- **SVG**: ベクター形式、印刷品質
- **WebGL**: 3D描画、超高性能

## 基本概念

### 1. インスタンス (ECharts Instance)
チャートの実体。DOMエレメントに描画される。

```typescript
// インスタンスの作成
const chart = echarts.init(domElement);

// オプションの設定
chart.setOption(option);

// リサイズ
chart.resize();

// 破棄
chart.dispose();
```

### 2. オプション (Option)
チャートの全ての設定を含むオブジェクト。

```typescript
const option: EChartsOption = {
  title: { text: 'チャートタイトル' },
  xAxis: { type: 'category', data: ['A', 'B', 'C'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [10, 20, 30] }]
};
```

### 3. シリーズ (Series)
実際のデータとその表現方法を定義。

```typescript
// 単一シリーズ
series: [{
  type: 'bar',
  data: [10, 20, 30]
}]

// 複数シリーズ
series: [
  { type: 'bar', data: [10, 20, 30], name: '売上' },
  { type: 'line', data: [15, 25, 35], name: '利益' }
]
```

## チャートの構成要素

### 基本構造
```
┌─────────────────────────────────┐
│ title (タイトル)                   │
├─────────────────────────────────┤
│ ┌─ legend (凡例) ────────────┐   │
│ │ ■ シリーズ1  ■ シリーズ2      │   │
│ └─────────────────────────┘   │
│ ┌─ grid (グリッド領域) ─────────┐  │
│ │ ↑                          │  │
│ │ │yAxis   ┌─ series ─────┐  │  │
│ │ │        │   データ表示    │  │  │
│ │ │        └──────────────┘  │  │
│ │ └─────────xAxis────────────→ │  │
│ └─────────────────────────────┘  │
│ toolbox (ツールボックス)            │
└─────────────────────────────────┘
```

### 主要コンポーネント

#### 1. タイトル (title)
```typescript
title: {
  text: 'メインタイトル',
  subtext: 'サブタイトル',
  left: 'center',  // 'left' | 'center' | 'right'
  textStyle: {
    fontSize: 18,
    color: '#333'
  }
}
```

#### 2. 凡例 (legend)
```typescript
legend: {
  data: ['シリーズ1', 'シリーズ2'],
  orient: 'horizontal',  // 'horizontal' | 'vertical'
  left: 'center',
  top: 'bottom'
}
```

#### 3. 軸 (xAxis/yAxis)
```typescript
xAxis: {
  type: 'category',  // 'category' | 'value' | 'time' | 'log'
  data: ['月', '火', '水', '木', '金'],
  axisLabel: {
    rotate: 45  // ラベルの回転
  }
},
yAxis: {
  type: 'value',
  name: 'Y軸タイトル',
  min: 0,
  max: 100
}
```

#### 4. グリッド (grid)
```typescript
grid: {
  left: '10%',
  right: '10%',
  top: '20%',
  bottom: '15%',
  containLabel: true  // ラベルを含めて計算
}
```

#### 5. ツールチップ (tooltip)
```typescript
tooltip: {
  trigger: 'axis',  // 'item' | 'axis' | 'none'
  formatter: '{b}: {c}',  // カスタムフォーマット
  backgroundColor: 'rgba(50,50,50,0.7)',
  textStyle: {
    color: '#fff'
  }
}
```

## 設定オプションの構造

### 階層構造の理解
```typescript
const option: EChartsOption = {
  // グローバル設定
  backgroundColor: '#fff',

  // コンポーネント設定
  title: { /* タイトル設定 */ },
  legend: { /* 凡例設定 */ },
  tooltip: { /* ツールチップ設定 */ },

  // 座標系設定
  xAxis: { /* X軸設定 */ },
  yAxis: { /* Y軸設定 */ },
  grid: { /* グリッド設定 */ },

  // データ表現設定
  series: [
    { /* シリーズ1設定 */ },
    { /* シリーズ2設定 */ }
  ],

  // インタラクション設定
  dataZoom: [{ /* ズーム設定 */ }],
  brush: { /* ブラシ選択設定 */ }
};
```

### 設定の優先順位
1. **シリーズレベル**: 個別のシリーズ固有設定
2. **コンポーネントレベル**: 各コンポーネントの設定
3. **グローバルレベル**: 全体のデフォルト設定

```typescript
// 例: 色の設定優先順位
const option = {
  // 3. グローバル色設定（最低優先度）
  color: ['#c23531', '#2f4554'],

  series: [{
    // 2. シリーズレベル色設定（中優先度）
    color: '#91c7ae',
    data: [
      // 1. データポイント色設定（最高優先度）
      { value: 100, itemStyle: { color: '#f39c12' } },
      200,
      300
    ]
  }]
};
```

## データの扱い方

### 1. 基本的なデータ形式

#### 配列形式
```typescript
// 単純な数値配列
data: [10, 20, 30, 40, 50]

// カテゴリと値のペア
data: [
  ['月曜日', 120],
  ['火曜日', 200],
  ['水曜日', 150]
]
```

#### オブジェクト形式
```typescript
data: [
  { name: '製品A', value: 335 },
  { name: '製品B', value: 310 },
  { name: '製品C', value: 234 }
]
```

### 2. 複雑なデータ構造

#### 多次元データ
```typescript
// 散布図用データ [x, y, size]
data: [
  [10.0, 8.04, 5],
  [8.07, 6.95, 3],
  [13.0, 7.58, 8]
]
```

#### メタデータ付きデータ
```typescript
data: [
  {
    value: 1212,
    name: '製品A',
    itemStyle: { color: '#c23531' },
    emphasis: { itemStyle: { color: '#e74c3c' } },
    tooltip: { formatter: 'カスタム表示: {c}' }
  }
]
```

### 3. データの動的更新

#### 全体更新
```typescript
// 新しいオプションで完全更新
chart.setOption(newOption);
```

#### 部分更新
```typescript
// シリーズデータのみ更新
chart.setOption({
  series: [{
    data: newData
  }]
});
```

#### データの追加・削除
```typescript
// データポイントの追加
const currentOption = chart.getOption();
currentOption.series[0].data.push(newDataPoint);
chart.setOption(currentOption);
```

## 💡 オフライン開発のポイント

### リソースの確認
```bash
# 必要なファイルがインストールされているか確認
node_modules/echarts/dist/echarts.min.js
node_modules/ngx-echarts/
```

### 型定義の活用
```typescript
import type { EChartsOption, SeriesOption } from 'echarts';

// 型安全な設定
const option: EChartsOption = {
  // TypeScriptが設定ミスを検出
  series: [{
    type: 'bar',  // 'bar' | 'line' | 'pie' など
    data: [1, 2, 3]
  }]
};
```

### デバッグ用ツール
```typescript
// 現在の設定を確認
const currentOption = chart.getOption();
console.log('Current Option:', currentOption);

// インスタンスの状態確認
console.log('Chart Info:', {
  width: chart.getWidth(),
  height: chart.getHeight(),
  isDisposed: chart.isDisposed()
});
```

## 次のステップ

1. **Angular統合**: [Angular統合入門](./angular-integration.md)でAngularとの統合を学習
2. **実装練習**: [基本的なチャート作成](../guides/basic-charts.md)で実際にチャートを作成
3. **サンプル確認**: [棒グラフの実装例](../examples/bar-chart.md)で具体的な実装を参照

---

> 💡 **ポイント**: EChartsの設定は非常に柔軟ですが、最初は基本的な構造を理解することから始めましょう。オフライン環境では公式ドキュメントにアクセスできないため、このガイドをブックマークして活用してください。