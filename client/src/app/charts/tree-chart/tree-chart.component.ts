import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface TreeNode {
  name: string;
  value?: number;
  itemStyle?: any;
  children?: TreeNode[];
  symbol?: string;
  symbolSize?: number;
  label?: any;
}

@Component({
  selector: 'app-tree-chart',
  standalone: true,
  imports: [NgxEchartsModule, FormsModule, CommonModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ],
  template: `
    <div class="tree-container">
      <div
        echarts
        [options]="chartOptions()"
        (chartInit)="onChartInit($event)"
        class="chart">
      </div>

      <div class="controls">
        <h3>Tree Chart Controls</h3>

        <div class="control-section">
          <h4>🌳 Tree Types</h4>
          <div class="tree-grid">
            <button
              class="tree-card"
              [class.active]="currentTree() === 'organization'"
              (click)="switchTree('organization')">
              <div class="card-icon">🏢</div>
              <div class="card-title">Organization</div>
              <div class="card-subtitle">Company Structure</div>
            </button>
            <button
              class="tree-card"
              [class.active]="currentTree() === 'family'"
              (click)="switchTree('family')">
              <div class="card-icon">👨‍👩‍👧‍👦</div>
              <div class="card-title">Family Tree</div>
              <div class="card-subtitle">Genealogy</div>
            </button>
            <button
              class="tree-card"
              [class.active]="currentTree() === 'filesystem'"
              (click)="switchTree('filesystem')">
              <div class="card-icon">📁</div>
              <div class="card-title">File System</div>
              <div class="card-subtitle">Directory Structure</div>
            </button>
            <button
              class="tree-card"
              [class.active]="currentTree() === 'mindmap'"
              (click)="switchTree('mindmap')">
              <div class="card-icon">🧠</div>
              <div class="card-title">Mind Map</div>
              <div class="card-subtitle">Concept Map</div>
            </button>
          </div>
        </div>

        <div class="control-section">
          <h4>📐 Layout Settings</h4>
          <div class="layout-controls">
            <div class="control-row">
              <label>
                Layout:
                <select [(ngModel)]="layout">
                  <option value="orthogonal">Orthogonal</option>
                  <option value="radial">Radial</option>
                </select>
              </label>
              <label>
                Orientation:
                <select [(ngModel)]="orient">
                  <option value="LR">Left to Right</option>
                  <option value="RL">Right to Left</option>
                  <option value="TB">Top to Bottom</option>
                  <option value="BT">Bottom to Top</option>
                </select>
              </label>
            </div>
            <div class="control-row">
              <label>
                Node Size:
                <input type="range" min="8" max="30" [(ngModel)]="symbolSize">
                <span>{{ symbolSize() }}px</span>
              </label>
              <label>
                Expand Level:
                <input type="range" min="1" max="5" [(ngModel)]="initialTreeDepth">
                <span>{{ initialTreeDepth() }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="control-section">
          <h4>🎨 Visual Settings</h4>
          <div class="visual-controls">
            <div class="control-row">
              <label>
                Color Scheme:
                <select [(ngModel)]="colorScheme">
                  <option value="default">Default</option>
                  <option value="blue">Blue Gradient</option>
                  <option value="green">Green Gradient</option>
                  <option value="purple">Purple Gradient</option>
                  <option value="orange">Orange Gradient</option>
                </select>
              </label>
              <label>
                Line Style:
                <select [(ngModel)]="lineStyle">
                  <option value="curve">Curved</option>
                  <option value="polyline">Polyline</option>
                </select>
              </label>
            </div>
            <div class="control-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showLabels">
                Show Labels
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showValues">
                Show Values
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="roam">
                Enable Roam
              </label>
            </div>
          </div>
        </div>

        <div class="control-section">
          <h4>📊 Tree Analysis</h4>
          <div class="analysis-controls">
            <div class="control-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="showStatistics">
                Show Statistics
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="highlightPath">
                Highlight Paths
              </label>
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="animateExpansion">
                Animate Expansion
              </label>
            </div>
          </div>
        </div>

        @if (showStatistics()) {
          <div class="stats-panel">
            <h4>📈 Tree Statistics</h4>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Total Nodes</div>
                <div class="stat-value">{{ getStatistics().totalNodes }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Max Depth</div>
                <div class="stat-value">{{ getStatistics().maxDepth }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Leaf Nodes</div>
                <div class="stat-value">{{ getStatistics().leafNodes }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Branch Nodes</div>
                <div class="stat-value">{{ getStatistics().branchNodes }}</div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./tree-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeChartComponent {
  echartsInstance: any;

  currentTree = signal<'organization' | 'family' | 'filesystem' | 'mindmap'>('organization');
  layout = signal<'orthogonal' | 'radial'>('orthogonal');
  orient = signal<'LR' | 'RL' | 'TB' | 'BT'>('LR');
  symbolSize = signal(12);
  initialTreeDepth = signal(3);
  colorScheme = signal<'default' | 'blue' | 'green' | 'purple' | 'orange'>('default');
  lineStyle = signal<'curve' | 'polyline'>('curve');
  showLabels = signal(true);
  showValues = signal(false);
  roam = signal(true);
  showStatistics = signal(true);
  highlightPath = signal(false);
  animateExpansion = signal(true);

  private colorSchemes = {
    default: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622'],
    blue: ['#1890ff', '#096dd9', '#0050b3', '#003a8c', '#40a9ff', '#69c0ff', '#91d5ff'],
    green: ['#52c41a', '#389e0d', '#237804', '#135200', '#73d13d', '#95de64', '#b7eb8f'],
    purple: ['#722ed1', '#531dab', '#391085', '#22075e', '#9254de', '#b37feb', '#d3adf7'],
    orange: ['#fa8c16', '#d46b08', '#ad4e00', '#873800', '#ffa940', '#ffb366', '#ffd591']
  };

  private generateOrganizationTree(): TreeNode {
    return {
      name: 'CEO',
      value: 100,
      children: [
        {
          name: 'CTO',
          value: 85,
          children: [
            {
              name: 'Frontend Team',
              value: 70,
              children: [
                { name: 'Senior Dev A', value: 60 },
                { name: 'Developer B', value: 50 },
                { name: 'Junior Dev C', value: 30 }
              ]
            },
            {
              name: 'Backend Team',
              value: 75,
              children: [
                { name: 'Senior Dev D', value: 65 },
                { name: 'Developer E', value: 55 },
                { name: 'DevOps F', value: 60 }
              ]
            }
          ]
        },
        {
          name: 'CFO',
          value: 80,
          children: [
            {
              name: 'Accounting',
              value: 60,
              children: [
                { name: 'Accountant A', value: 50 },
                { name: 'Accountant B', value: 45 }
              ]
            },
            {
              name: 'Finance',
              value: 65,
              children: [
                { name: 'Financial Analyst', value: 55 },
                { name: 'Budget Manager', value: 60 }
              ]
            }
          ]
        },
        {
          name: 'CMO',
          value: 78,
          children: [
            {
              name: 'Marketing',
              value: 65,
              children: [
                { name: 'Content Creator', value: 50 },
                { name: 'SEO Specialist', value: 55 }
              ]
            },
            {
              name: 'Sales',
              value: 70,
              children: [
                { name: 'Sales Rep A', value: 60 },
                { name: 'Sales Rep B', value: 58 }
              ]
            }
          ]
        }
      ]
    };
  }

  private generateFamilyTree(): TreeNode {
    return {
      name: 'Great Grandfather',
      value: 95,
      children: [
        {
          name: 'Grandfather',
          value: 75,
          children: [
            {
              name: 'Father',
              value: 50,
              children: [
                { name: 'Son', value: 25 },
                { name: 'Daughter', value: 23 }
              ]
            },
            {
              name: 'Uncle',
              value: 48,
              children: [
                { name: 'Cousin A', value: 20 },
                { name: 'Cousin B', value: 18 }
              ]
            }
          ]
        },
        {
          name: 'Great Uncle',
          value: 73,
          children: [
            {
              name: 'Second Cousin Parent',
              value: 45,
              children: [
                { name: 'Second Cousin', value: 15 }
              ]
            }
          ]
        }
      ]
    };
  }

  private generateFileSystemTree(): TreeNode {
    return {
      name: 'root',
      value: 100,
      children: [
        {
          name: 'src',
          value: 60,
          children: [
            {
              name: 'components',
              value: 25,
              children: [
                { name: 'header.tsx', value: 5 },
                { name: 'footer.tsx', value: 4 },
                { name: 'sidebar.tsx', value: 6 }
              ]
            },
            {
              name: 'pages',
              value: 20,
              children: [
                { name: 'home.tsx', value: 8 },
                { name: 'about.tsx', value: 6 }
              ]
            },
            { name: 'index.tsx', value: 3 }
          ]
        },
        {
          name: 'public',
          value: 15,
          children: [
            { name: 'favicon.ico', value: 1 },
            { name: 'index.html', value: 2 },
            {
              name: 'assets',
              value: 10,
              children: [
                { name: 'logo.png', value: 3 },
                { name: 'styles.css', value: 4 }
              ]
            }
          ]
        },
        {
          name: 'docs',
          value: 8,
          children: [
            { name: 'README.md', value: 3 },
            { name: 'CONTRIBUTING.md', value: 2 }
          ]
        }
      ]
    };
  }

  private generateMindMapTree(): TreeNode {
    return {
      name: 'Angular Development',
      value: 100,
      children: [
        {
          name: 'Core Concepts',
          value: 80,
          children: [
            {
              name: 'Components',
              value: 60,
              children: [
                { name: 'Templates', value: 20 },
                { name: 'Lifecycle', value: 25 },
                { name: 'Data Binding', value: 30 }
              ]
            },
            {
              name: 'Services',
              value: 50,
              children: [
                { name: 'Dependency Injection', value: 25 },
                { name: 'HTTP Client', value: 20 }
              ]
            }
          ]
        },
        {
          name: 'Advanced Topics',
          value: 70,
          children: [
            {
              name: 'Routing',
              value: 40,
              children: [
                { name: 'Guards', value: 15 },
                { name: 'Lazy Loading', value: 20 }
              ]
            },
            {
              name: 'State Management',
              value: 45,
              children: [
                { name: 'NgRx', value: 25 },
                { name: 'Signals', value: 20 }
              ]
            }
          ]
        },
        {
          name: 'Testing',
          value: 60,
          children: [
            { name: 'Unit Tests', value: 30 },
            { name: 'E2E Tests', value: 25 }
          ]
        }
      ]
    };
  }

  switchTree(tree: 'organization' | 'family' | 'filesystem' | 'mindmap') {
    this.currentTree.set(tree);
  }

  getCurrentTreeData(): TreeNode {
    switch (this.currentTree()) {
      case 'organization': return this.generateOrganizationTree();
      case 'family': return this.generateFamilyTree();
      case 'filesystem': return this.generateFileSystemTree();
      case 'mindmap': return this.generateMindMapTree();
      default: return this.generateOrganizationTree();
    }
  }

  private countNodes(node: TreeNode): number {
    let count = 1;
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + this.countNodes(child), 0);
    }
    return count;
  }

  private getMaxDepth(node: TreeNode, currentDepth = 0): number {
    if (!node.children || node.children.length === 0) {
      return currentDepth;
    }
    return Math.max(...node.children.map(child => this.getMaxDepth(child, currentDepth + 1)));
  }

  private countLeafNodes(node: TreeNode): number {
    if (!node.children || node.children.length === 0) {
      return 1;
    }
    return node.children.reduce((sum, child) => sum + this.countLeafNodes(child), 0);
  }

  getStatistics() {
    const treeData = this.getCurrentTreeData();
    const totalNodes = this.countNodes(treeData);
    const maxDepth = this.getMaxDepth(treeData);
    const leafNodes = this.countLeafNodes(treeData);
    const branchNodes = totalNodes - leafNodes;

    return {
      totalNodes,
      maxDepth: maxDepth + 1,
      leafNodes,
      branchNodes
    };
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  protected readonly chartOptions = computed(() => {
    const treeData = this.getCurrentTreeData();
    const colors = this.colorSchemes[this.colorScheme()];

    const getTreeTitle = () => {
      switch (this.currentTree()) {
        case 'organization': return 'Organization Chart';
        case 'family': return 'Family Tree';
        case 'filesystem': return 'File System Structure';
        case 'mindmap': return 'Mind Map';
        default: return 'Tree Chart';
      }
    };

    return {
      title: {
        text: getTreeTitle(),
        subtext: `Layout: ${this.layout()} - Orientation: ${this.orient()}`,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params: any) => {
          const data = params.data;
          let content = `<div style="font-weight: bold;">${data.name}</div>`;
          if (data.value && this.showValues()) {
            content += `<div>Value: ${data.value}</div>`;
          }
          return content;
        }
      },
      series: [
        {
          type: 'tree',
          data: [treeData],
          top: '5%',
          left: '10%',
          bottom: '5%',
          right: '15%',
          symbolSize: this.symbolSize(),
          layout: this.layout(),
          orient: this.orient(),
          label: {
            show: this.showLabels(),
            position: this.layout() === 'radial' ? 'radial' : 'left',
            verticalAlign: 'middle',
            align: this.layout() === 'radial' ? 'center' : 'right',
            fontSize: Math.max(10, this.symbolSize() - 2),
            color: '#333',
            formatter: (params: any) => {
              let text = params.data.name;
              if (this.showValues() && params.data.value) {
                text += `\n(${params.data.value})`;
              }
              return text;
            }
          },
          leaves: {
            label: {
              position: this.layout() === 'radial' ? 'radial' : 'right',
              verticalAlign: 'middle',
              align: this.layout() === 'radial' ? 'center' : 'left'
            }
          },
          emphasis: {
            focus: this.highlightPath() ? 'ancestor' : 'none'
          },
          expandAndCollapse: true,
          animationDuration: this.animateExpansion() ? 550 : 0,
          animationDurationUpdate: this.animateExpansion() ? 750 : 0,
          initialTreeDepth: this.initialTreeDepth(),
          itemStyle: {
            color: (params: any) => {
              const depth = params.data.depth || 0;
              return colors[depth % colors.length];
            },
            borderColor: '#fff',
            borderWidth: 2
          },
          lineStyle: {
            color: '#ccc',
            width: 1.5,
            curveness: this.lineStyle() === 'curve' ? 0.5 : 0
          }
        }
      ],
      roam: this.roam(),
      animation: this.animateExpansion(),
      animationDuration: this.animateExpansion() ? 1000 : 0,
      animationEasing: 'cubicInOut' as const
    };
  });
}