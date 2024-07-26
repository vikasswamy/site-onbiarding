export interface NavItem {
    parentName:string;
    parentId: string;
    displayName: string;
    id: string;
    geometry:{};
    children?: NavItem[];
  }