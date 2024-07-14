import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {NavItem} from '../nav-item';
import { Router } from '@angular/router';
@Component({
  selector: 'app-child-menu',
  templateUrl: './child-menu.component.html',
  styleUrls: ['./child-menu.component.scss']
})
export class ChildMenuComponent implements OnInit{
  @Input() items: NavItem[];
  @ViewChild('childMenu') public childMenu;
  constructor(private routre:Router){}
  ngOnInit(): void {
    
  }
  gotToAddLevel(data:any){
    console.log(data,'::::router data::::');
    // this.routre.navigate(["/add-facility"],
    //   { queryParams: { "facilityname":data.facilityName,"facilityId": data.facilityId} });
  }
}
