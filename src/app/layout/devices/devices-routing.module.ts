import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapDevicesComponent } from './map-devices/map-devices.component';

const routes: Routes = [
  {
    path:'',
    component:MapDevicesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule { }
