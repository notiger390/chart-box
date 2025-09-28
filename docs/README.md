# ECharts + Angular オフライン開発ガイド

オフライン環境でのECharts + Angular開発を支援するための包括的なドキュメントです。

## 📖 目次

### 🚀 はじめに
- [ECharts入門](./getting-started/echarts-basics.md) - EChartsの基本概念と特徴
- [Angular統合入門](./getting-started/angular-integration.md) - AngularでEChartsを使用する方法
- [開発環境セットアップ](./getting-started/setup.md) - オフライン環境での環境構築

### 📋 実装ガイド
- [基本的なチャート作成](./guides/basic-charts.md) - 最初のチャートを作成する
- [データバインディング](./guides/data-binding.md) - Angular Signalsとの統合
- [レスポンシブ対応](./guides/responsive-design.md) - 画面サイズに応じた調整
- [テーマとスタイリング](./guides/theming.md) - チャートの見た目をカスタマイズ
- [アニメーション制御](./guides/animations.md) - アニメーション効果の実装
- [イベント処理](./guides/event-handling.md) - ユーザーインタラクション

### 💡 実装例
- [棒グラフ](./examples/bar-chart.md) - 基本的な棒グラフの実装
- [折れ線グラフ](./examples/line-chart.md) - 時系列データの可視化
- [円グラフ](./examples/pie-chart.md) - 割合データの表示
- [散布図](./examples/scatter-chart.md) - 相関関係の可視化
- [複合チャート](./examples/combination-charts.md) - 複数のチャートタイプの組み合わせ
- [リアルタイムチャート](./examples/realtime-charts.md) - 動的データ更新

### 🔧 トラブルシューティング
- [よくある問題](./troubleshooting/common-issues.md) - 頻出する問題と解決策
- [パフォーマンス最適化](./troubleshooting/performance.md) - 大量データの処理
- [メモリリーク対策](./troubleshooting/memory-leaks.md) - リソース管理のベストプラクティス

### 📚 APIリファレンス
- [EChartsオプション](./api-reference/echarts-options.md) - 設定オプション一覧
- [ngx-echarts API](./api-reference/ngx-echarts.md) - Angular用ラッパーAPI
- [Signalsとの統合](./api-reference/signals-integration.md) - リアクティブプログラミング

## 🎯 このドキュメントの特徴

### オフライン対応
- インターネット接続不要で全ての情報を参照可能
- 外部リンクは最小限に抑制
- 必要な情報は全て内包

### 初心者フレンドリー
- EChartsが初めての開発者でも理解できる説明
- 段階的な学習カリキュラム
- 豊富なコード例とコメント

### 実践的
- すぐに使える実装例
- コピー&ペースト可能なコード
- ベストプラクティスの紹介

## 🚀 クイックスタート

1. **環境確認**: [開発環境セットアップ](./getting-started/setup.md)を確認
2. **基本概念**: [ECharts入門](./getting-started/echarts-basics.md)でEChartsの基本を学習
3. **Angular統合**: [Angular統合入門](./getting-started/angular-integration.md)で統合方法を理解
4. **最初のチャート**: [基本的なチャート作成](./guides/basic-charts.md)で実装開始

## 📝 表記法

### コードブロック
```typescript
// TypeScriptコード例
import { Component } from '@angular/core';
```

### 重要な注意点
> 💡 **ポイント**: オフライン環境での開発に役立つヒント

> ⚠️ **注意**: 注意すべき点や制限事項

> 🔧 **トラブルシューティング**: 問題解決のヒント

### ファイルパス表記
- `client/src/app/charts/` - プロジェクト内のパス
- `node_modules/echarts/` - ライブラリのパス

## 🤝 このドキュメントの使い方

### 学習パス（初心者向け）
1. ECharts入門 → Angular統合入門 → 基本的なチャート作成
2. データバインディング → レスポンシブ対応
3. 具体的なチャートタイプの実装例を参照
4. 必要に応じてトラブルシューティングを確認

### リファレンス利用（経験者向け）
- 特定のチャートタイプは `examples/` を参照
- 設定オプションは `api-reference/` を参照
- 問題解決は `troubleshooting/` を参照

## 📋 貢献とフィードバック

このドキュメントは実際の開発経験に基づいて継続的に改善されています。
新しいパターンや改善点があれば、プロジェクトに貢献してください。

---

**最終更新**: 2025年9月
**対象バージョン**: Angular 20.x, ECharts 6.x, ngx-echarts 20.x