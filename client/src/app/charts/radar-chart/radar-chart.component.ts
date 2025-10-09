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
      { name: 'コミュニケーション', max: 100 },
      { name: '問題解決力', max: 100 },
      { name: '技術力', max: 100 },
      { name: 'チームワーク', max: 100 },
      { name: 'リーダーシップ', max: 100 },
      { name: '創造性', max: 100 }
    ],
    candidateA: [85, 90, 95, 80, 70, 88],
    candidateB: [75, 80, 88, 85, 65, 92]
  });

  protected readonly chartOptions = computed<EChartsOption>(() => ({
    title: {
      text: '候補者のスキル比較',
      left: 'center'
    },
    legend: {
      data: ['候補者A', '候補者B'],
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
            name: '候補者A'
          },
          {
            value: this.skillScores().candidateB,
            name: '候補者B'
          }
        ]
      }
    ]
  }));

}
