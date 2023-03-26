import {Pipe, PipeTransform} from '@angular/core';
import {User} from '@angular/fire/auth';

@Pipe({
  name: 'displayNameInitials',
  pure: true,
  standalone: true
})
export class DisplayNameInitialsPipe implements PipeTransform {

  transform(value?: User | null): string {
    return this.getDisplayNameInitials(value?.displayName)
  }

  getDisplayNameInitials(displayName?: string | null): string {
    if (!displayName) {
      return '';
    }
    const initialsRegExp: RegExpMatchArray = displayName.match(/\b\w/g) || [];
    return (
      (initialsRegExp.shift() || "") + (initialsRegExp.pop() || "")
    ).toUpperCase();
  }

}
