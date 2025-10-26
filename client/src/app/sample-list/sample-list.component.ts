import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sample-list',
  imports: [RouterLink],
  templateUrl: './sample-list.component.html',
  styleUrls: ['./sample-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleListComponent {}
