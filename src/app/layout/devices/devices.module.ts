import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevicesRoutingModule } from './devices-routing.module';
import { MapDevicesComponent } from './map-devices/map-devices.component';
import { AppMaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { DeviceFloorPlanComponent } from './device-floor-plan/device-floor-plan.component';
import { DeleteDEviceComponent } from './delete-device/delete-device.component';


@NgModule({
  declarations: [
    MapDevicesComponent,
    DeviceFloorPlanComponent,
    DeleteDEviceComponent
  ],
  imports: [
    CommonModule,
    DevicesRoutingModule,
    AppMaterialModule,
    FormsModule,
  ]
})
export class DevicesModule { }
