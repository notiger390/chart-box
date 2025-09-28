# PrimeNG コンポーネント APIリファレンス

オフライン環境でのPrimeNG開発に必要なコンポーネントAPIの包括的なリファレンスです。

## 📖 目次

1. [Button コンポーネント](#button-コンポーネント)
2. [InputText コンポーネント](#inputtext-コンポーネント)
3. [Dropdown コンポーネント](#dropdown-コンポーネント)
4. [MultiSelect コンポーネント](#multiselect-コンポーネント)
5. [Calendar コンポーネント](#calendar-コンポーネント)
6. [Table コンポーネント](#table-コンポーネント)
7. [Dialog コンポーネント](#dialog-コンポーネント)
8. [Toast コンポーネント](#toast-コンポーネント)

## Button コンポーネント

### インポート
```typescript
import { Button } from 'primeng/button';
```

### 基本的な使用方法
```html
<p-button label="ボタンテキスト" (onClick)="handleClick()"></p-button>
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `label` | `string` | `undefined` | ボタンに表示するテキスト |
| `icon` | `string` | `undefined` | アイコンのCSSクラス (例: `pi pi-check`) |
| `iconPos` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | アイコンの位置 |
| `loading` | `boolean` | `false` | ローディング状態の表示 |
| `loadingIcon` | `string` | `'pi pi-spinner pi-spin'` | ローディング時のアイコン |
| `disabled` | `boolean` | `false` | 無効化状態 |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'danger' \| 'help'` | `'primary'` | ボタンの重要度 |
| `size` | `'small' \| 'large'` | `undefined` | ボタンのサイズ |
| `outlined` | `boolean` | `false` | アウトラインスタイル |
| `raised` | `boolean` | `false` | 立体感のあるスタイル |
| `rounded` | `boolean` | `false` | 角丸スタイル |
| `text` | `boolean` | `false` | テキストのみスタイル |
| `link` | `boolean` | `false` | リンクスタイル |
| `plain` | `boolean` | `false` | プレーンスタイル |

### イベント

| イベント | 型 | 説明 |
|---------|---|------|
| `onClick` | `EventEmitter<Event>` | ボタンクリック時に発生 |
| `onFocus` | `EventEmitter<Event>` | フォーカス時に発生 |
| `onBlur` | `EventEmitter<Event>` | フォーカス喪失時に発生 |

### 使用例

```typescript
// severity の使用例
<p-button label="プライマリ" severity="primary"></p-button>
<p-button label="成功" severity="success"></p-button>
<p-button label="警告" severity="warn"></p-button>
<p-button label="危険" severity="danger"></p-button>

// アイコン付きボタン
<p-button label="保存" icon="pi pi-save" iconPos="left"></p-button>
<p-button label="削除" icon="pi pi-trash" iconPos="right" severity="danger"></p-button>

// ローディング状態
<p-button label="処理中" [loading]="isLoading" (onClick)="processData()"></p-button>

// スタイルバリエーション
<p-button label="アウトライン" [outlined]="true"></p-button>
<p-button label="レイズド" [raised]="true"></p-button>
<p-button label="ラウンド" [rounded]="true"></p-button>
```

## InputText コンポーネント

### インポート
```typescript
import { InputText } from 'primeng/inputtext';
```

### 基本的な使用方法
```html
<input type="text" pInputText [(ngModel)]="value" placeholder="テキストを入力">
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `disabled` | `boolean` | `false` | 無効化状態 |
| `size` | `'small' \| 'large'` | `undefined` | 入力フィールドのサイズ |
| `variant` | `'filled' \| 'outlined'` | `'outlined'` | 表示スタイル |

### 使用例

```typescript
// 基本的な使用
<input type="text" pInputText [(ngModel)]="name" placeholder="お名前">

// サイズ指定
<input type="text" pInputText size="small" placeholder="小さい入力">
<input type="text" pInputText placeholder="通常サイズ">
<input type="text" pInputText size="large" placeholder="大きい入力">

// バリデーション統合
<input
  type="text"
  pInputText
  [(ngModel)]="email"
  [class.ng-invalid]="!isValidEmail()"
  placeholder="メールアドレス">

// フローティングラベルとの組み合わせ
<p-floatLabel>
  <input id="username" type="text" pInputText [(ngModel)]="username">
  <label for="username">ユーザー名</label>
</p-floatLabel>
```

## Dropdown コンポーネント

### インポート
```typescript
import { Dropdown } from 'primeng/dropdown';
```

### 基本的な使用方法
```html
<p-dropdown
  [options]="options"
  [(ngModel)]="selectedValue"
  optionLabel="label"
  optionValue="value">
</p-dropdown>
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `options` | `any[]` | `undefined` | 選択肢の配列 |
| `optionLabel` | `string \| ((option: any) => string)` | `undefined` | 表示ラベルのプロパティ名または関数 |
| `optionValue` | `string \| ((option: any) => any)` | `undefined` | 値のプロパティ名または関数 |
| `optionDisabled` | `string \| ((option: any) => boolean)` | `undefined` | 無効化判定のプロパティ名または関数 |
| `optionGroupLabel` | `string` | `undefined` | グループラベルのプロパティ名 |
| `optionGroupChildren` | `string` | `undefined` | グループ子要素のプロパティ名 |
| `placeholder` | `string` | `undefined` | プレースホルダーテキスト |
| `disabled` | `boolean` | `false` | 無効化状態 |
| `filter` | `boolean` | `false` | 検索フィルター機能 |
| `filterBy` | `string` | `undefined` | フィルター対象のプロパティ名 |
| `filterPlaceholder` | `string` | `undefined` | フィルター入力のプレースホルダー |
| `filterMatchMode` | `'contains' \| 'startsWith' \| 'endsWith' \| 'equals' \| 'notEquals' \| 'in'` | `'contains'` | フィルターマッチモード |
| `showClear` | `boolean` | `false` | クリアボタンの表示 |
| `emptyMessage` | `string` | `'No results found'` | 結果が空の時のメッセージ |
| `emptyFilterMessage` | `string` | `'No results found'` | フィルター結果が空の時のメッセージ |
| `group` | `boolean` | `false` | グループ化機能 |
| `editable` | `boolean` | `false` | 編集可能モード |
| `maxlength` | `number` | `undefined` | 編集時の最大文字数 |
| `appendTo` | `'body' \| HTMLElement` | `undefined` | ドロップダウンパネルの追加先 |
| `tabindex` | `number` | `undefined` | タブインデックス |
| `autoDisplayFirst` | `boolean` | `true` | 最初のオプションを自動表示 |
| `selectOnFocus` | `boolean` | `false` | フォーカス時の自動選択 |
| `autoOptionFocus` | `boolean` | `false` | 自動オプションフォーカス |
| `autofocus` | `boolean` | `false` | 自動フォーカス |
| `autofocusFilter` | `boolean` | `false` | フィルターへの自動フォーカス |

### イベント

| イベント | 型 | 説明 |
|---------|---|------|
| `onChange` | `EventEmitter<DropdownChangeEvent>` | 値変更時に発生 |
| `onFilter` | `EventEmitter<DropdownFilterEvent>` | フィルター時に発生 |
| `onFocus` | `EventEmitter<Event>` | フォーカス時に発生 |
| `onBlur` | `EventEmitter<Event>` | フォーカス喪失時に発生 |
| `onClick` | `EventEmitter<Event>` | クリック時に発生 |
| `onShow` | `EventEmitter<AnimationEvent>` | パネル表示時に発生 |
| `onHide` | `EventEmitter<AnimationEvent>` | パネル非表示時に発生 |
| `onClear` | `EventEmitter<Event>` | クリア時に発生 |
| `onLazyLoad` | `EventEmitter<DropdownLazyLoadEvent>` | 遅延読み込み時に発生 |

### 使用例

```typescript
// 基本的な使用
interface Option {
  label: string;
  value: string;
}

options: Option[] = [
  { label: 'オプション1', value: 'opt1' },
  { label: 'オプション2', value: 'opt2' },
  { label: 'オプション3', value: 'opt3' }
];

<p-dropdown
  [options]="options"
  [(ngModel)]="selectedOption"
  placeholder="選択してください"
  optionLabel="label"
  optionValue="value">
</p-dropdown>

// 検索機能付き
<p-dropdown
  [options]="options"
  [(ngModel)]="selectedOption"
  placeholder="検索または選択"
  [filter]="true"
  filterBy="label"
  [showClear]="true"
  optionLabel="label"
  optionValue="value">
</p-dropdown>

// グループ化
groupedOptions = [
  {
    label: '果物',
    items: [
      { label: 'りんご', value: 'apple' },
      { label: 'バナナ', value: 'banana' }
    ]
  },
  {
    label: '野菜',
    items: [
      { label: 'にんじん', value: 'carrot' },
      { label: 'トマト', value: 'tomato' }
    ]
  }
];

<p-dropdown
  [options]="groupedOptions"
  [(ngModel)]="selectedGrouped"
  placeholder="グループから選択"
  [group]="true"
  optionLabel="label"
  optionValue="value"
  optionGroupLabel="label"
  optionGroupChildren="items">
</p-dropdown>

// カスタムテンプレート
<p-dropdown
  [options]="countries"
  [(ngModel)]="selectedCountry"
  optionLabel="name"
  optionValue="code">

  <ng-template pTemplate="selectedItem" let-selectedOption>
    <div class="country-item" *ngIf="selectedOption">
      <span class="flag">{{ selectedOption.flag }}</span>
      <span>{{ selectedOption.name }}</span>
    </div>
  </ng-template>

  <ng-template pTemplate="item" let-option>
    <div class="country-item">
      <span class="flag">{{ option.flag }}</span>
      <span>{{ option.name }}</span>
    </div>
  </ng-template>
</p-dropdown>
```

## MultiSelect コンポーネント

### インポート
```typescript
import { MultiSelect } from 'primeng/multiselect';
```

### 基本的な使用方法
```html
<p-multiSelect
  [options]="options"
  [(ngModel)]="selectedValues"
  optionLabel="label"
  optionValue="value">
</p-multiSelect>
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `options` | `any[]` | `undefined` | 選択肢の配列 |
| `optionLabel` | `string \| ((option: any) => string)` | `undefined` | 表示ラベルのプロパティ名または関数 |
| `optionValue` | `string \| ((option: any) => any)` | `undefined` | 値のプロパティ名または関数 |
| `optionDisabled` | `string \| ((option: any) => boolean)` | `undefined` | 無効化判定のプロパティ名または関数 |
| `optionGroupLabel` | `string` | `undefined` | グループラベルのプロパティ名 |
| `optionGroupChildren` | `string` | `undefined` | グループ子要素のプロパティ名 |
| `placeholder` | `string` | `undefined` | プレースホルダーテキスト |
| `disabled` | `boolean` | `false` | 無効化状態 |
| `filter` | `boolean` | `false` | 検索フィルター機能 |
| `filterBy` | `string` | `undefined` | フィルター対象のプロパティ名 |
| `filterPlaceholder` | `string` | `undefined` | フィルター入力のプレースホルダー |
| `filterMatchMode` | `'contains' \| 'startsWith' \| 'endsWith' \| 'equals' \| 'notEquals' \| 'in'` | `'contains'` | フィルターマッチモード |
| `showClear` | `boolean` | `false` | クリアボタンの表示 |
| `emptyMessage` | `string` | `'No results found'` | 結果が空の時のメッセージ |
| `emptyFilterMessage` | `string` | `'No results found'` | フィルター結果が空の時のメッセージ |
| `group` | `boolean` | `false` | グループ化機能 |
| `display` | `'comma' \| 'chip'` | `'comma'` | 選択項目の表示方式 |
| `selectionLimit` | `number` | `undefined` | 最大選択数の制限 |
| `showToggleAll` | `boolean` | `true` | 全選択トグルの表示 |
| `maxSelectedLabels` | `number` | `3` | 表示する最大ラベル数 |
| `selectedItemsLabel` | `string` | `'{0} items selected'` | 複数選択時のラベル |
| `appendTo` | `'body' \| HTMLElement` | `undefined` | パネルの追加先 |
| `tabindex` | `number` | `undefined` | タブインデックス |
| `autoDisplayFirst` | `boolean` | `true` | 最初のオプションを自動表示 |
| `selectOnFocus` | `boolean` | `false` | フォーカス時の自動選択 |
| `autoOptionFocus` | `boolean` | `false` | 自動オプションフォーカス |
| `autofocus` | `boolean` | `false` | 自動フォーカス |
| `autofocusFilter` | `boolean` | `false` | フィルターへの自動フォーカス |

### イベント

| イベント | 型 | 説明 |
|---------|---|------|
| `onChange` | `EventEmitter<MultiSelectChangeEvent>` | 値変更時に発生 |
| `onFilter` | `EventEmitter<MultiSelectFilterEvent>` | フィルター時に発生 |
| `onFocus` | `EventEmitter<Event>` | フォーカス時に発生 |
| `onBlur` | `EventEmitter<Event>` | フォーカス喪失時に発生 |
| `onClick` | `EventEmitter<Event>` | クリック時に発生 |
| `onShow` | `EventEmitter<AnimationEvent>` | パネル表示時に発生 |
| `onHide` | `EventEmitter<AnimationEvent>` | パネル非表示時に発生 |
| `onClear` | `EventEmitter<Event>` | クリア時に発生 |
| `onLazyLoad` | `EventEmitter<MultiSelectLazyLoadEvent>` | 遅延読み込み時に発生 |
| `onSelectAllChange` | `EventEmitter<MultiSelectSelectAllChangeEvent>` | 全選択変更時に発生 |

### 使用例

```typescript
// 基本的な使用
<p-multiSelect
  [options]="technologies"
  [(ngModel)]="selectedTechnologies"
  placeholder="技術を選択"
  optionLabel="label"
  optionValue="value">
</p-multiSelect>

// チップ表示
<p-multiSelect
  [options]="languages"
  [(ngModel)]="selectedLanguages"
  placeholder="言語を選択"
  [display]="'chip'"
  optionLabel="label"
  optionValue="value">
</p-multiSelect>

// 選択数制限
<p-multiSelect
  [options]="hobbies"
  [(ngModel)]="selectedHobbies"
  placeholder="趣味を3つまで選択"
  [selectionLimit]="3"
  optionLabel="label"
  optionValue="value">
</p-multiSelect>

// カスタムテンプレート
<p-multiSelect
  [options]="countries"
  [(ngModel)]="selectedCountries"
  optionLabel="name"
  optionValue="code">

  <ng-template pTemplate="selectedItems" let-selectedOptions>
    <div class="selected-countries">
      <span *ngFor="let option of selectedOptions" class="country-chip">
        {{ getCountryName(option) }}
      </span>
    </div>
  </ng-template>

  <ng-template pTemplate="item" let-option>
    <div class="country-option">
      <span class="flag">{{ option.flag }}</span>
      <span>{{ option.name }}</span>
    </div>
  </ng-template>
</p-multiSelect>
```

## Calendar コンポーネント

### インポート
```typescript
import { Calendar } from 'primeng/calendar';
```

### 基本的な使用方法
```html
<p-calendar [(ngModel)]="date" dateFormat="yy/mm/dd"></p-calendar>
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `selectionMode` | `'single' \| 'multiple' \| 'range'` | `'single'` | 選択モード |
| `dateFormat` | `string` | `'mm/dd/yy'` | 日付フォーマット |
| `inline` | `boolean` | `false` | インライン表示 |
| `showOtherMonths` | `boolean` | `true` | 他の月の日付表示 |
| `selectOtherMonths` | `boolean` | `false` | 他の月の日付選択可能 |
| `showIcon` | `boolean` | `false` | カレンダーアイコン表示 |
| `icon` | `string` | `'pi pi-calendar'` | カレンダーアイコン |
| `showOnFocus` | `boolean` | `true` | フォーカス時の表示 |
| `numberOfMonths` | `number` | `1` | 表示月数 |
| `responsiveOptions` | `CalendarResponsiveOptions[]` | `undefined` | レスポンシブオプション |
| `view` | `'date' \| 'month' \| 'year'` | `'date'` | 表示ビュー |
| `touchUI` | `boolean` | `false` | タッチUI |
| `monthNavigator` | `boolean` | `false` | 月ナビゲーター |
| `yearNavigator` | `boolean` | `false` | 年ナビゲーター |
| `yearRange` | `string` | `undefined` | 年範囲 (例: '2000:2030') |
| `showTime` | `boolean` | `false` | 時刻選択 |
| `timeOnly` | `boolean` | `false` | 時刻のみ |
| `hourFormat` | `'12' \| '24'` | `'24'` | 時刻フォーマット |
| `stepHour` | `number` | `1` | 時のステップ |
| `stepMinute` | `number` | `1` | 分のステップ |
| `stepSecond` | `number` | `1` | 秒のステップ |
| `showSeconds` | `boolean` | `false` | 秒の表示 |
| `hideOnDateTimeSelect` | `boolean` | `false` | 日時選択時の非表示 |
| `hideOnRangeSelection` | `boolean` | `false` | 範囲選択時の非表示 |
| `showWeek` | `boolean` | `false` | 週番号表示 |
| `manualInput` | `boolean` | `true` | 手動入力可能 |
| `placeholder` | `string` | `undefined` | プレースホルダー |
| `disabled` | `boolean` | `false` | 無効化状態 |
| `readonly` | `boolean` | `false` | 読み取り専用 |
| `minDate` | `Date` | `undefined` | 最小日付 |
| `maxDate` | `Date` | `undefined` | 最大日付 |
| `disabledDates` | `Date[]` | `undefined` | 無効な日付 |
| `disabledDays` | `number[]` | `undefined` | 無効な曜日 (0=日曜日) |
| `maxDateCount` | `number` | `undefined` | 最大選択日数 |
| `showButtonBar` | `boolean` | `false` | ボタンバー表示 |
| `todayButtonStyleClass` | `string` | `'p-button-text'` | 今日ボタンのスタイル |
| `clearButtonStyleClass` | `string` | `'p-button-text'` | クリアボタンのスタイル |
| `appendTo` | `'body' \| HTMLElement` | `undefined` | パネルの追加先 |
| `tabindex` | `number` | `undefined` | タブインデックス |
| `showClear` | `boolean` | `false` | クリアボタン表示 |
| `shortYearCutoff` | `string` | `'+10'` | 短縮年の基準 |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | トランジション設定 |
| `hideTransitionOptions` | `string` | `'.1s linear'` | 非表示トランジション |

### イベント

| イベント | 型 | 説明 |
|---------|---|------|
| `onFocus` | `EventEmitter<Event>` | フォーカス時に発生 |
| `onBlur` | `EventEmitter<Event>` | フォーカス喪失時に発生 |
| `onClose` | `EventEmitter<AnimationEvent>` | カレンダー閉じる時に発生 |
| `onSelect` | `EventEmitter<Date>` | 日付選択時に発生 |
| `onClear` | `EventEmitter<Event>` | クリア時に発生 |
| `onInput` | `EventEmitter<Event>` | 入力時に発生 |
| `onTodayClick` | `EventEmitter<Date>` | 今日ボタンクリック時に発生 |
| `onClearClick` | `EventEmitter<Event>` | クリアボタンクリック時に発生 |
| `onMonthChange` | `EventEmitter<CalendarMonthChangeEvent>` | 月変更時に発生 |
| `onYearChange` | `EventEmitter<CalendarYearChangeEvent>` | 年変更時に発生 |
| `onClickOutside` | `EventEmitter<Event>` | 外側クリック時に発生 |
| `onShow` | `EventEmitter<AnimationEvent>` | 表示時に発生 |

### 使用例

```typescript
// 基本的な日付選択
<p-calendar
  [(ngModel)]="basicDate"
  dateFormat="yy/mm/dd"
  placeholder="日付を選択">
</p-calendar>

// 日時選択
<p-calendar
  [(ngModel)]="dateTime"
  [showTime]="true"
  hourFormat="24"
  dateFormat="yy/mm/dd"
  placeholder="日時を選択">
</p-calendar>

// 期間選択
<p-calendar
  [(ngModel)]="dateRange"
  selectionMode="range"
  [readonlyInput]="true"
  placeholder="期間を選択">
</p-calendar>

// 複数日付選択
<p-calendar
  [(ngModel)]="multipleDates"
  selectionMode="multiple"
  [readonlyInput]="true"
  placeholder="複数の日付を選択">
</p-calendar>

// インライン表示
<p-calendar
  [(ngModel)]="inlineDate"
  [inline]="true"
  [showWeek]="true">
</p-calendar>

// 制限付き日付選択
<p-calendar
  [(ngModel)]="restrictedDate"
  [minDate]="minDate"
  [maxDate]="maxDate"
  [disabledDates]="disabledDates"
  [disabledDays]="[0, 6]"
  placeholder="平日のみ選択可能">
</p-calendar>

// カスタムフォーマット
<p-calendar
  [(ngModel)]="customFormatDate"
  dateFormat="dd MM yy"
  placeholder="dd MM yy形式">
</p-calendar>

// 月・年選択
<p-calendar
  [(ngModel)]="monthYearDate"
  view="month"
  dateFormat="mm/yy"
  placeholder="月・年を選択">
</p-calendar>
```

## Table コンポーネント

### インポート
```typescript
import { Table } from 'primeng/table';
```

### 基本的な使用方法
```html
<p-table [value]="data">
  <ng-template pTemplate="header">
    <tr>
      <th>名前</th>
      <th>年齢</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-item>
    <tr>
      <td>{{ item.name }}</td>
      <td>{{ item.age }}</td>
    </tr>
  </ng-template>
</p-table>
```

### 主要プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `value` | `any[]` | `undefined` | テーブルデータ |
| `columns` | `any[]` | `undefined` | 列定義 |
| `paginator` | `boolean` | `false` | ページネーション |
| `rows` | `number` | `undefined` | 1ページあたりの行数 |
| `first` | `number` | `0` | 最初に表示する行のインデックス |
| `totalRecords` | `number` | `undefined` | 総レコード数 |
| `pageLinks` | `number` | `5` | ページリンク数 |
| `rowsPerPageOptions` | `number[]` | `undefined` | 行数選択オプション |
| `sortField` | `string` | `undefined` | デフォルトソートフィールド |
| `sortOrder` | `number` | `1` | ソート順 (1=昇順, -1=降順) |
| `multiSortMeta` | `SortMeta[]` | `undefined` | マルチソートメタデータ |
| `sortMode` | `'single' \| 'multiple'` | `'single'` | ソートモード |
| `defaultSortOrder` | `number` | `1` | デフォルトソート順 |
| `selectionMode` | `'single' \| 'multiple'` | `undefined` | 選択モード |
| `selection` | `any \| any[]` | `undefined` | 選択された項目 |
| `dataKey` | `string` | `undefined` | データのユニークキー |
| `metaKeySelection` | `boolean` | `false` | メタキーでの選択 |
| `globalFilterFields` | `string[]` | `undefined` | グローバルフィルター対象フィールド |
| `filterDelay` | `number` | `300` | フィルター遅延時間 |
| `filterLocale` | `string` | `undefined` | フィルターロケール |
| `expandedRowKeys` | `{[key: string]: boolean}` | `undefined` | 展開された行のキー |
| `editMode` | `'cell' \| 'row'` | `undefined` | 編集モード |
| `editingRowKeys` | `{[key: string]: boolean}` | `undefined` | 編集中の行キー |
| `loading` | `boolean` | `false` | ローディング状態 |
| `loadingIcon` | `string` | `'pi pi-spinner'` | ローディングアイコン |
| `scrollable` | `boolean` | `false` | スクロール可能 |
| `scrollHeight` | `string` | `undefined` | スクロール高さ |
| `virtualScroll` | `boolean` | `false` | 仮想スクロール |
| `virtualScrollItemSize` | `number` | `undefined` | 仮想スクロールアイテムサイズ |
| `virtualScrollOptions` | `ScrollerOptions` | `undefined` | 仮想スクロールオプション |
| `lazy` | `boolean` | `false` | 遅延読み込み |
| `lazyLoadOnInit` | `boolean` | `true` | 初期化時の遅延読み込み |
| `compareSelectionBy` | `'equals' \| 'deepEquals'` | `'deepEquals'` | 選択比較方法 |
| `csvSeparator` | `string` | `','` | CSV区切り文字 |
| `exportFilename` | `string` | `'download'` | エクスポートファイル名 |
| `exportFunction` | `Function` | `undefined` | カスタムエクスポート関数 |
| `resizableColumns` | `boolean` | `false` | 列リサイズ可能 |
| `columnResizeMode` | `'fit' \| 'expand'` | `'fit'` | 列リサイズモード |
| `reorderableColumns` | `boolean` | `false` | 列並び替え可能 |
| `contextMenu` | `boolean` | `false` | コンテキストメニュー |
| `contextMenuSelection` | `any` | `undefined` | コンテキストメニュー選択 |
| `rowTrackBy` | `Function` | `undefined` | 行トラッキング関数 |
| `filters` | `{[key: string]: FilterMetadata}` | `{}` | フィルター設定 |
| `globalFilter` | `any` | `undefined` | グローバルフィルター値 |
| `filterMode` | `'strict' \| 'lenient'` | `'lenient'` | フィルターモード |
| `showCurrentPageReport` | `boolean` | `false` | 現在ページレポート表示 |
| `currentPageReportTemplate` | `string` | `'{first} to {last} of {totalRecords}'` | ページレポートテンプレート |
| `customSort` | `boolean` | `false` | カスタムソート |
| `autoLayout` | `boolean` | `false` | 自動レイアウト |
| `resetPageOnSort` | `boolean` | `true` | ソート時のページリセット |
| `responsiveLayout` | `'scroll' \| 'stack'` | `'scroll'` | レスポンシブレイアウト |
| `breakpoint` | `string` | `'960px'` | レスポンシブブレークポイント |

### 主要イベント

| イベント | 型 | 説明 |
|---------|---|------|
| `onLazyLoad` | `EventEmitter<TableLazyLoadEvent>` | 遅延読み込み時に発生 |
| `onPage` | `EventEmitter<TablePageEvent>` | ページ変更時に発生 |
| `onSort` | `EventEmitter<TableSortEvent>` | ソート時に発生 |
| `onFilter` | `EventEmitter<TableFilterEvent>` | フィルター時に発生 |
| `onSelectionChange` | `EventEmitter<any>` | 選択変更時に発生 |
| `onContextMenuSelect` | `EventEmitter<TableContextMenuSelectEvent>` | コンテキストメニュー選択時に発生 |
| `onRowSelect` | `EventEmitter<TableRowSelectEvent>` | 行選択時に発生 |
| `onRowUnselect` | `EventEmitter<TableRowUnSelectEvent>` | 行選択解除時に発生 |
| `onRowExpand` | `EventEmitter<TableRowExpandEvent>` | 行展開時に発生 |
| `onRowCollapse` | `EventEmitter<TableRowCollapseEvent>` | 行折りたたみ時に発生 |
| `onEditInit` | `EventEmitter<TableEditInitEvent>` | 編集開始時に発生 |
| `onEditComplete` | `EventEmitter<TableEditCompleteEvent>` | 編集完了時に発生 |
| `onEditCancel` | `EventEmitter<TableEditCancelEvent>` | 編集キャンセル時に発生 |
| `onHeaderCheckboxToggle` | `EventEmitter<TableHeaderCheckboxToggleEvent>` | ヘッダーチェックボックストグル時に発生 |
| `onStateSave` | `EventEmitter<TableStateEvent>` | 状態保存時に発生 |
| `onStateRestore` | `EventEmitter<TableStateEvent>` | 状態復元時に発生 |

### 使用例

```typescript
// 基本的な使用
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

products: Product[] = [
  { id: 1, name: '商品1', category: 'カテゴリA', price: 1000 },
  { id: 2, name: '商品2', category: 'カテゴリB', price: 2000 }
];

<p-table [value]="products" [paginator]="true" [rows]="10">
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="name">
        商品名 <p-sortIcon field="name"></p-sortIcon>
      </th>
      <th pSortableColumn="category">
        カテゴリ <p-sortIcon field="category"></p-sortIcon>
      </th>
      <th pSortableColumn="price">
        価格 <p-sortIcon field="price"></p-sortIcon>
      </th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-product>
    <tr>
      <td>{{ product.name }}</td>
      <td>{{ product.category }}</td>
      <td>{{ product.price | currency:'JPY':'symbol':'1.0-0' }}</td>
    </tr>
  </ng-template>
</p-table>

// 選択機能付き
<p-table
  [value]="products"
  [(selection)]="selectedProducts"
  [paginator]="true"
  [rows]="10"
  selectionMode="multiple"
  dataKey="id">

  <ng-template pTemplate="header">
    <tr>
      <th style="width: 4rem">
        <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
      </th>
      <th>商品名</th>
      <th>カテゴリ</th>
      <th>価格</th>
    </tr>
  </ng-template>

  <ng-template pTemplate="body" let-product>
    <tr>
      <td>
        <p-tableCheckbox [value]="product"></p-tableCheckbox>
      </td>
      <td>{{ product.name }}</td>
      <td>{{ product.category }}</td>
      <td>{{ product.price | currency:'JPY':'symbol':'1.0-0' }}</td>
    </tr>
  </ng-template>
</p-table>

// フィルター機能付き
<p-table
  [value]="products"
  [globalFilterFields]="['name', 'category']"
  [paginator]="true"
  [rows]="10">

  <ng-template pTemplate="caption">
    <div class="flex">
      <button type="button" pButton icon="pi pi-filter-slash"
              (click)="clear(dt)" class="p-button-outlined"></button>
      <span class="p-input-icon-left ml-auto">
        <i class="pi pi-search"></i>
        <input pInputText type="text"
               (input)="dt.filterGlobal($event.target.value, 'contains')"
               placeholder="グローバル検索" />
      </span>
    </div>
  </ng-template>

  <ng-template pTemplate="header">
    <tr>
      <th>
        商品名
        <p-columnFilter type="text" field="name"></p-columnFilter>
      </th>
      <th>
        カテゴリ
        <p-columnFilter type="text" field="category"></p-columnFilter>
      </th>
      <th>
        価格
        <p-columnFilter type="numeric" field="price"></p-columnFilter>
      </th>
    </tr>
  </ng-template>

  <ng-template pTemplate="body" let-product>
    <tr>
      <td>{{ product.name }}</td>
      <td>{{ product.category }}</td>
      <td>{{ product.price | currency:'JPY':'symbol':'1.0-0' }}</td>
    </tr>
  </ng-template>
</p-table>
```

## Dialog コンポーネント

### インポート
```typescript
import { Dialog } from 'primeng/dialog';
```

### 基本的な使用方法
```html
<p-dialog header="ダイアログタイトル" [(visible)]="displayDialog" [modal]="true">
  <p>ダイアログの内容</p>
  <ng-template pTemplate="footer">
    <p-button label="キャンセル" (onClick)="displayDialog = false"></p-button>
    <p-button label="OK" (onClick)="displayDialog = false"></p-button>
  </ng-template>
</p-dialog>
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `visible` | `boolean` | `false` | 表示状態 |
| `header` | `string` | `undefined` | ヘッダーテキスト |
| `modal` | `boolean` | `false` | モーダル表示 |
| `draggable` | `boolean` | `true` | ドラッグ可能 |
| `resizable` | `boolean` | `true` | リサイズ可能 |
| `width` | `string` | `undefined` | 幅 |
| `height` | `string` | `undefined` | 高さ |
| `minWidth` | `number` | `undefined` | 最小幅 |
| `minHeight` | `number` | `undefined` | 最小高さ |
| `maxWidth` | `number` | `undefined` | 最大幅 |
| `maxHeight` | `number` | `undefined` | 最大高さ |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'center'` | 表示位置 |
| `contentStyle` | `object` | `undefined` | コンテンツスタイル |
| `baseZIndex` | `number` | `0` | ベースzIndex |
| `autoZIndex` | `boolean` | `true` | 自動zIndex |
| `dismissableMask` | `boolean` | `false` | マスククリックで閉じる |
| `rtl` | `boolean` | `false` | 右から左のレイアウト |
| `closable` | `boolean` | `true` | 閉じるボタン表示 |
| `responsive` | `boolean` | `true` | レスポンシブ |
| `appendTo` | `'body' \| HTMLElement` | `undefined` | 追加先要素 |
| `breakpoints` | `object` | `undefined` | ブレークポイント設定 |
| `styleClass` | `string` | `undefined` | スタイルクラス |
| `maskStyleClass` | `string` | `undefined` | マスクスタイルクラス |
| `maskStyle` | `object` | `undefined` | マスクスタイル |
| `showHeader` | `boolean` | `true` | ヘッダー表示 |
| `blockScroll` | `boolean` | `false` | スクロールブロック |
| `closeOnEscape` | `boolean` | `true` | Escキーで閉じる |
| `dismissableMask` | `boolean` | `false` | マスククリックで閉じる |
| `closeIcon` | `string` | `'pi pi-times'` | 閉じるアイコン |
| `minimizeIcon` | `string` | `'pi pi-window-minimize'` | 最小化アイコン |
| `maximizeIcon` | `string` | `'pi pi-window-maximize'` | 最大化アイコン |
| `transitionOptions` | `string` | `'150ms cubic-bezier(0, 0, 0.2, 1)'` | トランジション設定 |

### イベント

| イベント | 型 | 説明 |
|---------|---|------|
| `onShow` | `EventEmitter<any>` | 表示時に発生 |
| `onHide` | `EventEmitter<any>` | 非表示時に発生 |
| `onResizeInit` | `EventEmitter<any>` | リサイズ開始時に発生 |
| `onResizeEnd` | `EventEmitter<any>` | リサイズ終了時に発生 |
| `onDragEnd` | `EventEmitter<any>` | ドラッグ終了時に発生 |
| `onMaximize` | `EventEmitter<any>` | 最大化時に発生 |

### 使用例

```typescript
// 基本的な使用
displayDialog = false;

showDialog() {
  this.displayDialog = true;
}

<p-button label="ダイアログを開く" (onClick)="showDialog()"></p-button>

<p-dialog
  header="確認ダイアログ"
  [(visible)]="displayDialog"
  [modal]="true"
  [style]="{ width: '450px' }">

  <p>この操作を実行しますか？</p>

  <ng-template pTemplate="footer">
    <p-button label="キャンセル"
              icon="pi pi-times"
              (onClick)="displayDialog = false"
              class="p-button-text"></p-button>
    <p-button label="実行"
              icon="pi pi-check"
              (onClick)="confirmAction()"></p-button>
  </ng-template>
</p-dialog>

// カスタムヘッダー
<p-dialog
  [(visible)]="displayCustomDialog"
  [modal]="true"
  [style]="{ width: '50vw' }"
  [draggable]="false"
  [resizable]="false">

  <ng-template pTemplate="header">
    <div class="custom-header">
      <i class="pi pi-info-circle"></i>
      <span>カスタムヘッダー</span>
    </div>
  </ng-template>

  <p>カスタムヘッダー付きのダイアログです。</p>

  <ng-template pTemplate="footer">
    <p-button label="閉じる" (onClick)="displayCustomDialog = false"></p-button>
  </ng-template>
</p-dialog>

// レスポンシブダイアログ
<p-dialog
  [(visible)]="displayResponsiveDialog"
  [modal]="true"
  [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
  [style]="{ width: '50vw' }">

  <ng-template pTemplate="header">
    <span>レスポンシブダイアログ</span>
  </ng-template>

  <p>画面サイズに応じてサイズが変わります。</p>
</p-dialog>
```

## Toast コンポーネント

### インポート
```typescript
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
```

### 基本的な使用方法
```html
<p-toast></p-toast>
```

```typescript
constructor(private messageService: MessageService) {}

showSuccess() {
  this.messageService.add({
    severity: 'success',
    summary: '成功',
    detail: '操作が正常に完了しました'
  });
}
```

### プロパティ

| プロパティ | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `key` | `string` | `undefined` | トーストのキー（複数のトーストを区別） |
| `autoZIndex` | `boolean` | `true` | 自動zIndex |
| `baseZIndex` | `number` | `0` | ベースzIndex |
| `style` | `object` | `undefined` | インラインスタイル |
| `styleClass` | `string` | `undefined` | スタイルクラス |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right' \| 'center'` | `'top-right'` | 表示位置 |
| `preventOpenDuplicates` | `boolean` | `false` | 重複メッセージ防止 |
| `preventDuplicates` | `boolean` | `false` | 重複防止 |
| `showTransformOptions` | `string` | `'translateY(100%)'` | 表示トランスフォーム |
| `hideTransformOptions` | `string` | `'translateY(-100%)'` | 非表示トランスフォーム |
| `showTransitionOptions` | `string` | `'300ms ease-out'` | 表示トランジション |
| `hideTransitionOptions` | `string` | `'250ms ease-in'` | 非表示トランジション |
| `breakpoints` | `object` | `undefined` | ブレークポイント設定 |

### イベント

| イベント | 型 | 説明 |
|---------|---|------|
| `onClose` | `EventEmitter<ToastCloseEvent>` | 閉じる時に発生 |

### MessageService メソッド

| メソッド | 説明 |
|---------|------|
| `add(message: Message)` | メッセージを追加 |
| `addAll(messages: Message[])` | 複数のメッセージを追加 |
| `clear(key?: string)` | メッセージをクリア |

### Message インターフェース

```typescript
interface Message {
  severity?: 'success' | 'info' | 'warn' | 'error' | string;
  summary?: string;
  detail?: string;
  id?: any;
  key?: string;
  life?: number;
  sticky?: boolean;
  closable?: boolean;
  data?: any;
  icon?: string;
  contentStyleClass?: string;
  styleClass?: string;
}
```

### 使用例

```typescript
// コンポーネントでの使用
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  providers: [MessageService],
  template: `
    <div class="toast-demo">
      <p-button label="成功" severity="success" (onClick)="showSuccess()"></p-button>
      <p-button label="情報" severity="info" (onClick)="showInfo()"></p-button>
      <p-button label="警告" severity="warn" (onClick)="showWarn()"></p-button>
      <p-button label="エラー" severity="danger" (onClick)="showError()"></p-button>

      <p-button label="複数メッセージ" (onClick)="showMultiple()"></p-button>
      <p-button label="スティッキー" (onClick)="showSticky()"></p-button>
      <p-button label="カスタム" (onClick)="showCustom()"></p-button>

      <p-button label="クリア" (onClick)="clear()"></p-button>
    </div>

    <p-toast></p-toast>
  `
})
export class ToastDemoComponent {
  constructor(private messageService: MessageService) {}

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: '成功',
      detail: '操作が正常に完了しました'
    });
  }

  showInfo() {
    this.messageService.add({
      severity: 'info',
      summary: '情報',
      detail: '新しい情報があります'
    });
  }

  showWarn() {
    this.messageService.add({
      severity: 'warn',
      summary: '警告',
      detail: '注意が必要です'
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'エラー',
      detail: 'エラーが発生しました'
    });
  }

  showMultiple() {
    this.messageService.addAll([
      { severity: 'info', summary: 'メッセージ1', detail: '最初のメッセージ' },
      { severity: 'info', summary: 'メッセージ2', detail: '2番目のメッセージ' },
      { severity: 'info', summary: 'メッセージ3', detail: '3番目のメッセージ' }
    ]);
  }

  showSticky() {
    this.messageService.add({
      severity: 'info',
      summary: 'スティッキー',
      detail: '手動で閉じるまで表示されます',
      sticky: true
    });
  }

  showCustom() {
    this.messageService.add({
      severity: 'info',
      summary: 'カスタム',
      detail: 'カスタムライフタイム（10秒）',
      life: 10000
    });
  }

  clear() {
    this.messageService.clear();
  }
}

// 複数のトーストを使用する場合
<p-toast key="success" position="top-right"></p-toast>
<p-toast key="error" position="top-left"></p-toast>

// 特定のキーでメッセージを追加
this.messageService.add({
  key: 'success',
  severity: 'success',
  summary: '成功',
  detail: '右上に表示'
});

this.messageService.add({
  key: 'error',
  severity: 'error',
  summary: 'エラー',
  detail: '左上に表示'
});

// カスタムテンプレート
<p-toast position="top-center">
  <ng-template let-message pTemplate="message">
    <div class="custom-toast">
      <div class="custom-icon">
        <i [class]="message.icon || 'pi pi-info-circle'"></i>
      </div>
      <div class="custom-content">
        <div class="custom-summary">{{ message.summary }}</div>
        <div class="custom-detail">{{ message.detail }}</div>
      </div>
    </div>
  </ng-template>
</p-toast>
```

## 💡 オフライン開発のベストプラクティス

### 1. 型定義の活用

```typescript
// イベント型の正しい使用
import { DropdownChangeEvent, MultiSelectChangeEvent } from 'primeng/dropdown';
import { CalendarChangeEvent } from 'primeng/calendar';
import { TableLazyLoadEvent } from 'primeng/table';

// 型安全なイベントハンドリング
onDropdownChange(event: DropdownChangeEvent) {
  console.log('Selected:', event.value);
}

onTableLazyLoad(event: TableLazyLoadEvent) {
  // 型安全な遅延読み込み処理
  this.loadData(event.first, event.rows, event.sortField, event.sortOrder);
}
```

### 2. パフォーマンス最適化

```typescript
// OnPush戦略とSignalsの組み合わせ
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class OptimizedComponent {
  // Signalsは自動的にOnPush戦略と連携
  readonly data = signal([]);
  readonly filteredData = computed(() =>
    this.data().filter(item => this.filterCondition(item))
  );
}
```

### 3. メモリリーク対策

```typescript
@Component({
  // ...
})
export class MemoryEfficientComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // RxJSの自動クリーンアップ
    someObservable$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        // 処理
      });
  }
}
```

## 次のステップ

1. **実装例**: [PrimeNGコンポーネント実装例](../components/)
2. **統合ガイド**: [PrimeNG + ECharts統合](../integration/)
3. **テーマ**: [テーマカスタマイズ](../theming/)

---

> 💡 **ポイント**: このAPIリファレンスは、オフライン環境での開発を想定して詳細な情報を含んでいます。各コンポーネントの型定義を活用して、型安全で保守性の高いアプリケーションを構築してください。