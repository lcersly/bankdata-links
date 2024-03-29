import {ChangeDetectionStrategy, Component, computed, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {LinkService} from '../../../../services/link.service';
import {Link} from '../../../../models/link.model';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  DialogDeleteLinkComponent,
  DialogDeleteLinkData,
} from '../../dialogs/dialog-delete-link/dialog-delete-link.component';
import {MatButtonModule} from '@angular/material/button';
import {LinkFieldsFormComponent} from '../link-fields-form/link-fields-form.component';
import {MatIconModule} from '@angular/material/icon';
import {SAVE_SHORTCUT} from '../../../../models/shortcuts';
import {DatePipe} from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {ChangesPipe} from '../../../../pipes/changes.pipe';
import {FirestoreTagService} from '../../../../services/firestore/firestore-tag.service';
import {convertHistoryTagUuids} from '../../../../shared/util';

@Component({
  selector: 'app-create-link',
  templateUrl: './edit-link.component.html',
  styleUrls: ['./edit-link.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterLink,
    LinkFieldsFormComponent,
    ReactiveFormsModule,
    MatIconModule,
    DatePipe,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    ChangesPipe,
  ],
})
export class EditLinkComponent implements OnInit, OnDestroy {

  private onDestroy = new Subject<void>();

  private uuid: string | undefined;
  public link = new UntypedFormControl()
  public orgLink: Link | undefined;

  public history = computed(() =>
    convertHistoryTagUuids(this.orgLink?.history, this.tagService.tags())
  )

  constructor(private linkService: LinkService,
              private tagService: FirestoreTagService,
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

  @HostListener(SAVE_SHORTCUT)
  async save() {
    this.link.markAllAsTouched();
    if (!this.link.valid) {
      return;
    }

    let link: Link = {
      ...this.orgLink,
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
