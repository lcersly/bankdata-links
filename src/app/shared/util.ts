import {UntypedFormControl} from '@angular/forms';

export function fieldHasError(urlControl: UntypedFormControl, errorCode: string) {
  return urlControl.hasError(errorCode);
}
