import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {Link} from '../../../../shared/models/link.model';
import {MatDialogModule} from '@angular/material/dialog';
import {JsonPipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete-link.component.html',
  styleUrls: ['./dialog-delete-link.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    JsonPipe,
    MatButtonModule,
    MatIconModule,
  ],
})
export class DialogDeleteLinkComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteLinkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDeleteLinkData,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogDeleteLinkData {
  link: Link;
}
