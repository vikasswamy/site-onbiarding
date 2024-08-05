import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterdataService {

  public routeParams = new BehaviorSubject <any>('');
  constructor() { }
}
