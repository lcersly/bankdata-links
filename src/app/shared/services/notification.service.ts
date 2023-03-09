import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private options = {duration: 2000};
  link = {
    created: (tagsCreated: number) => {
      let message;
      if (tagsCreated) {
        message = `Created new link and ${tagsCreated} tag(s)`;
      } else {
        message = 'Created new link';
      }
      this.snackBar.open(message, undefined, this.options)
    },
    edited: (name: string) => {
      this.snackBar.open('Successfully edited link: ' + name, undefined, this.options);
    },
    deleted: () => {
      this.snackBar.open('Successfully deleted link', undefined, this.options);
    },
  };
  tag = {
    created: (key: string) => {
      this.snackBar.open('Created new tag: ' + key, undefined, this.options)
    },
    edited: () => {
      this.snackBar.open('Successfully edited tag', undefined, this.options);
    },
    deleted: () => {
      this.snackBar.open('Successfully deleted tag', undefined, this.options);
    },
    tagAlreadyAdded: (tagKey: string) => {
      this.snackBar.open(`Tag '${tagKey}' already exist on this URL`, undefined, this.options);
    },
  }

  authentication = {
    loggedIn: () => {
      this.snackBar.open('Successfully logged in', undefined, this.options)
    },
    loggedOut: () => {
      this.snackBar.open('You have logged out', undefined, this.options)
    },
  }

  constructor(private snackBar: MatSnackBar) {
  }
}
