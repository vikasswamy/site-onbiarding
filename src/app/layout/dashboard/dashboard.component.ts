import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { MaplocationService } from 'src/app/services/maplocation.service';
import {NavItem} from './nav-item';
import { geometry } from '@turf/turf';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    navItems: NavItem[] = [
        {
        parentId:'',
          displayName: 'select Level',
          id:'',
          geometry:{},
          children: [
          ]
        }
      ];
    SelectedSite:any='Select Site';
    SelectedFacility:any='Select Facility'
    AllSites:any=[];
    hasFacility:boolean=true;
    constructor(private router:Router,private dashboardService:MaplocationService) {
       
    }

    ngOnInit() {
        this.getAllSites()
    }
    goToAddLevel(){
        this.router.navigate(["/add-facility"],
            { queryParams: { siteName:this.SelectedSite} });
    }
    setSelectedSiteValue(values:any){
        this.SelectedSite=values.siteName;
        this.goToAddLevel()
    }
    getAllSites(){
        this.dashboardService.getAllSites().subscribe((SitesData:any)=>{
            console.log(SitesData,"::::SitesData::::")
            this.AllSites=SitesData
        });
        this.getFacilityGridData();
    }
    getFacilityGridData(){
        this.dashboardService.getFacilityGridData().subscribe((gridData:any)=>{
            console.log(gridData);
             this.dashboardService.falicityGridData.next(gridData)   
            gridData.forEach((siteItem:any,j:any) => {
                let obj:any={};
                obj.parentId=siteItem.siteId;
                obj.displayName=siteItem.siteName;
                obj.id=siteItem.siteId;
                obj.geometry={};
                obj.children=[];
                siteItem.Facilities&& siteItem.Facilities.forEach((facItem:any,i:any)=>{
                    obj.children.push({
                        parentId:siteItem.siteId,
                        displayName:facItem.facilityName,
                        id:facItem.facilityId,
                        geometry:facItem.geometry
                    });
                });
                this.navItems[0].children.push(obj);
            });
            console.log(this.navItems[0].children)
            
        });

    }
}
