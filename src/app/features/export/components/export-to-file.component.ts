import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {LinkService} from '../../../services/link.service';
import {saveAs} from 'file-saver';
import {DatePipe} from '@angular/common';
import {Link} from '../../../models/link.model';

type LinkWithStringTags = Exclude<Link, 'searchTags' | 'tags'> & {
  tags: string[]
}

@Component({
  selector: 'app-export-to-file',
  standalone: true,
  imports: [
    MatButton,
  ],
  providers: [
    DatePipe,
  ],
  templateUrl: './export-to-file.component.html',
  styleUrl: './export-to-file.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportToFileComponent {

  linkService = inject(LinkService);
  #datePipe = inject(DatePipe);

  links = computed<LinkWithStringTags[]>(() => {
    return this.linkService.links().map(link => {
      const {searchString, history, tags, ...rest} = link;
      const stringTags = link.tags.map(tag => tag.key);
      return {...rest, tags: stringTags} as LinkWithStringTags;
    })
  })

  headers = computed(() => {
    const links = this.links();

    if (links.length === 0) {
      return [];
    }

    return Object.keys(links[0]) as (keyof LinkWithStringTags)[];
  })

  exportToJSON() {
    const blob = new Blob([JSON.stringify(this.links(), null, 2)], {type: 'application/json'})
    saveAs(blob, `OBB links export ${this.#datePipe.transform(new Date(), 'short')}.json`);
  }
}
