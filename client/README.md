# Client - コーディング規則

このプロジェクトでは、TypeScript、Angular、PrimeNG、EChartsを使用してスケーラブルなWebアプリケーションを開発します。
以下のコーディング規則に従って、保守性が高く、パフォーマンスに優れ、アクセシブルなコードを書きましょう。

## 開発環境

開発サーバーを起動するには:

```bash
ng serve
```

## Angular CLIコマンドの使用

### 基本原則

- **必須**: 新しいファイル（コンポーネント、サービス、ディレクティブなど）を作成する際は、必ずAngular CLIコマンドを使用する
- 手動でファイルを作成することは避ける
- Angular CLIが生成するファイル構造と命名規則に従う

### よく使用するコマンド

```bash
# コンポーネント作成
ng generate component components/my-component
ng g c components/my-component

# サービス作成
ng generate service services/my-service
ng g s services/my-service

# ディレクティブ作成
ng generate directive directives/my-directive
ng g d directives/my-directive

# パイプ作成
ng generate pipe pipes/my-pipe
ng g p pipes/my-pipe

# ガード作成
ng generate guard guards/my-guard
ng g g guards/my-guard

# インターセプター作成
ng generate interceptor interceptors/my-interceptor

# インターフェース作成
ng generate interface interfaces/my-interface
ng g i interfaces/my-interface
```

### AIによるコード生成時の遵守事項

AIツール（Claude、GitHub Copilot等）を使用してコードを生成する場合:

1. **ファイル構造の遵守**
   - Angular CLIが生成するファイル構造に厳密に従う
   - 命名規則（kebab-case、suffixなど）を必ず適用する

2. **生成されるコードパターンの模倣**
   ```typescript
   // ✅ Angular CLIスタイルのコンポーネント
   import { Component } from '@angular/core';

   @Component({
     selector: 'app-my-component',
     templateUrl: './my-component.component.html',
     styleUrls: ['./my-component.component.css']
   })
   export class MyComponentComponent {
     constructor() { }
   }
   ```

3. **必須の遵守事項**
   - `selector`命名: `app-` プレフィックス + kebab-case
   - ファイル命名: `component-name.component.ts/html/css`
   - クラス命名: `ComponentNameComponent` (PascalCase + Component suffix)
   - テストファイル: `component-name.component.spec.ts`

4. **AIに指示する際のテンプレート**
   ```
   "Angular CLIの `ng generate component` コマンドで生成される形式に従って、
   [コンポーネント名]を作成してください。ファイル構造、命名規則、
   インポート文すべてをAngular CLI標準に合わせてください。"
   ```

## TypeScriptベストプラクティス

- 厳密な型チェックを使用する
- 型が明らかな場合は型推論を優先する
- `any`型を避ける。型が不確実な場合は`unknown`を使用する

## Angularベストプラクティス

### コンポーネント

- **必須**: standalone コンポーネントを使用する（NgModules は使用しない）
- `@Component`デコレータ内で`standalone: true`を設定**しない**（デフォルト値のため）
- 状態管理にはsignalsを使用する
- フィーチャールートには遅延読み込みを実装する
- `@HostBinding`と`@HostListener`デコレータを使用**しない**。代わりに`@Component`や`@Directive`デコレータの`host`オブジェクト内にホストバインディングを配置する
- 静的画像にはすべて`NgOptimizedImage`を使用する
  - 注意: `NgOptimizedImage`はインラインbase64画像では動作しない

### コンポーネント設計

- コンポーネントは小さく、単一責任に焦点を当てる
- デコレータの代わりに`input()`と`output()`関数を使用する
- 派生状態には`computed()`を使用する
- `@Component`デコレータで`changeDetection: ChangeDetectionStrategy.OnPush`を設定する
- 小さなコンポーネントにはインラインテンプレートを優先する
- テンプレート駆動フォームではなくリアクティブフォームを優先する
- `ngClass`を使用**しない**。代わりに`class`バインディングを使用する
- `ngStyle`を使用**しない**。代わりに`style`バインディングを使用する

### 状態管理

- ローカルコンポーネント状態にはsignalsを使用する
- 派生状態には`computed()`を使用する
- 状態変換は純粋で予測可能に保つ
- signalsで`mutate`を使用**しない**。代わりに`update`または`set`を使用する

### テンプレート

- テンプレートはシンプルに保ち、複雑なロジックを避ける
- `*ngIf`、`*ngFor`、`*ngSwitch`の代わりにネイティブ制御フロー（`@if`、`@for`、`@switch`）を使用する
- Observableを処理するためにasyncパイプを使用する

### サービス

- サービスは単一責任で設計する
- シングルトンサービスには`providedIn: 'root'`オプションを使用する
- コンストラクタインジェクションの代わりに`inject()`関数を使用する

## PrimeNGベストプラクティス

### 設定

PrimeNGは既に`app.config.ts`で設定済み:

```typescript
providePrimeNG({
  theme: {
    preset: Aura
  }
})
```

### コンポーネント使用ガイドライン

- **必須**: PrimeNGコンポーネントを使用する前に、必要なモジュールをインポートする
- PrimeNGコンポーネントはstandalone対応なので、直接インポートする

```typescript
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  imports: [ButtonModule, InputTextModule],
  // ...
})
```

### よく使用されるコンポーネント

- **ボタン**: `p-button` - 一貫したスタイリングのため、HTML `<button>` より優先
- **フォーム**: `p-inputtext`, `p-dropdown`, `p-calendar` など
- **データ表示**: `p-table`, `p-dataview`
- **ナビゲーション**: `p-menubar`, `p-tabview`
- **フィードバック**: `p-message`, `p-toast`

### 旧式な書き方を避ける

❌ **避けるべき**:
```typescript
// 古いモジュールベースのインポート
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [ButtonModule]
})
```

✅ **推奨**:
```typescript
// Standaloneコンポーネントでの直接インポート
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [ButtonModule]
})
```

## EChartsベストプラクティス

### セットアップ

EChartsは`ngx-echarts`ラッパーを通じて使用:

```typescript
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  imports: [NgxEchartsModule],
  // ...
})
```

### 基本的な使用方法

```typescript
// コンポーネント
export class ChartComponent {
  chartOption = signal({
    title: {
      text: 'サンプルチャート'
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
  });
}
```

```html
<!-- テンプレート -->
<div echarts [options]="chartOption()" class="chart-container"></div>
```

### チャートのベストプラクティス

- チャートオプションはsignalsで管理する
- レスポンシブデザインのためにコンテナのサイズを適切に設定する
- パフォーマンスのため、大きなデータセットには適切なサンプリングを使用する
- アクセシビリティのため、適切な`title`と`aria-label`を提供する

### 注意点

- EChartsインスタンスは必要に応じて手動でリサイズする
- メモリリークを避けるためにコンポーネント破棄時にチャートインスタンスをクリーンアップする

## コードフォーマット

プロジェクトではPrettierが設定済み:

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

## 追加リソース

- [Angular CLI リファレンス](https://angular.dev/tools/cli)
- [PrimeNG ドキュメント](https://www.primefaces.org/primeng/)
- [ECharts ドキュメント](https://echarts.apache.org/en/index.html)
- [ngx-echarts ドキュメント](https://github.com/xieziyu/ngx-echarts)
