import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MaplocationService } from 'src/app/services/maplocation.service';
import * as maptalks from "maptalks";
import { FilesService } from '../../files.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-on-board-level',
  templateUrl: './on-board-level.component.html',
  styleUrls: ['./on-board-level.component.scss']
})
export class OnBoardLevelComponent implements OnInit, AfterViewInit{
  isClicked:boolean=false;
  obtainedSiteId: any;
  map:any;
  obtainedFaciltiyId: any;
  file: any;
  layer: any;
  obtainedGeometry: any;
  polygon: any;
  fileName: any;
  fileType: any;
  obtainedFaciltiyname: any;

  constructor(private dashboardservice:MaplocationService,private router:ActivatedRoute,private dialog:MatDialog,private blobService:FilesService){
     this.router.queryParams.subscribe((params:any) => {
      console.log(params,"params:::::")
      this.obtainedSiteId=params.siteId;
      this.obtainedFaciltiyId= params.facilityId;
      this.obtainedFaciltiyname = params.facilityname;
      this.obtainedGeometry = JSON.parse(params.layout)
    });
    this.dashboardservice.falicityGridData.subscribe((data:any)=>{
      console.log(data,"gridData:::")
    });
  }
  public toggleMenu() {
    this.isClicked = !this.isClicked;
    console.log(this.isClicked)
  }
  ngAfterViewInit(): void {
    
  
  }
    ngOnInit(): void {
      
      this.initMap();
    }
   
    initMap(){
      this.map=null;
      (document.getElementById('level-map')as HTMLElement).innerHTML='';
      this.map = new maptalks.Map("level-map", {
        center :[-1.85306,52.63249],
        zoom: 1,
        minZoom:2,
        pitch: 6,
        baseLayer: new maptalks.TileLayer("base", {
          urlTemplate:"https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
          subdomains: ["a", "b", "c", "d"]
        }),
      });
     
      this.layer = new maptalks.VectorLayer('vector').setOptions({
        editable : true,
      }).addTo(this.map);
       this.polygon = new maptalks.Polygon(this.obtainedGeometry.coordinates, {
        symbol : {
          polygonFill : '#fff',
          polygonOpacity : 0.5
        },
        properties: {
          id: 'layout',
        }
      });
      this.layer.setOptions({ enableAltitude: true }).addGeometry(this.polygon);

      this.map.getLayer('vector').bringToFront();
      this.map.fitExtent(this.polygon.getExtent(), 0);
    
    }
    receiveDataFromChild(data: any) {
      const formData = new FormData();
      formData.append('file', data);
        console.log(data.name,"Filename"); var imageLayer = new maptalks.ImageLayer('images',
          [
            {
              url : data,
              extent: this.polygon.getExtent(),
              opacity : 1,
              altitude: 10,
            }
          ]);
  
        this.map.addLayer(imageLayer).bringToFront();
      
      // You can handle the received data here
    }
  onSubmit(Data:any) {}
  
}
