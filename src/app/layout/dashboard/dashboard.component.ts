import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '@angular/router';
import { MaplocationService } from 'src/app/services/maplocation.service';
import {NavItem} from './nav-item';
import { geometry } from '@turf/turf';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddDeviceformComponent } from './add-deviceform/add-deviceform.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { DeleteDeviceDialogComponent } from './delete-device-dialog/delete-device-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
export interface PeriodicElement {
 "DeviceId":string,  "Device Type":string, "Device Source Id":string, "Basic": string, "Advanced" :string
 }
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

    /*crl elements */
    arr: any= [];
    
    totalCards: number;
    currentPage: number = 1;
    pagePosition: string = "0%";
    cardsPerPage: number;
    totalPages: number;
    overflowWidth: string;
    cardWidth: string;
    containerWidth: number;
    @ViewChild("container", { static: true, read: ElementRef })
    container: ElementRef;
  SelectedSiteId: any;
    @HostListener("window:resize") windowResize() {
        let newCardsPerPage = this.getCardsPerPage();
        if (newCardsPerPage != this.cardsPerPage) {
          this.cardsPerPage = newCardsPerPage;
          this.initializeSlider();
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
            this.populatePagePosition();
          }
        }
      }


/** */
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    ELEMENT_DATA: PeriodicElement[]=[];
    dataSource = new MatTableDataSource<PeriodicElement>([]);
    dataSourceFilters = new MatTableDataSource(this.ELEMENT_DATA);
    
  columnsToDisplay = ["Delete","DeviceId","Device Type", "Device Source Id", "Basic", "Advanced" ];
  expandedElement: PeriodicElement | null;
    navItems: NavItem[] = [
        {
        parentName:'',
        parentId:'',
          displayName: 'select Site >> Facility',
          id:'',
          geometry:{},
          children: [
          ]
        }
      ];
    SelectedSite:any='Select Site';
    SelectedFacility:any='Select Facility'
    AllSites:any=[];
    hasFacility:boolean=true;
    constructor(private router:Router,private dashboardService:MaplocationService,private dialog:MatDialog,private snackbar:MatSnackBar) {
       
    }
    
    ngOnInit() {
        
        this.getAllSites();
        this.getAlldDevices();
        this.dataSource.paginator = this.paginator;
    }

    initializeSlider() {
        this.totalPages = Math.ceil(this.totalCards / this.cardsPerPage);
        this.overflowWidth = `calc(${this.totalPages * 100}% + ${this.totalPages *
          10}px)`;
        this.cardWidth = `calc((${100 / this.totalPages}% - ${this.cardsPerPage *
          10}px) / ${this.cardsPerPage})`;
      }
    
      getCardsPerPage() {
        return Math.floor(this.container.nativeElement.offsetWidth / 200);
      }
    
      changePage(incrementor) {
        this.currentPage += incrementor;
        this.populatePagePosition();
      }
    
      populatePagePosition() {
        this.pagePosition = `calc(${-100 * (this.currentPage - 1)}% - ${10 *
          (this.currentPage - 1)}px)`;
      }
    cellClicked(element: any) {
      }
    goToAddLevel(){
        this.router.navigate(["/add-facility"],
            { queryParams: { siteName:this.SelectedSite,siteId:this.SelectedSiteId} });
    }
    setSelectedSiteValue(values:any){
        this.SelectedSite=values.siteName;
        this.SelectedSiteId = values.siteId;
        this.goToAddLevel()
    }
    applyFilter(event: any) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
    getAlldDevices(){
        this.ELEMENT_DATA = [];

        this.dashboardService.getAlldDevice().subscribe((data:any)=>{
          let arr:any=[];
            if(data.length>0){
              
                data.forEach((ele:any) => {
                  if(ele.Facility_Id =='' && ele.Level_Id=='' && ele.Site_Id=='' && ele.Space_Id==''){
                    arr.push(ele);
                    this.ELEMENT_DATA.push( {
                       
                        "DeviceId":ele.deviceId,
                        "Device Type":ele.deviceType,
                         "Device Source Id":ele.deviecSourceId,
                          "Basic":String(ele.isBasic),
                           "Advanced":String(ele.isAdvance)
                    });
                  }
                   
                });
                this.dashboardService.UnmappedDevices.next(arr);
                this.dataSource.data = this.ELEMENT_DATA;
            }
            
        });
        return this.dataSource
    }
    getAllSites(){
        this.dashboardService.getAllSites().subscribe((SitesData:any)=>{
            
            this.AllSites=SitesData;
            this.arr = this.AllSites;
            console.log(this.arr,"::::arr::::");
            
            this.totalCards = this.arr.length;
            this.cardsPerPage = this.getCardsPerPage();
            this.initializeSlider();
        });
        this.getFacilityGridData();
    }
    AddDevice(){
        let dialogRef:any = this.dialog.open(AddDeviceformComponent,{
          disableClose: true});
        dialogRef.afterClosed().subscribe((dialogData:any) => {
            if(dialogData.event=='Submit'){
                console.log(dialogData.data,"::::Dialog data:::::");
                let obj:any ={
                    "DeviceId":dialogData.data.deviceId,
                    "Device Type":dialogData.data.deviceType,
                     "Device Source Id":String(dialogData.data.deviecSourceId),
                      "Basic":String(dialogData.data.isBasic),
                       "Advanced":String(dialogData.data.isAdvance)
                }
                this.ELEMENT_DATA= [...[obj],...this.ELEMENT_DATA]
                //this.ELEMENT_DATA.push(obj);
                this.dataSource.data = this.ELEMENT_DATA;
            }
        })
    }
    deleteElement(element: any) {
      let dialogRef:any = this.dialog.open(DeleteDeviceDialogComponent,{
        disableClose: true});
      dialogRef.afterClosed().subscribe((dialogData:any) => {
        if(dialogData.event=='Yes'){
          this.deleteDevice(element.DeviceId)
        }
      })
      console.log('Element to delete:', element);
    }
    deleteDevice(id: any) {
      console.log(id,"::::DeviceId::::");

      this.dashboardService.deleteDevice(id).subscribe((data: any) => {
        console.log(data)
        if (data) {
          this.snackbar.open('Device Deleted ', 'ok', {
            duration: 2000,
            verticalPosition: "top", // Allowed values are  'top' | 'bottom'
            horizontalPosition: "center",
            panelClass: 'success-snackbar'
            // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
          });
          this.getAlldDevices();
        }
      })
    }
    getFacilityGridData(){
        this.dashboardService.getFacilityGridData().subscribe((gridData:any)=>{
            console.log(gridData);
             this.dashboardService.falicityGridData.next(gridData)   
            gridData.forEach((siteItem:any,j:any) => {
                let obj:any={};
                obj.parentName= siteItem.siteName;
                obj.parentId=siteItem.siteId;
                obj.displayName=siteItem.siteName;
                obj.id=siteItem.siteId;
                obj.geometry={};
                obj.children=[];
                siteItem.Facilities&& siteItem.Facilities.forEach((facItem:any,i:any)=>{
                    obj.children.push({
                        parentName:siteItem.siteName,
                        parentId:siteItem.siteId,
                        displayName:facItem.facilityName,
                        id:facItem.facilityId,
                        geometry:facItem.geometry
                    });
                });
                this.navItems[0].children.push(obj);
            });
            console.log(this.navItems[0].children)
            
        });

    }
}
