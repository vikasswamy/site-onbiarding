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
  marker: maptalks.Marker;
  imageLayer:any;

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
     this. imageLayer = new maptalks.ImageLayer('images');
  
        this.map.addLayer(this.imageLayer)
     // this.create_rotate_marker();
    }
    create_rotate_marker(){
    //  this.marker = new maptalks.Marker(
    //     this.polygon.getCenter(),  // Replace with your coordinates
    //     {
    //         symbol: {
    //           visible : true,
    //           editable : true,
    //           cursor : 'pointer',
    //           draggable : false,
    //           dragShadow : false, // display a shadow during dragging
    //           drawOnAxis : null,
    //             'markerFile'   : 'https://storagesmartroute27.blob.core.windows.net/filesupload/newhome/png/Ground_Floor.png',
    //             'markerWidth': 100,
    //             'markerHeight': 100,
    //             'markerFill': '#f00',
    //             'markerDx': 0,
    //           'markerDy': 0,
    //           'markerRotation': 0 
    //                   }
    //     }
    // ).addTo(this.layer).bringToFront();
    this.imageLayer = new maptalks.ImageLayer('imageLayer',[{
      'url': 'https://storagesmartroute27.blob.core.windows.net/filesupload/newhome/png/Ground_Floor.png', 
      'extent': this.polygon.getExtent(), 
      'visible': true,
      'crossOrigin': 'anonymous',  // Specify cross-origin setting if loading external images
      'attribution': ''
    }]);
    this.map.addLayer(this.imageLayer).bringToFront();
  // Add the image marker to the ImageLayer


    }
    startEdit() {
      this.marker.startEdit();
    }
    endEdit() {
      // this.marker.endEdit();
      this.imageLayer.setRotation(45);
    }
    rotateMarker(){
     this.polygon.rotate(45, this.polygon.getCenter());
      console.log(this.imageLayer);
     
    }
    receiveDataFromChild(data: any) {
      console.log(data,"Image from Side nav")
      
        this.imageLayer.setImages([{
          'url': data, 
          'extent': this.polygon.getExtent(), 
          'visible': true,
          'crossOrigin': 'anonymous',  // Specify cross-origin setting if loading external images
          'attribution': '',
          'forceRenderOnRotating':true
        }])
      // You can handle the received data here
    }

  onSubmit(Data:any) {}
  
}
