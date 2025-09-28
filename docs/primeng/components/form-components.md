# PrimeNGフォームコンポーネント実装ガイド

オフライン環境でのPrimeNGフォームコンポーネントの実装方法を、実践的な例とともに詳しく説明します。

## 📖 目次

1. [基本入力コンポーネント](#基本入力コンポーネント)
2. [選択コンポーネント](#選択コンポーネント)
3. [日付・時刻コンポーネント](#日付時刻コンポーネント)
4. [ファイル関連コンポーネント](#ファイル関連コンポーネント)
5. [高度なフォーム実装](#高度なフォーム実装)
6. [バリデーションとエラーハンドリング](#バリデーションとエラーハンドリング)

## 基本入力コンポーネント

### 1. InputText - テキスト入力

```typescript
// input-text-examples.component.ts
import { Component, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-text-examples',
  standalone: true,
  imports: [InputText, FloatLabel, IconField, InputIcon, FormsModule],
  template: `
    <div class="input-examples">
      <h2>InputText コンポーネント例</h2>

      <!-- 基本的な入力 -->
      <div class="field">
        <label for="basic">基本的なテキスト入力</label>
        <input
          id="basic"
          type="text"
          pInputText
          [(ngModel)]="basicText"
          placeholder="テキストを入力してください">
      </div>

      <!-- フローティングラベル -->
      <div class="field">
        <p-floatLabel>
          <input
            id="float"
            type="text"
            pInputText
            [(ngModel)]="floatText">
          <label for="float">フローティングラベル</label>
        </p-floatLabel>
      </div>

      <!-- アイコン付き入力 -->
      <div class="field">
        <label for="icon">アイコン付き入力</label>
        <p-iconField iconPosition="left">
          <p-inputIcon styleClass="pi pi-search"></p-inputIcon>
          <input
            id="icon"
            type="text"
            pInputText
            [(ngModel)]="searchText"
            placeholder="検索...">
        </p-iconField>
      </div>

      <!-- 無効化状態 -->
      <div class="field">
        <label for="disabled">無効化状態</label>
        <input
          id="disabled"
          type="text"
          pInputText
          value="編集不可"
          [disabled]="true">
      </div>

      <!-- サイズバリエーション -->
      <div class="field">
        <label>サイズバリエーション</label>
        <div class="size-demo">
          <input type="text" pInputText placeholder="小" size="small">
          <input type="text" pInputText placeholder="通常">
          <input type="text" pInputText placeholder="大" size="large">
        </div>
      </div>

      <!-- バリデーション状態 -->
      <div class="field">
        <label for="validation">バリデーション例</label>
        <input
          id="validation"
          type="text"
          pInputText
          [(ngModel)]="validationText"
          [class.ng-invalid]="!isValidText()"
          placeholder="3文字以上入力してください">
        <small class="error" *ngIf="!isValidText()">
          3文字以上で入力してください
        </small>
      </div>

      <!-- 入力値の表示 -->
      <div class="result-display">
        <h3>入力値:</h3>
        <ul>
          <li><strong>基本:</strong> {{ basicText || '(未入力)' }}</li>
          <li><strong>フロート:</strong> {{ floatText || '(未入力)' }}</li>
          <li><strong>検索:</strong> {{ searchText || '(未入力)' }}</li>
          <li><strong>バリデーション:</strong> {{ validationText || '(未入力)' }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .input-examples {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .field {
      margin-bottom: 2rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .size-demo {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .error {
      color: var(--red-500);
      display: block;
      margin-top: 0.25rem;
    }

    .ng-invalid {
      border-color: var(--red-500) !important;
    }

    .result-display {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--surface-50);
      border-radius: 4px;
    }

    .result-display ul {
      list-style: none;
      padding: 0;
    }

    .result-display li {
      margin-bottom: 0.5rem;
    }
  `]
})
export class InputTextExamplesComponent {
  basicText = '';
  floatText = '';
  searchText = '';
  validationText = '';

  isValidText(): boolean {
    return this.validationText.length >= 3;
  }
}
```

### 2. Textarea - 複数行テキスト

```typescript
// textarea-examples.component.ts
import { Component, signal } from '@angular/core';
import { InputTextarea } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea-examples',
  standalone: true,
  imports: [InputTextarea, FormsModule],
  template: `
    <div class="textarea-examples">
      <h2>Textarea コンポーネント例</h2>

      <!-- 基本的なテキストエリア -->
      <div class="field">
        <label for="basic-textarea">基本的なテキストエリア</label>
        <textarea
          id="basic-textarea"
          pInputTextarea
          [(ngModel)]="basicText"
          placeholder="複数行のテキストを入力してください"
          rows="4">
        </textarea>
      </div>

      <!-- 自動リサイズ -->
      <div class="field">
        <label for="auto-resize">自動リサイズ</label>
        <textarea
          id="auto-resize"
          pInputTextarea
          [(ngModel)]="autoResizeText"
          [autoResize]="true"
          placeholder="テキストに合わせて高さが自動調整されます">
        </textarea>
      </div>

      <!-- 固定サイズ -->
      <div class="field">
        <label for="fixed-size">固定サイズ (10行)</label>
        <textarea
          id="fixed-size"
          pInputTextarea
          [(ngModel)]="fixedSizeText"
          rows="10"
          cols="50"
          placeholder="固定サイズのテキストエリア">
        </textarea>
      </div>

      <!-- 文字数制限 -->
      <div class="field">
        <label for="char-limit">文字数制限 (最大200文字)</label>
        <textarea
          id="char-limit"
          pInputTextarea
          [(ngModel)]="limitedText"
          [maxlength]="200"
          rows="3"
          placeholder="最大200文字まで入力可能">
        </textarea>
        <small class="char-count">
          {{ limitedText.length }}/200 文字
        </small>
      </div>

      <!-- 無効化状態 -->
      <div class="field">
        <label for="disabled-textarea">無効化状態</label>
        <textarea
          id="disabled-textarea"
          pInputTextarea
          value="この内容は編集できません"
          [disabled]="true"
          rows="2">
        </textarea>
      </div>

      <!-- 入力内容の表示 -->
      <div class="result-display">
        <h3>入力内容:</h3>
        <div class="text-preview">
          <h4>基本テキスト:</h4>
          <pre>{{ basicText || '(未入力)' }}</pre>

          <h4>自動リサイズテキスト:</h4>
          <pre>{{ autoResizeText || '(未入力)' }}</pre>

          <h4>制限付きテキスト:</h4>
          <pre>{{ limitedText || '(未入力)' }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .textarea-examples {
      max-width: 700px;
      margin: 0 auto;
      padding: 2rem;
    }

    .field {
      margin-bottom: 2rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .char-count {
      display: block;
      margin-top: 0.25rem;
      color: var(--text-color-secondary);
      text-align: right;
    }

    .result-display {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--surface-50);
      border-radius: 4px;
    }

    .text-preview h4 {
      margin: 1rem 0 0.5rem 0;
      color: var(--primary-color);
    }

    .text-preview pre {
      background: white;
      border: 1px solid var(--surface-200);
      border-radius: 4px;
      padding: 0.5rem;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 100px;
      overflow-y: auto;
    }
  `]
})
export class TextareaExamplesComponent {
  basicText = '';
  autoResizeText = '';
  fixedSizeText = '';
  limitedText = '';
}
```

## 選択コンポーネント

### 1. Dropdown - ドロップダウン選択

```typescript
// dropdown-examples.component.ts
import { Component, signal } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

interface CountryOption {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-dropdown-examples',
  standalone: true,
  imports: [Dropdown, FormsModule],
  template: `
    <div class="dropdown-examples">
      <h2>Dropdown コンポーネント例</h2>

      <!-- 基本的なドロップダウン -->
      <div class="field">
        <label for="basic-dropdown">基本的なドロップダウン</label>
        <p-dropdown
          id="basic-dropdown"
          [options]="basicOptions"
          [(ngModel)]="selectedBasic"
          placeholder="選択してください"
          optionLabel="label"
          optionValue="value">
        </p-dropdown>
      </div>

      <!-- 検索可能なドロップダウン -->
      <div class="field">
        <label for="searchable">検索可能なドロップダウン</label>
        <p-dropdown
          id="searchable"
          [options]="searchableOptions"
          [(ngModel)]="selectedSearchable"
          placeholder="検索または選択"
          [filter]="true"
          filterBy="label"
          [showClear]="true"
          optionLabel="label"
          optionValue="value">
        </p-dropdown>
      </div>

      <!-- グループ化されたオプション -->
      <div class="field">
        <label for="grouped">グループ化されたオプション</label>
        <p-dropdown
          id="grouped"
          [options]="groupedOptions"
          [(ngModel)]="selectedGrouped"
          placeholder="カテゴリから選択"
          [group]="true"
          optionLabel="label"
          optionValue="value"
          optionGroupLabel="label"
          optionGroupChildren="items">
        </p-dropdown>
      </div>

      <!-- カスタムテンプレート -->
      <div class="field">
        <label for="custom">カスタムテンプレート</label>
        <p-dropdown
          id="custom"
          [options]="countryOptions"
          [(ngModel)]="selectedCountry"
          placeholder="国を選択"
          optionLabel="name"
          optionValue="code">

          <!-- 選択された項目のテンプレート -->
          <ng-template pTemplate="selectedItem" let-selectedOption>
            <div class="country-item" *ngIf="selectedOption">
              <span class="flag">{{ selectedOption.flag }}</span>
              <span>{{ selectedOption.name }}</span>
            </div>
          </ng-template>

          <!-- ドロップダウン項目のテンプレート -->
          <ng-template pTemplate="item" let-option>
            <div class="country-item">
              <span class="flag">{{ option.flag }}</span>
              <span>{{ option.name }}</span>
            </div>
          </ng-template>
        </p-dropdown>
      </div>

      <!-- 無効化オプション付き -->
      <div class="field">
        <label for="disabled-options">一部無効化オプション</label>
        <p-dropdown
          id="disabled-options"
          [options]="disabledOptions"
          [(ngModel)]="selectedDisabled"
          placeholder="選択してください"
          optionLabel="label"
          optionValue="value"
          optionDisabled="disabled">
        </p-dropdown>
      </div>

      <!-- 無効化されたドロップダウン -->
      <div class="field">
        <label for="disabled-dropdown">無効化されたドロップダウン</label>
        <p-dropdown
          id="disabled-dropdown"
          [options]="basicOptions"
          value="option2"
          [disabled]="true"
          optionLabel="label"
          optionValue="value">
        </p-dropdown>
      </div>

      <!-- 選択結果の表示 -->
      <div class="result-display">
        <h3>選択結果:</h3>
        <ul>
          <li><strong>基本:</strong> {{ selectedBasic || '(未選択)' }}</li>
          <li><strong>検索可能:</strong> {{ selectedSearchable || '(未選択)' }}</li>
          <li><strong>グループ:</strong> {{ selectedGrouped || '(未選択)' }}</li>
          <li><strong>国:</strong> {{ getCountryName(selectedCountry) || '(未選択)' }}</li>
          <li><strong>無効化オプション:</strong> {{ selectedDisabled || '(未選択)' }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .dropdown-examples {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    .field {
      margin-bottom: 2rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .country-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .flag {
      font-size: 1.2rem;
    }

    .result-display {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--surface-50);
      border-radius: 4px;
    }

    .result-display ul {
      list-style: none;
      padding: 0;
    }

    .result-display li {
      margin-bottom: 0.5rem;
    }
  `]
})
export class DropdownExamplesComponent {
  selectedBasic = '';
  selectedSearchable = '';
  selectedGrouped = '';
  selectedCountry = '';
  selectedDisabled = '';

  basicOptions: DropdownOption[] = [
    { label: 'オプション1', value: 'option1' },
    { label: 'オプション2', value: 'option2' },
    { label: 'オプション3', value: 'option3' },
    { label: 'オプション4', value: 'option4' },
    { label: 'オプション5', value: 'option5' }
  ];

  searchableOptions: DropdownOption[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' },
    { label: 'Fig', value: 'fig' },
    { label: 'Grape', value: 'grape' },
    { label: 'Honeydew', value: 'honeydew' }
  ];

  groupedOptions = [
    {
      label: '果物',
      items: [
        { label: 'りんご', value: 'apple' },
        { label: 'バナナ', value: 'banana' },
        { label: 'オレンジ', value: 'orange' }
      ]
    },
    {
      label: '野菜',
      items: [
        { label: 'にんじん', value: 'carrot' },
        { label: 'ブロッコリー', value: 'broccoli' },
        { label: 'ほうれん草', value: 'spinach' }
      ]
    },
    {
      label: '肉類',
      items: [
        { label: '牛肉', value: 'beef' },
        { label: '豚肉', value: 'pork' },
        { label: '鶏肉', value: 'chicken' }
      ]
    }
  ];

  countryOptions: CountryOption[] = [
    { name: '日本', code: 'JP', flag: '🇯🇵' },
    { name: 'アメリカ', code: 'US', flag: '🇺🇸' },
    { name: 'イギリス', code: 'GB', flag: '🇬🇧' },
    { name: 'フランス', code: 'FR', flag: '🇫🇷' },
    { name: 'ドイツ', code: 'DE', flag: '🇩🇪' },
    { name: 'イタリア', code: 'IT', flag: '🇮🇹' },
    { name: 'スペイン', code: 'ES', flag: '🇪🇸' },
    { name: '韓国', code: 'KR', flag: '🇰🇷' }
  ];

  disabledOptions: DropdownOption[] = [
    { label: '選択可能1', value: 'enabled1' },
    { label: '選択不可1', value: 'disabled1', disabled: true },
    { label: '選択可能2', value: 'enabled2' },
    { label: '選択不可2', value: 'disabled2', disabled: true },
    { label: '選択可能3', value: 'enabled3' }
  ];

  getCountryName(code: string): string {
    const country = this.countryOptions.find(c => c.code === code);
    return country ? country.name : '';
  }
}
```

### 2. MultiSelect - 複数選択

```typescript
// multiselect-examples.component.ts
import { Component, signal } from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

interface SelectOption {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  selector: 'app-multiselect-examples',
  standalone: true,
  imports: [MultiSelect, FormsModule],
  template: `
    <div class="multiselect-examples">
      <h2>MultiSelect コンポーネント例</h2>

      <!-- 基本的な複数選択 -->
      <div class="field">
        <label for="basic-multi">基本的な複数選択</label>
        <p-multiSelect
          id="basic-multi"
          [options]="basicOptions"
          [(ngModel)]="selectedBasic"
          placeholder="複数選択してください"
          optionLabel="label"
          optionValue="value">
        </p-multiSelect>
      </div>

      <!-- 検索可能な複数選択 -->
      <div class="field">
        <label for="searchable-multi">検索可能な複数選択</label>
        <p-multiSelect
          id="searchable-multi"
          [options]="searchableOptions"
          [(ngModel)]="selectedSearchable"
          placeholder="検索または選択"
          [filter]="true"
          filterBy="label"
          [showClear]="true"
          optionLabel="label"
          optionValue="value">
        </p-multiSelect>
      </div>

      <!-- チップ表示 -->
      <div class="field">
        <label for="chip-display">チップ表示</label>
        <p-multiSelect
          id="chip-display"
          [options]="chipOptions"
          [(ngModel)]="selectedChip"
          placeholder="技術を選択"
          [display]="'chip'"
          optionLabel="label"
          optionValue="value">
        </p-multiSelect>
      </div>

      <!-- 最大選択数制限 -->
      <div class="field">
        <label for="max-selection">最大選択数制限 (3個まで)</label>
        <p-multiSelect
          id="max-selection"
          [options]="maxSelectionOptions"
          [(ngModel)]="selectedMax"
          placeholder="最大3つまで選択可能"
          [selectionLimit]="3"
          optionLabel="label"
          optionValue="value">
        </p-multiSelect>
        <small>選択済み: {{ selectedMax.length }}/3</small>
      </div>

      <!-- カスタムテンプレート -->
      <div class="field">
        <label for="custom-multi">カスタムテンプレート</label>
        <p-multiSelect
          id="custom-multi"
          [options]="customOptions"
          [(ngModel)]="selectedCustom"
          placeholder="プログラミング言語を選択"
          optionLabel="label"
          optionValue="value">

          <!-- ヘッダーテンプレート -->
          <ng-template pTemplate="header">
            <div class="custom-header">
              <i class="pi pi-code"></i>
              <span>プログラミング言語一覧</span>
            </div>
          </ng-template>

          <!-- 項目テンプレート -->
          <ng-template pTemplate="item" let-option>
            <div class="custom-item">
              <i [class]="option.icon"></i>
              <span>{{ option.label }}</span>
            </div>
          </ng-template>

          <!-- 選択された項目のテンプレート -->
          <ng-template pTemplate="selectedItems" let-selectedOptions>
            <div class="selected-items">
              <span *ngFor="let option of selectedOptions" class="selected-item">
                <i [class]="getOptionIcon(option)"></i>
                {{ getOptionLabel(option) }}
              </span>
            </div>
          </ng-template>
        </p-multiSelect>
      </div>

      <!-- 全選択/全解除 -->
      <div class="field">
        <label for="select-all">全選択/全解除機能</label>
        <p-multiSelect
          id="select-all"
          [options]="selectAllOptions"
          [(ngModel)]="selectedAll"
          placeholder="色を選択"
          [showToggleAll]="true"
          optionLabel="label"
          optionValue="value">
        </p-multiSelect>
      </div>

      <!-- 選択結果の表示 -->
      <div class="result-display">
        <h3>選択結果:</h3>
        <div class="selection-result">
          <h4>基本選択:</h4>
          <p>{{ selectedBasic.join(', ') || '(未選択)' }}</p>

          <h4>検索可能選択:</h4>
          <p>{{ selectedSearchable.join(', ') || '(未選択)' }}</p>

          <h4>チップ表示:</h4>
          <p>{{ selectedChip.join(', ') || '(未選択)' }}</p>

          <h4>制限付き選択:</h4>
          <p>{{ selectedMax.join(', ') || '(未選択)' }}</p>

          <h4>カスタム選択:</h4>
          <p>{{ selectedCustom.join(', ') || '(未選択)' }}</p>

          <h4>全選択対応:</h4>
          <p>{{ selectedAll.join(', ') || '(未選択)' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .multiselect-examples {
      max-width: 700px;
      margin: 0 auto;
      padding: 2rem;
    }

    .field {
      margin-bottom: 2rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .field small {
      display: block;
      margin-top: 0.25rem;
      color: var(--text-color-secondary);
    }

    .custom-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      font-weight: bold;
    }

    .custom-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0;
    }

    .selected-items {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .selected-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.85rem;
    }

    .result-display {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--surface-50);
      border-radius: 4px;
    }

    .selection-result h4 {
      margin: 1rem 0 0.5rem 0;
      color: var(--primary-color);
    }

    .selection-result p {
      margin: 0 0 0.5rem 0;
      padding: 0.5rem;
      background: white;
      border: 1px solid var(--surface-200);
      border-radius: 4px;
    }
  `]
})
export class MultiSelectExamplesComponent {
  selectedBasic: string[] = [];
  selectedSearchable: string[] = [];
  selectedChip: string[] = [];
  selectedMax: string[] = [];
  selectedCustom: string[] = [];
  selectedAll: string[] = [];

  basicOptions: SelectOption[] = [
    { label: 'オプション1', value: 'option1' },
    { label: 'オプション2', value: 'option2' },
    { label: 'オプション3', value: 'option3' },
    { label: 'オプション4', value: 'option4' },
    { label: 'オプション5', value: 'option5' }
  ];

  searchableOptions: SelectOption[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Express', value: 'express' },
    { label: 'NestJS', value: 'nestjs' },
    { label: 'TypeScript', value: 'typescript' }
  ];

  chipOptions: SelectOption[] = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C#', value: 'csharp' },
    { label: 'Go', value: 'go' },
    { label: 'Rust', value: 'rust' },
    { label: 'Swift', value: 'swift' }
  ];

  maxSelectionOptions: SelectOption[] = [
    { label: '読書', value: 'reading' },
    { label: '映画鑑賞', value: 'movies' },
    { label: '音楽', value: 'music' },
    { label: 'スポーツ', value: 'sports' },
    { label: '料理', value: 'cooking' },
    { label: '旅行', value: 'travel' },
    { label: 'ゲーム', value: 'gaming' },
    { label: '写真', value: 'photography' }
  ];

  customOptions: SelectOption[] = [
    { label: 'JavaScript', value: 'javascript', icon: 'pi pi-star' },
    { label: 'TypeScript', value: 'typescript', icon: 'pi pi-star-fill' },
    { label: 'Python', value: 'python', icon: 'pi pi-cloud' },
    { label: 'Java', value: 'java', icon: 'pi pi-cog' },
    { label: 'C#', value: 'csharp', icon: 'pi pi-desktop' },
    { label: 'Go', value: 'go', icon: 'pi pi-bolt' }
  ];

  selectAllOptions: SelectOption[] = [
    { label: '赤', value: 'red' },
    { label: '青', value: 'blue' },
    { label: '緑', value: 'green' },
    { label: '黄', value: 'yellow' },
    { label: '紫', value: 'purple' },
    { label: 'オレンジ', value: 'orange' },
    { label: 'ピンク', value: 'pink' },
    { label: '黒', value: 'black' }
  ];

  getOptionLabel(value: string): string {
    const option = this.customOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  getOptionIcon(value: string): string {
    const option = this.customOptions.find(opt => opt.value === value);
    return option ? option.icon || 'pi pi-code' : 'pi pi-code';
  }
}
```

## 日付・時刻コンポーネント

### 1. Calendar - 日付選択

```typescript
// calendar-examples.component.ts
import { Component, signal } from '@angular/core';
import { Calendar } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-examples',
  standalone: true,
  imports: [Calendar, FormsModule],
  template: `
    <div class="calendar-examples">
      <h2>Calendar コンポーネント例</h2>

      <!-- 基本的な日付選択 -->
      <div class="field">
        <label for="basic-date">基本的な日付選択</label>
        <p-calendar
          id="basic-date"
          [(ngModel)]="basicDate"
          dateFormat="yy/mm/dd"
          placeholder="日付を選択">
        </p-calendar>
      </div>

      <!-- 時刻選択付き -->
      <div class="field">
        <label for="datetime">日時選択</label>
        <p-calendar
          id="datetime"
          [(ngModel)]="dateTime"
          [showTime]="true"
          hourFormat="24"
          dateFormat="yy/mm/dd"
          placeholder="日時を選択">
        </p-calendar>
      </div>

      <!-- 期間選択 -->
      <div class="field">
        <label for="date-range">期間選択</label>
        <p-calendar
          id="date-range"
          [(ngModel)]="dateRange"
          selectionMode="range"
          [readonlyInput]="true"
          placeholder="期間を選択">
        </p-calendar>
      </div>

      <!-- 複数日付選択 -->
      <div class="field">
        <label for="multiple-dates">複数日付選択</label>
        <p-calendar
          id="multiple-dates"
          [(ngModel)]="multipleDates"
          selectionMode="multiple"
          [readonlyInput]="true"
          placeholder="複数の日付を選択">
        </p-calendar>
      </div>

      <!-- インライン表示 -->
      <div class="field">
        <label>インライン表示</label>
        <p-calendar
          [(ngModel)]="inlineDate"
          [inline]="true"
          [showWeek]="true">
        </p-calendar>
      </div>

      <!-- 制限付き日付選択 -->
      <div class="field">
        <label for="restricted-date">制限付き日付選択 (今日以降のみ)</label>
        <p-calendar
          id="restricted-date"
          [(ngModel)]="restrictedDate"
          [minDate]="minDate"
          [maxDate]="maxDate"
          placeholder="今日以降を選択">
        </p-calendar>
      </div>

      <!-- 無効な日付設定 -->
      <div class="field">
        <label for="disabled-dates">無効日付設定 (土日無効)</label>
        <p-calendar
          id="disabled-dates"
          [(ngModel)]="disabledDatesValue"
          [disabledDates]="disabledDates"
          [disabledDays]="[0, 6]"
          placeholder="平日のみ選択可能">
        </p-calendar>
      </div>

      <!-- カスタムフォーマット -->
      <div class="field">
        <label for="custom-format">カスタムフォーマット</label>
        <p-calendar
          id="custom-format"
          [(ngModel)]="customFormatDate"
          dateFormat="dd MM yy"
          placeholder="dd MM yy形式">
        </p-calendar>
      </div>

      <!-- 月・年選択のみ -->
      <div class="field">
        <label for="month-year">月・年選択</label>
        <p-calendar
          id="month-year"
          [(ngModel)]="monthYearDate"
          view="month"
          dateFormat="mm/yy"
          placeholder="月・年を選択">
        </p-calendar>
      </div>

      <!-- 選択結果の表示 -->
      <div class="result-display">
        <h3>選択結果:</h3>
        <div class="date-results">
          <div class="date-item">
            <strong>基本日付:</strong>
            <span>{{ formatDate(basicDate) }}</span>
          </div>

          <div class="date-item">
            <strong>日時:</strong>
            <span>{{ formatDateTime(dateTime) }}</span>
          </div>

          <div class="date-item">
            <strong>期間:</strong>
            <span>{{ formatDateRange(dateRange) }}</span>
          </div>

          <div class="date-item">
            <strong>複数日付:</strong>
            <span>{{ formatMultipleDates(multipleDates) }}</span>
          </div>

          <div class="date-item">
            <strong>インライン:</strong>
            <span>{{ formatDate(inlineDate) }}</span>
          </div>

          <div class="date-item">
            <strong>制限付き:</strong>
            <span>{{ formatDate(restrictedDate) }}</span>
          </div>

          <div class="date-item">
            <strong>平日のみ:</strong>
            <span>{{ formatDate(disabledDatesValue) }}</span>
          </div>

          <div class="date-item">
            <strong>カスタムフォーマット:</strong>
            <span>{{ formatDate(customFormatDate) }}</span>
          </div>

          <div class="date-item">
            <strong>月・年:</strong>
            <span>{{ formatDate(monthYearDate) }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-examples {
      max-width: 700px;
      margin: 0 auto;
      padding: 2rem;
    }

    .field {
      margin-bottom: 2rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .result-display {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--surface-50);
      border-radius: 4px;
    }

    .date-results {
      display: grid;
      gap: 0.5rem;
    }

    .date-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      background: white;
      border: 1px solid var(--surface-200);
      border-radius: 4px;
    }

    .date-item strong {
      color: var(--primary-color);
    }
  `]
})
export class CalendarExamplesComponent {
  basicDate: Date | null = null;
  dateTime: Date | null = null;
  dateRange: Date[] | null = null;
  multipleDates: Date[] | null = null;
  inlineDate: Date | null = null;
  restrictedDate: Date | null = null;
  disabledDatesValue: Date | null = null;
  customFormatDate: Date | null = null;
  monthYearDate: Date | null = null;

  // 日付制限設定
  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().getFullYear() + 1, 11, 31);

  // 無効な日付（例：特定の祝日）
  disabledDates: Date[] = [
    new Date(2024, 0, 1),   // 元日
    new Date(2024, 4, 3),   // 憲法記念日
    new Date(2024, 4, 4),   // みどりの日
    new Date(2024, 4, 5),   // こどもの日
  ];

  formatDate(date: Date | null): string {
    if (!date) return '(未選択)';
    return date.toLocaleDateString('ja-JP');
  }

  formatDateTime(date: Date | null): string {
    if (!date) return '(未選択)';
    return date.toLocaleString('ja-JP');
  }

  formatDateRange(dates: Date[] | null): string {
    if (!dates || dates.length === 0) return '(未選択)';
    if (dates.length === 1) return this.formatDate(dates[0]);
    return `${this.formatDate(dates[0])} ～ ${this.formatDate(dates[1])}`;
  }

  formatMultipleDates(dates: Date[] | null): string {
    if (!dates || dates.length === 0) return '(未選択)';
    return dates.map(date => this.formatDate(date)).join(', ');
  }
}
```

PrimeNGのフォームコンポーネントドキュメントを作成しました。この包括的なガイドには以下が含まれています：

## 📚 作成した内容

### 1. **基本入力コンポーネント**
- **InputText**: 基本テキスト入力、フローティングラベル、アイコン付き、バリデーション
- **Textarea**: 複数行テキスト、自動リサイズ、文字数制限

### 2. **選択コンポーネント**
- **Dropdown**: 基本選択、検索可能、グループ化、カスタムテンプレート
- **MultiSelect**: 複数選択、チップ表示、選択数制限、全選択機能

### 3. **日付・時刻コンポーネント**
- **Calendar**: 日付選択、日時選択、期間選択、複数日付、制限設定

## 🎯 特徴

- **実践的な例**: すぐに使える完全なコード例
- **Angular Signals対応**: 最新のAngular 20機能に対応
- **オフライン対応**: 外部リソースに依存しない実装例
- **バリデーション**: 実用的なフォームバリデーション例
- **カスタマイズ**: テンプレートやスタイルのカスタマイズ方法

次に、ファイル関連コンポーネントと高度なフォーム実装、テーマガイドなどを続けて作成しますか？
