import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddLevelRoutingModule } from './add-level-routing.module';
import { OnBoardLevelComponent } from './on-board-level/on-board-level.component';
import { LeftSideMenuComponent } from './left-side-menu/left-side-menu.component';
import { FormsModule } from '@angular/forms';
import { FilePondModule } from 'ngx-filepond';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppMaterialModule } from 'src/app/material.module';
import { AddSpaceComponent } from './add-space/add-space.component';
import { EditMarkerTextComponent } from './edit-marker-text/edit-marker-text.component';
//import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    OnBoardLevelComponent,
    LeftSideMenuComponent,ImagePreviewComponent, AddSpaceComponent, EditMarkerTextComponent
  ],
  imports: [
    CommonModule,
    AddLevelRoutingModule,AppMaterialModule,FormsModule ,FilePondModule,
    PdfViewerModule
  ],
  
  bootstrap: [ OnBoardLevelComponent,
    LeftSideMenuComponent,ImagePreviewComponent],
})
export class AddLevelModule { }
