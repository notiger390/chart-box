import { ChangeDetectionStrategy, Component, computed, signal, effect } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';

// EChartsの型定義を拡張してmarkAreaを含める
interface ExtendedLineSeriesOption {
  name: string;
  type: 'line';
  smooth?: boolean;
  symbol?: string;
  symbolSize?: number;
  lineStyle?: any;
  areaStyle?: any;
  label?: any;
  emphasis?: any;
  data: number[];
  markPoint?: any;
  markLine?: any;
  markArea?: any;
}

@Component({
  selector: 'app-line-chart',
  imports: [NgxEchartsModule, FormsModule, CommonModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent {
  echartsInstance: any;

  // データ管理
  private readonly seriesData = signal({
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series1: [820, 932, 901, 934, 1290, 1330, 1320, 1250, 1180, 1390, 1420, 1450],
    series2: [620, 711, 823, 884, 915, 1140, 1180, 1100, 1050, 1200, 1250, 1280],
    series3: [450, 532, 601, 634, 750, 830, 820, 780, 750, 880, 920, 980]
  });

  // コントロールパネルの設定
  smooth = signal(true);
  showArea = signal(true);
  showSymbol = signal(true);
  showLabel = signal(false);
  showMarkPoint = signal(true);
  showMarkLine = signal(true);
  showMarkArea = signal(false);
  enableDataZoom = signal(true);
  enableToolbox = signal(true);
  animationEnabled = signal(true);
  theme = signal<'light' | 'dark'>('light');

  // シリーズの表示/非表示
  showSeries1 = signal(true);
  showSeries2 = signal(true);
  showSeries3 = signal(false);

  // スタイリング設定
  lineWidth = signal(3);
  symbolSize = signal(8);
  symbolType = signal<'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow'>('circle');
  lineType = signal<'solid' | 'dashed' | 'dotted'>('solid');

  // グラデーション設定
  gradientOpacity = signal(0.3);

  // ツールチップ設定
  tooltipTrigger = signal<'axis' | 'item' | 'none'>('axis');

  // 凡例設定
  legendPosition = signal<'top' | 'bottom' | 'left' | 'right'>('top');
  legendOrient = signal<'horizontal' | 'vertical'>('horizontal');

  // チャートオプション
  protected readonly chartOptions = computed<EChartsOption>(() => {
    const series: ExtendedLineSeriesOption[] = [];

    if (this.showSeries1()) {
      series.push({
        name: 'Product A',
        type: 'line',
        smooth: this.smooth(),
        symbol: this.showSymbol() ? this.symbolType() : 'none',
        symbolSize: this.symbolSize(),
        lineStyle: {
          width: this.lineWidth(),
          type: this.lineType(),
          color: '#5470c6'
        },
        areaStyle: this.showArea() ? {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `rgba(84, 112, 198, ${this.gradientOpacity()})` },
            { offset: 1, color: `rgba(84, 112, 198, 0.1)` }
          ])
        } : undefined,
        label: {
          show: this.showLabel(),
          position: 'top',
          formatter: '{c}',
          fontSize: 10
        },
        emphasis: {
          focus: 'series',
          blurScope: 'coordinateSystem'
        },
        data: this.seriesData().series1,
        markPoint: this.showMarkPoint() ? {
          symbol: 'pin',
          symbolSize: 50,
          label: {
            show: true,
            formatter: '{c}'
          },
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        } : undefined,
        markLine: this.showMarkLine() ? {
          symbol: ['none', 'none'],
          label: {
            formatter: '{b}: {c}'
          },
          data: [
            { type: 'average', name: 'Average' },
            {
              name: 'Target',
              yAxis: 1200,
              lineStyle: { color: '#ff0000', type: 'dashed' }
            }
          ]
        } : undefined
      });
    }

    if (this.showSeries2()) {
      series.push({
        name: 'Product B',
        type: 'line',
        smooth: this.smooth(),
        symbol: this.showSymbol() ? this.symbolType() : 'none',
        symbolSize: this.symbolSize(),
        lineStyle: {
          width: this.lineWidth(),
          type: this.lineType(),
          color: '#91cc75'
        },
        areaStyle: this.showArea() ? {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `rgba(145, 204, 117, ${this.gradientOpacity()})` },
            { offset: 1, color: `rgba(145, 204, 117, 0.1)` }
          ])
        } : undefined,
        label: {
          show: this.showLabel(),
          position: 'bottom',
          formatter: '{c}',
          fontSize: 10
        },
        emphasis: {
          focus: 'series',
          blurScope: 'coordinateSystem'
        },
        data: this.seriesData().series2,
        markPoint: this.showMarkPoint() ? {
          symbol: 'pin',
          symbolSize: 50,
          label: {
            show: true,
            formatter: '{c}'
          },
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        } : undefined,
        markLine: this.showMarkLine() ? {
          symbol: ['none', 'none'],
          label: {
            formatter: '{b}: {c}'
          },
          data: [
            { type: 'average', name: 'Average' }
          ]
        } : undefined
      });
    }

    if (this.showSeries3()) {
      series.push({
        name: 'Product C',
        type: 'line',
        smooth: this.smooth(),
        symbol: this.showSymbol() ? this.symbolType() : 'none',
        symbolSize: this.symbolSize(),
        lineStyle: {
          width: this.lineWidth(),
          type: this.lineType(),
          color: '#fac858'
        },
        areaStyle: this.showArea() ? {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `rgba(250, 200, 88, ${this.gradientOpacity()})` },
            { offset: 1, color: `rgba(250, 200, 88, 0.1)` }
          ])
        } : undefined,
        label: {
          show: this.showLabel(),
          position: 'top',
          formatter: '{c}',
          fontSize: 10
        },
        emphasis: {
          focus: 'series',
          blurScope: 'coordinateSystem'
        },
        data: this.seriesData().series3,
        markPoint: this.showMarkPoint() ? {
          symbol: 'pin',
          symbolSize: 50,
          label: {
            show: true,
            formatter: '{c}'
          },
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        } : undefined,
        markLine: this.showMarkLine() ? {
          symbol: ['none', 'none'],
          label: {
            formatter: '{b}: {c}'
          },
          data: [
            { type: 'average', name: 'Average' }
          ]
        } : undefined
      });
    }

    // マークエリア設定
    if (this.showMarkArea() && series.length > 0) {
      series[0].markArea = {
        silent: true,
        itemStyle: {
          color: 'rgba(255, 173, 177, 0.4)'
        },
        data: [
          [
            { xAxis: 'Mar' },
            { xAxis: 'May' }
          ]
        ],
        label: {
          show: true,
          position: 'inside',
          formatter: 'Q1 Peak'
        }
      };
    }

    return {
      title: {
        text: 'Enhanced Line Chart with Rich Features',
        subtext: 'Interactive Control Panel Demo',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: this.tooltipTrigger(),
        axisPointer: {
          type: 'cross',
          animation: true,
          label: {
            backgroundColor: '#505765'
          }
        },
        formatter: (params: any) => {
          if (!Array.isArray(params)) params = [params];
          let result = params[0].name + '<br/>';
          params.forEach((item: any) => {
            result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
            result += item.seriesName + ': ' + item.value + '<br/>';
          });
          return result;
        }
      },
      legend: {
        data: ['Product A', 'Product B', 'Product C'],
        orient: this.legendOrient(),
        ...(this.legendPosition() === 'top' && { top: '10%' }),
        ...(this.legendPosition() === 'bottom' && { bottom: '5%' }),
        ...(this.legendPosition() === 'left' && { left: '5%' }),
        ...(this.legendPosition() === 'right' && { right: '5%' }),
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: this.enableDataZoom() ? '15%' : '5%',
        top: '20%',
        containLabel: true
      },
      toolbox: this.enableToolbox() ? {
        show: true,
        orient: 'horizontal',
        right: '20',
        top: '20',
        feature: {
          saveAsImage: {
            show: true,
            title: 'Save as Image'
          },
          dataView: {
            show: true,
            title: 'Data View',
            readOnly: false,
            lang: ['Data View', 'Close', 'Refresh']
          },
          magicType: {
            show: true,
            title: {
              line: 'Line',
              bar: 'Bar',
              stack: 'Stack'
            },
            type: ['line', 'bar', 'stack']
          },
          restore: {
            show: true,
            title: 'Restore'
          },
          dataZoom: {
            show: true,
            title: {
              zoom: 'Zoom',
              back: 'Back'
            }
          }
        }
      } : undefined,
      dataZoom: this.enableDataZoom() ? [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 100,
          height: 20,
          bottom: 5
        }
      ] : undefined,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.seriesData().categories,
        axisLine: {
          lineStyle: {
            color: '#333'
          }
        },
        axisLabel: {
          rotate: 0,
          interval: 0,
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        name: 'Sales (units)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#333'
          }
        },
        axisLabel: {
          formatter: '{value}',
          fontSize: 11
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#e0e0e0'
          }
        }
      },
      series: series,
      animation: this.animationEnabled(),
      animationDuration: 1500,
      animationEasing: 'elasticInOut' as const
    };
  });

  onChartInit(ec: any) {
    this.echartsInstance = ec;
    window.addEventListener('resize', () => {
      if (this.echartsInstance && !this.echartsInstance.isDisposed()) {
        this.echartsInstance.resize();
      }
    });
  }

  onChartClick(event: any) {
    console.log('Chart clicked:', event);
  }

  // データ更新メソッド
  updateData() {
    const newData = {
      categories: this.seriesData().categories,
      series1: this.seriesData().series1.map(() => Math.floor(Math.random() * 500) + 800),
      series2: this.seriesData().series2.map(() => Math.floor(Math.random() * 400) + 600),
      series3: this.seriesData().series3.map(() => Math.floor(Math.random() * 300) + 400)
    };
    this.seriesData.set(newData);
  }

  // 画像エクスポート
  exportChart() {
    if (this.echartsInstance) {
      const url = this.echartsInstance.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.href = url;
      link.download = 'line-chart.png';
      link.click();
    }
  }
}