import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterdataService } from '../masterdata.service';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { factors } from '@turf/turf';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  isClicked: boolean = false;
  obtainedSiteId: any;
  obtainedFacilityId: any;
  selectedfacility:any='All';
  facilitiesData:any[]=[];
  LevelsData: any[]=[];
  selectedLevel: any="All";
  FacilitiesGridData: any[]=[];

  constructor(private route:ActivatedRoute,private masterDataService :MaplocationService){
    this.route.queryParams.subscribe((params:any) => {
        this.masterDataService.params.next(params.siteId);
        this.obtainedSiteId = params.siteId
        this.masterDataService.params.next(params.facilityId);
        this.obtainedFacilityId = params.facilityId
        // this.masterDataService.facilityselected.next(this.selectedfacility)
        
        // this.masterDataService.levelselected.next(this.getlevelsbyFacilitiesId(this.selectedfacility));
    })
  }

  ngOnInit(): void {
    this.getfacilitiesbySiteId();
    // this.getlevelsbyFacilitiesId();
    this.getFacilitiesGridDatabySiteId();
    
  }

  getfacilitiesbySiteId(){
    this.facilitiesData=[];

    this.masterDataService.getFacilitiessBySiteId(this.obtainedSiteId).subscribe((responceData:any)=>{
      console.log(responceData,":::reponceData::::");
      this.facilitiesData=responceData
    })
  }
  getlevelsbyFacilitiesId(selectedfacility?: any) {
    this.LevelsData=[];

    this.masterDataService.getLevelsByFacilityId(selectedfacility).subscribe((responceData:any)=>{
    console.log(responceData,":::responceData:::");
    this.LevelsData=responceData
    })
  }
  
  getFacilitiesGridDatabySiteId(){
    this.FacilitiesGridData=[];

    this.masterDataService.getFacilitiesGridDatabySiteId(this.obtainedSiteId).subscribe((responceData:any)=>{
      console.log(responceData,":::responceData:::");
      this.FacilitiesGridData=responceData;
      this.masterDataService.gridData.next(responceData)
    })
  }


  onfacilitySelected(Facilityvalue:any){
      console.log(Facilityvalue);
      this.selectedfacility = Facilityvalue;

      this.masterDataService.setFacilitySelected(this.selectedfacility);
      
      this.getlevelsbyFacilitiesId(this.selectedfacility);
      
      
  }

  onlevelselected(levelvalue:any){
      console.log(levelvalue);
      this.masterDataService.setlevelselected(levelvalue);
  }
  public toggleMenu() {
    this.isClicked = !this.isClicked;
  }
}
