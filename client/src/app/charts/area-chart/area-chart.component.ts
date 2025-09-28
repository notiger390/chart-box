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
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    desktop: [320, 332, 301, 334, 390, 330, 320],
    mobile: [120, 132, 101, 134, 90, 230, 210]
  });

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'Weekly Website Traffic',
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
      data: ['Desktop', 'Mobile'],
      bottom: 10
    },
    toolbox: {
      feature: {
        saveAsImage: {}
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
        name: 'Desktop',
        type: 'line',
        smooth: true,
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: this.trafficData().desktop
      },
      {
        name: 'Mobile',
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
