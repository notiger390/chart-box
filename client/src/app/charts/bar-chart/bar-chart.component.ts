import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
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
  template: `
    <div class="chart-container">
      <h2>Bar Chart Sample</h2>
      <div echarts [options]="chartOptions()" class="chart"></div>
    </div>
  `,
  styles: [`
    .chart-container {
      padding: 20px;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .chart {
      height: 500px;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements OnInit {
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

  ngOnInit(): void {
    console.log('Bar chart component initialized');
  }
}