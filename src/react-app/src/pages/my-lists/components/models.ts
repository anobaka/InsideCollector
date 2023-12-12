import { ListPropertyTag, ListPropertyType } from '@/sdk/constants';

export interface IList {
  id: number;
  myListsId: number;
  variableName: string;
  name: string;
  description?: string;
  dataNameConvention?: string;
  order: number;
  width: number;

  properties: IListProperty[];
}

export interface IListProperty {
  id: number;
  listId: number;
  variableName: string;
  name: string;
  description?: string;
  type: ListPropertyType;
  tags: ListPropertyTag[];
  function?: string;
  externalListId?: number;
  group?: string;
  order: number;
  options?: IListPropertyOption[];
  width?: number;
  hidden: boolean;
}

export interface IListPropertyOption {
  propertyId: number;
  value: number;
  order: number;
  label: string;
}

export interface IListData {
  id: number;
  listId: number;
  order: number;
  myListsId: number;
  values: IListDataValue[];
  dynamic: Record<string, any>;

  name?: string;
}

export interface IListDataValue {
  id: string;
  dataId: number;
  propertyId: number;
  value?: string;
}
