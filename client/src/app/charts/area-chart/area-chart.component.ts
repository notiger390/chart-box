import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-area-chart',
  imports: [NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaChartComponent {
  private readonly trafficData = signal({
    categories: ['月', '火', '水', '木', '金', '土', '日'],
    desktop: [320, 332, 301, 334, 390, 330, 320],
    mobile: [120, 132, 101, 134, 90, 230, 210]
  });

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: '週間ウェブサイトトラフィック',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['デスクトップ', 'モバイル'],
      bottom: 10
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: '画像として保存'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: this.trafficData().categories
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'デスクトップ',
        type: 'line',
        smooth: true,
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: this.trafficData().desktop
      },
      {
        name: 'モバイル',
        type: 'line',
        smooth: true,
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: this.trafficData().mobile
      }
    ]
  }));

}
