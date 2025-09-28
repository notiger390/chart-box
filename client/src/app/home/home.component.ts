import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <h1>ECharts Sample Gallery</h1>
      <p class="description">Click on a chart type to see the example</p>

      <div class="chart-grid">
        <a routerLink="/bar-chart" class="chart-card">
          <div class="chart-icon">📊</div>
          <h3>Bar Chart</h3>
          <p>Basic bar chart with weekly sales data</p>
        </a>

        <a routerLink="/line-chart" class="chart-card">
          <div class="chart-icon">📈</div>
          <h3>Line Chart</h3>
          <p>Smooth line chart with monthly revenue trend</p>
        </a>

        <div class="chart-card placeholder">
          <div class="chart-icon">🥧</div>
          <h3>Pie Chart</h3>
          <p>Coming soon</p>
        </div>

        <div class="chart-card placeholder">
          <div class="chart-icon">🕸️</div>
          <h3>Radar Chart</h3>
          <p>Coming soon</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 40px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 10px;
    }

    .description {
      text-align: center;
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 40px;
    }

    .chart-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }

    .chart-card {
      background: white;
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }

    .chart-card:hover:not(.placeholder) {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }

    .chart-card.placeholder {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chart-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }

    .chart-card h3 {
      color: #333;
      margin: 10px 0;
      font-size: 1.3rem;
    }

    .chart-card p {
      color: #666;
      font-size: 0.95rem;
      margin: 5px 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}