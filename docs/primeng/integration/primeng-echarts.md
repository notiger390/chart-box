# PrimeNG + ECharts統合ガイド

PrimeNGコンポーネントとEChartsを効果的に組み合わせて、インタラクティブで美しいダッシュボードを構築する方法を説明します。

## 📖 目次

1. [統合の基本概念](#統合の基本概念)
2. [ダッシュボードレイアウトの構築](#ダッシュボードレイアウトの構築)
3. [フィルターとチャートの連携](#フィルターとチャートの連携)
4. [データ管理とリアクティブ更新](#データ管理とリアクティブ更新)
5. [エクスポート機能の実装](#エクスポート機能の実装)
6. [レスポンシブ対応](#レスポンシブ対応)

## 統合の基本概念

### アーキテクチャ概要

```
┌─────────────────────────────────────┐
│ PrimeNG UI Layer                    │
├─────────────────────────────────────┤
│ ├── Toolbar (フィルター・操作)         │
│ ├── Panel (チャートコンテナ)          │
│ ├── DataTable (詳細データ)           │
│ └── Dialog (設定・エクスポート)        │
├─────────────────────────────────────┤
│ Angular Signals (状態管理)           │
├─────────────────────────────────────┤
│ ECharts Layer                       │
├─────────────────────────────────────┤
│ ├── Chart Options (設定)            │
│ ├── Data Processing (データ処理)      │
│ └── Event Handling (イベント)        │
└─────────────────────────────────────┘
```

### 基本的な統合パターン

```typescript
// dashboard-base.component.ts
import { Component, signal, computed } from '@angular/core';
import { Panel } from 'primeng/panel';
import { Button } from 'primeng/button';
import { Dropdown } from 'primeng/dropdown';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard-base',
  standalone: true,
  imports: [Panel, Button, Dropdown, NgxEchartsModule],
  template: `
    <div class="dashboard-container">
      <!-- コントロールパネル -->
      <p-panel header="ダッシュボード設定" [toggleable]="true">
        <div class="controls">
          <p-dropdown
            [options]="chartTypes"
            [(ngModel)]="selectedChartType"
            placeholder="チャートタイプ">
          </p-dropdown>

          <p-dropdown
            [options]="timePeriods"
            [(ngModel)]="selectedPeriod"
            placeholder="期間">
          </p-dropdown>

          <p-button
            label="データ更新"
            icon="pi pi-refresh"
            (onClick)="refreshData()">
          </p-button>
        </div>
      </p-panel>

      <!-- チャート表示エリア -->
      <p-panel header="チャート" class="chart-panel">
        <div echarts
             [options]="chartOptions()"
             [loading]="isLoading()"
             class="chart-container">
        </div>
      </p-panel>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .chart-panel {
      flex: 1;
    }

    .chart-container {
      width: 100%;
      height: 400px;
    }
  `]
})
export class DashboardBaseComponent {
  // 状態管理
  selectedChartType = signal('bar');
  selectedPeriod = signal('month');
  isLoading = signal(false);

  // オプション
  chartTypes = [
    { label: '棒グラフ', value: 'bar' },
    { label: '折れ線グラフ', value: 'line' },
    { label: '円グラフ', value: 'pie' }
  ];

  timePeriods = [
    { label: '今月', value: 'month' },
    { label: '今四半期', value: 'quarter' },
    { label: '今年', value: 'year' }
  ];

  // チャートオプション
  readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: `${this.getChartTitle()} - ${this.getPeriodTitle()}`
    },
    // チャートタイプに応じた設定...
  }));

  refreshData() {
    this.isLoading.set(true);
    // データ更新ロジック
    setTimeout(() => this.isLoading.set(false), 1000);
  }

  private getChartTitle(): string {
    const type = this.selectedChartType();
    const titles = {
      bar: '売上データ',
      line: '傾向分析',
      pie: 'シェア分析'
    };
    return titles[type as keyof typeof titles] || 'データ分析';
  }

  private getPeriodTitle(): string {
    const period = this.selectedPeriod();
    const titles = {
      month: '月次',
      quarter: '四半期',
      year: '年次'
    };
    return titles[period as keyof typeof titles] || '';
  }
}
```

## ダッシュボードレイアウトの構築

### 1. グリッドレイアウトダッシュボード

```typescript
// grid-dashboard.component.ts
import { Component, signal, computed } from '@angular/core';
import { Panel } from 'primeng/panel';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Splitter, SplitterPanel } from 'primeng/splitter';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-grid-dashboard',
  standalone: true,
  imports: [Panel, Card, Button, Splitter, SplitterPanel, NgxEchartsModule],
  template: `
    <div class="grid-dashboard">
      <!-- ヘッダー -->
      <div class="dashboard-header">
        <h1>売上ダッシュボード</h1>
        <div class="header-actions">
          <p-button
            label="エクスポート"
            icon="pi pi-download"
            (onClick)="exportDashboard()">
          </p-button>
          <p-button
            label="設定"
            icon="pi pi-cog"
            severity="secondary"
            (onClick)="openSettings()">
          </p-button>
        </div>
      </div>

      <!-- メインコンテンツ -->
      <p-splitter [panelSizes]="[70, 30]" layout="horizontal">
        <!-- チャートエリア -->
        <p-splitterPanel>
          <div class="charts-grid">
            <!-- 主要指標 -->
            <p-card class="kpi-card">
              <div class="kpi-content">
                <h3>総売上</h3>
                <div class="kpi-value">{{ totalSales() | currency:'JPY':'symbol':'1.0-0' }}</div>
                <div class="kpi-change positive">+12.5%</div>
              </div>
            </p-card>

            <p-card class="kpi-card">
              <div class="kpi-content">
                <h3>新規顧客</h3>
                <div class="kpi-value">{{ newCustomers() }}</div>
                <div class="kpi-change positive">+8.3%</div>
              </div>
            </p-card>

            <!-- メインチャート -->
            <p-card class="main-chart-card">
              <div echarts
                   [options]="mainChartOptions()"
                   [loading]="isLoading()"
                   class="main-chart">
              </div>
            </p-card>

            <!-- サブチャート -->
            <p-card class="sub-chart-card">
              <div echarts
                   [options]="subChartOptions()"
                   class="sub-chart">
              </div>
            </p-card>
          </div>
        </p-splitterPanel>

        <!-- サイドパネル -->
        <p-splitterPanel>
          <div class="side-panel">
            <p-panel header="フィルター" [toggleable]="true">
              <div class="filter-content">
                <!-- フィルターコンポーネント -->
              </div>
            </p-panel>

            <p-panel header="詳細データ" [toggleable]="true">
              <div class="detail-content">
                <!-- 詳細データテーブル -->
              </div>
            </p-panel>
          </div>
        </p-splitterPanel>
      </p-splitter>
    </div>
  `,
  styles: [`
    .grid-dashboard {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: var(--surface-50);
      border-bottom: 1px solid var(--surface-200);
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    .charts-grid {
      padding: 1rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto 1fr 1fr;
      gap: 1rem;
      height: 100%;
    }

    .kpi-card {
      grid-column: span 1;
    }

    .main-chart-card {
      grid-column: span 2;
    }

    .sub-chart-card {
      grid-column: span 2;
    }

    .kpi-content {
      text-align: center;
    }

    .kpi-value {
      font-size: 2rem;
      font-weight: bold;
      color: var(--primary-color);
      margin: 0.5rem 0;
    }

    .kpi-change {
      font-size: 0.9rem;
      font-weight: bold;
    }

    .kpi-change.positive {
      color: var(--green-500);
    }

    .kpi-change.negative {
      color: var(--red-500);
    }

    .main-chart {
      width: 100%;
      height: 300px;
    }

    .sub-chart {
      width: 100%;
      height: 200px;
    }

    .side-panel {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .filter-content,
    .detail-content {
      min-height: 200px;
    }
  `]
})
export class GridDashboardComponent {
  isLoading = signal(false);

  // KPI データ
  totalSales = signal(12450000);
  newCustomers = signal(324);

  // チャートオプション
  readonly mainChartOptions = computed<EChartsOption>(() => ({
    title: {
      text: '月別売上推移',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      name: '売上 (万円)'
    },
    series: [{
      name: '売上',
      type: 'line',
      data: [820, 932, 901, 934, 1290, 1330],
      smooth: true,
      itemStyle: { color: '#5470c6' }
    }]
  }));

  readonly subChartOptions = computed<EChartsOption>(() => ({
    title: {
      text: '商品カテゴリ別シェア',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: 'シェア',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 335, name: '電子機器' },
        { value: 310, name: '衣料品' },
        { value: 234, name: '書籍' },
        { value: 135, name: 'その他' }
      ]
    }]
  }));

  exportDashboard() {
    console.log('ダッシュボードをエクスポート');
  }

  openSettings() {
    console.log('設定を開く');
  }
}
```

## フィルターとチャートの連携

### 1. 高度なフィルターシステム

```typescript
// filter-chart-integration.component.ts
import { Component, signal, computed, effect } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';
import { MultiSelect } from 'primeng/multiselect';
import { Calendar } from 'primeng/calendar';
import { Slider } from 'primeng/slider';
import { Panel } from 'primeng/panel';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

interface FilterState {
  dateRange: [Date, Date] | null;
  categories: string[];
  priceRange: [number, number];
  regions: string[];
}

interface SalesData {
  date: Date;
  category: string;
  region: string;
  amount: number;
  product: string;
}

@Component({
  selector: 'app-filter-chart-integration',
  standalone: true,
  imports: [
    Dropdown, MultiSelect, Calendar, Slider, Panel, NgxEchartsModule
  ],
  template: `
    <div class="filter-chart-container">
      <!-- フィルターパネル -->
      <p-panel header="データフィルター" [toggleable]="true" class="filter-panel">
        <div class="filter-grid">
          <!-- 日付範囲 -->
          <div class="filter-item">
            <label>期間</label>
            <p-calendar
              [(ngModel)]="dateRange"
              selectionMode="range"
              [readonlyInput]="true"
              placeholder="期間を選択">
            </p-calendar>
          </div>

          <!-- カテゴリ選択 -->
          <div class="filter-item">
            <label>カテゴリ</label>
            <p-multiSelect
              [options]="categoryOptions"
              [(ngModel)]="selectedCategories"
              placeholder="カテゴリを選択"
              optionLabel="label"
              optionValue="value">
            </p-multiSelect>
          </div>

          <!-- 金額範囲 -->
          <div class="filter-item">
            <label>金額範囲: {{ priceRange()[0] | currency:'JPY':'symbol':'1.0-0' }} - {{ priceRange()[1] | currency:'JPY':'symbol':'1.0-0' }}</label>
            <p-slider
              [(ngModel)]="priceRangeModel"
              [range]="true"
              [min]="0"
              [max]="1000000"
              [step]="10000">
            </p-slider>
          </div>

          <!-- 地域選択 -->
          <div class="filter-item">
            <label>地域</label>
            <p-multiSelect
              [options]="regionOptions"
              [(ngModel)]="selectedRegions"
              placeholder="地域を選択"
              optionLabel="label"
              optionValue="value">
            </p-multiSelect>
          </div>
        </div>

        <!-- フィルター情報表示 -->
        <div class="filter-summary">
          <p><strong>フィルタリング結果:</strong> {{ filteredData().length }} 件のデータ</p>
        </div>
      </p-panel>

      <!-- チャート表示エリア -->
      <div class="charts-container">
        <!-- 棒グラフ -->
        <p-panel header="カテゴリ別売上" class="chart-panel">
          <div echarts
               [options]="categoryChartOptions()"
               class="chart">
          </div>
        </p-panel>

        <!-- 折れ線グラフ -->
        <p-panel header="売上推移" class="chart-panel">
          <div echarts
               [options]="trendChartOptions()"
               class="chart">
          </div>
        </p-panel>

        <!-- 散布図 -->
        <p-panel header="地域別分析" class="chart-panel">
          <div echarts
               [options]="regionChartOptions()"
               class="chart">
          </div>
        </p-panel>
      </div>
    </div>
  `,
  styles: [`
    .filter-chart-container {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .filter-panel {
      margin-bottom: 1rem;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .filter-item label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .filter-summary {
      padding: 1rem;
      background: var(--surface-50);
      border-radius: 4px;
      border-left: 4px solid var(--primary-color);
    }

    .charts-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1rem;
    }

    .chart {
      width: 100%;
      height: 300px;
    }

    .chart-panel {
      min-height: 400px;
    }
  `]
})
export class FilterChartIntegrationComponent {
  // フィルター状態
  dateRange = signal<[Date, Date] | null>(null);
  selectedCategories = signal<string[]>([]);
  priceRange = signal<[number, number]>([0, 1000000]);
  selectedRegions = signal<string[]>([]);

  // UI バインディング用
  priceRangeModel: [number, number] = [0, 1000000];

  // オプション定義
  categoryOptions = [
    { label: '電子機器', value: 'electronics' },
    { label: '衣料品', value: 'clothing' },
    { label: '書籍', value: 'books' },
    { label: '食品', value: 'food' },
    { label: 'その他', value: 'other' }
  ];

  regionOptions = [
    { label: '東京', value: 'tokyo' },
    { label: '大阪', value: 'osaka' },
    { label: '名古屋', value: 'nagoya' },
    { label: '福岡', value: 'fukuoka' },
    { label: '札幌', value: 'sapporo' }
  ];

  // サンプルデータ
  private readonly rawData = signal<SalesData[]>(this.generateSampleData());

  // フィルタリングされたデータ
  readonly filteredData = computed(() => {
    let data = this.rawData();

    // 日付フィルター
    const dateRange = this.dateRange();
    if (dateRange && dateRange[0] && dateRange[1]) {
      data = data.filter(item =>
        item.date >= dateRange[0] && item.date <= dateRange[1]
      );
    }

    // カテゴリフィルター
    const categories = this.selectedCategories();
    if (categories.length > 0) {
      data = data.filter(item => categories.includes(item.category));
    }

    // 金額フィルター
    const [minPrice, maxPrice] = this.priceRange();
    data = data.filter(item =>
      item.amount >= minPrice && item.amount <= maxPrice
    );

    // 地域フィルター
    const regions = this.selectedRegions();
    if (regions.length > 0) {
      data = data.filter(item => regions.includes(item.region));
    }

    return data;
  });

  // チャートオプション
  readonly categoryChartOptions = computed<EChartsOption>(() => {
    const data = this.filteredData();
    const categoryData = this.aggregateByCategory(data);

    return {
      title: { text: 'カテゴリ別売上', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: categoryData.map(d => d.category)
      },
      yAxis: {
        type: 'value',
        name: '売上 (円)'
      },
      series: [{
        name: '売上',
        type: 'bar',
        data: categoryData.map(d => d.amount),
        itemStyle: { color: '#5470c6' }
      }]
    };
  });

  readonly trendChartOptions = computed<EChartsOption>(() => {
    const data = this.filteredData();
    const trendData = this.aggregateByDate(data);

    return {
      title: { text: '売上推移', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'time'
      },
      yAxis: {
        type: 'value',
        name: '売上 (円)'
      },
      series: [{
        name: '売上',
        type: 'line',
        data: trendData.map(d => [d.date, d.amount]),
        smooth: true,
        itemStyle: { color: '#91cc75' }
      }]
    };
  });

  readonly regionChartOptions = computed<EChartsOption>(() => {
    const data = this.filteredData();
    const regionData = this.aggregateByRegion(data);

    return {
      title: { text: '地域別分析', left: 'center' },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 円'
      },
      series: [{
        name: '売上',
        type: 'pie',
        radius: '50%',
        data: regionData.map(d => ({
          name: d.region,
          value: d.amount
        }))
      }]
    };
  });

  constructor() {
    // 価格範囲の同期
    effect(() => {
      this.priceRange.set([
        this.priceRangeModel[0],
        this.priceRangeModel[1]
      ]);
    });
  }

  private generateSampleData(): SalesData[] {
    const categories = ['electronics', 'clothing', 'books', 'food', 'other'];
    const regions = ['tokyo', 'osaka', 'nagoya', 'fukuoka', 'sapporo'];
    const products = ['商品A', '商品B', '商品C', '商品D', '商品E'];

    return Array.from({ length: 500 }, (_, i) => ({
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      category: categories[Math.floor(Math.random() * categories.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      amount: Math.floor(Math.random() * 500000) + 10000,
      product: products[Math.floor(Math.random() * products.length)]
    }));
  }

  private aggregateByCategory(data: SalesData[]) {
    const aggregated = new Map<string, number>();

    data.forEach(item => {
      const current = aggregated.get(item.category) || 0;
      aggregated.set(item.category, current + item.amount);
    });

    return Array.from(aggregated.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  }

  private aggregateByDate(data: SalesData[]) {
    const aggregated = new Map<string, number>();

    data.forEach(item => {
      const dateKey = item.date.toISOString().split('T')[0];
      const current = aggregated.get(dateKey) || 0;
      aggregated.set(dateKey, current + item.amount);
    });

    return Array.from(aggregated.entries())
      .map(([date, amount]) => ({ date: new Date(date), amount }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private aggregateByRegion(data: SalesData[]) {
    const aggregated = new Map<string, number>();

    data.forEach(item => {
      const current = aggregated.get(item.region) || 0;
      aggregated.set(item.region, current + item.amount);
    });

    return Array.from(aggregated.entries()).map(([region, amount]) => ({
      region,
      amount
    }));
  }
}
```

## データ管理とリアクティブ更新

### 1. 統合データサービス

```typescript
// integrated-data.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

export interface DashboardData {
  sales: SalesRecord[];
  kpis: KPIData;
  filters: FilterState;
}

export interface SalesRecord {
  id: string;
  date: Date;
  amount: number;
  category: string;
  region: string;
  customer: string;
}

export interface KPIData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  customerGrowth: number;
}

@Injectable({
  providedIn: 'root'
})
export class IntegratedDataService {
  // 中央集約データストア
  private readonly dataStore = signal<DashboardData>({
    sales: [],
    kpis: {
      totalSales: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      customerGrowth: 0
    },
    filters: {
      dateRange: null,
      categories: [],
      priceRange: [0, 1000000],
      regions: []
    }
  });

  // パブリックアクセサ
  readonly data = this.dataStore.asReadonly();

  // フィルタリングされたデータ
  readonly filteredSales = computed(() => {
    const { sales, filters } = this.data();
    return this.applyFilters(sales, filters);
  });

  // 計算されたKPI
  readonly computedKPIs = computed(() => {
    const sales = this.filteredSales();
    return this.calculateKPIs(sales);
  });

  // チャート用データ
  readonly chartData = computed(() => ({
    categoryData: this.aggregateByCategory(this.filteredSales()),
    trendData: this.aggregateByDate(this.filteredSales()),
    regionData: this.aggregateByRegion(this.filteredSales())
  }));

  constructor() {
    // 初期データの読み込み
    this.loadInitialData();

    // リアルタイム更新（デモ用）
    this.startRealtimeUpdates();
  }

  // フィルター更新
  updateFilters(filters: Partial<FilterState>) {
    this.dataStore.update(current => ({
      ...current,
      filters: { ...current.filters, ...filters }
    }));
  }

  // データ更新
  updateSalesData(sales: SalesRecord[]) {
    this.dataStore.update(current => ({
      ...current,
      sales
    }));
  }

  // データエクスポート
  exportData(): Blob {
    const data = this.filteredSales();
    const csv = this.convertToCSV(data);
    return new Blob([csv], { type: 'text/csv' });
  }

  private loadInitialData() {
    // 模擬的なデータ生成
    const sales = this.generateSampleSales(1000);
    this.updateSalesData(sales);
  }

  private startRealtimeUpdates() {
    // 5秒ごとに新しいデータを追加（デモ用）
    interval(5000).subscribe(() => {
      const currentSales = this.data().sales;
      const newRecord = this.generateRandomSalesRecord();
      this.updateSalesData([...currentSales, newRecord]);
    });
  }

  private applyFilters(sales: SalesRecord[], filters: FilterState): SalesRecord[] {
    let filtered = sales;

    // 日付フィルター
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      filtered = filtered.filter(record =>
        record.date >= filters.dateRange![0] && record.date <= filters.dateRange![1]
      );
    }

    // カテゴリフィルター
    if (filters.categories.length > 0) {
      filtered = filtered.filter(record =>
        filters.categories.includes(record.category)
      );
    }

    // 金額フィルター
    filtered = filtered.filter(record =>
      record.amount >= filters.priceRange[0] && record.amount <= filters.priceRange[1]
    );

    // 地域フィルター
    if (filters.regions.length > 0) {
      filtered = filtered.filter(record =>
        filters.regions.includes(record.region)
      );
    }

    return filtered;
  }

  private calculateKPIs(sales: SalesRecord[]): KPIData {
    if (sales.length === 0) {
      return {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        customerGrowth: 0
      };
    }

    const totalSales = sales.reduce((sum, record) => sum + record.amount, 0);
    const totalOrders = sales.length;
    const averageOrderValue = totalSales / totalOrders;

    // 簡易的な成長率計算
    const customerGrowth = 12.5; // 実際には期間比較が必要

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      customerGrowth
    };
  }

  private aggregateByCategory(sales: SalesRecord[]) {
    const aggregated = new Map<string, number>();
    sales.forEach(record => {
      const current = aggregated.get(record.category) || 0;
      aggregated.set(record.category, current + record.amount);
    });
    return Array.from(aggregated.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  }

  private aggregateByDate(sales: SalesRecord[]) {
    const aggregated = new Map<string, number>();
    sales.forEach(record => {
      const dateKey = record.date.toISOString().split('T')[0];
      const current = aggregated.get(dateKey) || 0;
      aggregated.set(dateKey, current + record.amount);
    });
    return Array.from(aggregated.entries())
      .map(([date, amount]) => ({ date: new Date(date), amount }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private aggregateByRegion(sales: SalesRecord[]) {
    const aggregated = new Map<string, number>();
    sales.forEach(record => {
      const current = aggregated.get(record.region) || 0;
      aggregated.set(record.region, current + record.amount);
    });
    return Array.from(aggregated.entries()).map(([region, amount]) => ({
      region,
      amount
    }));
  }

  private generateSampleSales(count: number): SalesRecord[] {
    return Array.from({ length: count }, () => this.generateRandomSalesRecord());
  }

  private generateRandomSalesRecord(): SalesRecord {
    const categories = ['electronics', 'clothing', 'books', 'food', 'other'];
    const regions = ['tokyo', 'osaka', 'nagoya', 'fukuoka', 'sapporo'];
    const customers = ['顧客A', '顧客B', '顧客C', '顧客D', '顧客E'];

    return {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      amount: Math.floor(Math.random() * 500000) + 10000,
      category: categories[Math.floor(Math.random() * categories.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      customer: customers[Math.floor(Math.random() * customers.length)]
    };
  }

  private convertToCSV(data: SalesRecord[]): string {
    const headers = ['ID', '日付', '金額', 'カテゴリ', '地域', '顧客'];
    const rows = data.map(record => [
      record.id,
      record.date.toISOString().split('T')[0],
      record.amount.toString(),
      record.category,
      record.region,
      record.customer
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }
}
```

## エクスポート機能の実装

### 1. チャートとデータのエクスポート

```typescript
// export-functionality.component.ts
import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Dropdown } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IntegratedDataService } from './integrated-data.service';

@Component({
  selector: 'app-export-functionality',
  standalone: true,
  imports: [Button, Dialog, Dropdown, InputText, Toast],
  providers: [MessageService],
  template: `
    <div class="export-controls">
      <p-button
        label="エクスポート"
        icon="pi pi-download"
        (onClick)="showExportDialog = true">
      </p-button>
    </div>

    <p-dialog
      header="データエクスポート"
      [(visible)]="showExportDialog"
      [modal]="true"
      [style]="{ width: '450px' }">

      <div class="export-options">
        <div class="field">
          <label>エクスポート形式</label>
          <p-dropdown
            [options]="exportFormats"
            [(ngModel)]="selectedFormat"
            placeholder="形式を選択"
            optionLabel="label"
            optionValue="value">
          </p-dropdown>
        </div>

        <div class="field">
          <label>ファイル名</label>
          <input
            type="text"
            pInputText
            [(ngModel)]="fileName"
            placeholder="ファイル名を入力">
        </div>

        <div class="field" *ngIf="selectedFormat === 'image'">
          <label>画像形式</label>
          <p-dropdown
            [options]="imageFormats"
            [(ngModel)]="selectedImageFormat"
            optionLabel="label"
            optionValue="value">
          </p-dropdown>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button
          label="キャンセル"
          icon="pi pi-times"
          (onClick)="showExportDialog = false"
          class="p-button-text">
        </p-button>
        <p-button
          label="エクスポート"
          icon="pi pi-check"
          (onClick)="executeExport()">
        </p-button>
      </ng-template>
    </p-dialog>

    <p-toast></p-toast>
  `,
  styles: [`
    .export-controls {
      padding: 1rem;
    }

    .export-options {
      padding: 1rem 0;
    }

    .field {
      margin-bottom: 1rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
  `]
})
export class ExportFunctionalityComponent {
  private readonly dataService = inject(IntegratedDataService);
  private readonly messageService = inject(MessageService);

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  showExportDialog = false;
  selectedFormat = 'csv';
  selectedImageFormat = 'png';
  fileName = 'dashboard-export';

  exportFormats = [
    { label: 'CSV', value: 'csv' },
    { label: 'JSON', value: 'json' },
    { label: '画像', value: 'image' },
    { label: 'PDF', value: 'pdf' }
  ];

  imageFormats = [
    { label: 'PNG', value: 'png' },
    { label: 'JPEG', value: 'jpeg' },
    { label: 'SVG', value: 'svg' }
  ];

  executeExport() {
    switch (this.selectedFormat) {
      case 'csv':
        this.exportCSV();
        break;
      case 'json':
        this.exportJSON();
        break;
      case 'image':
        this.exportImage();
        break;
      case 'pdf':
        this.exportPDF();
        break;
    }

    this.showExportDialog = false;
  }

  private exportCSV() {
    try {
      const blob = this.dataService.exportData();
      this.downloadBlob(blob, `${this.fileName}.csv`);

      this.messageService.add({
        severity: 'success',
        summary: 'エクスポート完了',
        detail: 'CSVファイルをダウンロードしました'
      });
    } catch (error) {
      this.handleExportError(error);
    }
  }

  private exportJSON() {
    try {
      const data = this.dataService.data();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      this.downloadBlob(blob, `${this.fileName}.json`);

      this.messageService.add({
        severity: 'success',
        summary: 'エクスポート完了',
        detail: 'JSONファイルをダウンロードしました'
      });
    } catch (error) {
      this.handleExportError(error);
    }
  }

  private exportImage() {
    try {
      // EChartsインスタンスから画像を生成
      const chartInstance = this.getChartInstance();
      if (!chartInstance) {
        throw new Error('チャートインスタンスが見つかりません');
      }

      const dataURL = chartInstance.getDataURL({
        type: this.selectedImageFormat,
        pixelRatio: 2,
        backgroundColor: '#fff'
      });

      this.downloadDataURL(dataURL, `${this.fileName}.${this.selectedImageFormat}`);

      this.messageService.add({
        severity: 'success',
        summary: 'エクスポート完了',
        detail: '画像ファイルをダウンロードしました'
      });
    } catch (error) {
      this.handleExportError(error);
    }
  }

  private exportPDF() {
    try {
      // 注意: 実際のPDF生成にはjsPDFなどのライブラリが必要
      // ここではプレースホルダー実装

      const content = this.generatePDFContent();
      const blob = new Blob([content], { type: 'application/pdf' });
      this.downloadBlob(blob, `${this.fileName}.pdf`);

      this.messageService.add({
        severity: 'info',
        summary: 'PDF生成',
        detail: 'PDF生成機能は開発中です'
      });
    } catch (error) {
      this.handleExportError(error);
    }
  }

  private getChartInstance(): any {
    // 実際の実装では、チャートコンポーネントからインスタンスを取得
    // ここではプレースホルダー
    return null;
  }

  private generatePDFContent(): string {
    // 簡易的なPDFコンテンツ生成
    const data = this.dataService.data();
    return `PDF Report\n\nData: ${JSON.stringify(data, null, 2)}`;
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private downloadDataURL(dataURL: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private handleExportError(error: any) {
    console.error('Export error:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'エクスポートエラー',
      detail: 'エクスポート中にエラーが発生しました'
    });
  }
}
```

## レスポンシブ対応

### 1. レスポンシブダッシュボード

```typescript
// responsive-dashboard.component.ts
import { Component, signal, computed, HostListener } from '@angular/core';
import { Panel } from 'primeng/panel';
import { Sidebar } from 'primeng/sidebar';
import { Button } from 'primeng/button';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-responsive-dashboard',
  standalone: true,
  imports: [Panel, Sidebar, Button, NgxEchartsModule],
  template: `
    <div class="responsive-dashboard" [class]="layoutClass()">
      <!-- モバイル用ヘッダー -->
      <div class="mobile-header" *ngIf="isMobile()">
        <h1>ダッシュボード</h1>
        <p-button
          icon="pi pi-bars"
          (onClick)="sidebarVisible = true"
          class="menu-button">
        </p-button>
      </div>

      <!-- サイドバー -->
      <p-sidebar
        [(visible)]="sidebarVisible"
        [modal]="isMobile()"
        [position]="'left'"
        [style]="sidebarStyle()">
        <div class="sidebar-content">
          <!-- フィルターコンポーネント -->
          <p-panel header="フィルター" [toggleable]="true">
            <div class="filter-controls">
              <!-- フィルター要素 -->
            </div>
          </p-panel>
        </div>
      </p-sidebar>

      <!-- メインコンテンツ -->
      <div class="main-content" [style]="mainContentStyle()">
        <!-- KPIカード -->
        <div class="kpi-grid" [class]="kpiGridClass()">
          <p-panel class="kpi-card">
            <div class="kpi-content">
              <h3>売上</h3>
              <div class="kpi-value">¥12,450,000</div>
            </div>
          </p-panel>

          <p-panel class="kpi-card">
            <div class="kpi-content">
              <h3>注文数</h3>
              <div class="kpi-value">1,234</div>
            </div>
          </p-panel>
        </div>

        <!-- チャートグリッド -->
        <div class="chart-grid" [class]="chartGridClass()">
          <p-panel header="売上推移" class="chart-panel">
            <div echarts
                 [options]="chartOptions()"
                 [style]="chartStyle()">
            </div>
          </p-panel>

          <p-panel header="カテゴリ分析" class="chart-panel">
            <div echarts
                 [options]="pieChartOptions()"
                 [style]="chartStyle()">
            </div>
          </p-panel>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .responsive-dashboard {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .responsive-dashboard.desktop {
      flex-direction: row;
    }

    .mobile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--surface-50);
      border-bottom: 1px solid var(--surface-200);
    }

    .menu-button {
      width: 40px;
      height: 40px;
    }

    .sidebar-content {
      padding: 1rem;
    }

    .main-content {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }

    .kpi-grid {
      display: grid;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .kpi-grid.mobile {
      grid-template-columns: 1fr;
    }

    .kpi-grid.tablet {
      grid-template-columns: 1fr 1fr;
    }

    .kpi-grid.desktop {
      grid-template-columns: repeat(4, 1fr);
    }

    .chart-grid {
      display: grid;
      gap: 1rem;
    }

    .chart-grid.mobile {
      grid-template-columns: 1fr;
    }

    .chart-grid.tablet {
      grid-template-columns: 1fr;
    }

    .chart-grid.desktop {
      grid-template-columns: 1fr 1fr;
    }

    .kpi-content {
      text-align: center;
      padding: 1rem;
    }

    .kpi-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color);
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .kpi-value {
        font-size: 1.2rem;
      }
    }
  `]
})
export class ResponsiveDashboardComponent {
  sidebarVisible = false;

  // 画面サイズの検出
  private readonly screenWidth = signal(window.innerWidth);

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth.set(event.target.innerWidth);
  }

  // デバイスタイプの判定
  readonly deviceType = computed(() => {
    const width = this.screenWidth();
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  readonly isMobile = computed(() => this.deviceType() === 'mobile');
  readonly isTablet = computed(() => this.deviceType() === 'tablet');
  readonly isDesktop = computed(() => this.deviceType() === 'desktop');

  // レイアウトクラス
  readonly layoutClass = computed(() => this.deviceType());
  readonly kpiGridClass = computed(() => this.deviceType());
  readonly chartGridClass = computed(() => this.deviceType());

  // スタイル計算
  readonly sidebarStyle = computed(() => {
    const device = this.deviceType();
    if (device === 'mobile') {
      return { width: '280px' };
    }
    return { width: '300px', position: 'relative' };
  });

  readonly mainContentStyle = computed(() => {
    const device = this.deviceType();
    if (device === 'desktop' && !this.isMobile()) {
      return { 'margin-left': '300px' };
    }
    return {};
  });

  readonly chartStyle = computed(() => {
    const device = this.deviceType();
    const baseHeight = device === 'mobile' ? '250px' : '300px';
    return {
      width: '100%',
      height: baseHeight
    };
  });

  // チャートオプション（レスポンシブ対応）
  readonly chartOptions = computed(() => {
    const device = this.deviceType();
    const isMobile = device === 'mobile';

    return {
      title: {
        text: '売上推移',
        left: 'center',
        textStyle: {
          fontSize: isMobile ? 14 : 16
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: isMobile ? '15%' : '10%',
        right: isMobile ? '15%' : '10%',
        bottom: isMobile ? '15%' : '10%'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月'],
        axisLabel: {
          fontSize: isMobile ? 10 : 12,
          rotate: isMobile ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: isMobile ? 10 : 12,
          formatter: isMobile ? '{value}' : '{value}万円'
        }
      },
      series: [{
        name: '売上',
        type: 'line',
        data: [820, 932, 901, 934, 1290],
        smooth: true
      }]
    };
  });

  readonly pieChartOptions = computed(() => {
    const device = this.deviceType();
    const isMobile = device === 'mobile';

    return {
      title: {
        text: 'カテゴリ分析',
        left: 'center',
        textStyle: {
          fontSize: isMobile ? 14 : 16
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: isMobile ? 'horizontal' : 'vertical',
        left: isMobile ? 'center' : 'left',
        bottom: isMobile ? 0 : 'auto'
      },
      series: [{
        name: 'カテゴリ',
        type: 'pie',
        radius: isMobile ? '40%' : '50%',
        data: [
          { value: 1048, name: '電子機器' },
          { value: 735, name: '衣料品' },
          { value: 580, name: '書籍' },
          { value: 484, name: 'その他' }
        ]
      }]
    };
  });
}
```

## 💡 統合開発のベストプラクティス

### 1. パフォーマンス最適化

```typescript
// OnPush戦略とSignalsの組み合わせ
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class OptimizedDashboardComponent {
  // Signalsは自動的にOnPush戦略と連携
  readonly optimizedData = computed(() => {
    // 重い計算処理も依存関係変更時のみ実行
    return this.expensiveCalculation();
  });
}
```

### 2. エラーハンドリング

```typescript
// 統合エラーハンドリング
@Component({
  providers: [MessageService],
  // ...
})
export class ErrorHandlingDashboardComponent {
  constructor(private messageService: MessageService) {}

  handleChartError(error: any) {
    console.error('Chart error:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'チャートエラー',
      detail: 'チャートの表示でエラーが発生しました'
    });
  }

  handleDataError(error: any) {
    console.error('Data error:', error);
    this.messageService.add({
      severity: 'warn',
      summary: 'データエラー',
      detail: 'データの取得でエラーが発生しました'
    });
  }
}
```

## 次のステップ

1. **コンポーネント詳細**: [PrimeNGコンポーネント実装例](../components/)
2. **テーマカスタマイズ**: [PrimeNGテーマガイド](../theming/)
3. **実装参考**: [棒グラフ実装例](../../examples/bar-chart.md)

---

> 💡 **ポイント**: PrimeNGとEChartsの統合では、Angular SignalsとPrimeNGのリアクティブ機能を組み合わせることで、パフォーマンスが高く保守性の良いダッシュボードを構築できます。オフライン環境では、このガイドを参照してベストプラクティスを活用してください。