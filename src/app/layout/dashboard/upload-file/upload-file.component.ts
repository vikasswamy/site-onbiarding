import { Component, Inject, ViewChild } from '@angular/core';
import { FilePondComponent } from 'ngx-filepond';
import { FilePondOptions } from 'filepond';
import { MAT_DIALOG_DATA,MatDialog,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @ViewChild('myPond') myPond: FilePondComponent;
  File: any;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private dialogRef:MatDialogRef<UploadFileComponent>){
  }
  pondOptions: any = {
    allowMultiple: false,
    acceptedFileTypes: String(this.data.data?this.data.data:this.data),
    labelIdle: 'Drop files here...',
    server: {
      process: (fieldName, file, metadata, load, error, progress, abort) => {
      
        this.File=file
        this.dialogclose()
      
        // You can add additional form data as needed
        // formData.append('otherField', 'value');

        // const uploadURL = 'https://example.com/upload'; // Replace with your upload endpoint

        // this.http.post(uploadURL, formData)
        //   .subscribe(response => {
        //     // Handle server response here
        //     console.log('Upload successful', response);
        //     load(file.id);
        //   }, error => {
        //     // Handle upload error
        //     console.error('Upload failed', error);
        //     error('Error uploading file');
        //   }, () => {
        //     // Handle upload complete (called after success or failure)
        //     console.log('Upload complete');
        //   });

        return {
          abort: () => {
            // This function is called if the user wants to abort the upload
            console.log('Upload aborted');
            abort();
          }
        };
      }   
    }
  }

  pondFiles: FilePondOptions["files"] = [
   
  ]

  pondHandleInit() {
  }

  pondHandleAddFile(event: any) {
    this.File=event
  }

  pondHandleActivateFile(event: any) {
    
  }
  dialogclose(){
    this.File? this.dialogRef.close({event:'Cancel',data:this.File}):this.dialogRef.close({event:'Cancel',data:'ignore'});
  }
}
