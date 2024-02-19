import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Link} from '../../../../models/link.model';
import {ReactiveFormsModule} from '@angular/forms';
import {LinkService} from '../../../../services/link.service';
import {FilterService} from '../../../../services/filter.service';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {Router} from '@angular/router';
import {CreateButtonComponent} from '../../../../shared/components/create-button/create-button.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {OpenLinkService} from '../../../../services/open-link.service';
import {FULL_PATHS_URLS, PATHS_URLS} from '../../../../urls';
import {FirestoreTagService} from '../../../../services/firestore/firestore-tag.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {LocalStorageService} from '../../../../services/localstorage.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {SearchPanelComponent} from '../search-panel/search-panel.component';
import {LinkListComponent} from '../link-list/link-list.component';

@Component({
  selector: 'app-link-list-view',
  templateUrl: './link-list-view.component.html',
  styleUrls: ['./link-list-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CreateButtonComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatChipsModule,
    MatPaginatorModule,
    SearchPanelComponent,
    LinkListComponent,
  ],
})
export class LinkListViewComponent{
  public createLink = FULL_PATHS_URLS.createLink;

  linkService= inject(LinkService)
  filterService= inject(FilterService)
  tagService= inject(FirestoreTagService)
  router= inject(Router)
  openLinkService= inject(OpenLinkService)
  localStorageService= inject(LocalStorageService)
  clipboard= inject(Clipboard)

  edit(element: Link) {
    return this.router.navigate([PATHS_URLS.links, element.uuid])
  }

  delete(element: Link) {
    return this.linkService.delete(element);
  }

  openLink(row: Link) {
    this.openLinkService.openLink(row);
  }

  copy(element: Link) {
    this.clipboard.copy(element.url)
  }
}
