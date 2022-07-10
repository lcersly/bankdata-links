import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {LinkService} from '../../../shared/services/link.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {FavIconService} from '../../../shared/services/fav-icon.service';
import {Link} from '../../../shared/models/link.model';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-create-link',
  templateUrl: './edit-link.component.html',
  styleUrls: ['./edit-link.component.scss'],
})
export class EditLinkComponent implements OnInit, OnDestroy {

  private onDestroy = new Subject<void>();

  private id: string | undefined;
  public link = new FormControl()

  constructor(private linkService: LinkService,
              private notifications: NotificationService,
              private favIconService: FavIconService,
              private route: ActivatedRoute,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.onDestroy))
      .subscribe(({link}) => {
        this.id = link.id;
        this.link.patchValue(link);
      })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  async edit() {
    this.link.markAllAsTouched();
    if (!this.link.valid) {
      return;
    }

    let link: Link = {
      ...this.link.value,
      id: this.id,
    };
    console.info('Edit component', link, this.link.value);
    await this.linkService.edit(link);

    this.notifications.link.edited(link.name);
    this.router.navigate(['..'], {relativeTo: this.route})
  }
}
