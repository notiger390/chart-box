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
  }
];
