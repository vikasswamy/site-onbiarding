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

@Component({
  selector: 'app-onboard-facility',
  templateUrl: './onboard-facility.component.html',
  styleUrls: ['./onboard-facility.component.scss']
})
export class OnboardFacilityComponent implements OnInit, AfterViewInit {
  file: any;
  sas=environment.sasToken;
  sites:any=[];
  public form = {
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
  drawToolitems: any=['Polygon'];
  layer: any;
  fileName: any;
  fileType: any;
  constructor(private router:ActivatedRoute, private dialog:MatDialog,private dashboardService:MaplocationService,
    private routers:Router,private blobService:FilesService,private facilityService:FacilityServiceService,private snackbar:MatSnackBar
  ){
    this.router.queryParams.subscribe((params:any) => {
      if(Object.entries(params).length>0){
        
      console.log(params,":::Params:::");
      this.obtainedSiteName=params.siteName;
      }
      else{
        this.routers.navigate(["/dashboard"]);
      }
    })
  }
ngAfterViewInit(): void {
  this.initMap();

}
  ngOnInit(): void {
    

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
    this.getAllSites();
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
        this.addFacility(this.form)
      }
    }
    else if(this.file =='ignore' && Data){
      console.log(Data,"API payload");
      this.form.imageUrl='';
       this.addFacility(this.form)
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

  addFacility(payload){
    this.facilityService.addFacility(payload).subscribe((request:any)=>{
      console.log(request,"request responce body");
      if(request){
        this.snackbar.open('Facility Add Successfully','ok',{
          duration: 2000,
          panelClass:'success-snackbar',
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
        this.myForm.resetForm({});
        this.routers.navigate(["/add-level"],
          { queryParams: { facilityName:request.facilityName } });
      }
    })
  }


  getAllSites(){
    this.dashboardService.getAllSites().subscribe((SitesData:any)=>{
        console.log(SitesData,"::::SitesData::::")
        this.sites=SitesData;
        let filteredSite:any=this.sites.find((obj:any)=>obj.siteName == this.obtainedSiteName);
        this.form.siteId=filteredSite.siteId;
        this.form.lan=filteredSite.location.coordinates[0];
          this.form.lat=filteredSite.location.coordinates[1];
        this.map.setCenterAndZoom(filteredSite.location.coordinates,20);
        this.mapMarker = new maptalks.Marker(
          filteredSite.location.coordinates,
          {
            'draggable' : true
          }
        ).addTo(this.map.getLayer('vector')).addEventListener('dragend',(e:any)=>{
          console.log(e,"afterdraging");
          const lngLat = e.coordinate;
          this.form.lan=lngLat.x;
          this.form.lat=lngLat.y;
        });
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
