import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-tag-searchbar',
  standalone: true,
  imports: [
    MatFormField,
    MatHint,
    MatInput,
    MatLabel
  ],
  templateUrl: './tag-searchbar.component.html',
  styleUrl: './tag-searchbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagSearchbarComponent {
  @Output() changeFilters = new EventEmitter<string>();
}
