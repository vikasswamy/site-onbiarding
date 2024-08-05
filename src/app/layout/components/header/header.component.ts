import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass: string | undefined;
    @Output() viewEvent = new EventEmitter<any>();
    isChecked:any;
    constructor(private translate: TranslateService, public router: Router) {
       
    }
    backtoHome(){
        this.router.navigate(['/dashboard']);
    }
    ngOnInit() {

    }
    checkValue(event:any){
        console.log(event);
        this.viewEvent.emit(event)
    }
}
