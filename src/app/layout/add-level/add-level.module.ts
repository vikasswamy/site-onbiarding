import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddLevelRoutingModule } from './add-level-routing.module';
import { OnBoardLevelComponent } from './on-board-level/on-board-level.component';
import { LeftSideMenuComponent } from './left-side-menu/left-side-menu.component';
import { AppMaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { FilePondModule } from 'ngx-filepond';


@NgModule({
  declarations: [
    OnBoardLevelComponent,
    LeftSideMenuComponent,
  ],
  imports: [
    CommonModule,
    AddLevelRoutingModule,AppMaterialModule,FormsModule ,  FilePondModule
  ]
})
export class AddLevelModule { }
