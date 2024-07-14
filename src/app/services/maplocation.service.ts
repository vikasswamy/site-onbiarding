import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { shareReplay } from "rxjs/operators";
import { environment } from "src/environments/environment.development";
const GOOGLE_MAPS_API_KEY = environment.googleMapsApiKey;
export type Maps = typeof google.maps;
@Injectable({
  providedIn: 'root'
})
export class MaplocationService {
  public falicityGridData = new BehaviorSubject <any>([]);
  facilityDataGrid = this.falicityGridData.asObservable();
  private siteparams = new BehaviorSubject <any>([]);
  addSiteData = this.siteparams.asObservable();

  private facilityparams = new BehaviorSubject <any>([]);
  addFacilityData = this.facilityparams.asObservable();
  
  private facilityLocation = new BehaviorSubject <any>([]);
   locateFacility = this.facilityLocation.asObservable();
   
  private levelParams =new BehaviorSubject <any>([]);
  addlevelData = this.levelParams.asObservable();
  private polygondata = new BehaviorSubject <any>([]);
  polygongeojson = this.polygondata.asObservable();
  constructor(private http: HttpClient) { }
  public readonly api = this.load();

  private load(): Promise<Maps> {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    // tslint:disable-next-line:no-bitwise
    const callbackName = `GooglePlaces_cb_` + ((Math.random() * 1e9) >>> 0);
    script.src = this.getScriptSrc(callbackName);

    interface MyWindow { [name: string]: Function; };
    const myWindow: MyWindow = window as any;

    const promise = new Promise((resolve, reject) => {
      myWindow[callbackName] = resolve;
      script.onerror = reject;
    });
    document.body.appendChild(script);
    return promise.then(() => google.maps);
  }

  private getScriptSrc(callback: string): string {
    interface QueryParams { [key: string]: string; };
    const query: QueryParams = {
      v: '3',
      callback,
      key: GOOGLE_MAPS_API_KEY,
      libraries: 'places',
    };
    const params = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    return `//maps.googleapis.com/maps/api/js?${params}&language=fr`;
  }
  getAllSites(){
    return this.http.get(
      environment.apiBaseUrl+`/Sites`
    )
  }
  getFacilityGridData(){
    return this.http.get(
      environment.apiBaseUrl+`/Sites/facility-grid-Data`
    )
  }
  getAllFacilities(){
    return this.http.get(
      environment.apiBaseUrl+`/Facilities`
    )
  }
  getAllLevels(){
    return this.http.get(
      environment.apiBaseUrl+`/Levels`
    )
  }
  getAllSpaces(){
    return this.http.get(
      environment.apiBaseUrl+`/Spaces`
    )
  }
  setFacilitylocation(data:any){
    this.facilityLocation.next(data)
  }
  addsitevalues(data:any){
    this.siteparams.next(data)
  }
  addFacilityvalues(data:any){
    this.facilityparams.next(data);
  }
  addLevelValues(data:any){
    this.levelParams.next(data);
  }
  addpolygondata(data:any){
    this.polygondata.next(data)
  }
  findMyTimeZone(Coordinates:any) {
    console.log(Coordinates)
    /* public end point for getting timezone and offset using users location  */
    let url:any=`https://api.wheretheiss.at/v1/coordinates/ ${Coordinates.latitude},${Coordinates.longitude}`;
    return this.http.get(url)
  }
}
