# 棒グラフ (Bar Chart) 実装ガイド

棒グラフは最も基本的で使用頻度の高いチャートタイプです。このガイドでは、基本的な実装から高度なカスタマイズまでを段階的に説明します。

## 📖 目次

1. [基本的な棒グラフ](#基本的な棒グラフ)
2. [データの動的更新](#データの動的更新)
3. [スタイルカスタマイズ](#スタイルカスタマイズ)
4. [インタラクション機能](#インタラクション機能)
5. [積み上げ棒グラフ](#積み上げ棒グラフ)
6. [横向き棒グラフ](#横向き棒グラフ)
7. [複数系列棒グラフ](#複数系列棒グラフ)

## 基本的な棒グラフ

### 1. 最小限の実装

```typescript
// basic-bar-chart.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-basic-bar-chart',
  standalone: true,
  imports: [NgxEchartsModule],
  template: `
    <div echarts [options]="chartOptions" class="chart"></div>
  `,
  styles: [`
    .chart {
      width: 100%;
      height: 400px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicBarChartComponent {
  readonly chartOptions: EChartsOption = {
    title: {
      text: '月別売上データ',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
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
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110]
    }]
  };
}
```

### 2. Signalsを使用したリアクティブ版

```typescript
// reactive-bar-chart.component.ts
import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

interface SalesData {
  month: string;
  sales: number;
}

@Component({
  selector: 'app-reactive-bar-chart',
  standalone: true,
  imports: [NgxEchartsModule],
  template: `
    <div class="controls">
      <button (click)="addMonth()">月を追加</button>
      <button (click)="updateData()">データ更新</button>
      <button (click)="removeLastMonth()">最後の月を削除</button>
    </div>

    <div echarts [options]="chartOptions()" class="chart"></div>

    <div class="info">
      <p>合計売上: {{ totalSales() }}万円</p>
      <p>平均売上: {{ averageSales() }}万円</p>
    </div>
  `,
  styles: [`
    .controls {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
    }

    button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #f5f5f5;
      cursor: pointer;
    }

    button:hover {
      background: #e5e5e5;
    }

    .chart {
      width: 100%;
      height: 400px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .info {
      padding: 16px;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .info p {
      margin: 8px 0;
      font-weight: bold;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveBarChartComponent {
  // リアクティブなデータストア
  private readonly salesData = signal<SalesData[]>([
    { month: '1月', sales: 120 },
    { month: '2月', sales: 200 },
    { month: '3月', sales: 150 },
    { month: '4月', sales: 80 },
    { month: '5月', sales: 70 },
    { month: '6月', sales: 110 }
  ]);

  // 計算プロパティ
  readonly months = computed(() => this.salesData().map(d => d.month));
  readonly sales = computed(() => this.salesData().map(d => d.sales));

  readonly totalSales = computed(() =>
    this.sales().reduce((sum, value) => sum + value, 0)
  );

  readonly averageSales = computed(() => {
    const total = this.totalSales();
    const count = this.sales().length;
    return count > 0 ? Math.round(total / count) : 0;
  });

  // チャートオプション
  readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: '月別売上データ（リアクティブ）',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}<br/>${data.seriesName}: ${data.value}万円`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: this.months(),
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '売上 (万円)',
      nameLocation: 'middle',
      nameGap: 50
    },
    series: [{
      name: '売上',
      type: 'bar',
      data: this.sales(),
      itemStyle: {
        color: '#5470c6',
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: {
          color: '#3ba0ff'
        }
      },
      animationDelay: (idx: number) => idx * 100,
      animationEasing: 'elasticOut'
    }]
  }));

  // インタラクションメソッド
  addMonth() {
    const currentData = this.salesData();
    const nextMonthNum = currentData.length + 1;

    if (nextMonthNum <= 12) {
      const newMonth = `${nextMonthNum}月`;
      const newSales = Math.floor(Math.random() * 200) + 50;

      this.salesData.set([
        ...currentData,
        { month: newMonth, sales: newSales }
      ]);
    }
  }

  updateData() {
    const currentData = this.salesData();
    const updatedData = currentData.map(item => ({
      ...item,
      sales: Math.floor(Math.random() * 250) + 50
    }));

    this.salesData.set(updatedData);
  }

  removeLastMonth() {
    const currentData = this.salesData();
    if (currentData.length > 1) {
      this.salesData.set(currentData.slice(0, -1));
    }
  }
}
```

## データの動的更新

### リアルタイムデータ更新

```typescript
// realtime-bar-chart.component.ts
import { Component, signal, computed, effect, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'app-realtime-bar-chart',
  template: `
    <div class="controls">
      <button (click)="toggleRealtime()">
        {{ isRealtime() ? 'リアルタイム停止' : 'リアルタイム開始' }}
      </button>
      <button (click)="resetData()">リセット</button>
    </div>

    <div echarts [options]="chartOptions()" class="chart"></div>

    <div class="status">
      ステータス: {{ isRealtime() ? 'リアルタイム更新中...' : '停止中' }}
    </div>
  `,
  styles: [`
    .controls { margin-bottom: 20px; }
    .chart { width: 100%; height: 400px; margin-bottom: 20px; }
    .status {
      padding: 8px 12px;
      background: #f0f0f0;
      border-radius: 4px;
      font-weight: bold;
    }
  `]
})
export class RealtimeBarChartComponent {
  private readonly destroyRef = inject(DestroyRef);

  // 状態管理
  private readonly isRealtime = signal(false);
  private readonly data = signal<number[]>([
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100
  ]);

  readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'リアルタイム棒グラフ',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const value = params[0].value;
        return `サーバー${params[0].dataIndex + 1}<br/>CPU使用率: ${value.toFixed(1)}%`;
      }
    },
    xAxis: {
      type: 'category',
      data: ['サーバー1', 'サーバー2', 'サーバー3', 'サーバー4', 'サーバー5']
    },
    yAxis: {
      type: 'value',
      max: 100,
      name: 'CPU使用率 (%)'
    },
    series: [{
      name: 'CPU使用率',
      type: 'bar',
      data: this.data(),
      itemStyle: {
        color: (params: any) => {
          const value = params.value;
          if (value > 80) return '#ff4d4f';  // 危険（赤）
          if (value > 60) return '#faad14';  // 注意（黄）
          return '#52c41a';  // 正常（緑）
        }
      },
      animationDuration: 300,
      animationEasing: 'linear'
    }]
  }));

  constructor() {
    // リアルタイム更新の管理
    effect(() => {
      if (this.isRealtime()) {
        const subscription = interval(1000)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.updateData();
          });
      }
    });
  }

  toggleRealtime() {
    this.isRealtime.update(current => !current);
  }

  resetData() {
    this.data.set([50, 30, 40, 60, 35]);
  }

  private updateData() {
    this.data.update(current =>
      current.map(value => {
        // ランダムな変動を追加（前の値の±20%以内）
        const change = (Math.random() - 0.5) * 40;
        return Math.max(0, Math.min(100, value + change));
      })
    );
  }
}
```

## スタイルカスタマイズ

### グラデーション効果

```typescript
// gradient-bar-chart.component.ts
@Component({
  selector: 'app-gradient-bar-chart',
  template: `<div echarts [options]="chartOptions" class="chart"></div>`
})
export class GradientBarChartComponent {
  readonly chartOptions: EChartsOption = {
    title: {
      text: 'グラデーション棒グラフ',
      left: 'center'
    },
    xAxis: {
      type: 'category',
      data: ['製品A', '製品B', '製品C', '製品D', '製品E']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'bar',
      data: [320, 280, 350, 400, 290],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ]
        },
        borderRadius: [8, 8, 0, 0],
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10,
        shadowOffsetY: 4
      },
      emphasis: {
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#f093fb' },
              { offset: 0.5, color: '#f5576c' },
              { offset: 1, color: '#f5576c' }
            ]
          }
        }
      }
    }]
  };
}
```

### 条件付きスタイリング

```typescript
// conditional-style-bar-chart.component.ts
@Component({
  selector: 'app-conditional-style-bar-chart',
  template: `<div echarts [options]="chartOptions()" class="chart"></div>`
})
export class ConditionalStyleBarChartComponent {
  private readonly data = signal([
    { name: '目標A', value: 85, target: 80 },
    { name: '目標B', value: 75, target: 90 },
    { name: '目標C', value: 95, target: 70 },
    { name: '目標D', value: 65, target: 80 },
    { name: '目標E', value: 90, target: 85 }
  ]);

  readonly chartOptions = computed<EChartsOption>(() => {
    const chartData = this.data();

    return {
      title: {
        text: '目標達成状況',
        left: 'center'
      },
      tooltip: {
        formatter: (params: any) => {
          const dataItem = chartData[params.dataIndex];
          const status = dataItem.value >= dataItem.target ? '達成' : '未達成';
          return `${params.name}<br/>
                  実績: ${dataItem.value}%<br/>
                  目標: ${dataItem.target}%<br/>
                  状況: ${status}`;
        }
      },
      xAxis: {
        type: 'category',
        data: chartData.map(d => d.name)
      },
      yAxis: {
        type: 'value',
        max: 100,
        name: '達成率 (%)'
      },
      series: [
        {
          name: '実績',
          type: 'bar',
          data: chartData.map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: item.value >= item.target ? '#52c41a' : '#ff4d4f',
              borderRadius: [4, 4, 0, 0]
            }
          }))
        },
        {
          name: '目標',
          type: 'line',
          data: chartData.map(d => d.target),
          lineStyle: {
            color: '#faad14',
            width: 3,
            type: 'dashed'
          },
          symbol: 'circle',
          symbolSize: 8,
          symbolStyle: {
            color: '#faad14'
          }
        }
      ]
    };
  });
}
```

## インタラクション機能

### クリックイベント処理

```typescript
// interactive-bar-chart.component.ts
@Component({
  selector: 'app-interactive-bar-chart',
  template: `
    <div echarts
         [options]="chartOptions()"
         (chartClick)="onBarClick($event)"
         (chartMouseOver)="onBarHover($event)"
         class="chart"></div>

    <div class="selected-info" *ngIf="selectedItem()">
      <h3>選択された項目</h3>
      <p><strong>名前:</strong> {{ selectedItem()?.name }}</p>
      <p><strong>値:</strong> {{ selectedItem()?.value }}</p>
      <p><strong>インデックス:</strong> {{ selectedItem()?.index }}</p>
    </div>
  `,
  styles: [`
    .chart { width: 100%; height: 400px; margin-bottom: 20px; }
    .selected-info {
      padding: 16px;
      border: 2px solid #1890ff;
      border-radius: 8px;
      background: #f0f9ff;
    }
  `]
})
export class InteractiveBarChartComponent {
  private readonly data = signal([
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 200 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 80 },
    { name: 'May', value: 70 }
  ]);

  private readonly selectedIndex = signal<number | null>(null);

  readonly selectedItem = computed(() => {
    const index = this.selectedIndex();
    return index !== null ? {
      ...this.data()[index],
      index
    } : null;
  });

  readonly chartOptions = computed<EChartsOption>(() => {
    const selectedIdx = this.selectedIndex();

    return {
      title: {
        text: 'インタラクティブ棒グラフ',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          return `${params[0].name}<br/>値: ${params[0].value}<br/>クリックで詳細表示`;
        }
      },
      xAxis: {
        type: 'category',
        data: this.data().map(d => d.name)
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        type: 'bar',
        data: this.data().map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: selectedIdx === index ? '#ff7875' : '#69b7ff',
            borderWidth: selectedIdx === index ? 3 : 0,
            borderColor: '#ff4d4f'
          }
        })),
        cursor: 'pointer'
      }]
    };
  });

  onBarClick(event: any) {
    if (event.componentType === 'series') {
      this.selectedIndex.set(event.dataIndex);
    }
  }

  onBarHover(event: any) {
    console.log('Hovered:', event);
  }
}
```

## 積み上げ棒グラフ

```typescript
// stacked-bar-chart.component.ts
@Component({
  selector: 'app-stacked-bar-chart',
  template: `<div echarts [options]="chartOptions" class="chart"></div>`
})
export class StackedBarChartComponent {
  readonly chartOptions: EChartsOption = {
    title: {
      text: '売上構成比（積み上げ棒グラフ）',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        let result = `${params[0].name}<br/>`;
        let total = 0;
        params.forEach((param: any) => {
          total += param.value;
          result += `${param.seriesName}: ${param.value}万円<br/>`;
        });
        result += `合計: ${total}万円`;
        return result;
      }
    },
    legend: {
      data: ['製品A', '製品B', '製品C'],
      top: 'bottom'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Q1', 'Q2', 'Q3', 'Q4']
    },
    yAxis: {
      type: 'value',
      name: '売上 (万円)'
    },
    series: [
      {
        name: '製品A',
        type: 'bar',
        stack: 'total',
        data: [120, 132, 101, 134],
        itemStyle: { color: '#5470c6' }
      },
      {
        name: '製品B',
        type: 'bar',
        stack: 'total',
        data: [220, 182, 191, 234],
        itemStyle: { color: '#91cc75' }
      },
      {
        name: '製品C',
        type: 'bar',
        stack: 'total',
        data: [150, 232, 201, 154],
        itemStyle: { color: '#fac858' }
      }
    ]
  };
}
```

## 横向き棒グラフ

```typescript
// horizontal-bar-chart.component.ts
@Component({
  selector: 'app-horizontal-bar-chart',
  template: `<div echarts [options]="chartOptions" class="chart"></div>`
})
export class HorizontalBarChartComponent {
  readonly chartOptions: EChartsOption = {
    title: {
      text: '部門別予算配分',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '15%',
      right: '10%',
      top: '15%',
      bottom: '10%'
    },
    xAxis: {
      type: 'value',
      name: '予算 (百万円)',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'category',
      data: ['開発部', '営業部', 'マーケティング部', '総務部', '人事部'],
      axisLabel: {
        interval: 0
      }
    },
    series: [{
      name: '予算',
      type: 'bar',
      data: [50, 80, 35, 25, 30],
      itemStyle: {
        color: '#73c0de',
        borderRadius: [0, 8, 8, 0]
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{c}M円'
      }
    }]
  };
}
```

## 複数系列棒グラフ

```typescript
// multi-series-bar-chart.component.ts
@Component({
  selector: 'app-multi-series-bar-chart',
  template: `<div echarts [options]="chartOptions" class="chart"></div>`
})
export class MultiSeriesBarChartComponent {
  readonly chartOptions: EChartsOption = {
    title: {
      text: '四半期売上比較',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['2023年', '2024年'],
      top: 'bottom'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Q1', 'Q2', 'Q3', 'Q4'],
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: {
      type: 'value',
      name: '売上 (百万円)'
    },
    series: [
      {
        name: '2023年',
        type: 'bar',
        data: [320, 302, 301, 334],
        itemStyle: {
          color: '#5470c6'
        }
      },
      {
        name: '2024年',
        type: 'bar',
        data: [420, 382, 391, 454],
        itemStyle: {
          color: '#91cc75'
        }
      }
    ]
  };
}
```

## 💡 実装のポイント

### 1. パフォーマンス最適化

```typescript
// 大量データの場合
const largeDataOptions: EChartsOption = {
  series: [{
    type: 'bar',
    large: true,           // 大量データモード
    largeThreshold: 2000,  // 閾値
    data: largeDataset,
    sampling: 'lttb'       // データサンプリング
  }]
};
```

### 2. レスポンシブ対応

```typescript
// メディアクエリを使用した応答性
const responsiveOptions: EChartsOption = {
  media: [
    {
      query: { maxWidth: 600 },
      option: {
        grid: { left: '10%', right: '10%' },
        title: { textStyle: { fontSize: 14 } }
      }
    },
    {
      query: { minWidth: 600 },
      option: {
        grid: { left: '5%', right: '5%' },
        title: { textStyle: { fontSize: 18 } }
      }
    }
  ]
};
```

### 3. アクセシビリティ

```typescript
const accessibleOptions: EChartsOption = {
  aria: {
    enabled: true,
    decal: { show: true },  // パターン追加（色覚多様性対応）
  },
  series: [{
    type: 'bar',
    data: data,
    label: {
      show: true,  // 値を表示
      position: 'top'
    }
  }]
};
```

## 次のステップ

1. **折れ線グラフ**: [折れ線グラフの実装](./line-chart.md)
2. **円グラフ**: [円グラフの実装](./pie-chart.md)
3. **複合チャート**: [複合チャートの実装](./combination-charts.md)

---

> 💡 **ポイント**: 棒グラフは最も使用頻度が高いチャートタイプです。基本的な実装をマスターした後、インタラクション機能やスタイルカスタマイズを追加して、より魅力的で使いやすいチャートを作成しましょう。