# PrimeNG UIコンポーネント活用ガイド

## 概要
このドキュメントは、Angular 20 + PrimeNG 20を使用したUI開発において、適切なコンポーネント選択と実装パターンを示すガイドラインです。Claude Codeやチーム開発時の参考資料として活用してください。

## 基本セットアップ

### インストール済みパッケージ
```json
{
  "@angular/core": "^20.3.0",
  "primeng": "^20.2.0",
  "@primeuix/themes": "^1.2.5"
}
```

### app.config.ts設定
```typescript
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
```

## UIパターン別推奨コンポーネント

### 1. データ表示パターン

#### テーブル・一覧表示
| ユースケース | 推奨コンポーネント | インポート |
|------------|----------------|----------|
| 大量データの表形式表示 | Table | `import { TableModule } from 'primeng/table'` |
| カード形式のデータ表示 | DataView | `import { DataViewModule } from 'primeng/dataview'` |
| シンプルなリスト表示 | DataView (list mode) | `import { DataViewModule } from 'primeng/dataview'` |
| 階層構造データ | Tree / TreeTable | `import { TreeModule } from 'primeng/tree'` |

**Table実装例：**
```typescript
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-data-list',
  template: `
    <p-table [value]="items" [paginator]="true" [rows]="10">
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="name">名前 <p-sortIcon field="name"></p-sortIcon></th>
          <th>説明</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{item.name}}</td>
          <td>{{item.description}}</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  imports: [TableModule]
})
```

### 2. フォーム入力パターン

#### 基本入力コンポーネント
| ユースケース | 推奨コンポーネント | インポート |
|------------|----------------|----------|
| テキスト入力 | InputText | `import { InputTextModule } from 'primeng/inputtext'` |
| 数値入力 | InputNumber | `import { InputNumberModule } from 'primeng/inputnumber'` |
| 日付選択 | DatePicker | `import { DatePickerModule } from 'primeng/datepicker'` |
| 単一選択（ドロップダウン） | Select | `import { SelectModule } from 'primeng/select'` |
| 複数選択 | MultiSelect | `import { MultiSelectModule } from 'primeng/multiselect'` |
| チェックボックス | Checkbox | `import { CheckboxModule } from 'primeng/checkbox'` |
| ラジオボタン | RadioButton | `import { RadioButtonModule } from 'primeng/radiobutton'` |
| スライダー | Slider | `import { SliderModule } from 'primeng/slider'` |
| ファイルアップロード | FileUpload | `import { FileUploadModule } from 'primeng/fileupload'` |

**フォーム実装例（リアクティブフォーム）：**
```typescript
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div class="field">
        <label for="name">名前</label>
        <input type="text" pInputText id="name" formControlName="name" />
      </div>

      <div class="field">
        <label for="role">役割</label>
        <p-select formControlName="role" [options]="roles" optionLabel="label" optionValue="value" />
      </div>

      <p-button type="submit" label="送信" />
    </form>
  `,
  imports: [ReactiveFormsModule, InputTextModule, SelectModule, ButtonModule]
})
export class UserFormComponent {
  userForm = new FormGroup({
    name: new FormControl(''),
    role: new FormControl('')
  });

  roles = [
    { label: '管理者', value: 'admin' },
    { label: 'ユーザー', value: 'user' }
  ];
}
```

### 3. ナビゲーションパターン

| ユースケース | 推奨コンポーネント | インポート |
|------------|----------------|----------|
| メインメニュー | Menu / TieredMenu | `import { MenuModule } from 'primeng/menu'` |
| タブ切り替え | Tabs | `import { TabsModule } from 'primeng/tabs'` |
| パンくずリスト | Breadcrumb | `import { BreadcrumbModule } from 'primeng/breadcrumb'` |
| サイドバーメニュー | PanelMenu | `import { PanelMenuModule } from 'primeng/panelmenu'` |
| ステップ表示 | Steps | `import { StepsModule } from 'primeng/steps'` |

### 4. レイアウト・コンテナパターン

| ユースケース | 推奨コンポーネント | インポート |
|------------|----------------|----------|
| コンテンツパネル | Panel | `import { PanelModule } from 'primeng/panel'` |
| カード表示 | Card | `import { CardModule } from 'primeng/card'` |
| 折りたたみコンテンツ | Accordion | `import { AccordionModule } from 'primeng/accordion'` |
| 分割レイアウト | Splitter | `import { SplitterModule } from 'primeng/splitter'` |

### 5. フィードバックパターン

| ユースケース | 推奨コンポーネント | インポート |
|------------|----------------|----------|
| ダイアログ | Dialog | `import { DialogModule } from 'primeng/dialog'` |
| 確認ダイアログ | ConfirmDialog | `import { ConfirmDialogModule } from 'primeng/confirmdialog'` |
| トースト通知 | Toast | `import { ToastModule } from 'primeng/toast'` |
| プログレスバー | ProgressBar | `import { ProgressBarModule } from 'primeng/progressbar'` |
| ローディング | ProgressSpinner | `import { ProgressSpinnerModule } from 'primeng/progressspinner'` |

**Dialog実装例：**
```typescript
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dialog-example',
  template: `
    <p-button (onClick)="showDialog()" label="開く" />

    <p-dialog [(visible)]="visible" [modal]="true" [style]="{width: '50vw'}">
      <ng-template pTemplate="header">
        <span>ダイアログタイトル</span>
      </ng-template>
      <p>ダイアログコンテンツ</p>
      <ng-template pTemplate="footer">
        <p-button label="キャンセル" (onClick)="visible = false" />
        <p-button label="確認" (onClick)="confirm()" />
      </ng-template>
    </p-dialog>
  `,
  imports: [DialogModule, ButtonModule]
})
export class DialogExampleComponent {
  visible = false;

  showDialog() {
    this.visible = true;
  }

  confirm() {
    // 処理実行
    this.visible = false;
  }
}
```

### 6. アクションパターン

| ユースケース | 推奨コンポーネント | インポート |
|------------|----------------|----------|
| 基本ボタン | Button | `import { ButtonModule } from 'primeng/button'` |
| フローティングボタン | SpeedDial | `import { SpeedDialModule } from 'primeng/speeddial'` |
| 分割ボタン | SplitButton | `import { SplitButtonModule } from 'primeng/splitbutton'` |

## チャート表示（ECharts統合）

ngx-echartsも導入済みのため、グラフ表示にはEChartsを使用します。

**基本実装例：**
```typescript
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-chart',
  template: `
    <div echarts [options]="chartOption" class="chart"></div>
  `,
  styles: [`
    .chart {
      height: 400px;
    }
  `],
  imports: [NgxEchartsModule]
})
export class ChartComponent {
  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }]
  };
}
```

## 実装のベストプラクティス

### 1. スタンドアロンコンポーネント使用
```typescript
@Component({
  selector: 'app-example',
  // standalone: true は記載不要（デフォルト）
  imports: [TableModule, ButtonModule],
  template: `...`
})
```

### 2. Signalベースの状態管理
```typescript
import { signal, computed } from '@angular/core';

export class DataComponent {
  items = signal<Item[]>([]);
  filteredItems = computed(() =>
    this.items().filter(item => item.active)
  );
}
```

### 3. OnPush変更検知戦略
```typescript
@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

### 4. フォームバリデーション
```typescript
// invalidプロパティを使用したバリデーション表示
<input pInputText [invalid]="nameControl.invalid && nameControl.touched" />
```

### 5. テーマカスタマイズ
```scss
// styles.scss
@import 'primeng/resources/primeng.css';
@import '@primeuix/themes/aura/aura.css';

// カスタムCSS変数
:root {
  --p-primary-color: #3b82f6;
  --p-primary-contrast-color: #ffffff;
}
```

## よくある実装シナリオ

### マスター詳細画面
- **リスト部分**: Table または DataView
- **詳細フォーム**: Dialog内にフォームコンポーネント配置
- **アクション**: Button, SplitButton

### ダッシュボード
- **レイアウト**: Card, Panel でセクション分割
- **グラフ**: ngx-echarts
- **データテーブル**: Table (paginator付き)
- **統計値**: Card内に数値表示

### 設定画面
- **カテゴリ分け**: Accordion または Tabs
- **フォーム要素**: 各種Input系コンポーネント
- **保存/キャンセル**: Button配置

### ウィザード形式
- **ステップ表示**: Steps
- **コンテンツ切り替え**: 条件付きレンダリング
- **ナビゲーション**: Button (前へ/次へ)

## トラブルシューティング

### アニメーションが動作しない
→ `provideAnimationsAsync()`が設定されているか確認

### スタイルが適用されない
→ angular.jsonのstylesセクションにPrimeNG CSSが含まれているか確認

### コンポーネントが表示されない
→ 必要なModuleがimportsに追加されているか確認

## 参考リンク

- [PrimeNG公式ドキュメント](https://primeng.org/)
- [PrimeNG Showcase](https://primeng.org/showcase)
- [ngx-echarts](https://github.com/xieziyu/ngx-echarts)
- [Angular公式ドキュメント](https://angular.io/docs)

## 更新履歴
- 2025年1月: 初版作成（Angular 20 + PrimeNG 20対応）