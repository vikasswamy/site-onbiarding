import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject,throwError,Observable, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
const GOOGLE_MAPS_API_KEY = 'AIzaSyCaKbVhcX_22R_pRKDYuNA7vox-PtGaDkI';
export type Maps = typeof google.maps;
@Injectable({
  providedIn: 'root'
})
export class AddSiteService {

  apiBaseUrl:any=environment.apiBaseUrl;
  public selectedtab:any=0;
  constructor(private http: HttpClient) { }
  private sharedSiteDetails = new BehaviorSubject <any>([]);
  obtainedSiteDetails = this.sharedSiteDetails.asObservable();

  private SharedFacilityDtailes = new BehaviorSubject <any>([]);
  obtainedFacilityDetails = this.SharedFacilityDtailes.asObservable();
  private errorMessage=new BehaviorSubject<any>('');
  obtainedError = this.errorMessage.asObservable();
  private SharedLevelDtailes = new BehaviorSubject <any>([]);
  obtainedLevelDetails = this.SharedLevelDtailes.asObservable();

  private SharedSpaceeDetailes = new BehaviorSubject <any>([]);
  obtainedspaceDetails = this.SharedSpaceeDetailes.asObservable();


  private SharedDeviceDetailes = new BehaviorSubject <any>([]);
  obtainedDeviceDetails = this.SharedDeviceDetailes.asObservable();
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
  addSite(data:any):Observable<any>{
    return this.http.post(
      this.apiBaseUrl + `/Sites`,
      data
    ) .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  
  addLevel(data:any){
    return this.http.post(
      this.apiBaseUrl + `/Levels`,
      data
    );
  }
  addSpaces(data:any){
    return this.http.post(
      this.apiBaseUrl + `/Spaces`,
      data
    );
  }
  adddevices(data:any){
    return this.http.post(
      this.apiBaseUrl + `/Devices`,
      data
    );
  }
  getAllSites(){
    return this.http.get(
      this.apiBaseUrl+`/Sites`
    )
  }
  getAllFacilities(){
    return this.http.get(
      this.apiBaseUrl+`/Facilities`
    )
  }
  getAllLevels(){
    return this.http.get(
      this.apiBaseUrl+`/Levels`
    )
  }
  getAllSpaces(){
    return this.http.get(
      this.apiBaseUrl+`/Spaces`
    )
  }
  getunMappedDevices(){
    return this.http.get('https://e75272ac-5f32-4034-ba58-f3a2493b6190.mock.pstmn.io/unMappedDevices')
  }
  getSpacesbyId(Id:any){
    return this.http.get(
      this.apiBaseUrl+`/Spaces/byId/${Id}`
    )
  }
  saveAllsiteDetails(data:any){
    this.sharedSiteDetails.next(data);
  }
  saveAllFacilityDetails(data:any){
    this.SharedFacilityDtailes.next(data);
  }
  saveAllLevelDetails(data:any){
    this.SharedLevelDtailes.next(data);
  }
  saveAllSpaceDetails(data:any){
    this.SharedSpaceeDetailes.next(data);
  }
  saveAllDeviceDetails(data:any){
    this.SharedDeviceDetailes.next(data);
  }

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


}
