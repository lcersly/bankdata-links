import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {User} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private options: MatSnackBarConfig = {
    duration: 2000,
    verticalPosition:'bottom'
  };
  link = {
    created: () => {
      const message = 'Created new link';
      this.snackBar.open(message, undefined, this.options)
    },
    edited: (name: string) => {
      this.snackBar.open('Successfully edited link: ' + name, undefined, this.options);
    },
    deleted: (name: string) => {
      this.snackBar.open('Successfully deleted link: ' + name, undefined, this.options);
    },
  };
  tag = {
    created: (key: string) => {
      this.snackBar.open('Created new tag: ' + key, undefined, this.options)
    },
    edited: () => {
      this.snackBar.open('Successfully edited tag', undefined, this.options);
    },
    deleted: (name: string) => {
      this.snackBar.open('Successfully deleted tag: ' + name, undefined, this.options);
    },
    tagAlreadyAdded: (tagKey: string) => {
      this.snackBar.open(`Tag '${tagKey}' already exist on this URL`, undefined, this.options);
    },
  }

  authentication = {
    loggedIn: (user: User) => {
      // this.snackBar.open(`Welcome ${user.displayName}`, undefined, this.options)
    },
    loggedOut: () => {
      // this.snackBar.open('Bye bye', undefined, this.options)
    },
  }

  constructor(private snackBar: MatSnackBar) {
  }
}
