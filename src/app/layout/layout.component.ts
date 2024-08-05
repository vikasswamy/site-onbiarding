import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    collapedSideBar: boolean | undefined;

    constructor(private router:Router) {}

    ngOnInit() {}

    receiveCollapsed($event: boolean | undefined) {
        this.collapedSideBar = $event;
    }
    changeView(event:any){
        if(event == true){
            this.router.navigate(["/Mapview"]);
        }else{
            this.router.navigate(["/dashboard"]);
        }
    }
}
