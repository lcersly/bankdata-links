import {FormControl} from '@angular/forms';

export function fieldHasError(urlControl: FormControl, errorCode: string) {
  return urlControl.hasError(errorCode);
}

export function arrayEquals(a: any[], b: any[]): boolean {
  if (a == null && b == null) return true;

  if (!Array.isArray(a) ||
    !Array.isArray(b) ||
    a.length !== b.length) {
    console.info('Failed check 2')
    return false
  }


  if (typeof a === 'object' && typeof b === 'object') {

  }
  for (const keyA of Object.keys(a)) {
    // @ts-ignore
    if (b[keyA] !== a[keyA]) {
      // @ts-ignore
      console.info('Failed check 3', b[keyA], a[keyA])
      return false;
    }
  }

  for (const keyB of Object.keys(b)) {
    // @ts-ignore
    if (b[keyB] !== a[keyB]) {
      // @ts-ignore
      console.info('Failed check 4', b[keyB], a[keyB])
      return false;
    }
  }

  return true;
}
