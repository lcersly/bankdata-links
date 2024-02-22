import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {LinkService} from '../../../services/link.service';
import {saveAs} from 'file-saver';
import {DatePipe} from '@angular/common';

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

  #linkService = inject(LinkService);
  #datePipe = inject(DatePipe);

  exportToJSON() {
    const data = this.#linkService.links().map(link => {
      const {tags, searchString, ...rest} = link;

      return ({...rest, tags: tags.map(tag=>tag.key)});
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json' })
    saveAs(blob, `OBB links export ${this.#datePipe.transform(new Date(), 'short')}.json`);
  }
}
