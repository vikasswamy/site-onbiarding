import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaplocationService } from 'src/app/services/maplocation.service';

@Component({
  selector: 'app-add-deviceform',
  templateUrl: './add-deviceform.component.html',
  styleUrls: ['./add-deviceform.component.scss']
})
export class AddDeviceformComponent {
   
  @ViewChild('deviceForm') myForm:any;
  public form :any= {
    deviceType:'',
    deviceTypeId:'',
    deviecSourceId :null,
    deviceModel:'Basic',
   };


   public DefauultDeviceType:any=[
    {
      deviceTypeId:'',
      deviceType:'Please Select Device type',

   },
    {
      deviceTypeId:1,
      deviceType:'Smart Display',

   },
   {
    deviceTypeId:2,
    deviceType:'Work Validation Scanner',
    
 },
 {
  deviceTypeId:3,
  deviceType:'Occupancy Sensor',
  
},
{
  deviceTypeId:4,
  deviceType:'People Counter',
  
},

  ]
  responceData: any;
   constructor(@Inject(MAT_DIALOG_DATA) private data: any,private dialogRef:MatDialogRef<AddDeviceformComponent>,private dashboardService: MaplocationService,private snackbar:MatSnackBar){
   }
   ngOnInit(): void {
     
   }
   dialogclose(){
     this.dialogRef.close(
       {event:'Cancel',data:this.form}
     )
   }
   onSubmit(data:any){
    this.responceData=null;
    this.form.deviceTypeId = Number(this.form.deviceTypeId);
     
     this.dashboardService.addDevice(this.form).subscribe((resp:any)=>{
      console.log(resp,":::Responce::::");
      if(resp){
        this.snackbar.open('Space updated Successfully','ok',{
          duration: 2000,
          panelClass:'success-snackbar',
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
      this.myForm.resetForm({});
      this.responceData=resp;
      this.dialogRef.close(
        {event:'Submit',data:resp})
      }
     })
   }
   onOptionsSelected(value:any){
      this.form.deviceType = this.DefauultDeviceType.find((obj:any)=>
        obj.deviceTypeId == value
      ).deviceType;
      console.log(this.form.deviceType,"Device Type setting")
   }
   handleChange(data:any){
    console.log(data,"Radio button toggle value")
   }
}
