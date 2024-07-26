import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-space',
  templateUrl: './add-space.component.html',
  styleUrls: ['./add-space.component.scss']
})
export class AddSpaceComponent implements OnInit {
  public form :any= {
   spaceName:'',
   spaceId :''
  };
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private dialogRef:MatDialogRef<AddSpaceComponent>){
  }
  ngOnInit(): void {
    
  }
  dialogclose(){
    this.dialogRef.close(
      {event:'Cancel',data:this.form}
    )
  }
  onSubmit(data:any){
    console.log(data.controls.Spacename.value)
    data.controls.Spacename.value?this.dialogclose():'';
  }
}
