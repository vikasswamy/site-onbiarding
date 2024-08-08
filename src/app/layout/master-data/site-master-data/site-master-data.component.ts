import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MaplocationService } from 'src/app/services/maplocation.service';

@Component({
  selector: 'app-site-master-data',
  templateUrl: './site-master-data.component.html',
  styleUrls: ['./site-master-data.component.scss']
})
export class SiteMasterDataComponent implements OnInit {
 
  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Address>>;

  data: User[] = USERS;
  obtainedSiteId:any;
  dataSource: MatTableDataSource<User>;
  usersData: User[] = [];
  columnsToDisplay = ['name', 'email', 'phone'];
  innerDisplayedColumns = ['street', 'zipCode', 'city'];
  innerInnerDisplayedColumns = ['comment', 'commentStatus'];
  expandedElement: User | null;
  expandedElements: any[] = [];

  constructor(private cd: ChangeDetectorRef,private mapService:MaplocationService, private router: ActivatedRoute) {
    
    this.router.queryParams.subscribe((params: any) => {
      this.obtainedSiteId = params.siteId;
      this.mapService.manju=params.siteId;
      this.mapService.params.next(params);
    });
    console.log(this.obtainedSiteId,"::::Site id from params::::");
  }

  ngOnInit() {
    USERS.forEach(user => {
      if (
        user.addresses &&
        Array.isArray(user.addresses) &&
        user.addresses.length
      ) {
        this.usersData = [
          ...this.usersData,
          { ...user, addresses: new MatTableDataSource(user.addresses) }
        ];
      } else {
        this.usersData = [...this.usersData, user];
      }
    });
    this.dataSource = new MatTableDataSource(this.usersData);
    this.dataSource.sort = this.sort;
    this.mapService.vikas='my name is vikas';
  }



  applyFilter(filterValue: string) {
    this.innerTables.forEach(
      (table, index) =>
        ((table.dataSource as MatTableDataSource<
          Address
        >).filter = filterValue.trim().toLowerCase())
    );
  }

  toggleRow(element: User) {
    element.addresses &&
    (element.addresses as MatTableDataSource<Address>).data.length
      ? this.toggleElement(element)
      : null;
    this.cd.detectChanges();
    this.innerTables.forEach(
      (table, index) =>
        ((table.dataSource as MatTableDataSource<
          Address
        >).sort = this.innerSort.toArray()[index])
    );
  }

  isExpanded(row: User): string {
    const index = this.expandedElements.findIndex(x => x.name == row.name);
    if (index !== -1) {
      return 'expanded';
    }
    return 'collapsed';
  }

  toggleElement(row: User) {
    const index = this.expandedElements.findIndex(x => x.name == row.name);
    if (index === -1) {
      this.expandedElements.push(row);
    } else {
      this.expandedElements.splice(index, 1);
    }

    //console.log(this.expandedElements);
  }


}
export interface User {
  name: string;
  email: string;
  phone: string;
  addresses?: Address[] | MatTableDataSource<Address>;
}

export interface Comment{
  commenID: number;
  comment: string;
  commentStatus: string;
}

export interface Address {
  street: string;
  zipCode: string;
  city: string;
  comments?: Comment[] | MatTableDataSource<Comment>;
}

const USERS: User[] = [
  {
    name: 'Mason',
    email: 'mason@test.com',
    phone: '9864785214',
    addresses: [
      {
        street: 'Street 1',
        zipCode: '78542',
        city: 'Kansas',
        comments: [
          {
            commenID: 1,
            comment: 'Test',
            commentStatus: 'Open'
          },
          {
            commenID: 2,
            comment: 'Test',
            commentStatus: 'Open'
          },{
            commenID: 3,
            comment: 'Test',
            commentStatus: 'Closed'
          },
        ]
      },
      {
        street: 'Street 2',
        zipCode: '78554',
        city: 'Texas',
        comments: [
          {
            commenID: 4,
            comment: 'Test',
            commentStatus: 'Open'
          },
          {
            commenID: 5,
            comment: 'Test',
            commentStatus: 'Open'
          },{
            commenID: 6,
            comment: 'Test',
            commentStatus: 'Closed'
          },
        ]
      }
    ]
  },
  {
    name: 'Eugene',
    email: 'eugene@test.com',
    phone: '8786541234',
    addresses: [
      {
        street: 'Street 5',
        zipCode: '23547',
        city: 'Utah',
        comments: [
          {
            commenID: 7,
            comment: 'Test',
            commentStatus: 'Open'
          },
          {
            commenID: 8,
            comment: 'Test',
            commentStatus: 'Open'
          },{
            commenID: 9,
            comment: 'Test',
            commentStatus: 'Closed'
          },
        ]
      },
      {
        street: 'Street 5',
        zipCode: '23547',
        city: 'Ohio',
        comments: [
          {
            commenID: 19,
            comment: 'Test',
            commentStatus: 'Open'
          },
          {
            commenID: 11,
            comment: 'Test',
            commentStatus: 'Open'
          },{
            commenID: 12,
            comment: 'Test',
            commentStatus: 'Closed'
          },
        ]
      }
    ]
  },
  {
    name: 'Jason',
    email: 'jason@test.com',
    phone: '7856452187',
    addresses: [
      {
        street: 'Street 5',
        zipCode: '23547',
        city: 'Utah',
        comments: [
          {
            commenID: 13,
            comment: 'Test',
            commentStatus: 'Open'
          },
          {
            commenID: 14,
            comment: 'Test',
            commentStatus: 'Open'
          },{
            commenID: 15,
            comment: 'Test',
            commentStatus: 'Closed'
          },
        ]
      },
      {
        street: 'Street 5',
        zipCode: '23547',
        city: 'Ohio',
        comments: [
          {
            commenID: 16,
            comment: 'Test',
            commentStatus: 'Open'
          },
          {
            commenID: 17,
            comment: 'Test',
            commentStatus: 'Open'
          },{
            commenID: 18,
            comment: 'Test',
            commentStatus: 'Closed'
          },
        ]
      }
    ]
  }
];
