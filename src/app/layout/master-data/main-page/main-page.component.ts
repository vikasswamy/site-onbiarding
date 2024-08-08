import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterdataService } from '../masterdata.service';
import { MaplocationService } from 'src/app/services/maplocation.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  isClicked: boolean = false;
  obtainedSiteId: any;
  selectedfacility:any='All';
  facilitiesData:any=[];

  constructor(private route:ActivatedRoute,private masterDataService :MaplocationService){
    this.route.queryParams.subscribe((params:any) => {
        this.masterDataService.params.next(params.siteId);
        this.obtainedSiteId = params.siteId
    })
  }

  ngOnInit(): void {
    this.getfacilitiesbySiteId();

  }

  getfacilitiesbySiteId(){
    this.facilitiesData=[];

    this.masterDataService.getFacilitiessBySiteId(this.obtainedSiteId).subscribe((responceData:any)=>{
      console.log(responceData,":::reponceData::::");
      this.facilitiesData=responceData
    })
  }
  onOptionsSelected(event:any){
      console.log(event)
  }
  public toggleMenu() {
    this.isClicked = !this.isClicked;
  }
}
