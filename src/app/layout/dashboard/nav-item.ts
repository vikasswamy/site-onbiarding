export interface NavItem {
    parentId: string;
    displayName: string;
    id: string;
    geometry:{};
    children?: NavItem[];
  }