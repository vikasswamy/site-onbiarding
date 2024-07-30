import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-device',
  templateUrl: './delete-device.component.html',
  styleUrls: ['./delete-device.component.scss']
})
export class DeleteDEviceComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private dialogRef:MatDialogRef<DeleteDEviceComponent>){
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
