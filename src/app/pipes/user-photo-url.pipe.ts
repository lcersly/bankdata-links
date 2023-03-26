import {Pipe, PipeTransform} from '@angular/core';
import {User} from '@angular/fire/auth';

@Pipe({
  name: 'userPhotoUrl',
  standalone: true,
  pure: true,
})
export class UserPhotoUrlPipe implements PipeTransform {

  transform(user: User | null | undefined, wrapInUrlString = false): string | null {
    if (!user) {
      return null;
    } else if (user.photoURL) {
      if (wrapInUrlString) {
        return `url(${user.photoURL})`;
      }
      return user.photoURL;
    }
    return null;
  }
}
