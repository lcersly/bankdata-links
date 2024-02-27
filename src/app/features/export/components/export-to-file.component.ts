import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {LinkService} from '../../../services/link.service';
import {saveAs} from 'file-saver';
import {DatePipe} from '@angular/common';
import {Link} from '../../../models/link.model';

type LinkWithStringTags = Link & {
  stringTags: string[]
}

@Component({
  selector: 'app-export-to-file',
  standalone: true,
  imports: [
    MatButton,
  ],
  providers:[
    DatePipe,
  ],
  templateUrl: './export-to-file.component.html',
  styleUrl: './export-to-file.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportToFileComponent {

  linkService = inject(LinkService);
  #datePipe = inject(DatePipe);

  links = computed<LinkWithStringTags[]>(() => {
    return this.linkService.links().map(link => ({...link, stringTags: link.tags.map(tag => tag.key)}))
  })

  headers = computed(() => {
    const links = this.links();

    if (links.length === 0) {
      return [];
    }

    let keys = Object.keys(links[0]) as (keyof LinkWithStringTags)[];
    return keys.filter(value => value !== 'searchString' && value !== 'tags');
  })

  exportToJSON() {
    const data = this.linkService.links().map(link => {
      const {tags, searchString, ...rest} = link;

      return ({...rest, tags: tags.map(tag=>tag.key)});
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json' })
    saveAs(blob, `OBB links export ${this.#datePipe.transform(new Date(), 'short')}.json`);
  }
}
