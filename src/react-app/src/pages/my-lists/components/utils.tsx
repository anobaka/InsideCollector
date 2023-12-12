import {
  InsideCollectorModelsEntitiesInsideList,
  InsideCollectorModelsEntitiesListData,
  InsideCollectorModelsEntitiesListDataValue,
} from '@/sdk/Api';
import { IList, IListData, IListDataValue, IListProperty, IListPropertyOption } from './models';
import { ListPropertyTag, listPropertyTags, ListPropertyType } from '@/sdk/constants';

export function convertList(allLists: InsideCollectorModelsEntitiesInsideList[]): IList[] {
  return allLists.map(l => ({
    id: l.id!,
    name: l.name!,
    myListsId: l.myListsId!,
    variableName: l.variableName!,
    properties: l.properties!.map<IListProperty>(p => ({
      id: p.id!,
      listId: p.listId!,
      name: p.name!,
      variableName: p.variableName!,
      type: p.type! as unknown as ListPropertyType,
      tags: listPropertyTags.filter(t => (p.tags! & t.value) == t.value).map(a => a.value),
      externalListId: p.externalListId!,
      options: p.options!.map<IListPropertyOption>(o => (
        {
          label: o.label!,
          value: o.id!,
          propertyId: o.propertyId!,
          order: o.order ?? Number.MAX_VALUE,
        }
      )),
      group: p.group ?? undefined,
      function: p.function ?? undefined,
      description: p.description ?? undefined,
      order: p.order ?? Number.MAX_VALUE,
      width: p.width,
      hidden: p.hidden ?? false,
    })),
    dataNameConvention: l.dataNameConvention ?? undefined,
    description: l.description ?? undefined,
    order: l.order ?? Number.MAX_VALUE,
    width: l.width!,
  }));
}

export function convertAllData(allData: InsideCollectorModelsEntitiesListData[], lists: IList[]): Record<number, IListData[]> {
  return allData.map<IListData>(d => {
    const list = lists.find(l => l.id == d.listId)!;
    return convertData(d, list);
  }).reduce((s, d) => {
    if (!(d.listId in s)) {
      s[d.listId] = [];
    }
    s[d.listId].push(d);
    return s;
  }, {});
}

export function convertDataValue(v: InsideCollectorModelsEntitiesListDataValue): IListDataValue {
  let value: any;
  if (v.value != undefined) {
    try {
      value = JSON.parse(v.value);
    } catch (e) {
      value = e.message + v.value;
    }
  }
  const d = {
    id: v.id!,
    dataId: v.dataId!,
    propertyId: v.propertyId!,
    value: value,
  };

  // console.log(d, value, typeof value);

  return d;
}

export function convertData(d: InsideCollectorModelsEntitiesListData, list: IList): IListData {
  const data: IListData = {
    id: d.id!,
    listId: d.listId!,
    myListsId: d.myListsId!,
    values: d.values?.map<IListDataValue>(v => convertDataValue(v)) || [],
    dynamic: {},
    order: d.order ?? Number.MAX_VALUE,
  };
  for (const value of data.values!) {
    const p = list.properties?.find(p => p.id == value.propertyId)!;
    // console.log(lists, value, d);
    data.dynamic[p.variableName] = value.value;
  }
  // console.log(data);
  return data;
}

export const getValue = (data: any, key: string): any => {
  if (data === undefined) {
    return;
  }
  const keys = key.split('.');
  if (keys.length > 1) {
    const k = keys.shift()!;
    return getValue(data[k], keys.join('.'));
  } else {
    return data[key];
  }
};

export const renderPropertyValue = (dataForComputing: IListData, propertyValue: any, property: IListProperty, allLists: IList[], allComputedData: Record<number, IListData[]>) => {
  if (propertyValue == undefined && property.type != ListPropertyType.Computed) {
    return;
  }
  switch (property.type) {
    case ListPropertyType.External: {
      if (propertyValue) {
        const list = allLists.find(c => c.id == property.externalListId);
        if (list) {
          const values = (property.tags.includes(ListPropertyTag.Multiple) ? propertyValue : [propertyValue]).map(v => (typeof v === 'string' || v instanceof String ? parseInt(v as string, 10) : v));
          const d = allComputedData[list.id].filter(d => values.includes(d.id));
          if (d.length > 0) {
            return d.map(a => a.name).join(',');
          }
        }
      }
      return;
    }
    case ListPropertyType.Computed: {
      const cv = dataForComputing.dynamic?.[property.variableName];
      // console.log(dataForComputing, property.variableName, cv);
      if (typeof cv == 'number') {
        return cv.toFixed(2);
      }
      return cv;
    }
    case ListPropertyType.Image:
    case ListPropertyType.File:
    case ListPropertyType.Text:
    // return (
    //   <pre style={{ wordWrap: 'break-word', whiteSpace: 'break-spaces' }}>{propertyValue}</pre>
    // );
    case ListPropertyType.Number:
    case ListPropertyType.Input:
    case ListPropertyType.DateTime:
    case ListPropertyType.TimeSpan:
    case ListPropertyType.Select:
    case ListPropertyType.Date:
      return propertyValue;
  }
};

