import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-radar-chart',
  imports: [NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadarChartComponent {
  private readonly skillScores = signal({
    indicators: [
      { name: 'Communication', max: 100 },
      { name: 'Problem Solving', max: 100 },
      { name: 'Technical Skills', max: 100 },
      { name: 'Teamwork', max: 100 },
      { name: 'Leadership', max: 100 },
      { name: 'Creativity', max: 100 }
    ],
    candidateA: [85, 90, 95, 80, 70, 88],
    candidateB: [75, 80, 88, 85, 65, 92]
  });

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: 'Candidate Skill Comparison',
      left: 'center'
    },
    legend: {
      data: ['Candidate A', 'Candidate B'],
      bottom: 10
    },
    tooltip: {},
    radar: {
      indicator: this.skillScores().indicators,
      radius: '60%'
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: this.skillScores().candidateA,
            name: 'Candidate A'
          },
          {
            value: this.skillScores().candidateB,
            name: 'Candidate B'
          }
        ]
      }
    ]
  }));

}
