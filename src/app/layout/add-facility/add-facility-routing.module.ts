import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardFacilityComponent } from './onboard-facility/onboard-facility.component';
import { AppMaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { FilePondModule } from 'ngx-filepond';

const routes: Routes = [
  {
    path:'',
    component:OnboardFacilityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,AppMaterialModule,FormsModule ,  FilePondModule ]
})
export class AddFacilityRoutingModule { }
