import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import html2canvas from 'html2canvas';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
  
})
export class ImagePreviewComponent implements OnInit {
  
  @ViewChild('screen') screen: ElementRef;
  title = 'pdf-to-image';
  
  public style: object = {};
  public pdfSrc = "";
  public totalPages: number = 0;
 public currentpage: number = 0;
  public isCropImage: boolean = false;
  public isPdfUploaded :boolean = false;
  imageChangedEvent: Event | null = null;
      constructor(@Inject(MAT_DIALOG_DATA) private data: any,private dialogRef:MatDialogRef<ImagePreviewComponent>){
        
      }
      ngOnInit(): void {
        this.currentpage = 1;
        this.pdfSrc=this.data.PDFfile
      }
      afterLoadComplete(pdf: PDFDocumentProxy) {
        this.totalPages = pdf.numPages;

       // this.converttoImage();
      }
      dialogclose(){
        this.dialogRef.close()
      }
      converttoImage(){
        html2canvas(document.querySelector(".pdf-container") as HTMLElement).then(canvas => {
          canvas.toBlob((blob) => {
            this.dialogRef.close(
              {event:'Cancel',data:blob}
            )
            //this.createImageFromBlob(blob,lat,long);
          });
          //this.screen.nativeElement.style.display='none';
        });

      }
 
}
