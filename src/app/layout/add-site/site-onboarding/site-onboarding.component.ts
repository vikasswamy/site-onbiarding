import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import * as maptalks from "maptalks";
import * as turf from '@turf/turf';
import { AddSiteService,Maps } from '../add-site.service';
import { geolib } from './geolib';
import { FormGroupDirective, NgForm, NgModelGroup } from '@angular/forms';
import * as FilePond from 'filepond';

import { MatDialog } from '@angular/material/dialog';
import { FilesService } from '../../files.service';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UploadFileComponent } from '../../dashboard/upload-file/upload-file.component';
// Register FilePond plugins

let place: google.maps.places.PlaceResult | null = null;

type Components = typeof place.address_components;

@Component({
  selector: 'app-site-onboarding',
  templateUrl: './site-onboarding.component.html',
  styleUrls: ['./site-onboarding.component.scss'],
  
})
export class SiteOnboardingComponent  implements OnInit,AfterViewInit  {
  private subscription: Subscription;
  siteName: string;
  movies: string[];
  sas= environment.sasToken;
  public form = {
    siteName: '',
    fileUrl:null,
    lan: null,
    lat:null,
    siteAddress:'',
    siteTimeZone:''
  };
  
  submitted: boolean = false;
  map: any;
  @ViewChild('bookMovieForm') myForm:any;
  @ViewChild('search') searchElementRef:any;
  public entries = [];
  public place: google.maps.places.PlaceResult | undefined;
  file: any;
  fileName: any;
  fileType: any;
  picturesList: any[];
  constructor(private router:Router, private ngZone :NgZone,private MaplocationService:MaplocationService,private siteServicelocation:AddSiteService,private dialog: MatDialog,private blobService:FilesService,private snackbar:MatSnackBar){
   
    
  }
  ngAfterViewInit(): void {
    if (this.searchElementRef && this.searchElementRef.nativeElement) {
      this.siteServicelocation.api.then((maps) => {
        this.initAutocomplete(maps);
  
        //this.initMap(maps);
      });
    }
    
  }
  ngOnInit(): void {
    this.siteName = "";
    
    this.map=null;
    (document.getElementById('mapa-mapbox')as HTMLElement).innerHTML='';
    this.map = new maptalks.Map("mapa-mapbox", {
      center :[-1.85306,52.63249],
      zoom: 1,
      minZoom:2,
      pitch: 6,
      baseLayer: new maptalks.TileLayer("base", {
        urlTemplate:
          "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
        subdomains: ['mt0','mt1','mt2','mt3']
      }),
    });
   
    document.querySelector(".maptalks-attribution").innerHTML=''
    var layer:any = new maptalks.VectorLayer('vector').setOptions({
      editable : true,
    }).addTo(this.map);
  }

  onSubmit(Data:any) {
    if(!this.file){
      this.openDialog()
    }
    else if(this.file && this.file !='ignore'){
      const formData = new FormData();
      formData.append('file', this.file.file);
        console.log(this.file.name,"Filename");
      this.fileName = this.file.name;
      this.fileType =this.file.name.split(".")[1];
      this.picturesList = [];
      console.log(this.fileName,'::',this.fileType)
      if (this.fileName) {
        this.blobService.uploadImage(this.sas, this.file, this.form.siteName.replace(/\s+/g, '')+"/"+ this.fileType + "/" + this.file.name, () => {
        });
        this.form.fileUrl = `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.form.siteName.replace(/\s+/g, '')}/${this.fileType}/${this.fileName}`;
        this.addSite(this.form)
      }
    }
    else if(this.file =='ignore' && Data){
      console.log(Data,"API payload");
      this.form.fileUrl='';
       this.addSite(this.form)
    }
    this.siteServicelocation.obtainedError.subscribe((err:any)=>{
      console.log(err,"error message");
      if(err && this.router.url=='add-site'){
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
    addSite(payload:any){
      this.siteServicelocation.addSite(payload).subscribe((request:any)=>{
        console.log(request,"request responce body");
        if(request){
          this.snackbar.open('Site Add Successfully','ok',{
            duration: 2000,
            panelClass:'success-snackbar',
            verticalPosition: "top", // Allowed values are  'top' | 'bottom'
            horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
          });
          this.myForm.resetForm({});
          this.router.navigate(["/add-facility"],
            { queryParams: { siteName:request.siteName } });
        }
      })
    }
  openDialog(){
    let dialogRef:any=this.dialog.open(UploadFileComponent,{
      disableClose: true,
      data:'image/jpeg, image/png'
    });
    dialogRef.afterClosed().subscribe((dialogData:any) => {
      console.log(dialogData);
      this.file=dialogData.data
    })
  }
  initAutocomplete(maps: Maps) {
    let autocomplete:any = new maps.places.Autocomplete(
      this.searchElementRef.nativeElement
     
    );
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.onPlaceChange(autocomplete.getPlace());
      });
    });
  }
  onPlaceChange(place: any) {
    
 

 

   const location:any = this.locationFromPlace(place);
   
    
    this.entries.unshift({
      place,
      location,
    });
    console.log(this.entries,":::entries:::")
    console.log([this.entries[0].location.coordinates.longitude, this.entries[0].location.coordinates.latitude],"lnglat");
    this.map.setCenterAndZoom([this.entries[0].location.coordinates.longitude, this.entries[0].location.coordinates.latitude], 21);
    var point = new maptalks.Marker(
      [this.entries[0].location.coordinates.longitude, this.entries[0].location.coordinates.latitude],
      {
        'draggable' : true
      }
    ).addTo(this.map.getLayer('vector'));
    this.form.lan=this.entries[0].location.coordinates.longitude;
    this.form.lat=this.entries[0].location.coordinates.latitude;
    this.form.siteAddress=this.entries[0].place.formatted_address;
    /*Here we are calculating TimeZone based on UTC_offSet */
    this.getIANATimezone(this.entries[0].place.utc_offset);
    // this.MaplocationService.findMyTimeZone(this.entries[0].location.coordinates).subscribe((data:any)=>{
    //   console.log(data,"::::::TimeZone API :::::")
    // })
    point.addEventListener('dragend',(e:any)=>{
      console.log(e,"afterdraging");
      const lngLat = e.coordinate;
      this.form.lan=lngLat.x;
      this.form.lat=lngLat.y;
      // this.MaplocationService.findMyTimeZone({longitude:lngLat.x,latitude:lngLat.y}).subscribe((data:any)=>{
      //   console.log(data,"TimeZone Data");
      // })
        // this.formdata[0].lan=lngLat.x;
        // this.formdata[0].lat =lngLat.y;
       // console.log(this.formdata[0])
        //this.opendialog()
    })
    //new maptalks.VectorLayer('marker', point)
  }
  getIANATimezone(utcOffsetSeconds:any) {
    const utcOffsetHours = Math.abs(utcOffsetSeconds / 3600);
    const sign = (utcOffsetSeconds < 0 ) ? '+': '-';
    console.log(`Etc/GMT${sign}${utcOffsetHours}`);
    this.form.siteTimeZone=`utc_offset_minutes(${utcOffsetSeconds}),${this.entries[0].location.countryCode},GMT${sign}${utcOffsetHours}`
    return `Etc/GMT${sign}${utcOffsetHours}`;
}
  public locationFromPlace(place: google.maps.places.PlaceResult) {
    const components = place.address_components;
    if (components === undefined) {
      return null;
    }

    const areaLevel3 = getShort(components, 'administrative_area_level_3');
    const locality = getLong(components, 'locality');

    const cityName = locality || areaLevel3;
    const countryName = getLong(components, 'country');
    const countryCode = getShort(components, 'country');
    const stateCode = getShort(components, 'administrative_area_level_1');
    const name = place.name !== cityName ? place.name : null;

    const coordinates = {
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    };

    const bounds = place.geometry.viewport.toJSON();

    // placeId is in place.place_id, if needed
    return {
      name,
      cityName,
      countryName,
      countryCode,
      stateCode,
      bounds,
      coordinates,
    };
  }
 
}
function getComponent(components: Components, name: string) {
  return components.filter((component:any) => component.types[0] === name)[0];
}

function getLong(components: Components, name: string) {
  const component = getComponent(components, name);
  return component && component.long_name;
}

function getShort(components: Components, name: string) {
  const component = getComponent(components, name);
  return component && component.short_name;
}
namespace cosmos {
  export interface Coordinates {
    /**
     * Coordinates latitude.
     * @type {number}
     */
    latitude: number;
    /**
     * Coordinates longitude.
     * @type {number}
     */
    longitude: number;
  }
  export interface LatLngBoundsLiteral {
    /**
     * LatLngBoundsLiteral east.
     * @type {number}
     */
    east: number;
    /**
     * LatLngBoundsLiteral north.
     * @type {number}
     */
    north: number;
    /**
     * LatLngBoundsLiteral south.
     * @type {number}
     */
    south: number;
    /**
     * LatLngBoundsLiteral west.
     * @type {number}
     */
    west: number;
  }
}


