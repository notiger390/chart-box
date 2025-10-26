import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';

interface CsvData {
  headers: string[];
  rows: string[][];
}

@Component({
  selector: 'app-chart-editor',
  imports: [CommonModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  templateUrl: './chart-editor.component.html',
  styleUrls: ['./chart-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartEditorComponent {
  csvData = signal<CsvData | null>(null);
  selectedXAxis = signal<number>(0);
  selectedYAxis = signal<number[]>([1]);

  chartOptions = computed(() => {
    const data = this.csvData();
    if (!data) return null;

    const xAxisIndex = this.selectedXAxis();
    const yAxisIndices = this.selectedYAxis();

    // X軸のデータを取得
    const xAxisData = data.rows.map(row => row[xAxisIndex]);

    // 各Y軸のシリーズを作成
    const series = yAxisIndices.map(yIndex => ({
      name: data.headers[yIndex],
      type: 'line',
      data: data.rows.map(row => {
        const value = parseFloat(row[yIndex]);
        return isNaN(value) ? row[yIndex] : value;
      }),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2
      }
    }));

    return {
      title: {
        text: 'CSV Data Chart',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: yAxisIndices.map(yIndex => data.headers[yIndex]),
        top: 40,
        left: 'center'
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        name: data.headers[xAxisIndex],
        nameLocation: 'middle',
        nameGap: 30,
        axisLine: {
          lineStyle: {
            color: '#666'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: yAxisIndices.map(i => data.headers[i]).join(', '),
        nameLocation: 'middle',
        nameGap: 50,
        axisLine: {
          lineStyle: {
            color: '#666'
          }
        }
      },
      series: series
    };
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      this.parseCsv(text);
    };
    reader.readAsText(file);
  }

  private parseCsv(text: string): void {
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      alert('CSVファイルには少なくとも2行（ヘッダー + データ）が必要です');
      return;
    }

    const headers = this.parseCsvLine(lines[0]);
    const rows = lines.slice(1).map(line => this.parseCsvLine(line));

    this.csvData.set({ headers, rows });

    // デフォルトで最初の列をX軸、2列目をY軸に設定
    this.selectedXAxis.set(0);
    this.selectedYAxis.set(headers.length > 1 ? [1] : []);
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  toggleYAxis(index: number): void {
    const current = this.selectedYAxis();
    const newSelection = current.includes(index)
      ? current.filter(i => i !== index)
      : [...current, index].sort((a, b) => a - b);

    this.selectedYAxis.set(newSelection);
  }

  isYAxisSelected(index: number): boolean {
    return this.selectedYAxis().includes(index);
  }
}
