import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
  import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
  } from '@angular/cdk/drag-drop';
import { SubscriptionLike } from 'rxjs';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl } from '@angular/forms';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDEviceComponent } from '../delete-device/delete-device.component';

export interface Staf {
  AvailableMinutes: number;
  CreatedDate: string;
  Email: string;
  FacilityId: string;
  IsActiveToday: boolean;
  Name: string;
  Shift: string;
  StaffId: number;
  UpdatedDate: string;
  UtilisedMinutes: number;
} 
export enum ToggleEnum {
  Option1,
  Option2,
  Option3
}
@Component({
  selector: 'app-map-devices',
  templateUrl: './map-devices.component.html',
  styleUrls: ['./map-devices.component.scss'],
})


export class MapDevicesComponent implements OnInit{

  @ViewChild(MatAccordion) accordion: MatAccordion;
  gridData:any=[];
  unMappedDevices :any = [];
toggleEnum = ToggleEnum;
  selectedState = ToggleEnum.Option3;
  public openMenu: boolean = false;
  isOver = false;
  SelectedLevelObj:any;

  connectedTo: any = [];
  userConnectedTo: any = [];
  taskConnectedTo: any = [];
  unAssaignedTaskRef: any = [];
  searchtext: string;
  selectedLevel:any='';
  unassignedConnectedTo: any = [];
  obtainSiteName: any;
  obtainedSiteId: any;
  obtainedFaciltiyId: any;
  obtainedFaciltiyName: any;
  ELEMENT_DATA: any[];
  Gridactive:boolean=true;
  MapActive:boolean =false;
  levlesData:any=[]
  activeButton: number = 1;
  showToolbar:any;
  isClicked: boolean = false;
 

  constructor(private dialog:MatDialog,private dashboardService : MaplocationService,private router: ActivatedRoute,private route: Router,private snackbar: MatSnackBar){
    this.router.queryParams.subscribe((params: any) => {
      if (Object.entries(params).length > 0) {
        this.obtainSiteName = params.siteName;
        this.obtainedSiteId = params.siteId;
        this.obtainedFaciltiyId = params.facilityId;
        this.getDevicesLevelSpacesgridData(params.facilityId);
        this.obtainedFaciltiyName = params.facilityname;
      } else {
        this.route.navigate(["/dashboard"]);
      }

    })
  }
  ngOnInit(): void {
   
   
    //this.groupByRoutesDetails();
   // this.groupByDevoiceDetails();
    //console.log(this.dashboardService.un)
  }
  public toggleMenu() {
    this.isClicked = !this.isClicked;
  }
  ShowToolbar(event:any){
    console.log(event,'showToolbar::::;');
    this.showToolbar=event;
  }
  activeMapView(){
  this.MapActive=true;
  this.Gridactive=false;
  this.getDevicesLevelSpacesgridData(this.obtainedFaciltiyId);
  }  
  activeGridView(){
    this.MapActive=false;
    this.Gridactive=true;
    this.selectedLevel='';
    this.SelectedLevelObj={
      levelId:'',
      levelName:'Please Select Level'
    };
    this.getDevicesLevelSpacesgridData(this.obtainedFaciltiyId);
  }
  unmappDEvice(){
    let dialogRef:any = this.dialog.open(DeleteDEviceComponent,{
      disableClose: true});
    dialogRef.afterClosed().subscribe((dialogData:any) => {
      if(dialogData.event=='Yes'){
        alert('UnmapPing device Developement under Progress')
        //this.deleteDevice(element.DeviceId)
      }
    })
  }
  onChange($event) {
    console.log($event.value);
    this.selectedState = $event.value;
  }
  getAlldDevices(){
    this.ELEMENT_DATA = [];
    this.unMappedDevices=[];
    this.dashboardService.getAlldDevice().subscribe((data:any)=>{
      console.log(data,':::::')
        if(data.length>0){
            data.forEach((ele:any) => {
              if(ele.deviceType == 'Smart Display' ){
                ele.src='../../../../assets/images/smart-display.png'
              }
              else if(ele.deviceType == 'Work Validation Scanner'){
                ele.isAdvance? ele.src='../../../../assets/images/scan-advance.png':ele.src='../../../../assets/images/barcode-scanner-advance.png'
          
              }
              else if(ele.deviceType == 'Occupancy Sensor'){
                ele.isAdvance? ele.src='../../../../assets/images/ocp-advance.png':ele.src='../../../../assets/images/occp-basic.png'
          
              }
              else if(ele.deviceType == 'People Counter'){
                 ele.src='../../../../assets/images/people-enter.png'
              }

              if(ele.Facility_Id=='' && ele.Level_Id=='' && ele.Site_Id=='' && ele.Space_Id==''){
                this.ELEMENT_DATA.push(ele);
              }
               
            });
            console.log(this.ELEMENT_DATA,':::::unmapped Device::::')
            this.unMappedDevices=this.ELEMENT_DATA;
            this.dashboardService.UnmappedDevices.next(this.ELEMENT_DATA);
            this.groupByDevoiceDetails();
           
        }
        
    });
}
applyFilter() {
  const value = this.searchtext.trim(); // Remove leading/trailing white spaces
  if (value.length === 0) {
    this.dashboardService.UnmappedDevices.subscribe((devicedata) => {
      this.unMappedDevices = devicedata;
    });
  } else {
    if (this.unAssaignedTaskRef.length === 0) {
      this.unAssaignedTaskRef = [...this.unMappedDevices]; // Create a copy of the array when it's not filtered yet
    }
    const searchWords = value.toLowerCase().split(" ");
    this.unMappedDevices = this.unAssaignedTaskRef.filter((data: any) => {
      const floorAndArea = (data.deviceType).toLowerCase();
      return searchWords.every((word) => floorAndArea.includes(word));
    });
  }
}

  async drop(event: CdkDragDrop<any>, user?: any) {


    // From Assigned to Unassigned.
   
    if (event.container.id === "unassigned@unassigned.com") {
      
      let index :any = event.previousIndex
      console.log(index,"::::Exacut Index::::")
      let draggedobj = event.previousContainer.data[index];
      let aboutToAssignObj: any = draggedobj;
      if (aboutToAssignObj !== null && aboutToAssignObj !== undefined) {
        aboutToAssignObj.Site_Id = '';
        aboutToAssignObj.Facility_Id = '';
        aboutToAssignObj.Level_Id = '';
        aboutToAssignObj.Space_Id = '';
        if (event.previousContainer === event.container) {
          moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        } else {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          console.log( event.previousContainer,' event.previousContainer');
          console.log( event.container,' event.previousContainer');
         await this.updateDevice(draggedobj);
         //this.getDevicesLevelSpacesgridData(this.obtainedFaciltiyId)
        }
        //this.toUpdateItems[aboutToAssignObj.Id] = aboutToAssignObj;
      }
    }
     //From unassigned to assigned. 
    if (event.previousContainer.id === "unassigned@unassigned.com") {
     
      let index :any = event.previousIndex-1 !== -1?event.previousIndex-1:0;
      let draggedobj = event.previousContainer.data[index];

      let aboutToAssignObj: any = draggedobj;
      if (aboutToAssignObj !== null && aboutToAssignObj !== undefined) {
        aboutToAssignObj.Site_Id = user.Site_Id;
        aboutToAssignObj.Facility_Id = user.Facility_Id;
        aboutToAssignObj.Level_Id = user.Level_Id;
        aboutToAssignObj.Space_Id = user.spaceId;
        if (event.previousContainer === event.container) {
          moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        } else {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex-1,
            event.currentIndex
          );
          console.log( event.previousContainer,' event.previousContainer');
          console.log( event.container,' event.previousContainer');
          this.updateDevice(draggedobj);
        }
       // this.toUpdateItems[aboutToAssignObj.Id] = aboutToAssignObj;
      }
    
    }
     //From within the levels and Spaces. 
    if(event.previousContainer.id !== "unassigned@unassigned.com" && event.container.id !== "unassigned@unassigned.com"){
      let index :any = event.previousIndex
      console.log(index,"::::Exacut Index::::")
      let draggedobj = event.previousContainer.data[index];
        let aboutToAssignObj: any = draggedobj;
      if (aboutToAssignObj !== null && aboutToAssignObj !== undefined) {
        aboutToAssignObj.Site_Id = user.Site_Id;
        aboutToAssignObj.Facility_Id = user.Facility_Id;
        aboutToAssignObj.Level_Id = user.Level_Id;
        aboutToAssignObj.Space_Id = event.container.id;
        if (event.previousContainer === event.container) {
          moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        } else {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          console.log( event.previousContainer,' event.previousContainer');
          console.log( event.container,' event.previousContainer');
          this.updateDevice(draggedobj);
        }
       // this.toUpdateItems[aboutToAssignObj.Id] = aboutToAssignObj;
      }
    }
   // console.log(draggedobj,"Dragged accordian")
      // if (event.previousContainer === event.container) {
      //   moveItemInArray(
      //     event.container.data,
      //     event.previousIndex,
      //     event.currentIndex
      //   );
      // } else {
      //   transferArrayItem(
      //     event.previousContainer.data,
      //     event.container.data,
      //     event.previousIndex,
      //     event.currentIndex
      //   );
      //   console.log( event.previousContainer,' event.previousContainer');
      //   console.log( event.container,' event.previousContainer');
      //   this.updateDevice(draggedobj);
      // }
    
     
  }
  onOptionsSelected(value:any){
    console.log(value);
   this.SelectedLevelObj= this.gridData.find((obj:any)=> obj.levelId == value)
  }
  getDevicesLevelSpacesgridData(fId:any){
    this.gridData=[];
    this.levlesData=[];
    this.unMappedDevices=[];
    this.dashboardService.getLevelSpaceDevicesGridData(fId).subscribe((data:any)=>{
      let responceData:any = data;
     
      console.log(responceData,"::::getLevelSpaceDevicesGridData::");
      this.gridData=responceData;
      this.levlesData=[...this.levlesData,...this.gridData];
      this.dashboardService.UnmappedDevices.subscribe((devicesData:any)=>{
        
          this.unMappedDevices = devicesData;
          this.groupByDevoiceDetails();
        
        
       });
       this.getAlldDevices();
    })
  }
  clickMenu() {
    this.openMenu = !this.openMenu;
  }
  groupByDevoiceDetails() {
    for (let udx in this.gridData) {
      let assigngridObj = this.gridData[udx];
      this.userConnectedTo.push(assigngridObj.levelName);
      for (let tdx in assigngridObj.Spaces) {
        let spaceObj = assigngridObj.Spaces[tdx];
       this.connectedTo.push(spaceObj.spaceId)
        
        for (let ldx in spaceObj.Devices) {
          let listObj = spaceObj.Devices[ldx];
          if(listObj.deviceType == 'Smart Display' ){
            listObj.src='../../../../assets/images/smart-display.png'
          }
          else if(listObj.deviceType == 'Work Validation Scanner'){
            listObj.isAdvance? listObj.src='../../../../assets/images/scan-advance.png':listObj.src='../../../../assets/images/barcode-scanner-advance.png'
      
          }
          else if(listObj.deviceType == 'Occupancy Sensor'){
            listObj.isAdvance? listObj.src='../../../../assets/images/ocp-advance.png':listObj.src='../../../../assets/images/occp-basic.png'
      
          }
          else if(listObj.deviceType == 'People Counter'){
             listObj.src='../../../../assets/images/people-enter.png'
          }
        
           this.taskConnectedTo.push(listObj.deviceId)

        }

     
      }
    }
    
    this.connectedTo.push("unassigned@unassigned.com");
    this.connectedTo.push("unassigned1@unassigned1");
    for (let undx in this.unMappedDevices) {
      let unAssdevice: any = this.unMappedDevices[undx];
     (unAssdevice&& unAssdevice.deviceId )?this.unassignedConnectedTo.push(unAssdevice.deviceId):'';
    }
    

  }
  async updateDevice(draggedOj:any){
    console.log(draggedOj,':::::payload for Update Device::::');
    this.dashboardService.updateDevice(draggedOj).subscribe((responce:any)=>{
      console.log(responce,"::::responce:::::");
      if(responce){
        this.snackbar.open('Device Updated Successfully', 'ok', {
          duration: 2000,
          panelClass: 'success-snackbar',
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
      }
    },(error) => {
        this.dashboardService.obtainedError.subscribe((err: any) => {
          if (err && error) {
            this.snackbar.open('Failed to Update Device Status', 'ok', {
              duration: 2000,
              verticalPosition: "top", // Allowed values are  'top' | 'bottom'
              horizontalPosition: "center",
              panelClass: 'error-snackbar'
              // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
            })
          }

        })
      })
  }
 
}
