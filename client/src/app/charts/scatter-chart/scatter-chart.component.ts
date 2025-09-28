import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

type ScatterPoint = [number, number];

@Component({
  selector: 'app-scatter-chart',
  imports: [NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScatterChartComponent {
  private readonly studyData = signal({
    hours: [
      [10.0, 8.04],
      [8.07, 6.95],
      [13.0, 7.58],
      [9.05, 8.81],
      [11.0, 8.33],
      [14.0, 9.96],
      [6.0, 7.24],
      [4.0, 4.26],
      [12.0, 10.84],
      [7.0, 4.82],
      [5.0, 5.68]
    ] as ScatterPoint[],
    regression: [
      [0, 4],
      [15, 11]
    ] as ScatterPoint[]
  });

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'Study Hours vs. Exam Score',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'value',
      name: 'Study Hours'
    },
    yAxis: {
      type: 'value',
      name: 'Exam Score'
    },
    series: [
      {
        name: 'Students',
        type: 'scatter',
        symbolSize: 16,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: '#91cc75'
        },
        data: this.studyData().hours
      },
      {
        name: 'Trend Line',
        type: 'line',
        showSymbol: false,
        smooth: true,
        lineStyle: {
          type: 'dashed'
        },
        data: this.studyData().regression
      }
    ]
  }));

}
