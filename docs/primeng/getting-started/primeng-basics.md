# PrimeNG入門ガイド

PrimeNGは、Angularアプリケーション用の包括的なUIコンポーネントライブラリです。このガイドでは、オフライン環境でのPrimeNG開発の基本から実践的な使用方法まで説明します。

## 📖 目次

1. [PrimeNGとは](#primengとは)
2. [主な特徴](#主な特徴)
3. [セットアップと基本設定](#セットアップと基本設定)
4. [基本コンポーネント](#基本コンポーネント)
5. [テーマシステム](#テーマシステム)
6. [Angular Signalsとの統合](#angular-signalsとの統合)

## PrimeNGとは

PrimeNGは、PrimeTekが開発するAngular用のUIコンポーネントライブラリです。80以上のリッチなコンポーネントを提供し、エンタープライズレベルのアプリケーション開発を支援します。

### 💡 なぜPrimeNGを選ぶのか？

- **豊富なコンポーネント**: フォーム、データ表示、ナビゲーション、オーバーレイなど
- **テーマサポート**: 30以上の組み込みテーマ
- **アクセシビリティ**: WCAG 2.1準拠
- **TypeScript完全対応**: 型安全な開発
- **Angular最新版対応**: Angular 20まで対応
- **無償利用**: MITライセンス

## 主な特徴

### コンポーネントカテゴリ

```
フォームコンポーネント:
├── InputText (テキスト入力)
├── Dropdown (ドロップダウン)
├── Calendar (日付選択)
├── MultiSelect (複数選択)
├── Checkbox (チェックボックス)
├── RadioButton (ラジオボタン)
└── Slider (スライダー)

データ表示:
├── Table (データテーブル)
├── DataView (データビュー)
├── Timeline (タイムライン)
├── Tree (ツリー)
└── VirtualScroller (仮想スクロール)

ナビゲーション:
├── Menu (メニュー)
├── Breadcrumb (パンくず)
├── TabView (タブ)
├── Accordion (アコーディオン)
└── Steps (ステップ)

オーバーレイ:
├── Dialog (ダイアログ)
├── OverlayPanel (オーバーレイパネル)
├── Tooltip (ツールチップ)
├── ConfirmDialog (確認ダイアログ)
└── Toast (トースト通知)

ボタンとメディア:
├── Button (ボタン)
├── SplitButton (分割ボタン)
├── Image (画像)
├── Galleria (ギャラリー)
└── Carousel (カルーセル)
```

## セットアップと基本設定

### 1. 依存関係の確認

```bash
# プロジェクトの依存関係を確認
cd client
npm list primeng @primeuix/themes

# 期待される出力:
# ├── primeng@20.2.0
# └── @primeuix/themes@1.2.5
```

### 2. 基本的なセットアップ

#### main.ts での設定

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

// PrimeNG用のグローバルスタイルを読み込み
import 'primeng/resources/themes/saga-blue/theme.css';
import 'primeng/resources/primeng.min.css';
import 'primeicons/primeicons.css';

bootstrapApplication(AppComponent, appConfig);
```

#### app.config.ts での設定

```typescript
// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    // アニメーション必須（多くのPrimeNGコンポーネントで使用）
    importProvidersFrom(BrowserAnimationsModule),

    // ルーター設定（必要に応じて）
    importProvidersFrom(RouterModule.forRoot([])),

    // その他のプロバイダ...
  ],
};
```

### 3. 最新のテーマシステム（PrimeUI）

```typescript
// src/main.ts（新しいテーマシステム使用時）
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';

// 新しいテーマシステム
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    }
  }
});

// テーマの適用
document.documentElement.style.setProperty('--primary-color', '#3b82f6');

bootstrapApplication(AppComponent, appConfig);
```

## 基本コンポーネント

### 1. ボタンコンポーネント

```typescript
// button-example.component.ts
import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-button-example',
  standalone: true,
  imports: [Button],
  template: `
    <div class="button-demo">
      <!-- 基本ボタン -->
      <p-button label="基本ボタン" (onClick)="onBasicClick()"></p-button>

      <!-- アイコン付きボタン -->
      <p-button
        label="保存"
        icon="pi pi-save"
        (onClick)="onSave()">
      </p-button>

      <!-- アイコンのみボタン -->
      <p-button
        icon="pi pi-search"
        [rounded]="true"
        (onClick)="onSearch()">
      </p-button>

      <!-- 重要度の異なるボタン -->
      <p-button label="主要" severity="primary"></p-button>
      <p-button label="成功" severity="success"></p-button>
      <p-button label="警告" severity="warn"></p-button>
      <p-button label="危険" severity="danger"></p-button>

      <!-- ローディング状態 -->
      <p-button
        label="処理中"
        [loading]="isLoading"
        (onClick)="processData()">
      </p-button>

      <!-- 無効化 -->
      <p-button
        label="無効"
        [disabled]="true">
      </p-button>
    </div>
  `,
  styles: [`
    .button-demo {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }
  `]
})
export class ButtonExampleComponent {
  isLoading = false;

  onBasicClick() {
    console.log('基本ボタンがクリックされました');
  }

  onSave() {
    console.log('保存処理を実行');
  }

  onSearch() {
    console.log('検索処理を実行');
  }

  async processData() {
    this.isLoading = true;

    try {
      // 模擬的な非同期処理
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('処理完了');
    } finally {
      this.isLoading = false;
    }
  }
}
```

### 2. 入力コンポーネント

```typescript
// input-example.component.ts
import { Component, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Dropdown } from 'primeng/dropdown';
import { Calendar } from 'primeng/calendar';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-input-example',
  standalone: true,
  imports: [
    InputText,
    Dropdown,
    Calendar,
    Checkbox,
    FormsModule
  ],
  template: `
    <div class="input-demo">
      <!-- テキスト入力 -->
      <div class="field">
        <label for="name">お名前</label>
        <input
          id="name"
          type="text"
          pInputText
          [(ngModel)]="formData.name"
          placeholder="お名前を入力してください">
      </div>

      <!-- ドロップダウン -->
      <div class="field">
        <label for="category">カテゴリ</label>
        <p-dropdown
          id="category"
          [options]="categories"
          [(ngModel)]="formData.category"
          placeholder="カテゴリを選択"
          optionLabel="label"
          optionValue="value">
        </p-dropdown>
      </div>

      <!-- 日付選択 -->
      <div class="field">
        <label for="date">日付</label>
        <p-calendar
          id="date"
          [(ngModel)]="formData.date"
          dateFormat="yy/mm/dd"
          placeholder="日付を選択">
        </p-calendar>
      </div>

      <!-- チェックボックス -->
      <div class="field-checkbox">
        <p-checkbox
          inputId="agreement"
          [(ngModel)]="formData.agreement"
          [binary]="true">
        </p-checkbox>
        <label for="agreement">利用規約に同意する</label>
      </div>

      <!-- 入力データの表示 -->
      <div class="data-display">
        <h3>入力データ:</h3>
        <pre>{{ getFormDataJson() }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .input-demo {
      max-width: 500px;
      margin: 0 auto;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .field-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .data-display {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .data-display pre {
      margin: 0;
      font-size: 0.9rem;
    }
  `]
})
export class InputExampleComponent {
  // Signalsを使った状態管理
  formData = signal({
    name: '',
    category: '',
    date: null as Date | null,
    agreement: false
  });

  categories: DropdownOption[] = [
    { label: '技術', value: 'tech' },
    { label: 'デザイン', value: 'design' },
    { label: 'ビジネス', value: 'business' },
    { label: 'その他', value: 'other' }
  ];

  getFormDataJson(): string {
    const data = this.formData();
    return JSON.stringify({
      ...data,
      date: data.date?.toLocaleDateString() || null
    }, null, 2);
  }
}
```

### 3. データ表示コンポーネント

```typescript
// table-example.component.ts
import { Component, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  status: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
  rating: number;
}

@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [Table, Tag, Button],
  template: `
    <div class="table-demo">
      <h2>商品一覧</h2>

      <p-table
        [value]="products()"
        [paginator]="true"
        [rows]="5"
        [globalFilterFields]="['name', 'category']"
        [loading]="loading()"
        responsiveLayout="scroll">

        <!-- ヘッダー -->
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="id">
              ID <p-sortIcon field="id"></p-sortIcon>
            </th>
            <th pSortableColumn="name">
              商品名 <p-sortIcon field="name"></p-sortIcon>
            </th>
            <th pSortableColumn="category">
              カテゴリ <p-sortIcon field="category"></p-sortIcon>
            </th>
            <th pSortableColumn="price">
              価格 <p-sortIcon field="price"></p-sortIcon>
            </th>
            <th>在庫状況</th>
            <th>評価</th>
            <th>操作</th>
          </tr>
        </ng-template>

        <!-- データ行 -->
        <ng-template pTemplate="body" let-product>
          <tr>
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.price | currency:'JPY':'symbol':'1.0-0' }}</td>
            <td>
              <p-tag
                [value]="getStatusLabel(product.status)"
                [severity]="getStatusSeverity(product.status)">
              </p-tag>
            </td>
            <td>
              <span class="rating">
                {{ '★'.repeat(product.rating) }}{{ '☆'.repeat(5 - product.rating) }}
              </span>
            </td>
            <td>
              <p-button
                icon="pi pi-pencil"
                size="small"
                (onClick)="editProduct(product)">
              </p-button>
              <p-button
                icon="pi pi-trash"
                severity="danger"
                size="small"
                (onClick)="deleteProduct(product.id)">
              </p-button>
            </td>
          </tr>
        </ng-template>

        <!-- データが空の場合 -->
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center">
              データがありません
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    .table-demo {
      margin: 2rem;
    }

    .rating {
      color: #ffd700;
      font-size: 1.2rem;
    }

    .text-center {
      text-align: center;
      padding: 2rem;
    }

    p-button {
      margin-right: 0.5rem;
    }
  `]
})
export class TableExampleComponent {
  loading = signal(false);

  products = signal<Product[]>([
    {
      id: 1,
      name: 'MacBook Pro',
      category: 'Electronics',
      price: 299800,
      status: 'INSTOCK',
      rating: 5
    },
    {
      id: 2,
      name: 'iPhone 15',
      category: 'Electronics',
      price: 124800,
      status: 'LOWSTOCK',
      rating: 4
    },
    {
      id: 3,
      name: 'デスクチェア',
      category: 'Furniture',
      price: 45000,
      status: 'OUTOFSTOCK',
      rating: 3
    },
    {
      id: 4,
      name: 'ワイヤレスマウス',
      category: 'Electronics',
      price: 3500,
      status: 'INSTOCK',
      rating: 4
    },
    {
      id: 5,
      name: 'モニターアーム',
      category: 'Accessories',
      price: 12000,
      status: 'INSTOCK',
      rating: 5
    }
  ]);

  getStatusLabel(status: Product['status']): string {
    const labels = {
      'INSTOCK': '在庫あり',
      'LOWSTOCK': '在庫少',
      'OUTOFSTOCK': '在庫切れ'
    };
    return labels[status];
  }

  getStatusSeverity(status: Product['status']): 'success' | 'warn' | 'danger' {
    const severities = {
      'INSTOCK': 'success' as const,
      'LOWSTOCK': 'warn' as const,
      'OUTOFSTOCK': 'danger' as const
    };
    return severities[status];
  }

  editProduct(product: Product) {
    console.log('編集:', product);
  }

  deleteProduct(id: number) {
    this.products.update(products =>
      products.filter(p => p.id !== id)
    );
  }
}
```

## テーマシステム

### 1. 組み込みテーマの使用

```typescript
// 利用可能な組み込みテーマ
const themes = [
  'bootstrap4-light-blue',
  'bootstrap4-dark-blue',
  'md-light-indigo',
  'md-dark-indigo',
  'mdc-light-indigo',
  'mdc-dark-indigo',
  'saga-blue',
  'saga-green',
  'saga-orange',
  'saga-purple',
  'vela-blue',
  'vela-green',
  'vela-orange',
  'vela-purple',
  'arya-blue',
  'arya-green',
  'arya-orange',
  'arya-purple',
  'nova',
  'nova-alt',
  'nova-accent',
  'luna-amber',
  'luna-blue',
  'luna-green',
  'luna-pink',
  'rhea'
];

// テーマの動的切り替え
export class ThemeService {
  changeTheme(theme: string) {
    const themeLink = document.getElementById('theme-link') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `assets/themes/${theme}/theme.css`;
    }
  }
}
```

### 2. カスタムテーマの作成

```scss
// custom-theme.scss
// PrimeNGの基本テーマをベースにカスタマイズ

// カラー変数の定義
:root {
  --primary-color: #3B82F6;
  --primary-color-text: #ffffff;
  --surface-0: #ffffff;
  --surface-50: #f8fafc;
  --surface-100: #f1f5f9;
  --surface-200: #e2e8f0;
  --surface-300: #cbd5e1;
  --surface-400: #94a3b8;
  --surface-500: #64748b;
  --surface-600: #475569;
  --surface-700: #334155;
  --surface-800: #1e293b;
  --surface-900: #0f172a;
  --text-color: #334155;
  --text-color-secondary: #64748b;
  --border-color: #e2e8f0;
}

// コンポーネント固有のスタイル
.p-button {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.p-inputtext {
  border-radius: 6px;
  border: 2px solid var(--border-color);
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }
}

.p-datatable {
  .p-datatable-header {
    background: var(--surface-50);
    border: none;
    border-radius: 8px 8px 0 0;
  }

  .p-datatable-tbody > tr:hover {
    background: var(--surface-50);
  }
}
```

## Angular Signalsとの統合

### 1. リアクティブなフォーム管理

```typescript
// reactive-form.component.ts
import { Component, signal, computed, effect } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Dropdown } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reactive-form',
  standalone: true,
  imports: [InputText, Dropdown, Button, Toast],
  providers: [MessageService],
  template: `
    <div class="form-container">
      <h2>リアクティブフォーム例</h2>

      <div class="field">
        <label>ユーザー名</label>
        <input
          type="text"
          pInputText
          [value]="formData().username"
          (input)="updateUsername($event)"
          [class.ng-invalid]="!isUsernameValid()">
        <small class="error" *ngIf="!isUsernameValid()">
          ユーザー名は3文字以上で入力してください
        </small>
      </div>

      <div class="field">
        <label>メールアドレス</label>
        <input
          type="email"
          pInputText
          [value]="formData().email"
          (input)="updateEmail($event)"
          [class.ng-invalid]="!isEmailValid()">
        <small class="error" *ngIf="!isEmailValid()">
          有効なメールアドレスを入力してください
        </small>
      </div>

      <div class="field">
        <label>役職</label>
        <p-dropdown
          [options]="roles"
          [value]="formData().role"
          (onChange)="updateRole($event.value)"
          placeholder="役職を選択"
          optionLabel="label"
          optionValue="value">
        </p-dropdown>
      </div>

      <div class="form-actions">
        <p-button
          label="送信"
          [disabled]="!isFormValid()"
          (onClick)="submitForm()">
        </p-button>
        <p-button
          label="リセット"
          severity="secondary"
          (onClick)="resetForm()">
        </p-button>
      </div>

      <div class="form-debug" *ngIf="showDebug">
        <h3>フォーム状態:</h3>
        <pre>{{ getFormStateJson() }}</pre>
      </div>
    </div>

    <p-toast></p-toast>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid var(--surface-200);
      border-radius: 8px;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .error {
      color: var(--red-500);
      display: block;
      margin-top: 0.25rem;
    }

    .ng-invalid {
      border-color: var(--red-500) !important;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .form-debug {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--surface-50);
      border-radius: 4px;
    }
  `]
})
export class ReactiveFormComponent {
  showDebug = true;

  // フォームデータの状態管理
  private readonly formData = signal({
    username: '',
    email: '',
    role: ''
  });

  // バリデーション計算
  readonly isUsernameValid = computed(() =>
    this.formData().username.length >= 3
  );

  readonly isEmailValid = computed(() => {
    const email = this.formData().email;
    return email.includes('@') && email.includes('.');
  });

  readonly isFormValid = computed(() =>
    this.isUsernameValid() &&
    this.isEmailValid() &&
    this.formData().role !== ''
  );

  roles = [
    { label: '開発者', value: 'developer' },
    { label: 'デザイナー', value: 'designer' },
    { label: 'プロジェクトマネージャー', value: 'pm' },
    { label: 'その他', value: 'other' }
  ];

  constructor(private messageService: MessageService) {
    // フォーム状態の変更を監視
    effect(() => {
      const data = this.formData();
      console.log('Form data changed:', data);
    });
  }

  updateUsername(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.update(data => ({ ...data, username: input.value }));
  }

  updateEmail(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.update(data => ({ ...data, email: input.value }));
  }

  updateRole(role: string) {
    this.formData.update(data => ({ ...data, role }));
  }

  submitForm() {
    if (this.isFormValid()) {
      this.messageService.add({
        severity: 'success',
        summary: '成功',
        detail: 'フォームが正常に送信されました'
      });

      console.log('Submitted data:', this.formData());
    }
  }

  resetForm() {
    this.formData.set({
      username: '',
      email: '',
      role: ''
    });

    this.messageService.add({
      severity: 'info',
      summary: '情報',
      detail: 'フォームがリセットされました'
    });
  }

  getFormStateJson(): string {
    return JSON.stringify({
      data: this.formData(),
      validation: {
        isUsernameValid: this.isUsernameValid(),
        isEmailValid: this.isEmailValid(),
        isFormValid: this.isFormValid()
      }
    }, null, 2);
  }
}
```

## 💡 オフライン開発のポイント

### 1. 必要なリソースの確認

```bash
# PrimeNGリソースの確認
ls node_modules/primeng/resources/
ls node_modules/primeicons/

# テーマファイルの確認
ls node_modules/primeng/resources/themes/
```

### 2. TypeScriptでの型安全な開発

```typescript
// PrimeNGコンポーネントの型定義活用
import { DropdownChangeEvent } from 'primeng/dropdown';
import { TableLazyLoadEvent } from 'primeng/table';
import { ToastMessageOptions } from 'primeng/api';

// 型安全なイベントハンドリング
onDropdownChange(event: DropdownChangeEvent) {
  console.log('Selected value:', event.value);
}

onTableLazyLoad(event: TableLazyLoadEvent) {
  console.log('Lazy load params:', {
    first: event.first,
    rows: event.rows,
    sortField: event.sortField,
    sortOrder: event.sortOrder
  });
}
```

### 3. パフォーマンス最適化

```typescript
// 必要なコンポーネントのみインポート
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
// ❌ import * from 'primeng'; は避ける

// 仮想スクロールで大量データに対応
@Component({
  template: `
    <p-virtualScroller
      [value]="items"
      [itemSize]="50"
      scrollHeight="400px">
      <ng-template pTemplate="item" let-item>
        <div class="item">{{ item.name }}</div>
      </ng-template>
    </p-virtualScroller>
  `
})
export class VirtualScrollComponent {}
```

## 次のステップ

1. **PrimeNG + ECharts統合**: [統合ガイド](../integration/primeng-echarts.md)
2. **コンポーネント詳細**: [コンポーネント実装例](../components/)
3. **テーマカスタマイズ**: [テーマガイド](../theming/)

---

> 💡 **ポイント**: PrimeNGは非常に豊富なコンポーネントを提供しているため、最初は基本的なコンポーネントから始めて、プロジェクトの要件に応じて段階的に導入することをお勧めします。オフライン環境では、このガイドを第一参照として活用してください。