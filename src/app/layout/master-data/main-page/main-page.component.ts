import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterdataService } from '../masterdata.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  isClicked: boolean = false;

  constructor(private route:ActivatedRoute,private masterDataService : MasterdataService){
    this.route.queryParams.subscribe((params:any) => {
        this.masterDataService.routeParams.next(params.siteId)
    })
  }

  public toggleMenu() {
    this.isClicked = !this.isClicked;
  }
}
