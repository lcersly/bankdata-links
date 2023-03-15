import {ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {LinkService} from '../../../services/link.service';
import {NotificationService} from '../../../services/notification.service';
import {FavIconService} from '../../../services/fav-icon.service';
import {Link} from '../../../models/link.model';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteLinkComponent, DialogDeleteLinkData} from './dialog-delete-link/dialog-delete-link.component';
import {MatButtonModule} from '@angular/material/button';
import {LinkFormComponent} from '../link-form/link-form.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-create-link',
  templateUrl: './edit-link.component.html',
  styleUrls: ['./edit-link.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    LinkFormComponent,
    ReactiveFormsModule,
    MatIconModule,
  ],
})
export class EditLinkComponent implements OnInit, OnDestroy {

  private onDestroy = new Subject<void>();

  private uuid: string | undefined;
  public link = new UntypedFormControl()
  public orgLink: Link | undefined;

  constructor(private linkService: LinkService,
              private notifications: NotificationService,
              private favIconService: FavIconService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data) => {
        const link = data['link'] as Link;
        this.uuid = link.uuid;
        this.orgLink = link;
        this.link.patchValue(link);
      })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  @HostListener('window:keydown.enter')
  async save() {
    this.link.markAllAsTouched();
    if (!this.link.valid) {
      return;
    }

    let link: Link = {
      ...this.link.value,
      uuid: this.uuid,
    };
    await this.linkService.edit(link);

    this.navigateBack();
  }

  @HostListener('window:keydown.esc')
  public navigateBack() {
    this.router.navigate(['..'], {relativeTo: this.route})
  }

  delete() {
    if (!this.orgLink) {
      return;
    }
    const dialogRef = this.dialog.open(DialogDeleteLinkComponent, {
      width: '250px',
      data: {link: this.orgLink} as DialogDeleteLinkData,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.orgLink) {
        this.linkService.delete(this.orgLink).then(() => this.navigateBack());
      }
    });
  }
}
