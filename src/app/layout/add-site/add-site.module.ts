import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteOnboardingComponent } from './site-onboarding/site-onboarding.component';
import { HeaderComponent } from '../components/header/header.component';
import { AppMaterialModule } from 'src/app/material.module';
import { RouterModule, Routes } from '@angular/router';
import { AddSiteService } from './add-site.service';
import { FormsModule } from '@angular/forms';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
registerPlugin(FilePondPluginFileValidateType);
const appRoutes: Routes = [
  { path: '', component: SiteOnboardingComponent }
];

@NgModule({
  declarations: [
    SiteOnboardingComponent,
  ],
  imports: [
    RouterModule.forChild(appRoutes),
    CommonModule,AppMaterialModule,FormsModule ,  FilePondModule   
  ],
  providers: [
    AddSiteService,
  ],
})
export class AddSiteModule { }
