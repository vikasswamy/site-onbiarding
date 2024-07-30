import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-facility-dialog',
  templateUrl: './delete-facility-dialog.component.html',
  styleUrls: ['./delete-facility-dialog.component.scss']
})
export class DeleteFacilityDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private dialogRef:MatDialogRef<DeleteFacilityDialogComponent>){
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
