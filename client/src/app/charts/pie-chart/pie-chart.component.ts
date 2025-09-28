import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-pie-chart',
  imports: [NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartComponent {
  private readonly salesShare = signal([
    { value: 1048, name: 'Electronics' },
    { value: 735, name: 'Apparel' },
    { value: 580, name: 'Home Goods' },
    { value: 484, name: 'Sports' },
    { value: 300, name: 'Books' }
  ]);

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'Sales Distribution by Category',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Sales Share',
        type: 'pie',
        radius: '60%',
        center: ['50%', '60%'],
        data: this.salesShare(),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }));

}
