import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as maptalks from "maptalks";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as turf from '@turf/turf'
import{ui}from 'maptalks';
import { MatSnackBar } from '@angular/material/snack-bar';
export interface CustomHtmlOptions extends ui.UIMarkerOptions{
  deviceId: any;
  spaceId:any;
  showdelete:any;
}
//import * as image from ''
@Component({
  selector: 'app-device-floor-plan',
  templateUrl: './device-floor-plan.component.html',
  styleUrls: ['./device-floor-plan.component.scss']
})
export class DeviceFloorPlanComponent implements OnInit, OnChanges {
  @Input() SelectedLevelData: any = [];
  @Output() showToolbar = new EventEmitter<boolean>();
  map: any;
  layer: any;
  geometrylayer: any;
  mappeddevices:any=[]
  unMappedDevices:any=[];
  obtainedGeometry: any;
  polygon: any;
  imageLayer: any;
  file: Blob;
  sampleGeojson: any = {
    type: "FeatureCollection",
    features: []
  };
  showdelete:boolean=false;
  MappedDevices:any=[];
  derivedGeometries: any;
  deviceMarker: any;
  mapMarker: maptalks.Marker;
  hoverdSpaceId: any;
  RoomMarkerCoordinates: any;
  obtainedSiteId: any;
  obtainedFaciltiyId: any;
  constructor(private dashboardService:MaplocationService,private router: ActivatedRoute,private http: HttpClient,private snackbar: MatSnackBar){
    this.router.queryParams.subscribe((params: any) => {
      this.obtainedSiteId = params.siteId;
        this.obtainedFaciltiyId = params.facilityId;
      this.obtainedGeometry = JSON.parse(params.layout)
    })
    this.unMappedDevices=[];
    this.dashboardService.UnmappedDevices.subscribe((unmappeDevicesData:any)=>{
      unmappeDevicesData.forEach((device:any) => {
     
      if(device.deviceType == 'Smart Display' ){
        device.src='../../../../assets/images/smart-display.png'
      }
      else if(device.deviceType == 'Work Validation Scanner'){
        device.isAdvance? device.src='../../../../assets/images/scan-advance.png':device.src='../../../../assets/images/barcode-scanner-advance.png'
  
      }
      else if(device.deviceType == 'Occupancy Sensor'){
        device.isAdvance? device.src='../../../../assets/images/ocp-advance.png':device.src='../../../../assets/images/occp-basic.png'
  
      }
      else if(device.deviceType == 'People Counter'){
         device.src='../../../../assets/images/people-enter.png'
      }
        
      });
      console.log(unmappeDevicesData)
      
      this.unMappedDevices=unmappeDevicesData;
    })
  }
  ngOnInit(): void {
    this.initMap()
  }
  ngOnChanges(): void {
    this.MappedDevices=[];
    console.log(this.SelectedLevelData);
    if(this.SelectedLevelData.Spaces.length>0){
      this.SelectedLevelData.Spaces.forEach((space:any) => {
        if(space.Devices.length>0){
          space.Devices.forEach((device:any) => {
              this.MappedDevices.push(device);
          });
        }
      });
    }

    this.sampleGeojson.features = [];

    /* remove existing Device  Markers  */
    this.map.getLayers().forEach((layer:any) => {
      if(layer.map.uiList){
        layer.map.uiList.forEach((ui:any) => {
          ui.remove()
        }); 
      }
      
     
    });
    
    /**************** */

    /**removing existing space polygons and Space name markers */
   this.geometrylayer? this.geometrylayer.clear():'';
   /** */
    this.refereancingFloorpalnImage(this.SelectedLevelData.FloorPlanImageUrl);
    this.createFilledPolygons_For_Rooms_And_Other_Structures(this.SelectedLevelData.Geojsonfile);
  }
  initMap() {

    //////////console.log(this.obtainedGeometry);
    this.map = null;
    (document.getElementById('device-map') as HTMLElement).innerHTML = '';
    this.map = new maptalks.Map("device-map", {
      center: [-1.85306, 52.63249],
      zoom: 1,
      minZoom: 16,
      pitch: 6,
      baseLayer: new maptalks.TileLayer("base", {
        urlTemplate: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
        subdomains: ["a", "b", "c", "d"]
      }),
    });
   
    /* creating seperate vectorLayer for shapes  */
    this.geometrylayer = new maptalks.VectorLayer('v').setOptions({
      editable: true,
    }).addTo(this.map);

    /*created layer for layout  */
    this.layer = new maptalks.VectorLayer('vector').setOptions({
      editable: true,
    }).addTo(this.map);
    this.polygon = new maptalks.Polygon(this.obtainedGeometry.coordinates, {
      symbol: {
        polygonFill: '#fff',
        polygonOpacity: 0.5
      },
      properties: {
        id: 'layout',
      }
    });


    this.layer.setOptions({ enableAltitude: true }).addGeometry(this.polygon);

    this.map.fitExtent(this.polygon.getExtent(), 0);
    
    this.imageLayer = new maptalks.ImageLayer('images');

    this.map.addLayer(this.imageLayer);
  }
  refereancingFloorpalnImage(data: any) {
    //////////console.log(data,"::::image from sidenav::::")

    let oldImages: any = this.imageLayer.getImages();
    oldImages.length > 0 ? this.imageLayer.getImages().pop() : '';
    const img = document.createElement("img");
    img.src = data;

    // Convert base64 to Blob
    fetch(data)
      .then(res => res.blob())
      .then(blob => {
        // Create a URL for the Blob
        this.file = blob;
        const url = URL.createObjectURL(blob);
        //////////console.log(blob,"::::blob:::")

        this.imageLayer.setImages([{
          'url': url,
          'extent': this.polygon.getExtent(),
          'visible': true,
          'crossOrigin': 'anonymous',  // Specify cross-origin setting if loading external images
          'attribution': '',
          'forceRenderOnRotating': true
        }]);
      });
   // this.enablecreateLevel = true;

    // You can handle the received data here
  
  }
  createFilledPolygons_For_Rooms_And_Other_Structures(geojsonFileURL:any){
    var coordinates: any;
    this.hoverdSpaceId='';
    this.sampleGeojson.features = [];
    this.derivedGeometries=[];
    this.http.get(String(geojsonFileURL)).subscribe((response: any) => {
      response.features.forEach((item: any, i: any) => {
        if (item.properties.SpaceName !== 'wall' && item.properties.SpaceName !== 'floor') {
          let derivedspaceId:any = this.SelectedLevelData.Spaces.find((obj: any) => obj.Level_Id == this.SelectedLevelData.levelId && obj.spaceName == item.properties.SpaceName);
          item.properties.SpaceId = derivedspaceId.spaceId;
          item.properties.SpaceName = derivedspaceId.spaceName;
        }

        this.sampleGeojson.features.push(item);

        if (item.geometry.type == "Polygon") {
          coordinates = item.geometry.coordinates;
        } else if (item.geometry.type == "MultiPolygon") {
          coordinates = item.geometry.coordinates[0][0];
        }

        // Add a polygon geometry to the map's vector layer
        this.geometrylayer.addGeometry(new maptalks.Polygon(item.geometry.coordinates, {
          visible: true,         // Polygon visibility
          editable: true,        // Polygon can be edited
          cursor: "pointer",     // Pointer cursor on polygon
          draggable: false,      // Polygon not draggable
          dragShadow: false,     // No drag shadow displayed
          drawOnAxis: null,      // No axis constraint for dragging
          symbol: {
            'lineColor': 'black',
            'lineWidth': 2,
            'polygonFill': 'rgb(135,196,240)',
            'polygonOpacity': 0.6 // Polygon opacity
          },
          properties: {
            SpaceId: item.properties.SpaceId,                                      // Polygon ID
            SpaceName: item.properties.SpaceName,                                   // Space Name (assuming it's related to levelname)
            name: item.properties.SpaceName,                                        // Name (assuming it's related to levelname)
            altitude: 0,                   // Altitude adjustment based on index and ArrayLength
            visible: true,                                          // Polygon visibility
          },
        })).bringToFront();


      });
      let otherPolygon: any = this.geometrylayer.getGeometries().filter((geo: any, index: any) =>
        (geo.properties.SpaceName == 'wall' || geo.properties.SpaceName == 'floor')
      );
      otherPolygon.forEach((str: any) => {
        str.addEventListener('contextmenu', (e: any) => {
          // this.selectedRoomName = e.target.properties.SpaceName
          // e.target.startEdit();
         // this.showToolbar.emit(true);
        })
      })
      this.derivedGeometries= this.geometrylayer.getGeometries().filter((geo: any, index: any) =>
        geo.type != 'Point' && (geo.properties.name != null || geo.properties.name != undefined) && (geo.properties.SpaceName !== 'wall' && geo.properties.SpaceName !== 'floor')
      );

      this.derivedGeometries.forEach(async (geo: any) => {
        geo.addEventListener('click', (e: any) => {
       
        })
        geo.addEventListener('contextmenu', (e: any) => {
          // this.selectedRoomName = e.target.properties.SpaceName ? e.target.properties.SpaceName : e.target.properties.name;
          // e.target.startEdit();
          // this.showToolbar = true;

        })
        geo.addEventListener('mouseover',(e:any)=>{
      
          this.hoverdSpaceId = e.target.properties.SpaceId;
          this.RoomMarkerCoordinates=e.coordinate;
        })
        this.createTextmarker(geo.getCenter(), geo.properties.SpaceName, geo.properties.SpaceId, geo.getSize().width, geo.getSize().height)
       await this.plot_Custom_PNG_Markers_For_Devices(geo.properties.SpaceId,geo);
      });
    })
  }
  createTextmarker(point: any, Name, SpaceId: any, width: any, height: any) {
    //////////console.log(Name,"::::Spacenames :::::")
    new maptalks.Marker(
      point,
      {
        'properties': {
          'name': Name,
          'spaceId': SpaceId ? SpaceId : 'newSpace'
        },
        'symbol': {
          'textFaceName': 'sans-serif',
          'textName': Name,          //value from name in geometry's properties
          'textWeight': width / 2, //'bold', 'bolder'
          'textStyle': height / 2,
          'textSize': 9,
          'textFill': '#fff',
          'markerFillOpacity': 1,
          'textDy': 5,
          'textHaloFill': 'blue',
          'textHaloRadius': 5,
          'textWrapWidth': null,
          'textWrapCharacter': '\n',
          'textLineSpacing': 0,

          'textDx': 0,
          'textHorizontalAlignment': 'middle', //left | middle | right | auto
          'textVerticalAlignment': 'middle',   // top | middle | bottom | auto
          'textAlign': 'center'
        }
      }
    ).on('click', (e: any) => {


    }).addTo(this.geometrylayer);

  }
 async plot_Custom_PNG_Markers_For_Devices(geoSpaceId:any,geo:any){

      this.SelectedLevelData.Spaces.forEach((Space:any,i:any) => {
          if(Space.spaceId == geoSpaceId){
            
            this.SelectedLevelData.Spaces[i].Devices.forEach(async (device:any,j:any) => {
              
                if(geo.properties.SpaceId ==device.Space_Id ){
                  let centerPonint:any = geo.getCenter().toArray();
                 let polygeometry :any = geo.toGeoJSON();
                 console.log(polygeometry,"polygeometry")

                 const polygon = turf.polygon(polygeometry.geometry.coordinates);
                  // Number of random points to generate
                  const numberOfPoints = this.SelectedLevelData.Spaces[i].Devices.length;
                  console.log(numberOfPoints,"::::no of points:::")
                  // Generate random points within the polygon
                  const randomPoints = [];
                  while (randomPoints.length < numberOfPoints) {
                    const point = turf.randomPoint(1, { bbox: turf.bbox(polygon) });
                    if (turf.booleanPointInPolygon(point.features[0], polygon)) {
                     // ;
                      randomPoints.push(point.features[0].geometry.coordinates);
                    }
                  }
                await this.createDraggaleMarker(geo.properties.SpaceId,device.deviceId,device.deviceType,device.isAdvance,randomPoints[0])
                  console.log(randomPoints);
                   //

                    
                  // while (randomPoints.length == this.SelectedLevelData.Spaces[i].Devices.length) { // change 10 to the desired number of points
                  //   const point = this.getRandomPointInBBox(spacesGeometry);
                  //   if (this.isPointInPolygon(point, geo)) {
                  //     randomPoints.push(point);
                  //     console.log(randomPoints)
                  //   }
                  // }
                }
             
            });
          }
      }); 
  }


 async createDraggaleMarker(SpaceId,deviceId:any,deviceName:any,isAdvance:any,point:any){
    console.log(isAdvance,"::::isAdvance::::::");
    console.log(deviceName,'::deviceName:::');

    var src = ''
    if(deviceName == 'Smart Display' ){
      src='../../../../assets/images/smart-display.png'
    }
    else if(deviceName == 'Work Validation Scanner'){
      isAdvance? src='../../../../assets/images/scan-advance.png':src='../../../../assets/images/barcode-scanner-advance.png'

    }
    else if(deviceName == 'Occupancy Sensor'){
      isAdvance? src='../../../../assets/images/ocp-advance.png':src='../../../../assets/images/occp-basic.png'

    }
    else if(deviceName == 'People Counter'){
       src='../../../../assets/images/people-enter.png'
    }


    console.log(src,":::src:::");

    let customoptions:CustomHtmlOptions= {
      'draggable': true,
      'single': false,
        'deviceId':deviceId,
        'spaceId':SpaceId,
        'showdelete':this.showdelete,
      'content': `
      <style>   
.pin {
width: 30px;
height: 30px;
border-radius: 50% 50% 50% 0;
background: gray;
position: absolute;
transform: rotate(45deg);
left: 50%;
top: 50%;
margin: -20px 0 0 -20px;
img{
transform: rotate(45deg);
width: 30px;
height: 30px;
border-radius: 50% 50% 50% 0;
}
}


.bounce {
animation-name: bounce;
animation-fill-mode: both;
animation-duration: 1s;
}

.pulse {
background: #d6d4d4;
border-radius: 50%;
height: 14px;
width: 14px;
position: absolute;
left: 50%;
top: 50%;
margin: 11px 0px 0px -12px;
transform: rotateX(55deg);
z-index: -2;
}
.pulse:after {
content: "";
border-radius: 50%;
height: 40px;
width: 40px;
position: absolute;
margin: -13px 0 0 -13px;
animation: pulsate 1s ease-out;
animation-iteration-count: infinite;
opacity: 0;
box-shadow: 0 0 1px 2px #00cae9;
animation-delay: 1.1s;
}

@keyframes pulsate {
0% {
transform: scale(0.1, 0.1);
opacity: 0;
}

50% {
opacity: 1;
}

100% {
transform: scale(1.2, 1.2);
opacity: 0;
}
}

@keyframes bounce {
0% {
opacity: 0;
transform: translateY(-2000px) rotate(-45deg);
}

60% {
opacity: 1;
transform: translateY(30px) rotate(-45deg);
}

80% {
transform: translateY(-10px) rotate(-45deg);
}

100% {
transform: translateY(0) rotate(-45deg);
}
}
      </style>
      <div class='pin bounce'><img src ='${src}'></div>
<div class='pulse'></div>
     
      `,
    }
    new ui.UIMarker(point, customoptions).setOptions({
       'deviceId':deviceId,
        'spaceId':SpaceId,
        'showdelete':this.showdelete,
    }).addEventListener('contextmenu', (e: any) => {
     
      e.target.showdelete=!this.showdelete;
     this.showToolbar.emit( e.target.showdelete);
     this.showdelete= e.target.showdelete;
    }).addEventListener('mouseenter', (e: any) => {
      e.target.showdelete=false;
      this.showdelete= false;
      this.showToolbar.emit( false);
    }).addEventListener('dragend',(e:any)=>{
      console.log(e.target.options,"afterdraging");
      if((this.hoverdSpaceId !== null && this.hoverdSpaceId !=undefined) && e.target.options.spaceId !== this.hoverdSpaceId){
       let targetedDEvice:any= this.MappedDevices.find((obj:any)=>obj.deviceId == e.target.options.deviceId);
       console.log(targetedDEvice)
        e.target.options.spaceId=this.hoverdSpaceId;
       targetedDEvice.Space_Id=this.hoverdSpaceId;
       this.updateDevice(targetedDEvice);
      }
    }).addTo(this.map);
    customoptions=null
    // this.mapMarker = new maptalks.Marker(
    //   point,
    //   {
    //     'draggable':true,
        
    //   'symbol' : {
    //     'markerFile'   : src,
    //     'markerWidth'  : 28,
    //     'markerHeight' : 40,
    //     'markerDx'     : 0,
    //     'markerDy'     : 0,
    //     'markerOpacity': 3
    //   },
    //   'properties':{
    //     'deviceId':deviceId,
    //     'spaceId':SpaceId,
    //     'showdelete':this.showdelete,
    //   }
    // }
    // ).addEventListener('contextmenu', (e: any) => {
    //   // this.selectedRoomName = e.target.properties.SpaceName
    //   // e.target.startEdit();
    //   e.target.properties.showdelete=!this.showdelete;
    //  this.showToolbar.emit( e.target.properties.showdelete);
    //  this.showdelete= e.target.properties.showdelete;
    // }).addEventListener('mouseenter', (e: any) => {
    //   e.target.properties.showdelete=false;
    //   this.showdelete= false;
    //   this.showToolbar.emit( false);
    // }).addTo(this.geometrylayer).bringToFront().addEventListener('dragend',(e:any)=>{
    //   //console.log(e,"afterdraging");
    //   if((this.hoverdSpaceId !== null && this.hoverdSpaceId !=undefined) && e.target.properties.spaceId !== this.hoverdSpaceId){
    //    let targetedDEvice:any= this.MappedDevices.find((obj:any)=>obj.deviceId == e.target.properties.deviceId);
    //     e.target.spaceId=this.hoverdSpaceId;
    //    targetedDEvice.Space_Id=this.hoverdSpaceId;
    //    this.updateDevice(targetedDEvice);
    //   }
    // });

  }
  
  updateDevice(draggedOj:any){
    this.dashboardService.updateDevice(draggedOj).subscribe((responce:any)=>{
      if(responce){
        this.snackbar.open('Device Updated Successfully', 'ok', {
          duration: 2000,
          panelClass: 'success-snackbar',
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
      }
    },(error) => {
        this.dashboardService.obtainedError.subscribe((err: any) => {
          if (err && error) {
            this.snackbar.open('Failed to Update Device Status', 'ok', {
              duration: 2000,
              verticalPosition: "top", // Allowed values are  'top' | 'bottom'
              horizontalPosition: "center",
              panelClass: 'error-snackbar'
              // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
            })
          }

        })
      })
  }
  async drop(event: CdkDragDrop<any>) {
    var pointcontains=false;
    let index :any = event.previousIndex-1 !== -1?event.previousIndex-1:0;
    let draggedobj = event.previousContainer.data[index];

    let aboutToAssignObj: any = draggedobj;
    if (event.previousContainer === event.container ) {
    
    // console.log('dropped Event', `> dropped '${event.item.data}' into '${event.container.id}'`);
     moveItemInArray(
       event.container.data,
       event.previousIndex,
       event.currentIndex
     );
   } else {
    this.derivedGeometries.forEach((geometry:any,index:any) => {
      
        if(geometry.containsPoint(this.RoomMarkerCoordinates)){
          pointcontains=true;
        }

    });
    if(pointcontains){
      
        aboutToAssignObj.Space_Id = this.hoverdSpaceId;
        aboutToAssignObj.Level_Id = this.sampleGeojson.levelId;
        aboutToAssignObj.Site_Id = this.obtainedSiteId;
        aboutToAssignObj.Facility_Id = this.obtainedFaciltiyId;
      await this.createDraggaleMarker(this.hoverdSpaceId,aboutToAssignObj.deviceId,aboutToAssignObj.deviceType,aboutToAssignObj.isAdvance,this.RoomMarkerCoordinates)
      console.log(aboutToAssignObj,"::::aboutToAssignObj:::::");
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex-1,
        event.currentIndex
      );
      console.log(event.previousContainer,"Drag drop from UnAssigned")
     this.updateDevice(aboutToAssignObj);
     //this.dashboardService.UnmappedDevices.next(event.previousContainer);
    }else{
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
    }
   
  }
 
   }
}
