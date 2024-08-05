import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.scss']
})
export class DeviceInfoComponent {
  
  @Input() clicked:boolean;
  
}
