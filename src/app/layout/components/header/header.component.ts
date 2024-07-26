import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass: string | undefined;

    constructor(private translate: TranslateService, public router: Router) {
       
    }
    backtoHome(){
        this.router.navigate(['/dashboard']);
    }
    ngOnInit() {
    }

}
