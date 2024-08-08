import { Component, OnInit } from '@angular/core';
import * as maptalks from "maptalks";

@Component({
  selector: 'app-map-overview',
  templateUrl: './map-overview.component.html',
  styleUrls: ['./map-overview.component.scss']
})
export class MapOverviewComponent implements OnInit{
  map: any;
  layer: any;
  constructor(){}
ngOnInit(): void {
  this.initMap()
}
initMap(){
  this.map=null;
  (document.getElementById('overview-map')as HTMLElement).innerHTML='';
  this.map = new maptalks.Map("overview-map", {
    center :[-1.85306,52.63249],
    zoom: 2,
    minZoom:2,
    pitch: 6,
    baseLayer: new maptalks.TileLayer("base", {
      urlTemplate: "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
      subdomains: ['mt0','mt1','mt2','mt3'],
      attribution:'© <a href="http://osm.org">OpenStreetMap</a>  contributors, © <a href="https://carto.com/">CARTO</a> ',
    }),
  });
  
  this.layer = new maptalks.VectorLayer('vector').setOptions({
    editable : true,
  }).addTo(this.map);
  
}
}
