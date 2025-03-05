import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as maptalks from "maptalks";
import { fromEvent, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, startWith } from "rxjs/operators"; 
import { environment } from 'src/environments/environment';
import { FilesService } from '../../files.service';
import { FacilityServiceService } from '../facility-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFileComponent } from '../../dashboard/upload-file/upload-file.component';
import { DeleteFacilityDialogComponent } from '../delete-facility-dialog/delete-facility-dialog.component';
import{ui}from 'maptalks'
import { HttpClient } from '@angular/common/http';
export interface CustomHtmlOptions extends ui.UIMarkerOptions{
  id: any;
  type:any;
  name:any;
}
@Component({
  selector: 'app-onboard-facility',
  templateUrl: './onboard-facility.component.html',
  styleUrls: ['./onboard-facility.component.scss']
})
export class OnboardFacilityComponent implements OnInit, AfterViewInit {
  file: any;
  sas=environment.sasToken;
  No_of_columns: any = '1fr 1fr 1fr 1fr ';
  sites:any=[];
  public form:any = {
    siteId: '',
    facilityName:'',
    imageUrl:'',
    lan:null ,
    lat:null,
    facilityLayout:null
  };
  sampleGeojson:any={
    type: "FeatureCollection",
    features: []
  } ;
  subscription: Subscription;
  map: any;
  @ViewChild('Facilityform') myForm:any;
  obtainedSiteName: any;
  mapMarker: any;
  drawToolitems: any=['Rectangle'];
  layer: any;
  fileName: any;
  fileType: any;
  obtainedSiteId: any;
  AllFacilities: any[];
  isAllFacilities: boolean;
  NewFacility: boolean;
  editing: boolean;
  viewing: boolean;
  selectedFacilityData: any;
  FacilityMarker: ui.UIMarker;
  constructor(private http: HttpClient,private router:ActivatedRoute, private dialog:MatDialog,private dashboardService:MaplocationService,
    private routers:Router,private blobService:FilesService,private facilityService:FacilityServiceService,private snackbar:MatSnackBar
  ){
    this.sites=[];
    this.router.queryParams.subscribe((params:any) => {
      if(Object.entries(params).length>0){
        
     // console.log(params,":::Params:::");
      this.obtainedSiteName=params.siteName;
      this.obtainedSiteId = params.siteId;
      let obj:any=[{
        siteId:params.siteId,
        siteName:params.siteName
      }];
      this.sites=obj;
        this.getFacilitesbySiteId(this.obtainedSiteId)
      }
      else{
        this.routers.navigate(["/dashboard"]);
      }
    })
  }
ngAfterViewInit(): void {
  //this.initMap();

}
  ngOnInit(): void {
    

  }

  addNew() {
    this.NewFacility = true;
    this.editing = false;
    this.viewing = false;
    this.isAllFacilities = false;
    setTimeout(() => {
      this.initMap();

    }, 2000)
  }
  viewFacility(data: any) {
    this.selectedFacilityData = data;
    this.NewFacility = false;
    this.editing = false;
    this.viewing = true;
    this.isAllFacilities = false;
    setTimeout(() => {
      this.initMap();
      //this.getAllSpacesByLevelId(data.levelId);
      //this.receiveDataFromChild(data.FloorPlanImageUrl);
    }, 2000)
  }
  editFacility(data: any) {
    console.log(data,"edit Facility")
    this.selectedFacilityData = data;
    this.NewFacility = false;
    this.editing = true;
    this.viewing = false;
    this.isAllFacilities = false;
    this.form.facilityName = data.facilityName;
    this.form.siteId = this.obtainedSiteId;
    this.form.imageUrl = data.fileUrl;
    this.form.facilityId =data.facilityId

    setTimeout(() => {
      this.initMap();
      
      //this.getAllSpacesByLevelId(data.levelId);
      //this.receiveDataFromChild(data.FloorPlanImageUrl);

    }, 2000)

  }
  backtoAllFacilities() {
    this.FacilityMarker=null;
    this.viewing = false;
    this.getFacilitesbySiteId(this.obtainedSiteId)
  }
  deleteFacility(data: any) {
    this.selectedFacilityData = data;
    let deletePop: any = this.dialog.open(DeleteFacilityDialogComponent,{
      disableClose: true});
    deletePop.afterClosed().subscribe((dailogEvent: any) => {
      if (dailogEvent.event == 'Yes') {
        alert('Delete Facility is Under Progress')
       // this.deleteselectedFacility(data.facilityId);
      }
    })
  }
  deleteselectedFacility(id: any) {
    this.dashboardService.deleteFacility(id).subscribe((data: any) => {
      if (data) {
        this.snackbar.open('Level Deleted ', 'ok', {
          duration: 2000,
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center",
          panelClass: 'error-snackbar'
          // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
        this.getFacilitesbySiteId(this.obtainedSiteId)
      }
    })
  }
  getFacilitesbySiteId(siteId){
    this.AllFacilities=[]
    this.dashboardService.getFacilitiessBySiteId(siteId).subscribe((responce:any)=>{
        if(responce.length>0){
          this.isAllFacilities = true;
          console.log(responce,"getFacilitesbySiteId")
          this.AllFacilities=responce;
        }else{
          this.addNew()
        }
    })  
  }


  initMap(){
    this.map=null;
    (document.getElementById('facility-map')as HTMLElement).innerHTML='';
    this.map = new maptalks.Map("facility-map", {
      center :[-1.85306,52.63249],
      zoom: 1,
      minZoom:2,
      pitch: 6,
      layerSwitcherControl: {
        'position'  : {'top': '20', 'right': '200'},
        // title of base layers
        
        'baseTitle' : 'Base Layers',
        // title of layers
        'overlayTitle' : 'Layers',
        'repeatWorld' :false,
        'excludeLayers' : ['vector'],
        // css class of container element, maptalks-layer-switcher by default
        'containerClass' : 'maptalks-layer-switcher'
      },
      baseLayer: new maptalks.GroupTileLayer('Base TileLayer', [
       
        new maptalks.TileLayer('Carto Dark',{
          'visible' : false,
          repeatWorld :false,
          urlTemplate:"https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
            subdomains: ["a", "b", "c", "d"]
        }),
        
        new maptalks.TileLayer('Satellite',{
          'visible' : true,
          repeatWorld :false,
          'urlTemplate': 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          subdomains: ['mt0','mt1','mt2','mt3'],
          attribution:
          '© <a href="http://osm.org">OpenStreetMap</a>  contributors, © <a href="https://carto.com/">CARTO</a> ',
        })
      ])
    });
   
    this.layer = new maptalks.VectorLayer('vector').setOptions({
      editable : true,
    }).addTo(this.map);
    this.NewFacility? this.getAllSites():'';
    this.viewing?this.MapInfoMarker():'';
    this.editing?this.createDraggaleMarker():'';
    var drawTool = new maptalks.DrawTool({
      mode: 'Point',
    }).addTo(this.map).disable();
    
    drawTool.on('drawend',  (param:any)=> {
      let obtainedGeojson:any = JSON.stringify(param.geometry.toGeoJSON());
        let parsedObject:any = JSON.parse(obtainedGeojson)
        console.log(parsedObject,'parsedObject');
        this.sampleGeojson.features.push(parsedObject);
        this.layer.addGeometry(param.geometry);
      this.form.facilityLayout=JSON.stringify(parsedObject);
      
  
    });
    this.map.getLayer('vector').bringToFront();
    // (document.querySelector(".maptalks-attribution")as HTMLElement).innerHTML=''
  
    var selectedtype:any=''
    var items = this.drawToolitems.map( (value:any)=> {
      return {
        item: value,
        click:  ()=> {
          
          drawTool.setMode(value).enable();
        }
      };
    });
    new maptalks.control.Toolbar({
      items: [
        {
          item: 'Shape',
          children: items
        },
        {
          item: 'Disable',
          click:  ()=> {
            drawTool.disable();
          }
        },
        {
          item: 'Clear',
          click:  () =>{
          
            this.layer.clear();
            this.form.facilityLayout=null;
          
          }
        }
      ]
    }).addTo(this.map).show();
  
    /*escape button press ending draw polygon feature  */
    const keyDowns:any = fromEvent(document, 'keydown').pipe(
      filter((e: KeyboardEvent) => e.keyCode === 27),
      distinctUntilChanged()
    );
    this.subscription = keyDowns.subscribe(escpress => {
      if (escpress.type === 'keydown') {
        drawTool.disable();
  
      }
    });
  }
  createDraggaleMarker(){
    console.log(this.selectedFacilityData);
    let customoptions:CustomHtmlOptions= {
      'draggable': true,
      'single': false,
      'id' : this.obtainedSiteId,
      'name': this.obtainedSiteName,
      'type': 'sitemarker',
      'content': `
        <style> 
       
.pin {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  background: #89849b;
  position: absolute;
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -20px 0 0 -20px;
  -webkit-animation-name: bounce;
  -moz-animation-name: bounce;
  -o-animation-name: bounce;
  -ms-animation-name: bounce;
  animation-name: bounce;
  -webkit-animation-fill-mode: both;
  -moz-animation-fill-mode: both;
  -o-animation-fill-mode: both;
  -ms-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  -o-animation-duration: 1s;
  -ms-animation-duration: 1s;
  animation-duration: 1s;
}
.pin:after {
  content: '';
  width: 14px;
  height: 14px;
  margin: 8px 0 0 8px;
  background: #2f2f2f;
  position: absolute;
  border-radius: 50%;
}
.pulse {
  background: rgba(0,0,0,0.2);
  border-radius: 50%;
  height: 14px;
  width: 14px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: 11px 0px 0px -12px;
  -webkit-transform: rotateX(55deg);
  -moz-transform: rotateX(55deg);
  -o-transform: rotateX(55deg);
  -ms-transform: rotateX(55deg);
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
  -webkit-animation: pulsate 1s ease-out;
  -moz-animation: pulsate 1s ease-out;
  -o-animation: pulsate 1s ease-out;
  -ms-animation: pulsate 1s ease-out;
  animation: pulsate 1s ease-out;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  opacity: 0;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  filter: alpha(opacity=0);
  -webkit-box-shadow: 0 0 1px 2px #89849b;
  box-shadow: 0 0 1px 2px #89849b;
  -webkit-animation-delay: 1.1s;
  -moz-animation-delay: 1.1s;
  -o-animation-delay: 1.1s;
  -ms-animation-delay: 1.1s;
  animation-delay: 1.1s;
}
@-moz-keyframes pulsate {
  0% {
    -webkit-transform: scale(0.1, 0.1);
    -moz-transform: scale(0.1, 0.1);
    -o-transform: scale(0.1, 0.1);
    -ms-transform: scale(0.1, 0.1);
    transform: scale(0.1, 0.1);
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
  }
  50% {
    opacity: 1;
    -ms-filter: none;
    filter: none;
  }
  100% {
    -webkit-transform: scale(1.2, 1.2);
    -moz-transform: scale(1.2, 1.2);
    -o-transform: scale(1.2, 1.2);
    -ms-transform: scale(1.2, 1.2);
    transform: scale(1.2, 1.2);
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
  }
}
@-webkit-keyframes pulsate {
  0% {
    -webkit-transform: scale(0.1, 0.1);
    -moz-transform: scale(0.1, 0.1);
    -o-transform: scale(0.1, 0.1);
    -ms-transform: scale(0.1, 0.1);
    transform: scale(0.1, 0.1);
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
  }
  50% {
    opacity: 1;
    -ms-filter: none;
    filter: none;
  }
  100% {
    -webkit-transform: scale(1.2, 1.2);
    -moz-transform: scale(1.2, 1.2);
    -o-transform: scale(1.2, 1.2);
    -ms-transform: scale(1.2, 1.2);
    transform: scale(1.2, 1.2);
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
  }
}
@-o-keyframes pulsate {
  0% {
    -webkit-transform: scale(0.1, 0.1);
    -moz-transform: scale(0.1, 0.1);
    -o-transform: scale(0.1, 0.1);
    -ms-transform: scale(0.1, 0.1);
    transform: scale(0.1, 0.1);
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
  }
  50% {
    opacity: 1;
    -ms-filter: none;
    filter: none;
  }
  100% {
    -webkit-transform: scale(1.2, 1.2);
    -moz-transform: scale(1.2, 1.2);
    -o-transform: scale(1.2, 1.2);
    -ms-transform: scale(1.2, 1.2);
    transform: scale(1.2, 1.2);
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
  }
}
@keyframes pulsate {
  0% {
    -webkit-transform: scale(0.1, 0.1);
    -moz-transform: scale(0.1, 0.1);
    -o-transform: scale(0.1, 0.1);
    -ms-transform: scale(0.1, 0.1);
    transform: scale(0.1, 0.1);
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
  }
  50% {
    opacity: 1;
    -ms-filter: none;
    filter: none;
  }
  100% {
    -webkit-transform: scale(1.2, 1.2);
    -moz-transform: scale(1.2, 1.2);
    -o-transform: scale(1.2, 1.2);
    -ms-transform: scale(1.2, 1.2);
    transform: scale(1.2, 1.2);
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
  }
}
@-moz-keyframes bounce {
  0% {
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
    -webkit-transform: translateY(-2000px) rotate(-45deg);
    -moz-transform: translateY(-2000px) rotate(-45deg);
    -o-transform: translateY(-2000px) rotate(-45deg);
    -ms-transform: translateY(-2000px) rotate(-45deg);
    transform: translateY(-2000px) rotate(-45deg);
  }
  60% {
    opacity: 1;
    -ms-filter: none;
    filter: none;
    -webkit-transform: translateY(30px) rotate(-45deg);
    -moz-transform: translateY(30px) rotate(-45deg);
    -o-transform: translateY(30px) rotate(-45deg);
    -ms-transform: translateY(30px) rotate(-45deg);
    transform: translateY(30px) rotate(-45deg);
  }
  80% {
    -webkit-transform: translateY(-10px) rotate(-45deg);
    -moz-transform: translateY(-10px) rotate(-45deg);
    -o-transform: translateY(-10px) rotate(-45deg);
    -ms-transform: translateY(-10px) rotate(-45deg);
    transform: translateY(-10px) rotate(-45deg);
  }
  100% {
    -webkit-transform: translateY(0) rotate(-45deg);
    -moz-transform: translateY(0) rotate(-45deg);
    -o-transform: translateY(0) rotate(-45deg);
    -ms-transform: translateY(0) rotate(-45deg);
    transform: translateY(0) rotate(-45deg);
  }
}
@-webkit-keyframes bounce {
  0% {
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
    -webkit-transform: translateY(-2000px) rotate(-45deg);
    -moz-transform: translateY(-2000px) rotate(-45deg);
    -o-transform: translateY(-2000px) rotate(-45deg);
    -ms-transform: translateY(-2000px) rotate(-45deg);
    transform: translateY(-2000px) rotate(-45deg);
  }
  60% {
    opacity: 1;
    -ms-filter: none;
    filter: none;
    -webkit-transform: translateY(30px) rotate(-45deg);
    -moz-transform: translateY(30px) rotate(-45deg);
    -o-transform: translateY(30px) rotate(-45deg);
    -ms-transform: translateY(30px) rotate(-45deg);
    transform: translateY(30px) rotate(-45deg);
  }
  80% {
    -webkit-transform: translateY(-10px) rotate(-45deg);
    -moz-transform: translateY(-10px) rotate(-45deg);
    -o-transform: translateY(-10px) rotate(-45deg);
    -ms-transform: translateY(-10px) rotate(-45deg);
    transform: translateY(-10px) rotate(-45deg);
  }
  100% {
    -webkit-transform: translateY(0) rotate(-45deg);
    -moz-transform: translateY(0) rotate(-45deg);
    -o-transform: translateY(0) rotate(-45deg);
    -ms-transform: translateY(0) rotate(-45deg);
    transform: translateY(0) rotate(-45deg);
  }
}
@-o-keyframes bounce {
  0% {
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
    -webkit-transform: translateY(-2000px) rotate(-45deg);
    -moz-transform: translateY(-2000px) rotate(-45deg);
    -o-transform: translateY(-2000px) rotate(-45deg);
    -ms-transform: translateY(-2000px) rotate(-45deg);
    transform: translateY(-2000px) rotate(-45deg);
  }
  60% {
    opacity: 1;
    -ms-filter: none;
    filter: none;
    -webkit-transform: translateY(30px) rotate(-45deg);
    -moz-transform: translateY(30px) rotate(-45deg);
    -o-transform: translateY(30px) rotate(-45deg);
    -ms-transform: translateY(30px) rotate(-45deg);
    transform: translateY(30px) rotate(-45deg);
  }
  80% {
    -webkit-transform: translateY(-10px) rotate(-45deg);
    -moz-transform: translateY(-10px) rotate(-45deg);
    -o-transform: translateY(-10px) rotate(-45deg);
    -ms-transform: translateY(-10px) rotate(-45deg);
    transform: translateY(-10px) rotate(-45deg);
  }
  100% {
    -webkit-transform: translateY(0) rotate(-45deg);
    -moz-transform: translateY(0) rotate(-45deg);
    -o-transform: translateY(0) rotate(-45deg);
    -ms-transform: translateY(0) rotate(-45deg);
    transform: translateY(0) rotate(-45deg);
  }
}
@keyframes bounce {
  0% {
    opacity: 0;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
    -webkit-transform: translateY(-2000px) rotate(-45deg);
    -moz-transform: translateY(-2000px) rotate(-45deg);
    -o-transform: translateY(-2000px) rotate(-45deg);
    -ms-transform: translateY(-2000px) rotate(-45deg);
    transform: translateY(-2000px) rotate(-45deg);
  }
  60% {
    opacity: 1;
    -ms-filter: none;
    filter: none;
    -webkit-transform: translateY(30px) rotate(-45deg);
    -moz-transform: translateY(30px) rotate(-45deg);
    -o-transform: translateY(30px) rotate(-45deg);
    -ms-transform: translateY(30px) rotate(-45deg);
    transform: translateY(30px) rotate(-45deg);
  }
  80% {
    -webkit-transform: translateY(-10px) rotate(-45deg);
    -moz-transform: translateY(-10px) rotate(-45deg);
    -o-transform: translateY(-10px) rotate(-45deg);
    -ms-transform: translateY(-10px) rotate(-45deg);
    transform: translateY(-10px) rotate(-45deg);
  }
  100% {
    -webkit-transform: translateY(0) rotate(-45deg);
    -moz-transform: translateY(0) rotate(-45deg);
    -o-transform: translateY(0) rotate(-45deg);
    -ms-transform: translateY(0) rotate(-45deg);
    transform: translateY(0) rotate(-45deg);
  }
}

        </style>

     <div class='pin'></div>
    <div class='pulse'></div>
      `
    };

    this.FacilityMarker= new ui.UIMarker(JSON.parse(this.selectedFacilityData.facilitylocation).coordinates, customoptions).addTo(this.map).addEventListener('dragend',(e:any)=>{
      console.log(e,"afterdraging");
      const lngLat = e.coordinate;
      this.form.lan=lngLat.x;
      this.form.lat=lngLat.y;
      this.form.siteId=this.obtainedSiteId;
    });
    this.map.setCenterAndZoom(JSON.parse(this.selectedFacilityData.facilitylocation).coordinates,18);
    this.form.lan=JSON.parse(this.selectedFacilityData.facilitylocation).coordinates[0];
    this.form.lat=JSON.parse(this.selectedFacilityData.facilitylocation).coordinates[1];
    this.form.facilityLayout=this.selectedFacilityData.geometry;
    this.createFilledpolygons(JSON.parse(this.selectedFacilityData.geometry));
  }
  createFilledpolygons(geojsonFile: any) {
    console.log(geojsonFile,"URL::::")
    this.sampleGeojson.features = [];
        this.sampleGeojson.features.push(geojsonFile);
        // Add a polygon geometry to the map's vector layer
        this.layer.addGeometry(new maptalks.Polygon(geojsonFile.coordinates, {
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
            facilityId: this.selectedFacilityData.facilityId,                                      // Polygon ID
            facilityName: this.selectedFacilityData.facilityName,                                   // Space Name (assuming it's related to levelname)
            name: this.selectedFacilityData.facilityName,                                        // Name (assuming it's related to levelname)
            altitude: 0,                   // Altitude adjustment based on index and ArrayLength
            visible: true,                                          // Polygon visibility
          },
        }))
  
  }

  MapInfoMarker(){
    let customoptions:CustomHtmlOptions= {
      'draggable': false,
      'single': false,
      'id' : this.obtainedSiteId,
      'name': this.obtainedSiteName,
      'type': 'sitemarker',
      'content': `
      <style>   
      .main {
        min-height: 100px;
        min-width: 200px;
        background-color: #673ab7;
        border-radius: 8px;
        display: flex;
        padding: 5px;
        box-sizing: border-box;
        position: relative;
    }
    .main::after{
        content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-width: 10px;
      border-style: solid;
      border-color: #673ab7 transparent transparent transparent;
    }
    .marker{
        max-width: 100%; 
        display: flex;
        justify-content: space-around;
    }
    
    .image{
        background-color: none;
        border-radius: 5px;
        width: 200px;
        height: 100%;
        margin-right: 5px;
        flex: 1;
    }
    
    .image img{
        width: 100%;
        height: 100%;
        object-fit: fill;
        border-radius: 5px;
    }
    
    .info{
        /* background-color: aquamarine; */
        height: 100%;
        width: 100%;
        display: flex;
        flex: 2;
        flex-grow: 5;
        flex-direction: column;
        padding-left: 10px;
        color:#ffff;

    }
    .title{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width:100%;
    }

      </style>
      <div class="marker" id='sitemarker'>
      <div class="main">
        <div class="image">
        <img src='${this.selectedFacilityData.fileUrl}' alt="Profile Image">
        </div>
        <div class="info">
          <div class="title">FacilityName: ${this.selectedFacilityData.facilityName}</div>
          <div class="contant">📍<span>${JSON.parse(this.selectedFacilityData.facilitylocation).coordinates} </span></div>
        </div>
      </div>
    </div>
     
      `,
    }
    this.FacilityMarker= new ui.UIMarker(JSON.parse(this.selectedFacilityData.facilitylocation).coordinates, customoptions).addTo(this.map)
    this.map.setCenterAndZoom(JSON.parse(this.selectedFacilityData.facilitylocation).coordinates,20);
  }

  onSubmit(Data:any) {
    if(!this.file){
      this.openDialog()
    }
    else if(this.file && this.file !='ignore'){
      const formData = new FormData();
      formData.append('file', this.file);
        console.log(this.file.name,"Filename");
      this.fileName = this.file.name;
      this.fileType =this.file.name.split(".")[1];
      console.log(this.fileName,'::',this.fileType)
      if (this.fileName) {
        this.blobService.uploadImage(this.sas, this.file, this.obtainedSiteName.replace(/\s+/g, '')+"/"+ this.form.facilityName.replace(/\s+/g, '')+"/"+this.fileType + "/" + this.file.name, () => {
        });
        this.form.imageUrl = `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.obtainedSiteName.replace(/\s+/g, '')}/${this.form.facilityName.replace(/\s+/g, '')}/${this.fileType}/${this.fileName}`;
        !this.editing?this.addFacility(this.form):this.updateFacility(this.form)
      }
    }
    else if(this.file =='ignore' && Data){
      console.log(Data,"API payload");
      this.form.imageUrl='';
      !this.editing?this.addFacility(this.form):this.updateFacility(this.form);
    }
    this.facilityService.obtainedError.subscribe((err:any)=>{
      console.log(err,"error message");
      if(err && this.routers.url=='add-site'){
        this.snackbar.open('Error in Side onboarding','ok',{
          duration: 2000,
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center",
          panelClass: 'error-snackbar'
           // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        })
      }
     
    })
  }
  private reloadImages() {
    this.blobService.listImages(this.sas).then((list) => {
      if(list){
        this.myForm.resetForm({});
        this.getFacilitesbySiteId(this.obtainedSiteId);
      }
    });

  }
  updateFacility(payload:any){
    this.facilityService.UpdateFacility(payload).subscribe((request:any)=>{
      console.log(request,"request responce body");
      if(request){
        this.snackbar.open('Facility Updated Successfully','ok',{
          duration: 2000,
          panelClass:'success-snackbar',
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
        this.reloadImages()
       
      }
    })
  }
  addFacility(payload:any){
    this.facilityService.addFacility(payload).subscribe((request:any)=>{
      console.log(request,"request responce body");
      if(request){
        this.snackbar.open('Facility Add Successfully','ok',{
          duration: 2000,
          panelClass:'success-snackbar',
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
        this.reloadImages()
      }
    })
  }


  getAllSites(){
    this.sites=[];
    this.dashboardService.getAllSites().subscribe((SitesData:any)=>{
        console.log(SitesData,"::::SitesData::::")
        this.sites=SitesData;
        let filteredSite:any=this.sites.find((obj:any)=>obj.siteName == this.obtainedSiteName);
        this.form.siteId=filteredSite.siteId;
        this.form.lan=filteredSite.location.coordinates[0];
          this.form.lat=filteredSite.location.coordinates[1];
        this.map.setCenterAndZoom(filteredSite.location.coordinates,20);
        let customoptions:CustomHtmlOptions= {
          'draggable': true,
          'single': false,
          'id' : this.obtainedSiteId,
          'name': this.obtainedSiteName,
          'type': 'sitemarker',
          'content': `
          <style>   
    .pin {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  background: #00cae9;
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -20px 0 0 -20px;
}
.pin:after {
  content: "";
  width: 14px;
  height: 14px;
  margin: 8px 0 0 8px;
  background: #e6e6e6;
  position: absolute;
  border-radius: 50%;
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
          <div class='pin bounce'></div>
<div class='pulse'></div>
         
          `,
        }
        this.FacilityMarker= new ui.UIMarker(filteredSite.location.coordinates, customoptions).addEventListener('dragend',(e:any)=>{
          console.log(e,"afterdraging");
          const lngLat = e.coordinate;
          this.form.lan=lngLat.x;
          this.form.lat=lngLat.y;
        }).addTo(this.map)

        // this.mapMarker = new maptalks.Marker(
        //   filteredSite.location.coordinates,
        //   {
        //     'draggable':true,
        //   'symbol' : {
        //     'markerFile'   : '../../../../assets/buildings.png',
        //     'markerWidth'  : 28,
        //     'markerHeight' : 40,
        //     'markerDx'     : 0,
        //     'markerDy'     : 0,
        //     'markerOpacity': 1
        //   }
        // }
        // ).addTo(this.map.getLayer('vector')).addEventListener('dragend',(e:any)=>{
        //   console.log(e,"afterdraging");
        //   const lngLat = e.coordinate;
        //   this.form.lan=lngLat.x;
        //   this.form.lat=lngLat.y;
        // });

        
    })
}
  openDialog(){
    let dialogRef:any=this.dialog.open(UploadFileComponent,{
      disableClose: true,
      data:'image/jpeg, image/png'
    });
    dialogRef.afterClosed().subscribe((dialogData:any) => {
     if(dialogData.data){
      
      this.file= dialogData.data;
     }
      
    })
  }
}
