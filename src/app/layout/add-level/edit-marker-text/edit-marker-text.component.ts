import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaplocationService } from 'src/app/services/maplocation.service';

@Component({
  selector: 'app-edit-marker-text',
  templateUrl: './edit-marker-text.component.html',
  styleUrls: ['./edit-marker-text.component.scss']
})
export class EditMarkerTextComponent {
  public form:any = {
    spaceName:'',
    spaceId:''
   };
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private dialogRef:MatDialogRef<EditMarkerTextComponent>,private dashboardservice:MaplocationService,private snackbar:MatSnackBar){
    console.log(this.data,":::::data::::::");
    this.form.spaceName=data.spaceName;
    this.form.spaceId= data.spaceId;
  }
  ngOnInit(): void {
    
  }
  dialogclose(){
    console.log(this.form)
    this.dialogRef.close(
      {event:'Cancel',data:this.form}
    );
  }
  onSubmit(data:any){
    console.log(data.controls.Spacename.value);

    this.dashboardservice.updateSpace(this.form).subscribe((data:any)=>{
       
        if(data){
          this.snackbar.open('Space updated Successfully','ok',{
            duration: 2000,
            panelClass:'success-snackbar',
            verticalPosition: "top", // Allowed values are  'top' | 'bottom'
            horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
          });
          this.form.spaceName= data;
          console.log(this.form);
          data?this.dialogRef.close(
            {event:'Submit',data:this.form}):'';
        }
    },(error:any)=>{
      this.dashboardservice.obtainedError.subscribe((err:any)=>{
        console.log(err,"error message");
        if(err ){
          this.snackbar.open('Error inSide Update SpaceName','ok',{
            duration: 2000,
            verticalPosition: "top", // Allowed values are  'top' | 'bottom'
            horizontalPosition: "center",
            panelClass: 'error-snackbar'
             // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
          })
        }
       
      })
    })
    
  }
}
