import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'ice';
import BApi from '@/sdk/BApi';
import List from './components/List';
import ListDialog from './components/ListDialog';
import { Button } from '@alifd/next';
import { convertAllData, convertList } from './components/utils';
import { ListPropertyTag, ListPropertyType } from '@/sdk/constants';
import { IList, IListData } from './components/models';
import merge from 'deepmerge';
import { useUpdateEffect } from 'react-use';
import './$id.list.scss';

export default () => {
  const { id: paramId } = useParams();
  const id = parseInt(paramId!, 10);
  const [myLists, setMyLists] = useState<any>();
  const [lists, setLists] = useState<IList[]>([]);
  const listsRef = useRef(lists);
  const [data, setData] = useState<Record<number, IListData[]>>({});
  const [allDataForComputing, setAllDataForComputing] = useState<Record<number, IListData[]>>({});

  useUpdateEffect(() => {
    listsRef.current = lists;
  }, [lists]);

  const loadMyLists = useCallback(async () => {
    const allMyLists = (await BApi.myLists.getAllMyLists()).data || [];
    const myLists = allMyLists.find(d => d.id == id);
    setMyLists(myLists);
  }, []);

  const loadLists = useCallback(async () => {
    const allLists = (await BApi.myLists.getListsInMyLists(id!)).data || [];
    setLists(convertList(allLists));
  }, []);

  const loadData = useCallback(async () => {
    const allData = (await BApi.myLists.getMyListsData(id!)).data || [];
    setData(convertAllData(allData, listsRef.current));
  }, []);

  const initialize = useCallback(async () => {
    await loadMyLists();
    await loadLists();
    await loadData();
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    const tmpData = merge<Record<number, IListData[]>>({}, data);
    Object.keys(tmpData).forEach(listIdStr => {
      const listId = parseInt(listIdStr, 10);
      const ds = tmpData[listId];
      const list = lists.find(l => l.id == listId)!;
      const computedProperties = (lists.find(c => c.id == listId)?.properties || []).filter(t => t.type == ListPropertyType.External);
      for (const cp of computedProperties) {
        const externalList = lists.find(c => c.id == cp.externalListId);
        if (externalList) {
          for (const d of ds) {
            let ids: number[];
            if (cp.tags?.includes(ListPropertyTag.Multiple)) {
              ids = d.dynamic[cp.variableName] || [];
            } else {
              ids = [d.dynamic[cp.variableName]];
            }
            ids = ids.filter(a => a);
            if (ids.length > 0) {
              const eds = tmpData[externalList.id].filter(d => ids.some(id => id == d.id)) || []!;
              d.dynamic[cp.variableName] = eds.map(ed => ed.dynamic);

              for (const ed of eds) {
                (ed.dynamic[list.variableName] ??= []).push(d.dynamic);
              }
            }
          }
        }
      }
    });

    Object.keys(tmpData).forEach(listIdStr => {
      const listId = parseInt(listIdStr, 10);
      const ds = tmpData[listIdStr] || [];
      const computedProperties = (lists.find(c => c.id == listId)?.properties || []).filter(t => t.type == ListPropertyType.Computed);
      const list = lists.find(l => l.id == listId)!;
      const variables = list.properties.filter(p => p.type != ListPropertyType.Computed).map(p => p.variableName);
      for (let i = 0; i < ds.length; i++) {
        const d = ds[i];
        for (const cp of computedProperties) {
            Object.defineProperty(d.dynamic, cp.variableName, {
            get: () => {
              const funcStr = `(data, ${variables.join(', ')}) => {
                  ${cp.function}
              }`;
              const func = eval(funcStr);
              // console.log(d.dynamic, cp.function);
              try {
                return func(d.dynamic, ...variables.map(v => d.dynamic[v]));
              } catch (e) {
                // console.error(e, cp.variableName, d.dynamic);
                return e.message;
              }
            },
          });
        }
      }
    });

    Object.keys(tmpData).forEach(listIdStr => {
      const listId = parseInt(listIdStr, 10);
      const ds = tmpData[listIdStr] || [];
      const list = lists.find(l => l.id == listId)!;
      for (let i = 0; i < ds.length; i++) {
        const d: IListData = ds[i];
        if (list.dataNameConvention) {
          let str = list.dataNameConvention;
          const variables = list.properties.filter(p => p.type != ListPropertyType.Computed).map(p => p.variableName);
          const funcStr = `(data, ${variables.join(', ')}) => {${str}}`;
          // console.log(funcStr);
          const func = eval(funcStr);
          d.name = func(d.dynamic, ...variables.map(v => d.dynamic[v]));
        } else {
          d.name = `[${list.name}]${d.dynamic[list.properties?.[0]?.variableName]}`;
        }
      }
    });

    console.log('----- setting data for calculating -----');
    Object.keys(tmpData).forEach(listIdStr => {
      const listId = parseInt(listIdStr, 10);
      const ds = tmpData[listIdStr] || [];
      const list = lists.find(l => l.id == listId)!;
      console.log(`[${list.name}]`, ds);
    });
    console.log('----------------------------------------');
    setAllDataForComputing(tmpData);
  }, [data]);

  const showListDetail = useCallback((list?: IList) => {
    ListDialog.show({
      value: list ? {
        ...list,
      } : undefined,
      onSubmit: async value => {
        // @ts-ignore
        await BApi.data.putList({ ...value, myListsId: id });
        await loadLists();
      },
    });
  }, []);

  return (
    <div className={'my-lists-page'}>
      <div className={'my-lists'}>
        My Lists: {myLists?.name}
        <Button
          type={'primary'}
          onClick={() => {
            showListDetail();
          }}
          text
        >
          Add List
        </Button>
      </div>
      <div className={'lists'}>
        {lists.map((l, i) => {
          return (
            <List
              key={l.id}
              list={l}
              lists={lists}
              showDetail={showListDetail}
              data={data[l.id]}
              allDataForComputing={allDataForComputing}
              onDataChange={d => {
                const listData = data[l.id] || [];
                const index = listData.findIndex(ld => ld.id == d.id);
                if (index > -1) {
                  listData[index] = d;
                } else {
                  listData.push(d);
                }
                setData({ ...data, [l.id]: listData });
              }}
              onDataDeleted={id => {
                setData({
                  ...data,
                  [l.id]: data[l.id].filter(d => d.id != id),
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
