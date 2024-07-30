import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MaplocationService } from 'src/app/services/maplocation.service';
import * as maptalks from "maptalks";
import { FilesService } from '../../files.service';
import { environment } from 'src/environments/environment.development';

import { distinctUntilChanged, filter, fromEvent, Subscription } from 'rxjs';
import * as chairGeojson from '../../../../assets/Chair.json'
import { MatSidenav } from '@angular/material/sidenav';
import { AddSpaceComponent } from '../add-space/add-space.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { EditMarkerTextComponent } from '../edit-marker-text/edit-marker-text.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
@Component({
  selector: 'app-on-board-level',
  templateUrl: './on-board-level.component.html',
  styleUrls: ['./on-board-level.component.scss']
})
export class OnBoardLevelComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('levelMap') levelMap: ElementRef;
  @ViewChild('LevelAndSpaceform') myForm: any;
  isClicked: boolean = false;
  editing: boolean = false;
  viewing: boolean = false;
  NewLevel: boolean = false;
  obtainedSiteId: any;
  map: any;
  obtainedFaciltiyId: any;
  file: any;
  showToolbar: boolean = false;
  levelAlreadyExist: boolean = false;
  layer: any;
  geometrylayer: any;
  sampleGeojson: any = {
    type: "FeatureCollection",
    features: []
  };
  drawToolitems: any = ['Polygon'];
  public form: any = {
    levelName: '',
    SpacesList: []
  }
  isAllLevels: boolean = false;
  No_of_columns: any = '1fr 1fr 1fr 1fr ';
  subscription: Subscription;
  obtainedGeometry: any;
  polygon: any;
  fileName: any;
  fileType: any;
  obtainedFaciltiyname: any;
  marker: maptalks.Marker;
  imageLayer: any;
  panel: any = []
  drawTool: maptalks.DrawTool;
  enablecreateLevel: boolean = false;
  isbuttonClikced: boolean = false;
  typeofshape: any;
  roomGeometry: any;
  selectedRoomName: any;
  obtainSiteName: any;
  Levels: any = [];
  AllLevelsData: any = [];
  selectedLevelData: any;
  spacesData: any[];
  constructor(private http: HttpClient, private dashboardservice: MaplocationService, private router: ActivatedRoute, private dialog: MatDialog, private blobService: FilesService, private route: Router, private snackbar: MatSnackBar) {
    this.router.queryParams.subscribe((params: any) => {
      if (Object.entries(params).length > 0) {
        this.obtainSiteName = params.siteName;
        this.obtainedSiteId = params.siteId;
        this.obtainedFaciltiyId = params.facilityId;
        this.getLevelsByFacilityId(params.facilityId);
        this.obtainedFaciltiyname = params.facilityname;
        this.obtainedGeometry = JSON.parse(params.layout)
      } else {
        this.route.navigate(["/dashboard"]);
      }

    })
  }
  public toggleMenu() {
    this.isClicked = !this.isClicked;
  }
  ngAfterViewInit(): void {


  }
  onChangeValue(event: any) {
    this.levelAlreadyExist = this.Levels.includes(event.target.value);
    //console.log(this.levelAlreadyExist,":::exiting level:::")
  }
  addNew() {
    this.NewLevel = true;
    this.editing = false;
    this.viewing = false;
    this.isAllLevels = false;
    setTimeout(() => {
      this.initMap();

    }, 2000)
  }
  editLevel(data: any) {
    this.selectedLevelData = data;
    this.NewLevel = false;
    this.editing = true;
    this.viewing = false;
    this.isAllLevels = false;
    this.form.levelName = data.levelName;
    this.form.FloorPlanImageUrl = data.FloorPlanImageUrl;


    setTimeout(() => {
      this.initMap();
      this.getAllSpacesByLevelId(data.levelId);
      this.receiveDataFromChild(data.FloorPlanImageUrl);

    }, 2000)

  }
  backtoAllFloors() {
    this.viewing = false;
    this.getLevelsByFacilityId(this.obtainedFaciltiyId)
  }
  viewLevel(data: any) {
    this.selectedLevelData = data;
    this.NewLevel = false;
    this.editing = false;
    this.viewing = true;
    this.isAllLevels = false;
    setTimeout(() => {
      this.initMap();
      this.getAllSpacesByLevelId(data.levelId);
      this.receiveDataFromChild(data.FloorPlanImageUrl);
    }, 2000)
  }
  deleteLevel(data: any) {
    this.selectedLevelData = data;
    let deletePop: any = this.dialog.open(DeleteDialogComponent);
    deletePop.afterClosed().subscribe((dailogEvent: any) => {
      if (dailogEvent.event == 'Yes') {
        this.deleteselectedLevel(data.levelId);
      }
    })
  }

  getLevelsByFacilityId(id: any) {
    this.Levels = [];
    this.AllLevelsData = [];
    this.dashboardservice.getLevelsByFacilityId(id).subscribe((levelData: any) => {
      this.AllLevelsData = levelData
      if (levelData.length > 0) {
        this.isAllLevels = true;
        levelData.forEach((level: any) => {
          this.Levels.push(level.levelName);
        });
        this.showAllLevels();

      } else {
        this.isAllLevels = false
        this.addNew()
      }

    })
  }

  toggleRightSideBar() {
    this.isbuttonClikced = !this.isbuttonClikced;
    this.sidenav.toggle();
    this.toggleMenu()
  }
  ngOnInit(): void {

  }
  showAllLevels() {

  }
  submitlevl() {
    let params: any = {
      "Site_Id": this.obtainedSiteId,
      "Facility_Id": this.obtainedFaciltiyId,
      "levelName": this.form.levelName,
      "FloorPlanImageUrl": this.form.FloorPlanImageUrl,
      "Geojsonfile": this.form.Geojsonfile
    }
    this.dashboardservice.addLevel(params).subscribe((response: any) => {
      if (response) {
        this.Levels.push(response.levelName);
        this.snackbar.open('Level Added Successfully', 'ok', {
          duration: 2000,
          panelClass: 'success-snackbar',
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
        let payload: any = {
          facilityId: response.Facility_Id,
          levelName: response.levelName
        }
        if (this.form.SpacesList.length > 0) {
          this.dashboardservice.getLevelsByLevelName(payload).subscribe((Leveldata: any) => {
            if (Leveldata.length > 0) {

              this.submitSpaces(Leveldata[0])
            } else {
              this.getLevelsByFacilityId(this.obtainedFaciltiyId)
            }
          });
        }
      }

    },
      (error) => {
        this.dashboardservice.obtainedError.subscribe((err: any) => {
          if (err) {
            this.snackbar.open('Error inSide Add Levels', 'ok', {
              duration: 2000,
              verticalPosition: "top", // Allowed values are  'top' | 'bottom'
              horizontalPosition: "center",
              panelClass: 'error-snackbar'
              // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
            })
          }

        })
      }
    );

  }
  deleteselectedLevel(id: any) {
    this.dashboardservice.deleteLevel(id).subscribe((data: any) => {
      if (data) {
        this.snackbar.open('Level Deleted ', 'ok', {
          duration: 2000,
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center",
          panelClass: 'error-snackbar'
          // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
        this.getLevelsByFacilityId(this.obtainedFaciltiyId)
      }
    })
  }
  submitSpaces(lData: any) {
    this.form.SpacesList.forEach((item) => {
      item.Site_Id = lData.Site_Id,
        item.Facility_Id = lData.Facility_Id,
        item.Level_Id = lData.levelId
    });
    //////////console.log(this.form.SpacesList,"::::payload for Spaces")
    this.dashboardservice.addSpaces(this.form.SpacesList).subscribe((spacesData: any) => {
      if (spacesData) {
        this.snackbar.open('Spaces Added Successfully', 'ok', {
          duration: 2000,
          panelClass: 'success-snackbar',
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
        this.form.SpacesList = [];
        this.myForm.resetForm({});
        this.toggleRightSideBar();
        this.getLevelsByFacilityId(this.obtainedFaciltiyId)
      }

    }, (error) => {
      this.dashboardservice.obtainedError.subscribe((err: any) => {
        //////////console.log(err,"error message");
        if (err) {
          this.snackbar.open('Error inSide Add Sapces', 'ok', {
            duration: 2000,
            verticalPosition: "top", // Allowed values are  'top' | 'bottom'
            horizontalPosition: "center",
            panelClass: 'error-snackbar'
            // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
          })
        }

      })
    }
    )
  }
  initMap() {
    //////////console.log(this.obtainedGeometry);
    this.map = null;
    (document.getElementById('level-map') as HTMLElement).innerHTML = '';
    this.map = new maptalks.Map("level-map", {
      center: [-1.85306, 52.63249],
      zoom: 1,
      minZoom: 16,
      pitch: 6,
      baseLayer: new maptalks.TileLayer("base", {
        urlTemplate: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
        subdomains: ["a", "b", "c", "d"]
      }),
    });
    /* creating seperate vectorLayer for shapes  */
    this.geometrylayer = new maptalks.VectorLayer('v').setOptions({
      editable: true,
    }).addTo(this.map);

    /*created layer for layout  */
    this.layer = new maptalks.VectorLayer('vector').setOptions({
      editable: true,
    }).addTo(this.map);

    /*creating polygon layer vector layer for fitextent  */
    this.polygon = new maptalks.Polygon(this.obtainedGeometry.coordinates, {
      symbol: {
        polygonFill: '#fff',
        polygonOpacity: 0.5
      },
      properties: {
        id: 'layout',
      }
    });


    this.layer.setOptions({ enableAltitude: true }).addGeometry(this.polygon);

    /*initiating DrawTool  */
    this.drawTool = new maptalks.DrawTool({
      mode: 'Point',
    }).addTo(this.map).disable();


    this.drawTool.on('drawend', (param: any) => {
      let obtainedGeojson: any = JSON.stringify(param.geometry.toGeoJSON());
      let parsedObject: any = JSON.parse(obtainedGeojson);

      if (this.typeofshape == 'room') {

        this.geometrylayer.addGeometry(new maptalks.Polygon(parsedObject.geometry.coordinates, {
          visible: true,         // Polygon visibility
          editable: true,        // Polygon can be edited
          cursor: "pointer",     // Pointer cursor on polygon
          draggable: false,      // Polygon not draggable
          dragShadow: false,     // No drag shadow displayed
          drawOnAxis: null,      // No axis constraint for dragging
          symbol: {
            'lineColor': 'black',
            'lineWidth': 2,
            'polygonFill': 'rgb(135,196,240)',
            'polygonOpacity': 0.6 // Polygon opacity
          },
          properties: {
            // Polygon ID
            SpaceName: 'room',                                   // Space Name (assuming it's related to levelname)
            name: '',                                        // Name (assuming it's related to levelname)
            altitude: 0,                   // Altitude adjustment based on index and ArrayLength
            visible: true,                                          // Polygon visibility
          },
        })).bringToFront();

        var spaceDialog: any = this.dialog.open(AddSpaceComponent);

        spaceDialog.afterClosed().subscribe((dialogData: any) => {

          this.roomGeometry = this.geometrylayer.getGeometries().filter((geo: any, index: any) =>
            geo.properties.SpaceName === 'room'
          );
          if (dialogData.data) {
            this.roomGeometry[0].properties.SpaceName = dialogData.data.spaceName;
            this.roomGeometry[0].properties.name = dialogData.data.spaceName;
            this.roomGeometry[0].addEventListener('click', (e: any) => {
              this.showToolbar = true;
              this.selectedRoomName = e.target.properties.name;
              e.target.startEdit();
              this.showToolbar = true;
            });
            dialogData.data ? this.createTextmarker(this.roomGeometry[0].getCenter(), dialogData.data.spaceName, '', this.roomGeometry[0].getSize().width, this.roomGeometry[0].getSize().height) : ''

            parsedObject.properties = {
              SpaceName: dialogData.data.spaceName,
              SpaceId: dialogData.data.sapceId,
            }
            this.sampleGeojson.features.push(parsedObject);
            let arr = [
              {
                spaceName: dialogData.data.spaceName,
                spaceType: '',
                capacity: 0
              }]
            this.form.SpacesList = [...this.form.SpacesList, ...arr];

            this.drawTool.disable();
          } else {
            this.geometrylayer.removeGeometry(this.roomGeometry[0]);
          }
        })
        //this.geometrylayer.addGeometry(param.geometry).bringToFront();

      } else {
        this.geometrylayer.addGeometry(param.geometry).bringToFront();
        parsedObject.properties = {
          SpaceName: this.typeofshape,
        }
        this.sampleGeojson.features.push(parsedObject);
      }


    });
    var items = this.drawToolitems.map((value: any) => {
      return {
        item: value,
        click: () => {

          this.drawTool.setMode(value).enable();
        }
      };
    });
    new maptalks.control.Toolbar({
      items: [
        {
          item: 'Shape',
          children: items
        },
        {
          item: 'Disable',
          click: () => {
            this.drawTool.disable();
          }
        },
        {
          item: 'Clear',
          click: () => {

            this.layer.clear();
            // this.form.facilityLayout=null;

          }
        }
      ]
    }).addTo(this.map).hide();
    this.map.getLayer('vector').bringToFront();
    this.map.fitExtent(this.polygon.getExtent(), 0);

    this.imageLayer = new maptalks.ImageLayer('images');

    this.map.addLayer(this.imageLayer);

    const keyDowns: any = fromEvent(document, 'keydown').pipe(
      filter((e: KeyboardEvent) => e.keyCode === 27),
      distinctUntilChanged()
    );
    this.subscription = keyDowns.subscribe(escpress => {
      if (escpress.type === 'keydown') {
        this.drawTool.disable();

      }
    });
    // this.create_rotate_marker();
  }
  async uploadGeojsonFle(content: any, fileName: any, contentType: any) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    const formData = new FormData();
    formData.append('file', file);
    this.fileType = fileName.split(".")[1];
    if (fileName) {
      this.blobService.uploadImage(environment.sasToken, file, this.obtainSiteName.replace(/\s+/g, '') + '/' + this.obtainedFaciltiyname.replace(/\s+/g, '') + "/" + this.form.levelName.replace(/\s+/g, '') + "/" + this.fileType + "/" + fileName, () => {
      });
      this.form.Geojsonfile = `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.obtainSiteName.replace(/\s+/g, '')}/${this.obtainedFaciltiyname.replace(/\s+/g, '')}/${this.form.levelName.replace(/\s+/g, '')}/${this.fileType}/${fileName}`;

      //this.reloadImages();
    }
    //a.click();

  }
  uploadFloorPlan() {


    //////////console.log(this.file,":::image file:::")
    this.fileType = this.fileName.split(".")[1];

    const formData = new FormData();
    formData.append('file', this.file);

    if (this.fileName) {
      this.blobService.uploadImage(environment.sasToken, this.file, this.obtainSiteName.replace(/\s+/g, '') + '/' + this.obtainedFaciltiyname.replace(/\s+/g, '') + "/" + this.form.levelName.replace(/\s+/g, '') + "/" + this.fileType + "/" + this.fileName, () => {
      });
      this.form.FloorPlanImageUrl = `https://storagesmartroute27.blob.core.windows.net/filesupload/${this.obtainSiteName.replace(/\s+/g, '')}/${this.obtainedFaciltiyname.replace(/\s+/g, '')}/${this.form.levelName.replace(/\s+/g, '')}/${this.fileType}/${this.fileName}`;
      //this.addFacility(this.form)
    }



  }
  createTextmarker(point: any, Name, SpaceId: any, width: any, height: any) {
    //////////console.log(Name,"::::Spacenames :::::")
    new maptalks.Marker(
      point,
      {
        'properties': {
          'name': Name,
          'spaceId': SpaceId ? SpaceId : 'newSpace'
        },
        'symbol': {
          'textFaceName': 'sans-serif',
          'textName': Name,          //value from name in geometry's properties
          'textWeight': width / 2, //'bold', 'bolder'
          'textStyle': height / 2,
          'textSize': 9,
          'textFill': '#fff',
          'markerFillOpacity': 1,
          'textDy': 5,
          'textHaloFill': 'blue',
          'textHaloRadius': 5,
          'textWrapWidth': null,
          'textWrapCharacter': '\n',
          'textLineSpacing': 0,

          'textDx': 0,
          'textHorizontalAlignment': 'middle', //left | middle | right | auto
          'textVerticalAlignment': 'middle',   // top | middle | bottom | auto
          'textAlign': 'center'
        }
      }
    ).on('click', (e: any) => {


    }).addTo(this.geometrylayer);

  }
  deleteGeometry() {
    let Markers: any = this.geometrylayer.getGeometries().filter((geo: any, index: any) =>
      geo.type === 'Point'
    );
    let Geometries: any = this.geometrylayer.getGeometries().filter((geo: any, index: any) =>
      geo.type != 'Point'
    );
    let formindex: any = this.form.SpacesList.findIndex(obj => obj.spaceName === this.selectedRoomName);
    if (formindex !== -1) {
      this.form.SpacesList.splice(formindex, 1);
    }
    let jsoIndex: any = this.sampleGeojson.features.findIndex(obj => obj.properties.SpaceName === this.selectedRoomName);
    console.log(jsoIndex, 'inside delete space ')
    if (jsoIndex !== -1) {
      if (this.editing) {
        let deletepop: any = this.dialog.open(DeleteDialogComponent);
        deletepop.afterClosed().subscribe((dialogEvent: any) => {
          if (dialogEvent.event == 'Yes') {
            this.deleteSpaceFormLevel(this.sampleGeojson.features[jsoIndex].properties.SpaceId, jsoIndex);
            this.geometrylayer.removeGeometry(Geometries.find((geo) => geo.properties.name == this.selectedRoomName));
            this.geometrylayer.removeGeometry(Markers.find((marker) => marker.properties.name == this.selectedRoomName));
        
            !this.editing && this.form.SpacesList.length == 0 && this.sampleGeojson.features.length == 0 ? this.showToolbar = false : this.showToolbar = true;
          }
        })

      } else { 

        console.log("hi else is triggered")
        this.sampleGeojson.features.splice(jsoIndex, 1);
        this.geometrylayer.removeGeometry(Geometries.find((geo) => geo.properties.name == this.selectedRoomName));
        this.geometrylayer.removeGeometry(Markers.find((marker) => marker.properties.name == this.selectedRoomName));
    
        !this.editing && this.form.SpacesList.length == 0 && this.sampleGeojson.features.length == 0 ? this.showToolbar = false : this.showToolbar = true;
      }



    }
   
  }
  deleteSpaceFormLevel(spaceId: any, index: any) {
    console.log(spaceId, index, "spId ==> Delete a space ")
    this.dashboardservice.deletespace(spaceId).subscribe((responce: any) => {
      if (responce) {
        this.snackbar.open('Sapce Deleted ', 'ok', {
          duration: 2000,
          panelClass: 'success-snackbar',
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });
        this.sampleGeojson.features.splice(index, 1);
        console.log(this.sampleGeojson.features, "sample geojson after deleting a obj")
        this.uploadGeojsonFle(JSON.stringify(this.sampleGeojson), this.selectedLevelData.levelName.replace(/\s+/g, '') + ".geojson", "text/plain")
        this.sampleGeojson.features.length == 0 ? this.showToolbar = false : this.showToolbar = true;
      }

    })
  }
  endEdit() {
    console.log(this.selectedRoomName, ":::selectedRoomname::::");

    let Geometries: any = this.geometrylayer.getGeometries().filter((geo: any, index: any) =>
      geo.type != 'Point' && geo.properties.name == this.selectedRoomName
    );

    Geometries[0].endEdit();
    console.log(Geometries[0], ':::After End Edit:::');
    let jsoIndex: any = this.sampleGeojson.features.findIndex(obj => obj.properties.SpaceName === this.selectedRoomName);

    console.log(jsoIndex, "matched jsoIndex");
    if (jsoIndex !== -1 && (this.selectedRoomName != 'wall' && this.selectedRoomName != 'floor')) {
      this.sampleGeojson.features.splice(jsoIndex, 1);
    }
    console.log(this.sampleGeojson.features, "after Splice")


    this.sampleGeojson.features.push(Geometries[0].toGeoJSON());

    console.log(this.sampleGeojson.features, "after push")
    this.showToolbar = false;
    //this.roomGeometry.setRotation(45);
  }
  rotateMarker() {
    this.polygon.rotate(45, this.polygon.getCenter());

  }


  receiveDataFromChild(data: any) {
    //////////console.log(data,"::::image from sidenav::::")

    let oldImages: any = this.imageLayer.getImages();
    oldImages.length > 0 ? this.imageLayer.getImages().pop() : '';
    const img = document.createElement("img");
    img.src = data;

    // Convert base64 to Blob
    fetch(data)
      .then(res => res.blob())
      .then(blob => {
        // Create a URL for the Blob
        this.file = blob;
        const url = URL.createObjectURL(blob);
        //////////console.log(blob,"::::blob:::")

        this.imageLayer.setImages([{
          'url': url,
          'extent': this.polygon.getExtent(),
          'visible': true,
          'crossOrigin': 'anonymous',  // Specify cross-origin setting if loading external images
          'attribution': '',
          'forceRenderOnRotating': true
        }]);
      });
    this.enablecreateLevel = true;

    // You can handle the received data here
  }
  getFileType(name: any) {
    //////////console.log(name,":::file name::::")
    this.fileName = name
  }
  getAllSpacesByLevelId(levelId: any) {
    this.spacesData = []
    this.dashboardservice.getAllSpacesByLevelId(levelId).subscribe((SpaceData: any) => {
      //////////console.log(SpaceData,'::::responce::::');
      this.spacesData = SpaceData;
      this.createFilledpolygons(this.selectedLevelData.Geojsonfile);
    })
  }
  createStructure(name: any) {
    this.typeofshape = name;
    if (name == 'wall') {
      this.drawTool.setMode('Rectangle').setSymbol({
        'lineColor': 'black',
        'lineWidth': 2,
        'polygonFill': 'black',
        'polygonOpacity': 0.6
      }).enable()
    }
    else if (name == 'room') {
      this.drawTool.setMode('Rectangle').setSymbol({
        'lineColor': 'black',
        'lineWidth': 2,
        'polygonFill': 'rgb(135,196,240)',
        'polygonOpacity': 0.6
      },
      ).enable()
    } else {
      this.drawTool.setMode('Polygon').setSymbol({
        'lineColor': '#34495e',
        'lineWidth': 2,
        'polygonOpacity': 0.1
      }).enable()
    }
  }
  async onSubmit(Data: any) {


    this.showToolbar = false;
    !this.editing ? (
      console.log(this.sampleGeojson, ":::during Create level:::"),
      await this.uploadGeojsonFle(JSON.stringify(this.sampleGeojson), this.form.levelName.replace(/\s+/g, '') + ".geojson", "text/plain"),
      this.uploadFloorPlan(), this.submitlevl()
    ) : (
      console.log(this.sampleGeojson, "during update level:::"),
      await this.uploadGeojsonFle(JSON.stringify(this.sampleGeojson), this.selectedLevelData.levelName.replace(/\s+/g, '') + ".geojson", "text/plain")
      , this.updateLevel());


  }

  updateLevel() {
    let params: any = {
      "Site_Id": this.obtainedSiteId,
      "Facility_Id": this.obtainedFaciltiyId,
      'levelId': this.selectedLevelData.levelId,
      "levelName": this.form.levelName,
      "FloorPlanImageUrl": this.form.FloorPlanImageUrl,
      "Geojsonfile": this.form.Geojsonfile
    }
    //////////console.log(params,"update Floor")

    this.dashboardservice.updateLevel(params).subscribe((response: any) => {
      if (response) {
        this.snackbar.open('Level Updated Successfully', 'ok', {
          duration: 2000,
          panelClass: 'success-snackbar',
          verticalPosition: "top", // Allowed values are  'top' | 'bottom'
          horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
        });

        console.log(this.form.SpacesList, "SPaces list inside update level")
        this.form.SpacesList.length > 0 ? this.submitSpaces(this.selectedLevelData) : (
          this.form.SpacesList = [],
          this.myForm.resetForm({}),
          this.toggleRightSideBar(),
          this.getLevelsByFacilityId(this.obtainedFaciltiyId)
        );
      }
    })
  }

  createFilledpolygons(geojsonFile: any) {
    var coordinates: any;
    this.sampleGeojson.features = [];
    this.http.get(String(geojsonFile)).subscribe((response: any) => {
      response.features.forEach((item: any, i: any) => {
        if (item.properties.SpaceName !== 'wall' && item.properties.SpaceName !== 'floor') {
          let derivedspaceId:any = this.spacesData.find((obj: any) => obj.Level_Id == this.selectedLevelData.levelId && obj.spaceName == item.properties.SpaceName);
          console.log(derivedspaceId,"::::derivedSpaceId:::::");
          item.properties.SpaceId = derivedspaceId.spaceId;
          item.properties.SpaceName = derivedspaceId.spaceName;
        }

        this.sampleGeojson.features.push(item);

        if (item.geometry.type == "Polygon") {
          coordinates = item.geometry.coordinates;
        } else if (item.geometry.type == "MultiPolygon") {
          coordinates = item.geometry.coordinates[0][0];
        }

        // Add a polygon geometry to the map's vector layer
        this.geometrylayer.addGeometry(new maptalks.Polygon(item.geometry.coordinates, {
          visible: true,         // Polygon visibility
          editable: true,        // Polygon can be edited
          cursor: "pointer",     // Pointer cursor on polygon
          draggable: false,      // Polygon not draggable
          dragShadow: false,     // No drag shadow displayed
          drawOnAxis: null,      // No axis constraint for dragging
          symbol: {
            'lineColor': 'black',
            'lineWidth': 2,
            'polygonFill': 'rgb(135,196,240)',
            'polygonOpacity': 0.6 // Polygon opacity
          },
          properties: {
            SpaceId: item.properties.SpaceId,                                      // Polygon ID
            SpaceName: item.properties.SpaceName,                                   // Space Name (assuming it's related to levelname)
            name: item.properties.SpaceName,                                        // Name (assuming it's related to levelname)
            altitude: 0,                   // Altitude adjustment based on index and ArrayLength
            visible: true,                                          // Polygon visibility
          },
        })).bringToFront();


      });
      let otherPolygon: any = this.geometrylayer.getGeometries().filter((geo: any, index: any) =>
        (geo.properties.SpaceName == 'wall' || geo.properties.SpaceName == 'floor')
      );
      otherPolygon.forEach((str: any) => {
        str.addEventListener('contextmenu', (e: any) => {
          this.selectedRoomName = e.target.properties.SpaceName
          e.target.startEdit();
          this.showToolbar = true;
        })
      })
      let derivedGeometries: any = this.geometrylayer.getGeometries().filter((geo: any, index: any) =>
        geo.type != 'Point' && (geo.properties.name != null || geo.properties.name != undefined) && (geo.properties.SpaceName !== 'wall' && geo.properties.SpaceName !== 'floor')
      );

      derivedGeometries.forEach((geo: any) => {
        geo.addEventListener('click', (e: any) => {
          if (this.editing || this.NewLevel) {
            var markerDialog: any = this.dialog.open(EditMarkerTextComponent, {
              data: {
                spaceName: e.target.properties.name,
                spaceId: e.target.properties.SpaceId
              }
            });

            markerDialog.afterClosed().subscribe((dialogData: any) => {
              console.log(dialogData, "::::update Space Dialog close data:::");

              if (dialogData.event != 'Cancel') {
                let currentspace: any = e.target.toGeoJSON();
                //console.log(currentspace,"Current before  Spaces After Updating Space name")
                currentspace.properties.SpaceName = dialogData.data.spaceName;
                currentspace.properties.name = dialogData.data.spaceName;
                currentspace.properties.SpaceId = dialogData.data.spaceId;
                e.target.properties.SpaceName = dialogData.data.spaceName;
                e.target.properties.name = dialogData.data.spaceName;
                e.target.properties.SpaceId = dialogData.data.spaceId;
                //console.log(currentspace,"Current After  Spaces After Updating Space name")
                let jsoIndex: any = this.sampleGeojson.features.findIndex(obj => obj.properties.SpaceId === dialogData.data.spaceId);
                if (jsoIndex !== -1) {
                  this.sampleGeojson.features[jsoIndex] = currentspace;
                  console.log(this.sampleGeojson, "After updating Room Name");

                }
                this.selectedRoomName = dialogData.data.spaceName;
                console.log(this.selectedRoomName, "selectedRoomName After updating Room Name");

                this.uploadGeojsonFle(JSON.stringify(this.sampleGeojson), this.form.levelName.replace(/\s+/g, '') + ".geojson", "text/plain")
                this.createTextmarker(e.target.getCenter(), e.target.properties.SpaceName, e.target.properties.SpaceId, e.target.getSize().width, e.target.getSize().height)

              }
              else if (dialogData.event === 'Cancel') {
                console.log(dialogData, ":::if cancle :::")
                e.target.properties.SpaceName = dialogData.data.spaceName;
                e.target.properties.name = dialogData.data.spaceName;
                e.target.properties.SpaceId = dialogData.data.spaceId;
                let currentspace: any = e.target.toGeoJSON();
                let jsoIndex: any = this.sampleGeojson.features.findIndex(obj => obj.properties.SpaceId === dialogData.data.spaceId);
                if (jsoIndex !== -1) {
                  this.sampleGeojson.features[jsoIndex] = currentspace;
                }
                this.selectedRoomName = dialogData.data.spaceName;

              }


            })
          }

        })
        geo.addEventListener('contextmenu', (e: any) => {
          this.selectedRoomName = e.target.properties.SpaceName ? e.target.properties.SpaceName : e.target.properties.name;
          e.target.startEdit();
          this.showToolbar = true;

        })

        this.createTextmarker(geo.getCenter(), geo.properties.SpaceName, geo.properties.SpaceId, geo.getSize().width, geo.getSize().height)

      });
    })
  }

}
