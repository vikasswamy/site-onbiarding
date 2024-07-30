import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-device-dialog',
  templateUrl: './delete-device-dialog.component.html',
  styleUrls: ['./delete-device-dialog.component.scss']
})
export class DeleteDeviceDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private dialogRef:MatDialogRef<DeleteDeviceDialogComponent>){
  }
  ngOnInit(): void {
    
  }
  cancel(){
    this.dialogRef.close(
      {event:'cancel',data:this.data}
    )
  }
  Yes(){
    this.dialogRef.close(
      {event:'Yes',data:this.data}
    )
  }
}
