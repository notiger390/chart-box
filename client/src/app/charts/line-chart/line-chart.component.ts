import { Component, ChangeDetectionStrategy, OnInit, computed, signal } from '@angular/core';
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
  template: `
    <div class="chart-container">
      <h2>Line Chart Sample</h2>
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
export class LineChartComponent implements OnInit {
  private readonly seriesData = signal({
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    values: [820, 932, 901, 934, 1290, 1330, 1320]
  });

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'Monthly Revenue Trend',
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
        name: 'Revenue',
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

  ngOnInit(): void {
    console.log('Line chart component initialized');
  }
}
