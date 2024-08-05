import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { MasterdataSidenavComponent } from './masterdata-sidenav/masterdata-sidenav.component';
import { AppMaterialModule } from 'src/app/material.module';
import { SiteMasterDataComponent } from './site-master-data/site-master-data.component';
import { DeviceConfigComponent } from './device-config/device-config.component';
import { FilemanagementComponent } from './filemanagement/filemanagement.component';
import { StaffmanagementComponent } from './staffmanagement/staffmanagement.component';
import { CreateAlertsComponent } from './create-alerts/create-alerts.component';
import { InsigtsComponent } from './insigts/insigts.component';
import { ServicingComponent } from './servicing/servicing.component';
import { PmComponentHomeComponent } from './pm-component-home/pm-component-home.component';
import { PMSecondComponentComponent } from './pmsecond-component/pmsecond-component.component';


@NgModule({
  declarations: [
    MainPageComponent,
    MasterdataSidenavComponent,
    SiteMasterDataComponent,
    DeviceConfigComponent,
    FilemanagementComponent,
    StaffmanagementComponent,
    CreateAlertsComponent,
    InsigtsComponent,
    ServicingComponent,
    PmComponentHomeComponent,
    PMSecondComponentComponent
  ],
  imports: [
    CommonModule,
    MasterDataRoutingModule,
    AppMaterialModule
  ]
})
export class MasterDataModule { }
