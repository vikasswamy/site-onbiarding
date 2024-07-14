import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAlertModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
//import { StatModule } from '../../shared';
import { ChatComponent, NotificationComponent, TimelineComponent } from './components';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AppMaterialModule } from 'src/app/material.module';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { ChildMenuComponent } from './child-menu/child-menu.component';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { UploadFileComponent } from './upload-file/upload-file.component';
registerPlugin(FilePondPluginFileValidateType);

@NgModule({
    imports: [CommonModule, NgbCarouselModule, NgbAlertModule, DashboardRoutingModule,AppMaterialModule,FilePondModule],
    declarations: [DashboardComponent, TimelineComponent, NotificationComponent, ChatComponent, MenuItemComponent, ChildMenuComponent,UploadFileComponent]
})
export class DashboardModule {}