import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddFacilityRoutingModule } from './add-facility-routing.module';
import { OnboardFacilityComponent } from './onboard-facility/onboard-facility.component';
import { DeleteFacilityDialogComponent } from './delete-facility-dialog/delete-facility-dialog.component';


@NgModule({
  declarations: [
    OnboardFacilityComponent,
    DeleteFacilityDialogComponent
  ],
  imports: [
    CommonModule,
    AddFacilityRoutingModule
  ]
})
export class AddFacilityModule { }
