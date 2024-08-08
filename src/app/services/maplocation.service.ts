import { Injectable } from "@angular/core";
import { BehaviorSubject,throwError,Observable, retry, catchError } from 'rxjs';
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
  UnmappedDevices:BehaviorSubject<any> = new BehaviorSubject([]);
  public vikas:any
  public manju:any
  public params = new BehaviorSubject <any>([]);
  private siteparams = new BehaviorSubject <any>([]);
  addSiteData = this.siteparams.asObservable();

  private facilityparams = new BehaviorSubject <any>([]);
  addFacilityData = this.facilityparams.asObservable();
  
  private facilityLocation = new BehaviorSubject <any>([]);
   locateFacility = this.facilityLocation.asObservable();
  private errorMessage=new BehaviorSubject<any>('');
  obtainedError = this.errorMessage.asObservable();
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
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    this.errorMessage.next(errorMessage);
    return throwError(errorMessage);
  }
  addLevel(data:any){
    return this.http.post(
      environment.apiBaseUrl + `/Levels`,
      data
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  addDevice(data:any){
    return this.http.post(
      environment.apiBaseUrl + `/Devices`,
      data
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getLevelSpaceDevicesGridData(Id:any){
    return this.http.get(
      environment.apiBaseUrl+`/Levels/gridDatabyFacilityId/${Id}`
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getAlldDevice(){
    return this.http.get(
      environment.apiBaseUrl + `/Devices`
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getFacilitsbySiteId(id:any){
    return this.http.get(
      environment.apiBaseUrl + `/bySiteId/${id}`
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateLevel(data:any){
    return this.http.put(
      environment.apiBaseUrl + `/Levels/updateLevel`,
      data
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  deleteLevel(levelId:any){
    return this.http.delete(
      environment.apiBaseUrl+`/Levels/${levelId}`
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  deleteDevice(dId:any){
    return this.http.delete(
      environment.apiBaseUrl+`/Devices/${dId}`
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  deleteFacility(facilityId:any){
    return this.http.delete(
      environment.apiBaseUrl+`/Facilities/${facilityId}`
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  deletespace(sapceId:any){
    return this.http.delete(
      environment.apiBaseUrl+`/Spaces/${sapceId}`
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getFacilitiessBySiteId(Id:any){
    return this.http.get(
      environment.apiBaseUrl+`/Facilities/bySiteId/${Id}`
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getLevelsByFacilityId(Id:any){
    return this.http.get(
      environment.apiBaseUrl+`/Levels/byFacility/${Id}`
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getLevelsByLevelName(data:any){
    return this.http.get(
      environment.apiBaseUrl+`/Levels/byFacility/${data.facilityId}/byLevelName/${data.levelName}`
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  addSpaces(data:any){
    return this.http.post(
      environment.apiBaseUrl + `/Spaces`,
      data
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateSpace(data:any){
    return this.http.put(
      environment.apiBaseUrl + `/Spaces/updateSpace`,
      data
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  updateDevice(data:any){
    return this.http.put(
      environment.apiBaseUrl + `/Devices/updatedevice`,
      data
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
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
  getAllSpacesByLevelId(levelId:any){
    return this.http.get(
      environment.apiBaseUrl+`/Spaces/byId/${levelId}`
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
