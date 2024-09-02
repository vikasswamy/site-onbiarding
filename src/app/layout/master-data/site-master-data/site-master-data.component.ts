import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MaplocationService } from 'src/app/services/maplocation.service';
import { FacilityServiceService } from '../../add-facility/facility-service.service';

@Component({
  selector: 'app-site-master-data',
  templateUrl: './site-master-data.component.html',
  styleUrls: ['./site-master-data.component.scss']
})
export class SiteMasterDataComponent implements OnInit {
 
  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<any>>;

  data= new MatTableDataSource<facility>([]);
  obtainedSiteId:any;
  obtainedFaciltiyId:any;
  obtainedFaciltiyname:any;
  // dataSource: MatTableDataSource<any>;
  usersData: any[] = [];
  columnsToDisplay = ['facilityName','facilityId','number of levels'];
  innerDisplayedColumns = ['levelName', 'levelId', 'number of spaces'];
  innerInnerDisplayedColumns = ['spaceName', 'spaceId','number of devices'];
  innerInnerInnerDisplayedColumns = ['DeviceType', 'DeviceId'];
  
  expandedElement: any | null;
  expandedElements: any[] = [];
  FACILITY_DATA:facility[]=[];
  dataSource = new MatTableDataSource<facility>([]);
  dataSourceFilters = new MatTableDataSource(this.FACILITY_DATA);
  ELEMENT_DATA:any=[];
  facilityydata: any;
  leveldata: any;
  filertedtableData: any;



  constructor(private cd: ChangeDetectorRef,private mapService:MaplocationService, private router: ActivatedRoute) {
    
    this.router.queryParams.subscribe((params: any) => {
      this.obtainedSiteId = params.siteId;
      this.obtainedFaciltiyId = params.facilityId;
      this.obtainedFaciltiyname = params.facilityname;
      this.mapService.manju=params.siteId;
      this.mapService.params.next(params);
    });
    // console.log(this.obtainedSiteId,"::::Site id from params::::");
    // console.log(this.obtainedFaciltiyId,":::Facility id from params:::");
    // console.log(this.obtainedFaciltiyname,":::Facility name from params:::");
   
  }

  ngOnInit() {
  
    this.dataSource = new MatTableDataSource(this.usersData);
    this.dataSource.sort = this.sort;
    this.mapService.vikas='my name is vikas';

    this.mapService.facilityselecteddata.subscribe(facilityvalue => {
      this.facilityydata= facilityvalue;
      this.filertedtableData=[]

     this.filertableData(facilityvalue,null);
    })
    
    this.mapService.levelselecteddata.subscribe(levelvalue => {
      this.leveldata= levelvalue;
       console.log(levelvalue,"::: levelvalue data:::");
       this.filertableData(this.facilityydata,levelvalue);
    })
    this.mapService.gridData.subscribe((someData:any)=>{
      this.ELEMENT_DATA = [];
      this.data.data =[];
      // console.log(someData);
      someData.forEach((ele:any,i:any) => {
        // console.log(ele);
          this.ELEMENT_DATA.push( {
             
              "facilityName":ele.facilityName,
               "facilityId":ele.facilityId,
                "number of levels":String(ele.Levels.length),
                 "levels":[]
                
          }
        );
        if(ele.Levels.length>0){
          ele.Levels.forEach((levlItem:any,j:any) => {
            this.ELEMENT_DATA[i].levels.push({
              'levelName':levlItem.levelName,
              'levelId':levlItem.levelId,
              'number of spaces':String(levlItem.Spaces.length),
              "spaces":[]
            });
            if(levlItem.Spaces.length>0){
              levlItem.Spaces.forEach((SpaceItem:any,k:any) => {
                this.ELEMENT_DATA[i].levels[j].spaces.push({
                  'spaceName':SpaceItem.spaceName,
                  'spaceId':SpaceItem.spaceId,
                  'number of Devices':String(SpaceItem.Devices.length),
                  "devices":[]
                });
                if(SpaceItem.Devices.length>0){
                  SpaceItem.Devices.forEach((deviceitem:any,l:any) => {
                    this.ELEMENT_DATA[i].levels[j].spaces[k].devices.push({
                      'DeviceType':deviceitem.deviceType,
                      'DeviceId':deviceitem.deviceId
                    })
                  });
                  console.log("devicesdata",SpaceItem.Devices);
                  
                }
              });
            }
          });
        }
        
      });
      // console.log(this.ELEMENT_DATA);
      this.data.data = this.ELEMENT_DATA
    })
    //this.getAlldfacilities();
  }
  filertableData(selectedFacility:any,selectedLevel:any){
    if((selectedFacility !== 'All' || selectedFacility !==null) && (selectedLevel === null || selectedLevel =="All") ){
      let tableData :any = [...this.ELEMENT_DATA];
       this.filertedtableData= tableData.filter((obj:any)=>
        (obj.facilityId === selectedFacility));
      this.data.data = this.filertedtableData.length>0?this.filertedtableData:this.ELEMENT_DATA;

    }else if((selectedFacility !== 'All' || selectedFacility!==null) && (selectedLevel!=='All' || selectedLevel !==null)){
      console.log(this.data.data,'this.data.data[0]' );
      let tableData:any =JSON.parse(JSON.stringify(this.filertedtableData));
      tableData[0].levels = tableData[0].levels.filter((obj:any)=> obj.levelId == selectedLevel);
      console.log(tableData[0].levels,"tableData[0].levels")
        this.data.data =tableData;
    }
 
    // let filertedData:any;


    //   if(selectedFacility == 'All facility' || !selectedFacility) {
    //     filertedData = tableData;
    //   } else {
    //     filertedData = tableData.filter((obj:any)=>
    //     obj.facilityId == selectedFacility);
    //   }

    //   if(selectedLevel  && selectedLevel !== 'All Levels') {
    //     filertedData = filertedData.filter((obj:any)=>
    //     obj.facilityId == selectedLevel);
    //   }
      
     
        



    // let filertedData:any;


      // if(selectedFacility !== 'All facility' && selectedFacility) {
      //   filertedData = tableData.filter((obj:any)=>
      //     obj.facilityId == selectedFacility);
      // } 
      // else {
      //   filertedData = tableData;
      // }

      // if(selectedLevel !== 'All Levels' && selectedLevel) {
      //   filertedData = tableData.filter((obj:any)=>
      //   obj.facilityId == selectedLevel);
      // }
      
      // console.log(filertedData,"filter data");
      // this.data.data = filertedData;
        

      // let filertedData:any = [];
      // if(selectedFacility === 'All facility' && selectedLevel === 'All Levels') {
      //   filertedData=tableData;
      // }else if (selectedFacility === 'All facility') {
      //    filertedData=tableData.filter((obj: any) => obj.facilityId ===  selectedFacility);
      // }else if (selectedLevel == 'All Levels'){
      //   filertedData=tableData.filter((obj: any) => obj.facilityId ===  selectedFacility);
      // }else {
      //   filertedData = tableData.filter((obj:any) => obj.facilityId === selectedFacility && obj.levelId == selectedLevel);
      // }

      // console.log(filertedData,"filter data");
      // this.data.data = filertedData;


        }

   





  applyFilter(filterValue: string) {
    this.innerTables.forEach(
      (table, index) =>
        ((table.dataSource as MatTableDataSource<
          any
        >).filter = filterValue.trim().toLowerCase())
    );
  }

  toggleRow(element: any) {
    element.addresses &&
    (element.addresses as MatTableDataSource<any>).data.length
      ? this.toggleElement(element)
      : null;
    this.cd.detectChanges();
    this.innerTables.forEach(
      (table, index) =>
        ((table.dataSource as MatTableDataSource<
          any
        >).sort = this.innerSort.toArray()[index])
    );
  }

  isExpanded(row: any): string {
    const index = this.expandedElements.findIndex(x => x.name == row.name);
    if (index !== -1) {
      return 'expanded';
    }
    return 'collapsed';
  }

  toggleElement(row: any) {
    const index = this.expandedElements.findIndex(x => x.name == row.name);
    if (index === -1) {
      this.expandedElements.push(row);
    } else {
      this.expandedElements.splice(index, 1);
    }

    //console.log(this.expandedElements);
    
  }


}
// export interface User {
//   name: string;
//   email: string;
//   phone: string;
//   addresses?: Address[] | MatTableDataSource<Address>;
// }

// export interface Comment{
//   commenID: number;
//   comment: string;
//   commentStatus: string;
// }

// export interface Address {
//   street: string;
//   zipCode: string;
//   city: string;
//   comments?: Comment[] | MatTableDataSource<Comment>;
// }

export interface facility {
  "facilityName":string,  "facilityId":string, "number of levels":string,  levels?: levels[] | MatTableDataSource<levels>;
  }

  export interface levels {
    "levelName":string,  "levelId":string, "number of Spaces":string,  spaces?: spaces[] | MatTableDataSource<spaces>;
    }

    export interface spaces {
      "spaceName":any,  "spaceId":string, "number of Devices":any,  Devices?: Devices[] | MatTableDataSource<Devices>;
      }

      export interface Devices {
        "DeviceType":string,  "DeviceId":string;
        }

   

 
        
// const facilities: facility[] = [
//     {
//     //     "facilityId": "29e5a302-1ac7-4d53-a78d-88111128a5d3",
//     //     "facilityName": "cse block",
//     //     // "fileUrl": "https://storagesmartroute27.blob.core.windows.net/filesupload/BVCCollegeofEngineering,V),Rajanagaram(M,Palacherla,Rajahmundry,AndhraPradesh,India/cseblock/jpg/dubai.jpg",
//     //     // "geometry": {
//     //     //     "type": "Polygon",
//     //     //     "coordinates": [
//     //     //         [
//     //     //             [
//     //     //                 81.84125898811226,
//     //     //                 17.059964851631577
//     //     //             ],
//     //     //             [
//     //     //                 81.84209312995642,
//     //     //                 17.059964851631577
//     //     //             ],
//     //     //             [
//     //     //                 81.8420868576926,
//     //     //                 17.05948680950118
//     //     //             ],
//     //     //             [
//     //     //                 81.8412609295276,
//     //     //                 17.05948680950118
//     //     //             ],
//     //     //             [
//     //     //                 81.84125898811226,
//     //     //                 17.059964851631577
//     //     //             ]
//     //     //         ]
//     //     //     ]
//     //     // },
//     //     // "facilitylocation": {
//     //     //     "type": "Point",
//     //     //     "coordinates": [
//     //     //         81.8418789,
//     //     //         17.0601386
//     //     //     ]
//     //     // },
//     //     // "createdAt": "2024-08-09T12:01:20.000Z",
//     //     // "updatedAt": "2024-08-09T12:01:20.000Z",
//     //     // "Site_Id": "035b874e-b50e-42d7-a5bc-0bccd0935c27",
//     //     "Levels": [
//     //         {
//     //             "levelId": "4e99fdfa-4bb0-4388-b39d-0a73c2a8c0c5",
//     //             "levelName": "LEVEL 0",
//     //             "capacity": 0,
//     //             "max_capacity": 0,
//     //             "pdfFileUrl": "",
//     //             "FloorPlanImageUrl": "https://storagesmartroute27.blob.core.windows.net/filesupload/BVCCollegeofEngineering,V),Rajanagaram(M,Palacherla,Rajahmundry,AndhraPradesh,India/cseblock/LEVEL0/png/Ground_Floor 1.png",
//     //             "Geojsonfile": "https://storagesmartroute27.blob.core.windows.net/filesupload/BVCCollegeofEngineering,V),Rajanagaram(M,Palacherla,Rajahmundry,AndhraPradesh,India/cseblock/LEVEL0/geojson/LEVEL0.geojson",
//     //             "createdAt": "2024-08-12T12:00:31.000Z",
//     //             "updatedAt": "2024-08-12T12:00:31.000Z",
//     //             "Facility_Id": "29e5a302-1ac7-4d53-a78d-88111128a5d3",
//     //             "Site_Id": "035b874e-b50e-42d7-a5bc-0bccd0935c27",
//     //             "Spaces": [
//     //                 {
//     //                     "spaceId": "d31e7698-852a-4236-954c-448b82d32750",
//     //                     "spaceName": "waiting hall",
//     //                     "spaceType": "",
//     //                     "capacity": 0,
//     //                     "createdAt": "2024-08-12T12:00:32.000Z",
//     //                     "updatedAt": "2024-08-12T12:00:32.000Z",
//     //                     "Facility_Id": "29e5a302-1ac7-4d53-a78d-88111128a5d3",
//     //                     "Level_Id": "4e99fdfa-4bb0-4388-b39d-0a73c2a8c0c5",
//     //                     "Site_Id": "035b874e-b50e-42d7-a5bc-0bccd0935c27",
//     //                     "Devices": []
//     //                 },
//     //                 {
//     //                     "spaceId": "8e55d3f4-eeb3-4b0f-b3c8-38de76bc13f1",
//     //                     "spaceName": "reception",
//     //                     "spaceType": "",
//     //                     "capacity": 0,
//     //                     "createdAt": "2024-08-12T12:00:32.000Z",
//     //                     "updatedAt": "2024-08-12T12:00:32.000Z",
//     //                     "Facility_Id": "29e5a302-1ac7-4d53-a78d-88111128a5d3",
//     //                     "Level_Id": "4e99fdfa-4bb0-4388-b39d-0a73c2a8c0c5",
//     //                     "Site_Id": "035b874e-b50e-42d7-a5bc-0bccd0935c27",
//     //                     "Devices": []
//     //                 }
//     //             ]
//     //         }
//     //     ]
//     // },
//     // {
//     //     "facilityId": "90959f84-abb4-49f4-a7e1-4d5b4ec8dcf1",
//     //     "facilityName": "ece block",
//     //     "fileUrl": "https://storagesmartroute27.blob.core.windows.net/filesupload/BVCCollegeofEngineering,V),Rajanagaram(M,Palacherla,Rajahmundry,AndhraPradesh,India/eceblock/jpg/dubai.jpg",
//     //     "geometry": {
//     //         "type": "Polygon",
//     //         "coordinates": [
//     //             [
//     //                 [
//     //                     81.84119872236465,
//     //                     17.05946619741448
//     //                 ],
//     //                 [
//     //                     81.84171883332601,
//     //                     17.05946619741448
//     //                 ],
//     //                 [
//     //                     81.84170832967834,
//     //                     17.059009780850232
//     //                 ],
//     //                 [
//     //                     81.84120016008137,
//     //                     17.059009780850232
//     //                 ],
//     //                 [
//     //                     81.84119872236465,
//     //                     17.05946619741448
//     //                 ]
//     //             ]
//     //         ]
//     //     },
//     //     "facilitylocation": {
//     //         "type": "Point",
//     //         "coordinates": [
//     //             81.8418789,
//     //             17.0601386
//     //         ]
//     //     },
//     //     "createdAt": "2024-08-09T12:02:50.000Z",
//     //     "updatedAt": "2024-08-09T12:02:50.000Z",
//     //     "Site_Id": "035b874e-b50e-42d7-a5bc-0bccd0935c27",
//     //     "Levels": []
//     // }  
// ];


