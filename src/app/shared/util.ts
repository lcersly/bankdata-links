import {FormControl} from '@angular/forms';

export function fieldHasError(urlControl: FormControl, errorCode: string) {
  return urlControl.hasError(errorCode);
}
