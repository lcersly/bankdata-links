import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {Link} from '../../../../models/link.model';
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
