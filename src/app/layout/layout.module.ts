import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './components/header/header.component';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { AppMaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MapOverviewComponent } from './map-overview/map-overview.component';
@NgModule({
    imports: [CommonModule, LayoutRoutingModule, TranslateModule,AppMaterialModule,FormsModule],
    declarations: [LayoutComponent, HeaderComponent, MapOverviewComponent,]
})
export class LayoutModule {}
