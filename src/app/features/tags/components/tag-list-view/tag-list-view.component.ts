import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FirestoreTagService} from '../../../../services/firestore/firestore-tag.service';
import {Router} from '@angular/router';
import {FULL_PATHS_URLS, PATHS_URLS} from '../../../../urls';
import {Tag} from '../../../../models/tag.model';
import {CreateButtonComponent} from '../../../../shared/components/create-button/create-button.component';
import {FilterService} from '../../../../services/filter.service';
import {LocalStorageService} from '../../../../services/localstorage.service';
import {TagSearchbarComponent} from './tag-searchbar/tag-searchbar.component';
import {TagListComponent} from './tag-list/tag-list.component';

@Component({
  selector: 'app-tag-list-view',
  templateUrl: './tag-list-view.component.html',
  styleUrls: ['./tag-list-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CreateButtonComponent,
    TagSearchbarComponent,
    TagListComponent,
  ],
})
export class TagListViewComponent {
  public createUrl = FULL_PATHS_URLS.createTag;

  filterService = inject(FilterService);
  fireTagService = inject(FirestoreTagService);
  router= inject( Router)
  localStorageService= inject(LocalStorageService);

  filters = signal('');
  edit(element: Tag) {
    this.router.navigate([PATHS_URLS.tags, element.uuid])
  }

  showLinksUsing(element: Tag) {
    this.filterService.setLinkFilters({selectedTagsUUID: [element.uuid], searchTags: '', searchString: ''})
    this.router.navigateByUrl(FULL_PATHS_URLS.links);
  }
}
