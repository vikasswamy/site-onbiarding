import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {NavItem} from '../nav-item';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit{
  @Input() items: NavItem[];
  @ViewChild('childMenu') public childMenu;
  constructor(private routre:Router){}
  ngOnInit(): void {
    
  }
  gotToAddLevel(data:any){
    console.log(data,'::::router data::::');
    this.routre.navigate(["/add-level"],
      { queryParams: {"siteName":data.parentName,"siteId":data.parentId,"facilityname":data.displayName,"facilityId": data.id,"layout":JSON.stringify(data.geometry)} });
  }
}
