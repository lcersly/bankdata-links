import {Component, Inject} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {Link} from '../../../../shared/models/link.model';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete-link.component.html',
  styleUrls: ['./dialog-delete-link.component.scss'],
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
