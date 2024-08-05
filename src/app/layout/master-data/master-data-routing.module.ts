import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { SiteMasterDataComponent } from './site-master-data/site-master-data.component';
import { DeviceConfigComponent } from './device-config/device-config.component';
import { FilemanagementComponent } from './filemanagement/filemanagement.component';
import { StaffmanagementComponent } from './staffmanagement/staffmanagement.component';
import { CreateAlertsComponent } from './create-alerts/create-alerts.component';
import { InsigtsComponent } from './insigts/insigts.component';
import { ServicingComponent } from './servicing/servicing.component';
import { PmComponentHomeComponent } from './pm-component-home/pm-component-home.component';
import { PMSecondComponentComponent } from './pmsecond-component/pmsecond-component.component';

const routes: Routes = [{
  path:'',
  component:MainPageComponent,
  children: [
    { path: '', redirectTo: 'masterData', pathMatch: 'prefix' },
    {
      path:'masterData',
      component: SiteMasterDataComponent
    },{
      path:'deviceManagement',
      component: DeviceConfigComponent
    },{
      path:'filemanagement',
      component: FilemanagementComponent
    },{
      path:'team-Availability',
      component: StaffmanagementComponent
    },{
      path:'alerts',
      component: CreateAlertsComponent
    },{
      path:'insights',
      component: InsigtsComponent
    },
    {
      path:'servicing',
      component: ServicingComponent
    },{
      path:'pmHome',
      component: PmComponentHomeComponent
    },{
      path:'PmComponent',
      component: PMSecondComponentComponent
    }
  ]
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
