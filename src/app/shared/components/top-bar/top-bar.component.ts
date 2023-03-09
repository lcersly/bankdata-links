import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ThemeService} from '../../services/theme.service';
import {first} from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  standalone: true,
  styleUrls: ['./top-bar.component.scss'],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent implements OnInit {
  @Input()
  title: string = '';

  toggleControl = new FormControl(false);

  constructor(private themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.themeService.darkMode$.pipe(
      first(),
    )      .subscribe(isEnabled => this.toggleControl.setValue(isEnabled));

    this.toggleControl.valueChanges.subscribe(enabled => this.themeService.setDarkMode(enabled))
  }


}
