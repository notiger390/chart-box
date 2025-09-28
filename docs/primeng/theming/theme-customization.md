# PrimeNGテーマ・スタイリングガイド

オフライン環境でのPrimeNGテーマシステムの理解と、カスタマイズ方法を詳しく説明します。

## 📖 目次

1. [テーマシステムの概要](#テーマシステムの概要)
2. [組み込みテーマの使用](#組み込みテーマの使用)
3. [CSS変数によるカスタマイズ](#css変数によるカスタマイズ)
4. [PrimeUIテーマシステム](#primeuiテーマシステム)
5. [コンポーネント固有のスタイリング](#コンポーネント固有のスタイリング)
6. [ダークモード対応](#ダークモード対応)

## テーマシステムの概要

### PrimeNGテーマアーキテクチャ

```
PrimeNGテーマシステム
├── 組み込みテーマ
│   ├── 従来テーマ (v19以前)
│   │   ├── bootstrap4-*
│   │   ├── material-*
│   │   ├── saga-*
│   │   └── vela-*
│   └── 新テーマ (v20以降)
│       ├── aura-*
│       ├── lara-*
│       └── nora-*
├── PrimeUIテーマシステム (@primeuix/themes)
│   ├── デザイントークン
│   ├── プリセット
│   └── カスタムテーマ生成
└── CSS変数システム
    ├── カラーパレット
    ├── タイポグラフィ
    └── スペーシング
```

### 基本概念

```typescript
// テーマの基本構造
interface ThemeStructure {
  // カラーシステム
  colors: {
    primary: ColorScale;    // プライマリカラー
    surface: ColorScale;    // 背景・サーフェイス
    gray: ColorScale;       // グレースケール
    semantic: {             // セマンティックカラー
      success: ColorScale;
      warning: ColorScale;
      danger: ColorScale;
      info: ColorScale;
    };
  };

  // タイポグラフィ
  typography: {
    fontFamily: string;
    fontSize: SizeScale;
    fontWeight: WeightScale;
    lineHeight: SizeScale;
  };

  // スペーシング
  spacing: SizeScale;

  // ボーダー・影
  borderRadius: SizeScale;
  boxShadow: ShadowScale;
}

interface ColorScale {
  50: string;   // 最も薄い
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;  // ベースカラー
  600: string;
  700: string;
  800: string;
  900: string;  // 最も濃い
  950: string;
}
```

## 組み込みテーマの使用

### 1. 従来テーマの適用

```typescript
// main.ts - シンプルな組み込みテーマ
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';

// テーマCSSのインポート
import 'primeng/resources/themes/saga-blue/theme.css';
import 'primeng/resources/primeng.min.css';
import 'primeicons/primeicons.css';

bootstrapApplication(AppComponent, appConfig);
```

```scss
// styles.scss - SCSSでのテーマインポート
// 利用可能なテーマ一覧
@import 'primeng/resources/themes/bootstrap4-light-blue/theme.css';
// @import 'primeng/resources/themes/bootstrap4-dark-blue/theme.css';
// @import 'primeng/resources/themes/material-light/theme.css';
// @import 'primeng/resources/themes/material-dark/theme.css';
// @import 'primeng/resources/themes/saga-blue/theme.css';
// @import 'primeng/resources/themes/saga-green/theme.css';
// @import 'primeng/resources/themes/vela-blue/theme.css';
// @import 'primeng/resources/themes/vela-green/theme.css';
// @import 'primeng/resources/themes/arya-blue/theme.css';
// @import 'primeng/resources/themes/arya-green/theme.css';
// @import 'primeng/resources/themes/nova/theme.css';
// @import 'primeng/resources/themes/nova-alt/theme.css';
// @import 'primeng/resources/themes/luna-amber/theme.css';
// @import 'primeng/resources/themes/luna-blue/theme.css';
// @import 'primeng/resources/themes/rhea/theme.css';

@import 'primeng/resources/primeng.min.css';
@import 'primeicons/primeicons.css';
```

### 2. 動的テーマ切り替え

```typescript
// theme-switcher.service.ts
import { Injectable, signal } from '@angular/core';

export interface ThemeOption {
  name: string;
  value: string;
  displayName: string;
  isDark: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherService {
  private readonly currentTheme = signal<string>('saga-blue');

  readonly availableThemes: ThemeOption[] = [
    { name: 'saga-blue', value: 'saga-blue', displayName: 'Saga Blue', isDark: false },
    { name: 'saga-green', value: 'saga-green', displayName: 'Saga Green', isDark: false },
    { name: 'saga-orange', value: 'saga-orange', displayName: 'Saga Orange', isDark: false },
    { name: 'saga-purple', value: 'saga-purple', displayName: 'Saga Purple', isDark: false },
    { name: 'vela-blue', value: 'vela-blue', displayName: 'Vela Blue', isDark: true },
    { name: 'vela-green', value: 'vela-green', displayName: 'Vela Green', isDark: true },
    { name: 'vela-orange', value: 'vela-orange', displayName: 'Vela Orange', isDark: true },
    { name: 'vela-purple', value: 'vela-purple', displayName: 'Vela Purple', isDark: true },
    { name: 'arya-blue', value: 'arya-blue', displayName: 'Arya Blue', isDark: true },
    { name: 'arya-green', value: 'arya-green', displayName: 'Arya Green', isDark: true },
    { name: 'arya-orange', value: 'arya-orange', displayName: 'Arya Orange', isDark: true },
    { name: 'arya-purple', value: 'arya-purple', displayName: 'Arya Purple', isDark: true },
    { name: 'bootstrap4-light-blue', value: 'bootstrap4-light-blue', displayName: 'Bootstrap Light', isDark: false },
    { name: 'bootstrap4-dark-blue', value: 'bootstrap4-dark-blue', displayName: 'Bootstrap Dark', isDark: true },
    { name: 'material-light', value: 'md-light-indigo', displayName: 'Material Light', isDark: false },
    { name: 'material-dark', value: 'md-dark-indigo', displayName: 'Material Dark', isDark: true }
  ];

  readonly theme = this.currentTheme.asReadonly();

  changeTheme(themeName: string): void {
    this.updateThemeLink(themeName);
    this.currentTheme.set(themeName);
    this.updateBodyClass(themeName);
  }

  private updateThemeLink(themeName: string): void {
    const themeLink = document.getElementById('theme-link') as HTMLLinkElement;
    const themePath = `assets/themes/${themeName}/theme.css`;

    if (themeLink) {
      themeLink.href = themePath;
    } else {
      const link = document.createElement('link');
      link.id = 'theme-link';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = themePath;
      document.head.appendChild(link);
    }
  }

  private updateBodyClass(themeName: string): void {
    const themeInfo = this.availableThemes.find(t => t.value === themeName);
    const body = document.body;

    // 既存のテーマクラスを削除
    body.classList.remove('theme-light', 'theme-dark');

    // 新しいテーマクラスを追加
    if (themeInfo?.isDark) {
      body.classList.add('theme-dark');
    } else {
      body.classList.add('theme-light');
    }

    // 特定のテーマクラスを追加
    body.classList.remove(...this.availableThemes.map(t => `theme-${t.value}`));
    body.classList.add(`theme-${themeName}`);
  }
}
```

```typescript
// theme-switcher.component.ts
import { Component, inject } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ThemeSwitcherService, ThemeOption } from './theme-switcher.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [Dropdown, Button, Card, FormsModule],
  template: `
    <p-card header="テーマ設定" class="theme-switcher-card">
      <div class="theme-controls">
        <div class="field">
          <label for="theme-select">テーマを選択</label>
          <p-dropdown
            id="theme-select"
            [options]="themeService.availableThemes"
            [value]="themeService.theme()"
            (onChange)="onThemeChange($event.value)"
            placeholder="テーマを選択"
            optionLabel="displayName"
            optionValue="value">

            <ng-template pTemplate="selectedItem" let-selectedOption>
              <div class="theme-option" *ngIf="selectedOption">
                <span class="theme-indicator"
                      [class.dark]="selectedOption.isDark">
                </span>
                <span>{{ selectedOption.displayName }}</span>
              </div>
            </ng-template>

            <ng-template pTemplate="item" let-option>
              <div class="theme-option">
                <span class="theme-indicator"
                      [class.dark]="option.isDark">
                </span>
                <span>{{ option.displayName }}</span>
                <span class="theme-type">{{ option.isDark ? 'Dark' : 'Light' }}</span>
              </div>
            </ng-template>
          </p-dropdown>
        </div>

        <div class="theme-preview">
          <h4>現在のテーマ: {{ getCurrentThemeInfo()?.displayName }}</h4>
          <div class="preview-components">
            <p-button label="プライマリ" severity="primary"></p-button>
            <p-button label="セカンダリ" severity="secondary"></p-button>
            <p-button label="成功" severity="success"></p-button>
            <p-button label="警告" severity="warn"></p-button>
            <p-button label="危険" severity="danger"></p-button>
          </div>
        </div>
      </div>
    </p-card>
  `,
  styles: [`
    .theme-switcher-card {
      max-width: 600px;
      margin: 2rem auto;
    }

    .theme-controls {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .theme-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .theme-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary-color);
      border: 2px solid var(--surface-border);
    }

    .theme-indicator.dark {
      background: #1f2937;
      border-color: #374151;
    }

    .theme-type {
      margin-left: auto;
      font-size: 0.85rem;
      color: var(--text-color-secondary);
    }

    .theme-preview {
      padding: 1rem;
      border: 1px solid var(--surface-border);
      border-radius: 8px;
      background: var(--surface-ground);
    }

    .theme-preview h4 {
      margin: 0 0 1rem 0;
      color: var(--primary-color);
    }

    .preview-components {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  `]
})
export class ThemeSwitcherComponent {
  protected readonly themeService = inject(ThemeSwitcherService);

  onThemeChange(themeName: string): void {
    this.themeService.changeTheme(themeName);
  }

  getCurrentThemeInfo(): ThemeOption | undefined {
    return this.themeService.availableThemes.find(
      theme => theme.value === this.themeService.theme()
    );
  }
}
```

## CSS変数によるカスタマイズ

### 1. カラーシステムのカスタマイズ

```scss
// custom-theme.scss
// PrimeNGのベーステーマをインポート
@import 'primeng/resources/themes/saga-blue/theme.css';
@import 'primeng/resources/primeng.min.css';
@import 'primeicons/primeicons.css';

// カスタムカラーパレットの定義
:root {
  // プライマリカラー（ブランドカラー）
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;  // ベースカラー
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
  --primary-950: #172554;

  // セカンダリカラー
  --secondary-50: #f8fafc;
  --secondary-100: #f1f5f9;
  --secondary-200: #e2e8f0;
  --secondary-300: #cbd5e1;
  --secondary-400: #94a3b8;
  --secondary-500: #64748b;
  --secondary-600: #475569;
  --secondary-700: #334155;
  --secondary-800: #1e293b;
  --secondary-900: #0f172a;

  // サーフェイス・背景色
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

  // セマンティックカラー
  --green-50: #f0fdf4;
  --green-500: #22c55e;
  --green-600: #16a34a;
  --green-700: #15803d;

  --red-50: #fef2f2;
  --red-500: #ef4444;
  --red-600: #dc2626;
  --red-700: #b91c1c;

  --yellow-50: #fffbeb;
  --yellow-500: #f59e0b;
  --yellow-600: #d97706;
  --yellow-700: #b45309;

  --blue-50: #eff6ff;
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --blue-700: #1d4ed8;

  // PrimeNGが使用する変数をオーバーライド
  --primary-color: var(--primary-500);
  --primary-color-text: #ffffff;
  --surface-ground: var(--surface-0);
  --surface-section: var(--surface-50);
  --surface-card: var(--surface-0);
  --surface-overlay: var(--surface-0);
  --surface-border: var(--surface-200);
  --surface-hover: var(--surface-50);

  --text-color: var(--surface-700);
  --text-color-secondary: var(--surface-500);
  --border-color: var(--surface-200);

  // ボタンカラー
  --p-button-primary-background: var(--primary-500);
  --p-button-primary-border-color: var(--primary-500);
  --p-button-primary-color: #ffffff;
  --p-button-primary-hover-background: var(--primary-600);
  --p-button-primary-hover-border-color: var(--primary-600);
  --p-button-primary-active-background: var(--primary-700);
  --p-button-primary-active-border-color: var(--primary-700);

  // 成功ボタン
  --p-button-success-background: var(--green-500);
  --p-button-success-border-color: var(--green-500);
  --p-button-success-color: #ffffff;
  --p-button-success-hover-background: var(--green-600);
  --p-button-success-hover-border-color: var(--green-600);

  // 警告ボタン
  --p-button-warn-background: var(--yellow-500);
  --p-button-warn-border-color: var(--yellow-500);
  --p-button-warn-color: #ffffff;
  --p-button-warn-hover-background: var(--yellow-600);
  --p-button-warn-hover-border-color: var(--yellow-600);

  // 危険ボタン
  --p-button-danger-background: var(--red-500);
  --p-button-danger-border-color: var(--red-500);
  --p-button-danger-color: #ffffff;
  --p-button-danger-hover-background: var(--red-600);
  --p-button-danger-hover-border-color: var(--red-600);
}
```

### 2. タイポグラフィのカスタマイズ

```scss
// typography-custom.scss
:root {
  // フォントファミリー
  --font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN',
                 'ヒラギノ角ゴ ProN W3', 'Yu Gothic',
                 'メイリオ', 'Meiryo', sans-serif;

  // フォントサイズスケール
  --font-size-xs: 0.75rem;    // 12px
  --font-size-sm: 0.875rem;   // 14px
  --font-size-base: 1rem;     // 16px
  --font-size-lg: 1.125rem;   // 18px
  --font-size-xl: 1.25rem;    // 20px
  --font-size-2xl: 1.5rem;    // 24px
  --font-size-3xl: 1.875rem;  // 30px
  --font-size-4xl: 2.25rem;   // 36px

  // フォントウェイト
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  // 行間
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;
}

// グローバルタイポグラフィの適用
body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--text-color);
}

// 見出しのスタイリング
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

h1 { font-size: var(--font-size-4xl); }
h2 { font-size: var(--font-size-3xl); }
h3 { font-size: var(--font-size-2xl); }
h4 { font-size: var(--font-size-xl); }
h5 { font-size: var(--font-size-lg); }
h6 { font-size: var(--font-size-base); }

// PrimeNGコンポーネントのフォント調整
.p-component {
  font-family: var(--font-family);
}

.p-button {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.p-inputtext, .p-dropdown, .p-calendar input {
  font-size: var(--font-size-base);
  font-family: var(--font-family);
}
```

### 3. スペーシングとレイアウト

```scss
// spacing-custom.scss
:root {
  // スペーシングスケール
  --spacing-0: 0;
  --spacing-1: 0.25rem;  // 4px
  --spacing-2: 0.5rem;   // 8px
  --spacing-3: 0.75rem;  // 12px
  --spacing-4: 1rem;     // 16px
  --spacing-5: 1.25rem;  // 20px
  --spacing-6: 1.5rem;   // 24px
  --spacing-8: 2rem;     // 32px
  --spacing-10: 2.5rem;  // 40px
  --spacing-12: 3rem;    // 48px
  --spacing-16: 4rem;    // 64px
  --spacing-20: 5rem;    // 80px
  --spacing-24: 6rem;    // 96px

  // ボーダー半径
  --border-radius-none: 0;
  --border-radius-sm: 0.125rem;   // 2px
  --border-radius-base: 0.25rem;  // 4px
  --border-radius-md: 0.375rem;   // 6px
  --border-radius-lg: 0.5rem;     // 8px
  --border-radius-xl: 0.75rem;    // 12px
  --border-radius-2xl: 1rem;      // 16px
  --border-radius-full: 9999px;

  // シャドウ
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

// ユーティリティクラス
.spacing-sm { margin: var(--spacing-2); }
.spacing-md { margin: var(--spacing-4); }
.spacing-lg { margin: var(--spacing-6); }
.spacing-xl { margin: var(--spacing-8); }

.p-1 { padding: var(--spacing-1); }
.p-2 { padding: var(--spacing-2); }
.p-3 { padding: var(--spacing-3); }
.p-4 { padding: var(--spacing-4); }
.p-6 { padding: var(--spacing-6); }
.p-8 { padding: var(--spacing-8); }

.m-1 { margin: var(--spacing-1); }
.m-2 { margin: var(--spacing-2); }
.m-3 { margin: var(--spacing-3); }
.m-4 { margin: var(--spacing-4); }
.m-6 { margin: var(--spacing-6); }
.m-8 { margin: var(--spacing-8); }

// PrimeNGコンポーネントのスペーシング調整
.p-card {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.p-button {
  border-radius: var(--border-radius-md);
  padding: var(--spacing-3) var(--spacing-6);
}

.p-inputtext, .p-dropdown {
  border-radius: var(--border-radius-base);
  padding: var(--spacing-3);
}
```

## PrimeUIテーマシステム

### 1. 新しいテーマシステムの使用

```typescript
// main.ts - PrimeUIテーマシステム
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';

// PrimeUIテーマシステムのインポート
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

// カスタムプリセットの定義
const CustomPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    colorScheme: {
      light: {
        primary: {
          color: '#3b82f6',
          contrastColor: '#ffffff',
          hoverColor: '#2563eb',
          activeColor: '#1d4ed8'
        },
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      dark: {
        primary: {
          color: '#60a5fa',
          contrastColor: '#ffffff',
          hoverColor: '#3b82f6',
          activeColor: '#2563eb'
        },
        surface: {
          0: '#020617',
          50: '#0f172a',
          100: '#1e293b',
          200: '#334155',
          300: '#475569',
          400: '#64748b',
          500: '#94a3b8',
          600: '#cbd5e1',
          700: '#e2e8f0',
          800: '#f1f5f9',
          900: '#f8fafc',
          950: '#ffffff'
        }
      }
    }
  }
});

// アプリケーション設定にテーマを適用
export const appConfig: ApplicationConfig = {
  providers: [
    // その他のプロバイダ...
    providePrimeUITheme({
      preset: CustomPreset,
      options: {
        prefix: 'p',
        darkModeSelector: '.dark',
        cssLayer: false
      }
    })
  ]
};

bootstrapApplication(AppComponent, appConfig);
```

### 2. 動的テーマ切り替え（PrimeUI）

```typescript
// primeui-theme-switcher.service.ts
import { Injectable, signal } from '@angular/core';
import { updatePreset, updateSurfacePalette } from '@primeuix/themes';

export interface ThemeConfig {
  name: string;
  preset: any;
  isDark: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PrimeUIThemeSwitcherService {
  private readonly currentConfig = signal<ThemeConfig | null>(null);

  readonly config = this.currentConfig.asReadonly();

  changeTheme(config: ThemeConfig): void {
    // プリセットの更新
    updatePreset({
      preset: config.preset,
      options: {
        darkModeSelector: '.dark'
      }
    });

    // サーフェイスパレットの更新
    updateSurfacePalette({
      palette: config.isDark ? 'dark' : 'light'
    });

    // ダークモードクラスの切り替え
    this.toggleDarkMode(config.isDark);

    this.currentConfig.set(config);
  }

  private toggleDarkMode(isDark: boolean): void {
    const htmlElement = document.documentElement;

    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
}
```

## コンポーネント固有のスタイリング

### 1. ボタンコンポーネントのカスタマイズ

```scss
// button-custom.scss
.p-button {
  // 基本スタイル
  transition: all 0.2s ease-in-out;
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-md);

  // ホバー効果
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }

  // アクティブ状態
  &:active {
    transform: translateY(0);
  }

  // サイズバリエーション
  &.p-button-sm {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: var(--font-size-sm);
  }

  &.p-button-lg {
    padding: var(--spacing-4) var(--spacing-8);
    font-size: var(--font-size-lg);
  }

  // カスタムセベリティ
  &.p-button-info {
    background: var(--blue-500);
    border-color: var(--blue-500);
    color: white;

    &:hover {
      background: var(--blue-600);
      border-color: var(--blue-600);
    }

    &:active {
      background: var(--blue-700);
      border-color: var(--blue-700);
    }
  }

  // グラデーションボタン
  &.p-button-gradient {
    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    border-color: var(--primary-500);

    &:hover {
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
    }
  }

  // アウトラインボタンのカスタマイズ
  &.p-button-outlined {
    border-width: 2px;

    &:hover {
      background: var(--primary-50);
      transform: translateY(-1px);
    }
  }

  // アイコンのみボタン
  &.p-button-icon-only {
    border-radius: var(--border-radius-full);
    width: 2.5rem;
    height: 2.5rem;
  }
}
```

### 2. フォームコンポーネントのカスタマイズ

```scss
// form-custom.scss
.p-inputtext, .p-dropdown, .p-calendar input {
  border: 2px solid var(--surface-200);
  border-radius: var(--border-radius-base);
  transition: all 0.2s ease-in-out;
  font-size: var(--font-size-base);

  &:focus {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 1px var(--primary-500);
    outline: none;
  }

  &:hover:not(:focus) {
    border-color: var(--surface-300);
  }

  // エラー状態
  &.ng-invalid.ng-touched {
    border-color: var(--red-500);
    box-shadow: 0 0 0 1px var(--red-500);
  }

  // 成功状態
  &.ng-valid.ng-touched {
    border-color: var(--green-500);
    box-shadow: 0 0 0 1px var(--green-500);
  }
}

// ラベルのスタイリング
.field label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  color: var(--text-color);
  font-size: var(--font-size-sm);
}

// エラーメッセージ
.field .error-message {
  display: block;
  margin-top: var(--spacing-1);
  color: var(--red-600);
  font-size: var(--font-size-sm);
}

// 成功メッセージ
.field .success-message {
  display: block;
  margin-top: var(--spacing-1);
  color: var(--green-600);
  font-size: var(--font-size-sm);
}

// フィールドグループ
.field-group {
  display: flex;
  gap: var(--spacing-4);

  .field {
    flex: 1;
  }
}

// フローティングラベル
.p-float-label {
  position: relative;

  label {
    position: absolute;
    left: var(--spacing-3);
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s ease-in-out;
    pointer-events: none;
    color: var(--text-color-secondary);
  }

  input:focus ~ label,
  input:not(:placeholder-shown) ~ label {
    top: 0;
    font-size: var(--font-size-xs);
    color: var(--primary-500);
    background: var(--surface-0);
    padding: 0 var(--spacing-1);
  }
}
```

### 3. データテーブルのカスタマイズ

```scss
// table-custom.scss
.p-datatable {
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);

  .p-datatable-header {
    background: var(--surface-50);
    border: none;
    padding: var(--spacing-4);
    font-weight: var(--font-weight-semibold);
  }

  .p-datatable-thead > tr > th {
    background: var(--surface-100);
    border: none;
    border-bottom: 2px solid var(--surface-200);
    padding: var(--spacing-4);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .p-datatable-tbody > tr {
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background: var(--surface-50);
    }

    &:nth-child(even) {
      background: var(--surface-25);
    }

    > td {
      border: none;
      border-bottom: 1px solid var(--surface-200);
      padding: var(--spacing-4);
    }
  }

  // 選択された行
  .p-datatable-tbody > tr.p-highlight {
    background: var(--primary-50);
    color: var(--primary-700);
  }

  // ページネーション
  .p-paginator {
    border: none;
    border-top: 1px solid var(--surface-200);
    background: var(--surface-50);
    padding: var(--spacing-4);

    .p-paginator-page {
      border-radius: var(--border-radius-base);
      margin: 0 var(--spacing-1);
    }
  }
}

// レスポンシブテーブル
.p-datatable-responsive {
  @media (max-width: 768px) {
    .p-datatable-thead {
      display: none;
    }

    .p-datatable-tbody > tr {
      display: block;
      border: 1px solid var(--surface-200);
      border-radius: var(--border-radius-base);
      margin-bottom: var(--spacing-4);
      padding: var(--spacing-4);

      > td {
        display: block;
        border: none;
        padding: var(--spacing-2) 0;

        &:before {
          content: attr(data-label) ': ';
          font-weight: var(--font-weight-semibold);
          color: var(--text-color-secondary);
        }
      }
    }
  }
}
```

## ダークモード対応

### 1. ダークモードテーマ

```scss
// dark-mode.scss
:root {
  // ライトモードの変数（デフォルト）
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}

[data-theme="dark"] {
  // ダークモードの変数
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;

  // PrimeNG変数のオーバーライド
  --surface-ground: var(--bg-primary);
  --surface-section: var(--bg-secondary);
  --surface-card: var(--bg-secondary);
  --text-color: var(--text-primary);
  --text-color-secondary: var(--text-secondary);
  --border-color: var(--border-color);
}

// テーマ切り替えアニメーション
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

### 2. ダークモード切り替えコンポーネント

```typescript
// dark-mode-toggle.component.ts
import { Component, signal, effect } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-dark-mode-toggle',
  standalone: true,
  imports: [Button],
  template: `
    <p-button
      [icon]="isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'"
      [label]="isDarkMode() ? 'ライトモード' : 'ダークモード'"
      (onClick)="toggleDarkMode()"
      severity="secondary"
      [outlined]="true">
    </p-button>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DarkModeToggleComponent {
  private readonly isDarkMode = signal(false);

  constructor() {
    // ローカルストレージから設定を読み込み
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.isDarkMode.set(savedTheme === 'dark' || (!savedTheme && systemPrefersDark));

    // テーマの適用
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(current => !current);
  }

  private applyTheme(isDark: boolean): void {
    const theme = isDark ? 'dark' : 'light';

    // HTMLに属性を設定
    document.documentElement.setAttribute('data-theme', theme);

    // ローカルストレージに保存
    localStorage.setItem('theme', theme);

    // ボディクラスの更新
    document.body.classList.toggle('dark-theme', isDark);
  }
}
```

## 💡 オフライン開発のベストプラクティス

### 1. テーマリソースの管理

```bash
# 必要なテーマファイルの確認
ls node_modules/primeng/resources/themes/
ls node_modules/@primeuix/themes/

# アセットディレクトリにテーマをコピー（オプション）
cp -r node_modules/primeng/resources/themes/ src/assets/themes/
```

### 2. CSS変数のデバッグ

```typescript
// テーマデバッグユーティリティ
export class ThemeDebugUtil {
  static logCurrentTheme(): void {
    const rootStyles = getComputedStyle(document.documentElement);

    console.group('Current Theme Variables');
    console.log('Primary Color:', rootStyles.getPropertyValue('--primary-color'));
    console.log('Surface Ground:', rootStyles.getPropertyValue('--surface-ground'));
    console.log('Text Color:', rootStyles.getPropertyValue('--text-color'));
    console.groupEnd();
  }

  static getAllCSSVariables(): Record<string, string> {
    const rootStyles = getComputedStyle(document.documentElement);
    const variables: Record<string, string> = {};

    for (let i = 0; i < rootStyles.length; i++) {
      const property = rootStyles[i];
      if (property.startsWith('--')) {
        variables[property] = rootStyles.getPropertyValue(property).trim();
      }
    }

    return variables;
  }
}
```

### 3. パフォーマンス最適化

```scss
// CSS最適化のベストプラクティス
// 1. 不要なテーマファイルは除外
// @import 'primeng/resources/themes/saga-blue/theme.css'; // 使用するもののみ

// 2. CSS変数の適切な使用
.custom-component {
  // ✅ CSS変数を使用
  color: var(--text-color);
  background: var(--surface-card);

  // ❌ ハードコードされた値は避ける
  // color: #333333;
  // background: #ffffff;
}

// 3. レスポンシブデザインでのパフォーマンス
@media (max-width: 768px) {
  .heavy-component {
    // モバイルでは軽量な表示
    box-shadow: none;
    transform: none;
  }
}
```

## 次のステップ

1. **コンポーネント実装**: [PrimeNGコンポーネント実装例](../components/)
2. **統合開発**: [PrimeNG + ECharts統合](../integration/)
3. **APIリファレンス**: [PrimeNG APIリファレンス](../api-reference/)

---

> 💡 **ポイント**: PrimeNGのテーマシステムは非常に柔軟で強力です。オフライン環境では、CSS変数とカスタムテーマを活用して、ブランドに合った美しいUIを構築できます。このガイドを参考に、段階的にカスタマイズを進めてください。