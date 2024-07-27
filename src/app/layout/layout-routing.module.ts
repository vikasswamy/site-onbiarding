import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            { path: 'add-site', loadChildren: () => import('././add-site/add-site.module').then((m) => m.AddSiteModule) },
            { path: 'add-facility', loadChildren: () => import('./add-facility/add-facility.module').then((m) => m.AddFacilityModule) },
            { path: 'add-level', loadChildren: () => import('./add-level/add-level.module').then((m) => m.AddLevelModule) },
            { path: 'map-devices', loadChildren: () => import('./devices/devices.module').then((m) => m.DevicesModule) },
            // {
            //     path: 'bs-element',
            //     loadChildren: () => import('./bs-element/bs-element.module').then((m) => m.BsElementModule)
            // },
            // { path: 'grid', loadChildren: () => import('./grid/grid.module').then((m) => m.GridModule) },
            // {
            //     path: 'components',
            //     loadChildren: () => import('./bs-component/bs-component.module').then((m) => m.BsComponentModule)
            // },
            {
                path: 'blank-page',
                loadChildren: () => import('./blank-page/blank-page.module').then((m) => m.BlankPageModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
