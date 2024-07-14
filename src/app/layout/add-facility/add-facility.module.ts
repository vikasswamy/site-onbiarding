import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddFacilityRoutingModule } from './add-facility-routing.module';
import { OnboardFacilityComponent } from './onboard-facility/onboard-facility.component';


@NgModule({
  declarations: [
    OnboardFacilityComponent
  ],
  imports: [
    CommonModule,
    AddFacilityRoutingModule
  ]
})
export class AddFacilityModule { }
