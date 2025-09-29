import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'bar-chart',
    loadComponent: () => import('./charts/bar-chart/bar-chart.component').then(m => m.BarChartComponent)
  },
  {
    path: 'line-chart',
    loadComponent: () => import('./charts/line-chart/line-chart.component').then(m => m.LineChartComponent)
  },
  {
    path: 'line-chart-realtime',
    loadComponent: () => import('./charts/line-chart-realtime/line-chart-realtime.component').then(m => m.LineChartRealtimeComponent)
  },
  {
    path: 'line-chart-step',
    loadComponent: () => import('./charts/line-chart-step/line-chart-step.component').then(m => m.LineChartStepComponent)
  },
  {
    path: 'line-chart-timeseries',
    loadComponent: () => import('./charts/line-chart-timeseries/line-chart-timeseries.component').then(m => m.LineChartTimeseriesComponent)
  },
  {
    path: 'line-chart-stacked',
    loadComponent: () => import('./charts/line-chart-stacked/line-chart-stacked.component').then(m => m.LineChartStackedComponent)
  },
  {
    path: 'pie-chart',
    loadComponent: () => import('./charts/pie-chart/pie-chart.component').then(m => m.PieChartComponent)
  },
  {
    path: 'scatter-chart',
    loadComponent: () => import('./charts/scatter-chart/scatter-chart.component').then(m => m.ScatterChartComponent)
  },
  {
    path: 'area-chart',
    loadComponent: () => import('./charts/area-chart/area-chart.component').then(m => m.AreaChartComponent)
  },
  {
    path: 'radar-chart',
    loadComponent: () => import('./charts/radar-chart/radar-chart.component').then(m => m.RadarChartComponent)
  }
];
