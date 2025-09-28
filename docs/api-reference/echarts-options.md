# EChartsオプション完全リファレンス

オフライン環境でのECharts開発に必要な設定オプションの包括的なリファレンスです。よく使用される設定から高度な設定まで、実用的な例とともに説明します。

## 📖 目次

1. [基本構造](#基本構造)
2. [タイトル (title)](#タイトル-title)
3. [凡例 (legend)](#凡例-legend)
4. [グリッド (grid)](#グリッド-grid)
5. [軸 (xAxis/yAxis)](#軸-xaxisyaxis)
6. [シリーズ (series)](#シリーズ-series)
7. [ツールチップ (tooltip)](#ツールチップ-tooltip)
8. [ツールボックス (toolbox)](#ツールボックス-toolbox)
9. [データズーム (dataZoom)](#データズーム-datazoom)
10. [アニメーション](#アニメーション)

## 基本構造

### EChartsOption型の基本構造

```typescript
import type { EChartsOption } from 'echarts';

const option: EChartsOption = {
  // グローバル設定
  backgroundColor: string,
  color: string[],
  animation: boolean,

  // コンポーネント
  title: TitleOption,
  legend: LegendOption,
  grid: GridOption,
  xAxis: XAXisOption,
  yAxis: YAXisOption,
  series: SeriesOption[],
  tooltip: TooltipOption,
  toolbox: ToolboxOption,
  dataZoom: DataZoomOption[],

  // レスポンシブ
  media: MediaOption[],

  // アクセシビリティ
  aria: AriaOption
};
```

### 最小限の設定例

```typescript
const minimalOption: EChartsOption = {
  xAxis: { type: 'category', data: ['A', 'B', 'C'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [1, 2, 3] }]
};
```

## タイトル (title)

### 基本設定

```typescript
interface TitleOption {
  show?: boolean;
  text?: string;
  link?: string;
  target?: 'self' | 'blank';

  // サブタイトル
  subtext?: string;
  sublink?: string;
  subtarget?: 'self' | 'blank';

  // 位置
  left?: 'auto' | 'left' | 'center' | 'right' | string | number;
  top?: 'auto' | 'top' | 'middle' | 'bottom' | string | number;
  right?: 'auto' | string | number;
  bottom?: 'auto' | string | number;

  // スタイル
  textStyle?: TextStyleOption;
  subtextStyle?: TextStyleOption;

  // 余白
  padding?: number | number[];
  itemGap?: number;

  // 背景
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number | number[];
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}
```

### 実用例

```typescript
// 基本的なタイトル
const basicTitle: TitleOption = {
  text: '売上データ',
  left: 'center',
  top: 20
};

// 詳細なタイトル設定
const detailedTitle: TitleOption = {
  text: '2024年 月別売上レポート',
  subtext: 'データ更新: 2024/12/01',
  left: 'center',
  top: 10,
  textStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  subtextStyle: {
    fontSize: 12,
    color: '#666'
  },
  itemGap: 10,
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  padding: [15, 20]
};

// リンク付きタイトル
const linkedTitle: TitleOption = {
  text: 'ダッシュボードに戻る',
  link: '/dashboard',
  target: 'self',
  left: 'left',
  textStyle: {
    color: '#1890ff',
    textDecoration: 'underline'
  }
};
```

## 凡例 (legend)

### 基本設定

```typescript
interface LegendOption {
  show?: boolean;
  zlevel?: number;
  z?: number;

  // 位置
  left?: 'auto' | 'left' | 'center' | 'right' | string | number;
  top?: 'auto' | 'top' | 'middle' | 'bottom' | string | number;
  right?: 'auto' | string | number;
  bottom?: 'auto' | string | number;
  width?: 'auto' | string | number;
  height?: 'auto' | string | number;

  // 方向とレイアウト
  orient?: 'horizontal' | 'vertical';
  align?: 'auto' | 'left' | 'right';
  padding?: number | number[];
  itemGap?: number;
  itemWidth?: number;
  itemHeight?: number;

  // データ
  data?: (string | LegendDataOption)[];

  // スタイル
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number | number[];
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // アイコン
  icon?: string;

  // テキストスタイル
  textStyle?: TextStyleOption;

  // インタラクション
  selectedMode?: boolean | 'single' | 'multiple';
  inactiveColor?: string;
  selected?: Record<string, boolean>;

  // ページング
  type?: 'plain' | 'scroll';
  scrollDataIndex?: number;
  pageButtonItemGap?: number;
  pageButtonGap?: number;
  pageButtonPosition?: 'start' | 'end';
  pageFormatter?: string | ((current: number, total: number) => string);
  pageIcons?: {
    horizontal?: string[];
    vertical?: string[];
  };
  pageIconColor?: string;
  pageIconInactiveColor?: string;
  pageIconSize?: number | number[];
  pageTextStyle?: TextStyleOption;

  // アニメーション
  animation?: boolean;
  animationDuration?: number;
}
```

### 実用例

```typescript
// 基本的な凡例
const basicLegend: LegendOption = {
  data: ['売上', '利益', '顧客数'],
  top: 'bottom',
  left: 'center'
};

// 縦方向凡例
const verticalLegend: LegendOption = {
  orient: 'vertical',
  left: 'right',
  top: 'center',
  data: ['製品A', '製品B', '製品C'],
  textStyle: {
    fontSize: 14
  }
};

// カスタムアイコン凡例
const customIconLegend: LegendOption = {
  data: [
    {
      name: '実績',
      icon: 'rect',
      textStyle: { color: '#333' }
    },
    {
      name: '予測',
      icon: 'circle',
      textStyle: { color: '#666' }
    }
  ],
  itemWidth: 20,
  itemHeight: 14,
  itemGap: 20
};

// スクロール可能な凡例
const scrollableLegend: LegendOption = {
  type: 'scroll',
  orient: 'horizontal',
  top: 'bottom',
  data: Array.from({ length: 20 }, (_, i) => `シリーズ${i + 1}`),
  pageButtonItemGap: 5,
  pageButtonPosition: 'end'
};
```

## グリッド (grid)

### 基本設定

```typescript
interface GridOption {
  show?: boolean;
  zlevel?: number;
  z?: number;

  // 位置とサイズ
  left?: string | number;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  width?: string | number;
  height?: string | number;

  // ラベル含有
  containLabel?: boolean;

  // 背景
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;

  // 影
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // ツールチップ
  tooltip?: TooltipOption;
}
```

### 実用例

```typescript
// 基本的なグリッド
const basicGrid: GridOption = {
  left: '10%',
  right: '10%',
  top: '15%',
  bottom: '10%',
  containLabel: true
};

// 複数グリッド（複数チャート）
const multipleGrids: GridOption[] = [
  {
    left: '7%',
    right: '55%',
    top: '7%',
    bottom: '60%'
  },
  {
    left: '55%',
    right: '7%',
    top: '7%',
    bottom: '60%'
  },
  {
    left: '7%',
    right: '7%',
    top: '60%',
    bottom: '7%'
  }
];

// スタイル付きグリッド
const styledGrid: GridOption = {
  left: 60,
  right: 60,
  top: 60,
  bottom: 60,
  backgroundColor: '#f8f9fa',
  borderColor: '#dee2e6',
  borderWidth: 1,
  shadowBlur: 10,
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffsetX: 2,
  shadowOffsetY: 2
};
```

## 軸 (xAxis/yAxis)

### 基本設定

```typescript
interface AxisOption {
  show?: boolean;
  gridIndex?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;

  // 軸タイプ
  type?: 'value' | 'category' | 'time' | 'log';
  name?: string;
  nameLocation?: 'start' | 'middle' | 'center' | 'end';
  nameTextStyle?: TextStyleOption;
  nameGap?: number;
  nameRotate?: number;

  // 範囲
  min?: number | string | ((value: { min: number; max: number }) => number);
  max?: number | string | ((value: { min: number; max: number }) => number);
  scale?: boolean;

  // データ
  data?: (string | number | CategoryData)[];

  // 分割
  splitNumber?: number;
  interval?: number | 'auto';
  minInterval?: number;
  maxInterval?: number;

  // ライン
  axisLine?: {
    show?: boolean;
    onZero?: boolean;
    onZeroAxisIndex?: number;
    symbol?: string | string[];
    symbolSize?: number[];
    symbolOffset?: number[];
    lineStyle?: LineStyleOption;
  };

  // 目盛り
  axisTick?: {
    show?: boolean;
    alignWithLabel?: boolean;
    interval?: number | 'auto' | ((index: number, value: string) => boolean);
    inside?: boolean;
    length?: number;
    lineStyle?: LineStyleOption;
  };

  // ラベル
  axisLabel?: {
    show?: boolean;
    interval?: number | 'auto' | ((index: number, value: string) => boolean);
    inside?: boolean;
    rotate?: number;
    margin?: number;
    formatter?: string | ((value: any, index: number) => string);
    showMinLabel?: boolean;
    showMaxLabel?: boolean;
    hideOverlap?: boolean;
    color?: string | ((value: any, index: number) => string);
    fontStyle?: 'normal' | 'italic' | 'oblique';
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
    fontFamily?: string;
    fontSize?: number;
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    lineHeight?: number;
    backgroundColor?: string | {
      image: string;
    };
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number | number[];
    padding?: number | number[];
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    width?: number;
    height?: number;
    textBorderColor?: string;
    textBorderWidth?: number;
    textShadowColor?: string;
    textShadowBlur?: number;
    textShadowOffsetX?: number;
    textShadowOffsetY?: number;
    overflow?: 'truncate' | 'break' | 'breakAll';
    ellipsis?: string;
  };

  // 分割線
  splitLine?: {
    show?: boolean;
    interval?: number | 'auto' | ((index: number, value: string) => boolean);
    lineStyle?: LineStyleOption;
  };

  // 分割エリア
  splitArea?: {
    show?: boolean;
    interval?: number | 'auto' | ((index: number, value: string) => boolean);
    areaStyle?: AreaStyleOption;
  };

  // ポインター
  axisPointer?: AxisPointerOption;

  // アニメーション
  animation?: boolean;
  animationThreshold?: number;
  animationDuration?: number | ((index: number) => number);
  animationEasing?: string;
  animationDelay?: number | ((index: number) => number);
  animationDurationUpdate?: number | ((index: number) => number);
  animationEasingUpdate?: string;
  animationDelayUpdate?: number | ((index: number) => number);
}
```

### 実用例

```typescript
// 基本的な軸設定
const basicAxes = {
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月']
  },
  yAxis: {
    type: 'value',
    name: '売上 (万円)'
  }
};

// 詳細な軸設定
const detailedAxes = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    name: '曜日',
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: {
      fontSize: 14,
      fontWeight: 'bold'
    },
    axisLabel: {
      rotate: 45,
      fontSize: 12,
      color: '#666'
    },
    axisTick: {
      alignWithLabel: true
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#e0e0e0'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: '値',
    min: 0,
    max: 100,
    interval: 20,
    axisLabel: {
      formatter: '{value}%'
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)']
      }
    }
  }
};

// 時間軸
const timeAxis = {
  xAxis: {
    type: 'time',
    axisLabel: {
      formatter: {
        year: '{yyyy}',
        month: '{MMM}',
        day: '{d}',
        hour: '{HH}:{mm}',
        minute: '{HH}:{mm}',
        second: '{HH}:{mm}:{ss}',
        millisecond: '{hh}:{mm}:{ss} {SSS}',
        none: '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}'
      }
    }
  }
};

// 対数軸
const logAxis = {
  yAxis: {
    type: 'log',
    logBase: 10,
    min: 1,
    max: 100000,
    axisLabel: {
      formatter: (value: number) => {
        if (value === 1) return '1';
        if (value === 10) return '10';
        if (value === 100) return '100';
        if (value === 1000) return '1K';
        if (value === 10000) return '10K';
        if (value === 100000) return '100K';
        return value.toString();
      }
    }
  }
};

// 複数Y軸
const multipleYAxes = [
  {
    type: 'value',
    name: '降水量',
    position: 'left',
    axisLabel: {
      formatter: '{value} ml'
    }
  },
  {
    type: 'value',
    name: '温度',
    position: 'right',
    axisLabel: {
      formatter: '{value} °C'
    }
  }
];
```

## シリーズ (series)

### 基本的なシリーズタイプ

```typescript
// 棒グラフ
const barSeries: SeriesOption = {
  type: 'bar',
  name: '売上',
  data: [120, 200, 150, 80, 70],

  // スタイル
  itemStyle: {
    color: '#5470c6',
    borderRadius: [4, 4, 0, 0]
  },

  // 強調スタイル
  emphasis: {
    itemStyle: {
      color: '#3ba0ff'
    }
  },

  // ラベル
  label: {
    show: true,
    position: 'top',
    formatter: '{c}万円'
  },

  // アニメーション
  animationDelay: (idx: number) => idx * 100
};

// 折れ線グラフ
const lineSeries: SeriesOption = {
  type: 'line',
  name: '傾向',
  data: [820, 932, 901, 934, 1290],

  // 線スタイル
  lineStyle: {
    color: '#91cc75',
    width: 3,
    type: 'solid'
  },

  // ポイントスタイル
  symbol: 'circle',
  symbolSize: 8,

  // エリア塗りつぶし
  areaStyle: {
    color: {
      type: 'linear',
      x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: 'rgba(145, 204, 117, 0.8)' },
        { offset: 1, color: 'rgba(145, 204, 117, 0.1)' }
      ]
    }
  },

  // スムージング
  smooth: 0.3
};

// 円グラフ
const pieSeries: SeriesOption = {
  type: 'pie',
  name: 'シェア',
  radius: ['40%', '70%'],
  center: ['50%', '50%'],
  data: [
    { value: 335, name: '製品A' },
    { value: 310, name: '製品B' },
    { value: 234, name: '製品C' },
    { value: 135, name: '製品D' },
    { value: 1548, name: '製品E' }
  ],

  // ラベル
  label: {
    formatter: '{b}: {c} ({d}%)'
  },

  // 引き出し線
  labelLine: {
    show: true,
    length: 20,
    length2: 10
  },

  // 強調効果
  emphasis: {
    itemStyle: {
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowColor: 'rgba(0, 0, 0, 0.5)'
    }
  }
};

// 散布図
const scatterSeries: SeriesOption = {
  type: 'scatter',
  name: '相関',
  data: [
    [10.0, 8.04],
    [8.07, 6.95],
    [13.0, 7.58],
    [9.05, 8.81],
    [11.0, 8.33]
  ],

  // シンボルサイズ
  symbolSize: (data: number[]) => Math.sqrt(data[1]) * 5,

  // シンボルスタイル
  itemStyle: {
    color: 'rgba(255, 144, 128, 0.8)',
    shadowBlur: 10,
    shadowColor: 'rgba(120, 36, 50, 0.5)',
    shadowOffsetY: 5
  }
};
```

### 高度なシリーズ設定

```typescript
// 積み上げ棒グラフ
const stackedBarSeries: SeriesOption[] = [
  {
    name: '製品A',
    type: 'bar',
    stack: 'total',
    data: [120, 132, 101, 134]
  },
  {
    name: '製品B',
    type: 'bar',
    stack: 'total',
    data: [220, 182, 191, 234]
  }
];

// 複合チャート
const combinationSeries: SeriesOption[] = [
  {
    name: '売上',
    type: 'bar',
    yAxisIndex: 0,
    data: [2.0, 4.9, 7.0, 23.2, 25.6]
  },
  {
    name: '成長率',
    type: 'line',
    yAxisIndex: 1,
    data: [2.0, 2.2, 3.3, 4.5, 6.3]
  }
];
```

## ツールチップ (tooltip)

### 基本設定

```typescript
interface TooltipOption {
  show?: boolean;
  trigger?: 'item' | 'axis' | 'none';
  axisPointer?: AxisPointerOption;
  showContent?: boolean;
  alwaysShowContent?: boolean;
  triggerOn?: 'mousemove' | 'click' | 'mousemove|click' | 'none';
  showDelay?: number;
  hideDelay?: number;
  enterable?: boolean;
  renderMode?: 'html' | 'richText';
  confine?: boolean;
  appendToBody?: boolean;

  // 位置
  position?: string | number[] | ((point: number[], params: any, dom: HTMLElement, rect: any, size: any) => number[]);

  // スタイル
  formatter?: string | ((params: any, ticket: string, callback: (ticket: string, html: string) => void) => string);
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  padding?: number | number[];
  textStyle?: TextStyleOption;

  // 影
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // アニメーション
  animation?: boolean;
  animationDuration?: number;
  animationEasing?: string;
}
```

### 実用例

```typescript
// 基本的なツールチップ
const basicTooltip: TooltipOption = {
  trigger: 'axis',
  axisPointer: {
    type: 'shadow'
  }
};

// カスタムフォーマット
const customTooltip: TooltipOption = {
  trigger: 'item',
  formatter: (params: any) => {
    return `
      <div style="text-align: left;">
        <strong>${params.name}</strong><br/>
        ${params.seriesName}: ${params.value}万円<br/>
        割合: ${params.percent}%
      </div>
    `;
  },
  backgroundColor: 'rgba(50, 50, 50, 0.9)',
  borderColor: '#333',
  borderWidth: 1,
  textStyle: {
    color: '#fff',
    fontSize: 14
  }
};

// 複数シリーズ用
const multiSeriesTooltip: TooltipOption = {
  trigger: 'axis',
  formatter: (params: any[]) => {
    let result = `<strong>${params[0].name}</strong><br/>`;
    params.forEach(param => {
      result += `${param.seriesName}: ${param.value}<br/>`;
    });
    return result;
  }
};

// リッチテキスト
const richTooltip: TooltipOption = {
  renderMode: 'richText',
  formatter: (params: any) => {
    return [
      '{title|' + params.name + '}',
      '{value|値: ' + params.value + '}',
      '{percent|割合: ' + params.percent + '%}'
    ].join('\n');
  },
  rich: {
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333'
    },
    value: {
      fontSize: 14,
      color: '#666'
    },
    percent: {
      fontSize: 12,
      color: '#999'
    }
  }
};
```

## ツールボックス (toolbox)

### 基本設定

```typescript
interface ToolboxOption {
  show?: boolean;
  orient?: 'horizontal' | 'vertical';
  itemSize?: number;
  itemGap?: number;
  showTitle?: boolean;

  // 位置
  left?: string | number;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  width?: string | number;
  height?: string | number;

  // 機能
  feature?: {
    saveAsImage?: {
      show?: boolean;
      type?: 'png' | 'jpeg';
      name?: string;
      backgroundColor?: string;
      pixelRatio?: number;
      title?: string;
      icon?: string;
    };
    restore?: {
      show?: boolean;
      title?: string;
      icon?: string;
    };
    dataView?: {
      show?: boolean;
      title?: string;
      icon?: string;
      readOnly?: boolean;
      lang?: string[];
      backgroundColor?: string;
      textareaColor?: string;
      textareaBorderColor?: string;
      textColor?: string;
      buttonColor?: string;
      buttonTextColor?: string;
    };
    dataZoom?: {
      show?: boolean;
      title?: {
        zoom?: string;
        back?: string;
      };
      icon?: {
        zoom?: string;
        back?: string;
      };
      yAxisIndex?: number | number[] | 'all' | 'none' | false;
      xAxisIndex?: number | number[] | 'all' | 'none' | false;
    };
    magicType?: {
      show?: boolean;
      type?: ('line' | 'bar' | 'stack' | 'tiled')[];
      title?: {
        line?: string;
        bar?: string;
        stack?: string;
        tiled?: string;
      };
      icon?: {
        line?: string;
        bar?: string;
        stack?: string;
        tiled?: string;
      };
    };
  };
}
```

### 実用例

```typescript
// 基本的なツールボックス
const basicToolbox: ToolboxOption = {
  feature: {
    saveAsImage: {
      title: '画像として保存'
    },
    restore: {
      title: 'リセット'
    }
  }
};

// 完全なツールボックス
const fullToolbox: ToolboxOption = {
  left: 'right',
  top: 'top',
  feature: {
    saveAsImage: {
      type: 'png',
      name: 'chart',
      backgroundColor: '#fff',
      title: 'PNG保存'
    },
    restore: {
      title: '元に戻す'
    },
    dataView: {
      title: 'データ表示',
      readOnly: false,
      lang: ['データ表示', '閉じる', '更新']
    },
    dataZoom: {
      title: {
        zoom: 'ズーム',
        back: 'ズーム解除'
      }
    },
    magicType: {
      type: ['line', 'bar', 'stack'],
      title: {
        line: '折れ線',
        bar: '棒グラフ',
        stack: '積み上げ'
      }
    }
  }
};
```

## データズーム (dataZoom)

### 基本設定

```typescript
interface DataZoomOption {
  type?: 'inside' | 'slider';
  id?: string;
  show?: boolean;
  backgroundColor?: string;

  // 軸設定
  xAxisIndex?: number | number[];
  yAxisIndex?: number | number[];

  // 範囲
  start?: number;
  end?: number;
  startValue?: number | string | Date;
  endValue?: number | string | Date;
  minSpan?: number;
  maxSpan?: number;
  minValueSpan?: number | string | Date;
  maxValueSpan?: number | string | Date;

  // フィルタリング
  filterMode?: 'filter' | 'weakFilter' | 'empty' | 'none';

  // スライダー特有
  showDetail?: boolean;
  showDataShadow?: boolean;
  realtime?: boolean;
  textStyle?: TextStyleOption;

  // 位置（スライダー）
  left?: string | number;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  width?: string | number;
  height?: string | number;

  // 内部ズーム特有
  disabled?: boolean;
  zoomLock?: boolean;
  moveOnMouseMove?: boolean;
  moveOnMouseWheel?: boolean;
  preventDefaultMouseMove?: boolean;
}
```

### 実用例

```typescript
// 基本的なデータズーム
const basicDataZoom: DataZoomOption[] = [
  {
    type: 'inside',
    start: 0,
    end: 100
  }
];

// スライダー付きズーム
const sliderDataZoom: DataZoomOption[] = [
  {
    type: 'inside',
    start: 0,
    end: 100
  },
  {
    type: 'slider',
    start: 0,
    end: 100,
    height: 30,
    bottom: 20
  }
];

// Y軸ズーム
const yAxisDataZoom: DataZoomOption[] = [
  {
    type: 'inside',
    yAxisIndex: 0,
    start: 20,
    end: 80
  },
  {
    type: 'slider',
    yAxisIndex: 0,
    width: 30,
    right: 20
  }
];

// 詳細設定
const detailedDataZoom: DataZoomOption[] = [
  {
    type: 'slider',
    show: true,
    xAxisIndex: [0],
    start: 10,
    end: 90,
    backgroundColor: '#f5f5f5',
    showDetail: true,
    showDataShadow: true,
    realtime: true,
    filterMode: 'filter',
    textStyle: {
      color: '#333'
    }
  }
];
```

## アニメーション

### グローバルアニメーション設定

```typescript
const animationOptions = {
  // 基本設定
  animation: true,
  animationThreshold: 2000,
  animationDuration: 1000,
  animationEasing: 'cubicOut',
  animationDelay: 0,

  // 更新アニメーション
  animationDurationUpdate: 300,
  animationEasingUpdate: 'cubicOut',
  animationDelayUpdate: 0
};
```

### シリーズ別アニメーション

```typescript
const animatedSeries: SeriesOption = {
  type: 'bar',
  data: [1, 2, 3, 4, 5],

  // 個別アニメーション設定
  animation: true,
  animationDuration: (idx: number) => idx * 200 + 1000,
  animationEasing: 'elasticOut',
  animationDelay: (idx: number) => idx * 100
};
```

## 💡 実用的な組み合わせ例

### ダッシュボード用設定

```typescript
const dashboardOption: EChartsOption = {
  backgroundColor: '#f8f9fa',

  title: {
    text: 'KPIダッシュボード',
    left: 'center',
    textStyle: {
      fontSize: 20,
      fontWeight: 'bold'
    }
  },

  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    textStyle: { color: '#fff' }
  },

  legend: {
    bottom: 20,
    data: ['売上', '利益', '顧客数']
  },

  grid: {
    left: '5%',
    right: '5%',
    top: '15%',
    bottom: '15%',
    containLabel: true
  },

  toolbox: {
    feature: {
      saveAsImage: {},
      dataView: { readOnly: false },
      magicType: { type: ['line', 'bar'] },
      restore: {}
    }
  },

  dataZoom: [
    { type: 'inside' },
    { type: 'slider', height: 20 }
  ],

  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },

  yAxis: {
    type: 'value',
    name: '万円'
  },

  series: [
    {
      name: '売上',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110]
    }
  ]
};
```

### モバイル対応設定

```typescript
const mobileOption: EChartsOption = {
  media: [
    {
      query: { maxWidth: 768 },
      option: {
        title: {
          textStyle: { fontSize: 16 }
        },
        legend: {
          bottom: 10,
          itemGap: 5
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '20%',
          bottom: '20%'
        },
        xAxis: {
          axisLabel: {
            rotate: 45,
            fontSize: 10
          }
        }
      }
    }
  ]
};
```

---

> 💡 **ポイント**: このリファレンスはオフライン環境での開発を想定しています。設定オプションは非常に豊富ですが、まずは基本的な設定から始めて、必要に応じて詳細な設定を追加していくことをお勧めします。