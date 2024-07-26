import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileComponent } from '../../dashboard/upload-file/upload-file.component';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

@Component({
  selector: 'app-left-side-menu',
  templateUrl: './left-side-menu.component.html',
  styleUrls: ['./left-side-menu.component.scss']
})
export class LeftSideMenuComponent implements OnInit {
  name = "Angular Toggle Show Hide";
  @ViewChild('jpgInput') jpgInput!: ElementRef;  jpgToUpload: File;
  @ViewChild('pngInput') pngInput!: ElementRef;  fileToUpload: File;
  @ViewChild('pdfInput') pdfInput!: ElementRef;  pdfToUpload: File;
  showMyContainer: boolean = false;
  @Input() clicked:boolean;
  @Input() isedit:boolean;
  @Input() isview:boolean;
  @Input() isnew:boolean;
  isImageSelected:boolean=false;
   isfileChoosen:boolean;
   @Output() dataEvent = new EventEmitter<string>();
   @Output() drawEvent = new EventEmitter<string>();
   @Output() typeofFile = new EventEmitter<string>();
  status: boolean = false;
  statusLink: boolean = false;
  File: any;
  fileName: string;
  fileType: string;
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
      this.File?this.isImageSelected=true:this.isImageSelected=false;

    })
  }
  
  openFileInput(): void {
    this.jpgInput.nativeElement.click();
  }
  openPngInput():void{
    this.pngInput.nativeElement.click();
  
  }
  openpdfInput():void{
    this.pdfInput.nativeElement.click();
  }
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('Selected file:', file);
      this.fileName = fileInput.files[0].name
    this.fileType = fileInput.files[0].name.split(".")[1];
    this.typeofFile.emit(this.fileName);
    let reader = new FileReader();
   reader.readAsDataURL(fileInput.files[0])
    reader.addEventListener(
      'load',
      () => {
        this.fileType!='pdf'?this.sendDataToParent(reader.result):this.pdfpreview(reader.result)

      })
      // Handle your file here, for example, upload it to a server
    }
  }
  pdfpreview(file:any){
    console.log("PDF to IMG convertion ");
    let dialogRef:any= this.dialog.open(ImagePreviewComponent,{
      data:{
        PDFfile:file
      }
    });
    dialogRef.afterClosed().subscribe((dialogData:any) => {
      
      if(dialogData.data){
        let reader = new FileReader();
        reader.readAsDataURL(dialogData.data)
    reader.addEventListener(
      'load',
      () => {
        
        this.sendDataToParent(reader.result)
        
      });
      }
      
    })
  }
  sendDataToParent(data:any) {
    
    this.dataEvent.emit(data);
    this.isImageSelected=true; // Emitting the data to the parent component
  }
  createGeometry(name:any){
    this.isImageSelected || this.isedit ?this.drawEvent.emit(name):alert('please Import Floor Plan')
  }
}
