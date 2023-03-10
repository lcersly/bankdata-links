import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode$ = new ReplaySubject<boolean>();

  constructor() {
    let darkMode = localStorage.getItem("darkMode") || 'true';
    this.darkMode$.next(darkMode === "true");
    this.darkMode$.subscribe(enabled => localStorage.setItem("darkMode", enabled ? "true" : "false"))
  }

  setDarkMode(enabled: boolean | null): void{
    this.darkMode$.next(!!enabled);
  }
}