import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileComponent } from '../../dashboard/upload-file/upload-file.component';

@Component({
  selector: 'app-left-side-menu',
  templateUrl: './left-side-menu.component.html',
  styleUrls: ['./left-side-menu.component.scss']
})
export class LeftSideMenuComponent implements OnInit {
  name = "Angular Toggle Show Hide";
  showMyContainer: boolean = false;
  @Input() clicked:boolean;
   isfileChoosen:boolean;
   @Output() dataEvent = new EventEmitter<string>();
  status: boolean = false;
  statusLink: boolean = false;
  File: any;
  constructor( private dialog:MatDialog ){

  }
  ngOnInit(): void {
    
  }


  onFileAdded(file: File) {
    console.log('File added in parent component:', file);
    // Perform actions with the file added, e.g., upload, process, etc.
  }
  openDialog(fileType:any){
    let dialogRef:any=this.dialog.open(UploadFileComponent,{
      disableClose: true,
      data:{data:fileType,url:'/add-level'}
    });
    dialogRef.afterClosed().subscribe((dialogData:any) => {
      console.log(dialogData);
      this.File=dialogData.data;
      this.sendDataToParent(this.File)

    })
  }
  sendDataToParent(data:any) {
    this.dataEvent.emit(data); // Emitting the data to the parent component
  }
}
