import {Pipe, PipeTransform} from '@angular/core';
import {LinkHistoryType} from '../models/link.model';

@Pipe({
  name: 'changes',
  standalone: true,
  pure: true
})
export class ChangesPipe implements PipeTransform {

  transform(change: LinkHistoryType['changeDetails']) {
    const result:{ key: string, from: string, to: string }[] = [];
    const keys = Object.keys(change);
    for (const key of keys) {
      const changeValue = change[key as keyof LinkHistoryType['changeDetails']];
      result.push({
        key,
        from: changeValue[0] + '',
        to: changeValue[1] + ''
      });
    }
    return result;
  }
}
