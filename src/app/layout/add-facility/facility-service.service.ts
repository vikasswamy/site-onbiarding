import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,throwError,Observable, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FacilityServiceService {
  apiBaseUrl:any=environment.apiBaseUrl;

  private errorMessage=new BehaviorSubject<any>('');
  obtainedError = this.errorMessage.asObservable();

  constructor(private http: HttpClient) { }
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
  addFacility(data:any){
    return this.http.post(
      this.apiBaseUrl + `/Facilities`,
      data
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
}
