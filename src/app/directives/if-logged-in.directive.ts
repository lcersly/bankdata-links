import {Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subject, takeUntil} from 'rxjs';

@Directive({
  selector: '[appIfLoggedIn]',
  standalone: true,
})
export class IfLoggedInDirective implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>()

  constructor(
    private templateRef: TemplateRef<unknown>,
    private vcr: ViewContainerRef,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.displayTemplate();
    this.authService.isSignedIn$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(isSignedIn => this.displayTemplate(isSignedIn))

  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private displayTemplate(show = true) {
    this.vcr.clear();
    if (show) {
      this.vcr.createEmbeddedView(this.templateRef);
    }
  }
}
