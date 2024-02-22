import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {

}
