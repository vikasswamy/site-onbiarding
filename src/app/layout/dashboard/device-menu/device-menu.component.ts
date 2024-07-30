import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {NavItem} from '../nav-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-menu',
  templateUrl: './device-menu.component.html',
  styleUrls: ['./device-menu.component.scss']
})
export class DeviceMenuComponent {

  @Input() items: NavItem[];
  @ViewChild('childMenu') public childMenu;
  constructor(private routre:Router){}
  ngOnInit(): void {
    
  }
  gotToAddLevel(data:any){
    this.routre.navigate(["/map-devices"],
      { queryParams: {"siteName":data.parentName,"siteId":data.parentId,"facilityname":data.displayName,"facilityId": data.id, 
      "layout":JSON.stringify(data.geometry)} });
  }
}
