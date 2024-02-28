import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {LinkService} from '../../services/link.service';
import {Link, LinkHistoryType} from '../../models/link.model';
import {DatePipe} from '@angular/common';
import {ChangesPipe} from '../../pipes/changes.pipe';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {PATHS_URLS} from '../../urls';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatAccordion,
    DatePipe,
    ChangesPipe,
    MatButton,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {
  linkService = inject(LinkService)
  router = inject(Router)

  history = computed(()=>{
    let changeHistory = this.linkService.links().reduce((previousValue, currentValue) => {
      previousValue.push(...currentValue.history.map(item => ({link: currentValue, change: item})))
      return previousValue;
    }, [] as {change: LinkHistoryType, link: Link}[])
      .sort((a, b) => b.change.date.getTime() - a.change.date.getTime());
    return changeHistory.slice(0, 100);
  })

  goToLink(link: Link) {
    return this.router.navigate([PATHS_URLS.links, link.uuid])
  }
}
