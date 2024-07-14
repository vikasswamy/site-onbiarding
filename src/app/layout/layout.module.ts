import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './components/header/header.component';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { AppMaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
@NgModule({
    imports: [CommonModule, LayoutRoutingModule, TranslateModule,AppMaterialModule],
    declarations: [LayoutComponent, HeaderComponent,]
})
export class LayoutModule {}
