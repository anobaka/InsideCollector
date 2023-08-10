import { Balloon, Button, Dialog, Table } from '@alifd/next';
import PropertyDialog from '../PropertyDialog';
import React, { useState } from 'react';
import BApi from '@/sdk/BApi';
import { ListPropertyType } from '@/sdk/constants';
import { useUpdate } from 'react-use';
import { IList, IListData, IListProperty } from '../models';
import { convertData } from '../utils';
import ClickableIcon from '@/components/ClickableIcon';
import './index.scss';
import CustomIcon from '@/components/CustomIcon';
import PropertyValue from '@/pages/my-lists/components/PropertyValue';


interface IProps {
  list: IList;
  lists: IList[];
  data: IListData[];
  allDataForComputing: Record<number, IListData[]>;
  showDetail: (list: IList) => any;
  onDataChange: (data: IListData) => any;
  onDataDeleted: (id: number) => any;
}


export default (props: IProps) => {
  const forceUpdate = useUpdate();

  const {
    list,
    showDetail,
    lists,
    data,
    allDataForComputing,
    onDataChange,
    onDataDeleted,
  } = props;

  const [editingDataIds, setEditingDataIds] = useState<number[]>([]);

  const groupedProperties: { group?: string; properties: IListProperty[] }[] = [];
  for (const p of list.properties) {
    if (p.group != undefined) {
      const gp = groupedProperties.find(gp => gp.group == p.group);
      if (gp) {
        gp.properties.push(p);
        continue;
      }
    }
    groupedProperties.push({
      group: p.group,
      properties: [p],
    });
  }

  return (
    <div
      className={'inside-list'}
      style={{ width: `${list.width}%` }}
      key={list.id}
    >
      <div className="info">
        <Balloon
          triggerType={'hover'}
          align={'t'}
          trigger={(
            <Button
              type={'primary'}
              text
              onClick={() => {
                showDetail(list);
              }}
              size={'large'}
            >{list.name}</Button>
          )}
          v2
          closable={false}
        >
          {list.variableName}
        </Balloon>
        <Button
          type={'normal'}
          size={'small'}
          onClick={() => {
            PropertyDialog.show({
              list,
              lists,
              onSubmitted: async (p) => {
                list.properties.push(p);
                forceUpdate();
              },
            });
          }}
        >
          <CustomIcon type={'plus-circle'} size={'small'} />
          property
        </Button>
        <Button
          type={'normal'}
          size={'small'}
          onClick={async () => {
            const rsp = await BApi.data.putListData({
              listId: list.id,
            });
            onDataChange(convertData(rsp.data!, list));
          }}
        > <CustomIcon type={'plus-circle'} size={'small'} />
          data</Button>
      </div>
      <div className={'data'}>
        <Table
          size={'small'}
          dataSource={data}
          rowProps={(r, i) => {
            if (editingDataIds.includes(r.id)) {
              return {
                className: 'active',
              };
            }
            return;
          }}
          // dataIndex: keys
          onFilter={(filterParams) => {
            console.log(filterParams);
          }}
        >
          <Table.Column
            // width={60}
            title={'#'}
            className={'id'}
            dataIndex={'id'}
            cell={(id, i, r) => {
              return (
                <Balloon
                  triggerType={'hover'}
                  closable={false}
                  trigger={(
                    <Button type={'primary'} text>
                      {i + 1}
                    </Button>
                  )}
                  v2
                  align={'t'}
                >
                  <ClickableIcon
                    size={'small'}
                    type={'delete'}
                    colorType={'danger'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      Dialog.confirm({
                        title: 'Delete data',
                        content: 'Are you sure to delete this data?',
                        autoFocus: true,
                        v2: true,
                        width: 'auto',
                        closeMode: ['mask', 'close', 'esc'],
                        onOk: async () => {
                          const rsp = await BApi.data.deleteListData(id);
                          if (!rsp.code) {
                            onDataDeleted(id);
                          }
                        },
                      });
                    }}
                  />
                </Balloon>
              );
            }}
          />
          {groupedProperties.map(gp => {
            const cols = gp.properties.map(p => {
              const flag = p.type == ListPropertyType.Computed ? (
                <span className={'computed'}>C</span>
              ) : p.type == ListPropertyType.External ? (
                <span className={'external'}>E</span>
              ) : null;
              const text = p.name;

              return (
                <Table.Column
                  key={p.id}
                  filterMode={'multiple'}
                  filters={[
                    {
                      label: 'Computed',
                      value: 123,
                    },
                    {
                      label: 'Computed123',
                      value: 12344,
                    },
                  ]}
                  dataIndex={`dynamic.${p.variableName}`}
                  width={p.width ? `${p.width}%` : undefined}
                  title={(
                    <Balloon
                      v2
                      closable={false}
                      triggerType={'hover'}
                      align={'t'}
                      trigger={(
                        <div
                          draggable
                          onDragStart={e => {
                            e.dataTransfer.setData('text', p.id.toString());
                          }}
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => {
                            e.preventDefault();
                            const id = parseInt(e.dataTransfer.getData('text'), 10);
                            const newOrder = p.order;
                            BApi.property.reorderProperties({
                              dataId: id,
                              newOrder,
                            }).then(a => {
                              if (!a.code) {
                                list.properties.forEach(tp => {
                                    const no = a.data![tp.id];
                                    if (no) {
                                      tp.order = no;
                                    }
                                  },
                                );
                                list.properties.sort((a, b) => a.order - b.order);
                                forceUpdate();
                              }
                            });
                          }}
                          className={'title'}
                          onClick={() => {
                            PropertyDialog.show({
                              list,
                              lists,
                              onSubmitted: async (np) => {
                                const idx = list.properties.findIndex(p => p.id == np.id);
                                list.properties[idx] = {
                                  ...p,
                                  ...np,
                                };
                                forceUpdate();
                              },
                              property: p,
                            });
                          }}
                        >
                          {flag}
                          {text}
                        </div>
                      )}
                    >
                      {p.variableName}
                      {p.description}
                      <ClickableIcon
                        type={'delete'}
                        colorType={'danger'}
                        size={'small'}
                        onClick={(e) => {
                          e.stopPropagation();
                          Dialog.confirm({
                            title: 'Delete',
                            content: 'Are you sure to delete this property?',
                            onOk: async () => {
                              await BApi.property.deleteListProperty(p.id);
                            },
                            closeMode: ['close', 'esc', 'mask'],
                            v2: true,
                          });
                        }}
                      />
                    </Balloon>
                  )}
                  cell={(v, i, r) => {
                    const cd = allDataForComputing[list.id]?.find(d => d.id == r.id)!;
                    return (
                      <PropertyValue
                        allDataForComputing={allDataForComputing}
                        dataForComputing={cd}
                        property={p}
                        lists={lists}
                        onUpdated={dv => {
                          const idx = r.values.findIndex(v => v.propertyId == p.id);
                          if (idx != -1) {
                            r.values[idx] = {
                              ...r.values[idx],
                              ...dv,
                            };
                          } else {
                            r.values.push(dv);
                          }
                          // console.log(r, dv);
                          onDataChange(r);
                      }}
                        onEditing={e => {
                          if (e) {
                            if (!editingDataIds.includes(r.id)) {
                              editingDataIds.push(r.id);
                            }
                          } else {
                            editingDataIds.splice(editingDataIds.findIndex(id => id == r.id), 1);
                          }
                          setEditingDataIds([...editingDataIds]);
                        }}
                      />
                    );
                  }}
                />
              );
            });
            if (gp.group != undefined) {
              // console.log(gp.group, gp.properties);
              return (
                <Table.ColumnGroup key={gp.group} title={(<div className={'group-header'}>{gp.group}</div>)}>
                  {cols}
                </Table.ColumnGroup>
              );
            } else {
              return cols;
            }
          })}
        </Table>
      </div>
    </div>
  );
};
