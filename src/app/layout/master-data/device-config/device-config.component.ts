import { Component } from '@angular/core';
import { MaplocationService } from 'src/app/services/maplocation.service';

@Component({
  selector: 'app-device-config',
  templateUrl: './device-config.component.html',
  styleUrls: ['./device-config.component.scss']
})
export class DeviceConfigComponent {
    name:string
    constructor(private mapservice: MaplocationService){

      this.name= this.mapservice.vikas;
      this.mapservice.params.subscribe((paramsData:any)=>{
        console.log(paramsData,"::::paramsData:::");
      })
    }
}
