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
    { value: 1048, name: '家電' },
    { value: 735, name: '衣料品' },
    { value: 580, name: '生活用品' },
    { value: 484, name: 'スポーツ用品' },
    { value: 300, name: '書籍' }
  ]);

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'カテゴリ別売上構成',
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
        name: '売上構成比',
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
