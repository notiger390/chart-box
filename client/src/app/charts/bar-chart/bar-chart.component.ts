import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-bar-chart',
  imports: [NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent {
  private readonly data = signal({
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [120, 200, 150, 80, 70, 110, 130]
  });

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'Weekly Sales Data',
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
      data: this.data().categories
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Sales',
        data: this.data().values,
        type: 'bar',
        itemStyle: {
          color: '#5470c6'
        },
        emphasis: {
          itemStyle: {
            color: '#91cc75'
          }
        }
      }
    ]
  }));

}
