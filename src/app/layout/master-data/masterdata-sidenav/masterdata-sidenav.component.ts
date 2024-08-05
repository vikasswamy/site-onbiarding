import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-masterdata-sidenav',
  templateUrl: './masterdata-sidenav.component.html',
  styleUrls: ['./masterdata-sidenav.component.scss']
})
export class MasterdataSidenavComponent implements OnInit{

  @Input() clicked:boolean;
  constructor(){}
  ngOnInit(): void {
    
  }
  
}
