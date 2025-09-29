import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-line-chart',
  imports: [NgxEchartsModule],
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
  private readonly seriesData = signal({
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    values: [820, 932, 901, 934, 1290, 1330, 1320]
  });

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: '月次売上推移',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: this.seriesData().categories
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '売上高',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 4
        },
        areaStyle: {
          color: 'rgba(84, 112, 198, 0.2)'
        },
        emphasis: {
          focus: 'series'
        },
        data: this.seriesData().values
      }
    ]
  }));

}
