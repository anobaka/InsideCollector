import { Balloon, Button, Dialog, Icon, Overlay, Select, Table } from '@alifd/next';
import PropertyDialog from '../PropertyDialog';
import React, { useEffect, useRef, useState } from 'react';
import BApi from '@/sdk/BApi';
import { ListPropertyType } from '@/sdk/constants';
import { useUpdate } from 'react-use';
import { IList, IListData, IListProperty } from '../models';
import { convertData, renderPropertyValue } from '../utils';
import ClickableIcon from '@/components/ClickableIcon';
import './index.scss';
import CustomIcon from '@/components/CustomIcon';
import PropertyValue from '@/pages/my-lists/components/PropertyValue';
import { SelectionMode } from '@/pages/my-lists/$id.list';

const { Popup } = Overlay;

interface IProps {
  list: IList;
  lists: IList[];
  data: IListData[];
  allDataForComputing: Record<number, IListData[]>;
  showDetail: (list: IList) => any;
  onDataChange: (data: IListData) => any;
  onBulkDataChange: (data: IListData[]) => any;
  onDataDeleted: (id: number) => any;
  selectionMode?: SelectionMode;
  onDataSelected?: (data: IListData, selected: boolean) => any;
}

enum SelectionType {
  Multiple = 1,
  Range = 2,
}

enum SelectionStartType {
  Normal = 1,
  Crosshair,
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
    selectionMode = SelectionMode.None,
    onDataSelected = (data: IListData, selected: boolean) => {
    },
    onBulkDataChange = (data: IListData[]) => {
    },
  } = props;

  const [editingDataIds, setEditingDataIds] = useState<number[]>([]);

  const tableTitleFilterRefs = useRef<Record<string, any>>({});
  const [visibleFilters, setVisibleFilters] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<Record<string, any[]>>({});
  const filterPanelRefs = useRef<Record<string, any>>({});

  const hoveringCellPosRef = useRef<{ i: number; j: number }>();

  const [selection, setSelection] = useState<{
    startType: SelectionStartType;
    type: SelectionType;
    dataCells?: Record<number, number[]>;
    range?: { si: number; sj: number; ei: number; ej: number };
  }>({
    startType: SelectionStartType.Normal,
    type: SelectionType.Multiple,
    dataCells: {},
  });

  const selectedValueKeysRef = useRef<{ dataId: number; propertyId: number }[]>([]);
  const mouseDownRef = useRef(false);

  const visibleProperties = list.properties.filter(p => !p.hidden);

  const groupedProperties: { group?: string; properties: IListProperty[] }[] = [];
  for (const p of visibleProperties) {
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

  useEffect(() => {
    if (selection) {
      const visibleProperties = list.properties.filter(p => !p.hidden);
      selectedValueKeysRef.current = [];
      switch (selection.type) {
        case SelectionType.Multiple: {
          for (const dataIndex of Object.keys(selection.dataCells!)) {
            const dataId = data[parseInt(dataIndex, 10)].id;
            for (const propertyIndex of selection.dataCells![dataIndex]) {
              const propertyId = visibleProperties[propertyIndex].id;
              selectedValueKeysRef.current.push({
                dataId,
                propertyId,
              });
            }
          }
          break;
        }
        case SelectionType.Range: {
          const si = Math.min(selection.range!.si, selection.range!.ei);
          const ei = Math.max(selection.range!.si, selection.range!.ei);
          const sj = Math.min(selection.range!.sj, selection.range!.ej);
          const ej = Math.max(selection.range!.sj, selection.range!.ej);
          for (let i = si; i <= ei; i++) {
            const dataId = data[i].id;
            for (let j = sj; j <= ej; j++) {
              const propertyId = visibleProperties[j].id;
              selectedValueKeysRef.current.push({
                dataId,
                propertyId,
              });
            }
          }
          break;
        }
      }
    } else {
      selectedValueKeysRef.current = [];
    }
  }, [selection]);

  console.log('rendering list', selection, SelectionMode[selectionMode]);

  const renderFilter = (property: IListProperty) => {
    const key = property.variableName;
    const selection = data?.map(d => {
      const dc = allDataForComputing[list.id]?.find(x => x.id == d.id);
      if (dc) {
        const label = renderPropertyValue(dc, d.values.find(v => v.propertyId == property.id)?.value, property, lists, allDataForComputing);
        const value = d.dynamic[key];

        return {
          label,
          value,
        };
      }
      return;
    }).filter(a => a?.label != undefined) || [];
    return (
      <>
        <Icon
          type={'filter'}
          size={'small'}
          ref={r => {
            tableTitleFilterRefs.current[key] = r;
          }}
          onClick={() => {
            setVisibleFilters({
              ...visibleFilters,
              [key]: !visibleFilters[key],
            });
          }}
        />
        {visibleFilters[key] && (
          <div className={'filter-panel'} ref={r => filterPanelRefs.current[key] = r}>
            <Select
              showSearch
              // width={200}
              // style={{ width: 200 }}
              autoWidth
              size={'small'}
              // visible
              useVirtual
              dataSource={selection}
              mode={'multiple'}
              tagInline={false}
              adjustTagSize
              value={filters[key]}
              popupContainer={() => filterPanelRefs.current[key]}
              onChange={v => {
                filters[key] = v;
                setFilters({
                  ...filters,
                  [key]: v,
                });
              }}
            />
          </div>
        )}
      </>
    );
  };

  const renderHiddenIcon = (p: IListProperty) => {
    return (
      <ClickableIcon
        type={p.hidden ? 'eye-close' : 'eye'}
        size={'small'}
        colorType={'normal'}
        onClick={() => {
          BApi.property.patchListProperty(p.id, {
            hidden: !p.hidden,
          }).then(a => {
            p.hidden = !p.hidden;
            forceUpdate();
          });
        }}
      />
    );
  };

  return (
    <div
      onMouseDown={() => {
        mouseDownRef.current = true;
        forceUpdate();
      }}
      onMouseUp={() => {
        mouseDownRef.current = false;
        forceUpdate();
      }}
      onMouseLeave={() => {
        console.log('mouse leave');
        mouseDownRef.current = false;
        forceUpdate();
      }}
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
        <Balloon
          trigger={(
            <Button
              type={'normal'}
              size={'small'}
            >
              <CustomIcon type={'eye-close'} size={'small'} />
              Hidden properties
            </Button>
          )}
          triggerType={'hover'}
          v2
          closable={false}
          align={'t'}
          autoFocus={false}
        >
          {list.properties.filter(p => p.hidden).map(p => (
            <div>
              {renderHiddenIcon(p)}
              {p.name}
            </div>
          ))}
        </Balloon>
      </div>
      <div
        className={`data ${(selection.startType == SelectionStartType.Crosshair && mouseDownRef.current) ? 'crosshair' : ''}`}
        onMouseLeave={e => {
          if (e.button == 0) {
            mouseDownRef.current = false;
          }
        }}
      >
        <Table
          size={'small'}
          dataSource={data?.filter(d => {
            for (const filteredKey of Object.keys(filters)) {
              const values = filters[filteredKey] ?? [];
              if (values.length > 0) {
                const v = d.dynamic[filteredKey];
                if (!values.includes(v)) {
                  return false;
                }
              }
            }
            return true;
          })}
          rowProps={(r, i) => {
            if (editingDataIds.includes(r.id)) {
              return {
                className: 'active',
              };
            }
            return;
          }}
          cellProps={(r, c, dataIndex) => {
            if (c > 0) {
              return {
                onMouseMove: e => {
                  if (mouseDownRef.current && selection) {
                    const i1 = r;
                    const j1 = c - 1;
                    const curr = hoveringCellPosRef.current;
                    if (!curr || curr.i != i1) {
                      hoveringCellPosRef.current = {
                        i: r,
                        j: j1,
                      };

                      if (selection.type == SelectionType.Multiple) {
                        selection.type = SelectionType.Range;
                        selection.range = {
                          si: i1,
                          sj: j1,
                          ei: i1,
                          ej: j1,
                        };
                      }

                      console.log(`selecting from ${selection.range?.si},${selection.range?.sj} to ${i1},${j1}`);
                      setSelection({
                        startType: selection.startType,
                        type: SelectionType.Range,
                        range: {
                          si: selection.range!.si,
                          sj: selection.range!.sj,
                          ei: i1,
                          ej: selection.startType == SelectionStartType.Crosshair ? selection.range!.sj : j1,
                        },
                      });
                    }
                  }
                },
                onMouseUp: e => {
                  if (selectedValueKeysRef.current.length > 1 && selection?.startType == SelectionStartType.Crosshair) {
                    const sourceValueKey = {
                      dataId: data[selection.range!.si].id,
                      propertyId: visibleProperties[selection.range!.sj].id,
                    };
                    const otherValueKeys = selectedValueKeysRef.current.filter(a => a.propertyId != sourceValueKey.propertyId || a.dataId != sourceValueKey.dataId);
                    if (otherValueKeys.length > 0) {
                      BApi.data.copyDataValueToOthers({
                        source: sourceValueKey,
                        targets: otherValueKeys,
                      }).then(r => {
                        if (!r.code) {
                          const dataIds = otherValueKeys.map(a => a.dataId);
                          const ds = data.filter(d => dataIds.includes(d.id));
                          const newValue = data[selection.range!.si].values.find(v => v.propertyId == sourceValueKey.propertyId)?.value;
                          for (const d of ds) {
                            let v = d.values.find(v => v.propertyId == sourceValueKey.propertyId);
                            if (!v) {
                              v = {
                                propertyId: sourceValueKey.propertyId,
                                dataId: d.id,
                                id: `${d.id}-${sourceValueKey.propertyId}`,
                              };
                              d.values.push(v);
                            }
                            v.value = newValue;
                          }
                          onBulkDataChange(ds);
                        }
                      });
                    }
                  }
                },
              };
            }
            return;
          }}
        >
          <Table.Column
            // width={60}
            title={(
              <>
                #
              </>
            )}
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
            const cols = gp.properties.map((p) => {
              const visiblePropertyIndex = visibleProperties.indexOf(p);
              const flag = p.type == ListPropertyType.Computed ? (
                <span className={'computed'}>C</span>
              ) : p.type == ListPropertyType.External ? (
                <span className={'external'}>E</span>
              ) : null;
              const text = p.name;

              return (
                <Table.Column
                  key={p.id}
                  dataIndex={`dynamic.${p.variableName}`}
                  width={p.width ? `${p.width}%` : undefined}
                  title={(
                    <>
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
                        {renderHiddenIcon(p)}
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
                      {renderFilter(p)}
                    </>
                  )}
                  cell={(v, i, r) => {
                    const cd = allDataForComputing[list.id]?.find(d => d.id == r.id)!;
                    const key = `${r.id}-${p.id}`;
                    let selected = false;
                    if (selection) {
                      switch (selection.type) {
                        case SelectionType.Multiple:
                          selected = selection.dataCells![i]?.includes(visiblePropertyIndex) == true;
                          break;
                        case SelectionType.Range:
                          const {
                            si,
                            sj,
                            ei,
                            ej,
                          } = selection.range!;
                          const rsi = Math.min(si, ei);
                          const rsj = Math.min(sj, ej);
                          const rei = Math.max(si, ei);
                          const rej = Math.max(sj, ej);
                          selected = rsi <= i && i <= rei && rsj <= visiblePropertyIndex && visiblePropertyIndex <= rej;
                          break;
                      }
                    }
                    // if (selected) {
                    //   console.log('selected', r.id, p.id);
                    // }
                    return (
                      <>
                        <PropertyValue
                          allDataForComputing={allDataForComputing}
                          dataForComputing={cd}
                          property={p}
                          lists={lists}
                          onSelect={() => {
                            switch (selectionMode) {
                              case SelectionMode.None:
                                setSelection({
                                  startType: SelectionStartType.Normal,
                                  type: SelectionType.Multiple,
                                  dataCells: {
                                    [i]: [visiblePropertyIndex],
                                  },
                                });
                                break;
                              case SelectionMode.Ctrl:
                                // console.log(`click on ${r.id} ${propertyIndex}`, SelectionMode[selectionMode], 'selected', selected);
                                if (selected) {
                                  const newPropertyIndexes = selection.dataCells![i].filter(idx => idx != visiblePropertyIndex);
                                  if (newPropertyIndexes.length == 0) {
                                    delete selection.dataCells![i];
                                  } else {
                                    selection.dataCells![i] = newPropertyIndexes;
                                  }
                                  setSelection({
                                    ...selection,
                                  });
                                } else {
                                  setSelection({
                                    startType: SelectionStartType.Normal,
                                    type: SelectionType.Multiple,
                                    dataCells: {
                                      ...selection.dataCells,
                                      [i]: [...(selection.dataCells![i] ?? []), visiblePropertyIndex],
                                    },
                                  });
                                }
                                break;
                              case SelectionMode.Shift: {
                                let multipleI = -1;
                                let multipleJ = -1;
                                if (selection.type == SelectionType.Multiple) {
                                  const dataIndexes = Object.keys(selection.dataCells!);
                                  const count = dataIndexes.length;
                                  if (count == 0 || count > 1) {
                                    // start point
                                    setSelection({
                                      startType: SelectionStartType.Normal,
                                      type: SelectionType.Range,
                                      range: {
                                        si: i,
                                        sj: visiblePropertyIndex,
                                        ei: i,
                                        ej: visiblePropertyIndex,
                                      },
                                    });
                                    return;
                                  } else {
                                    const selectedPropertyIndexes = selection.dataCells![dataIndexes[0]] || [];
                                    if (selectedPropertyIndexes.length == 1) {
                                      multipleI = parseInt(dataIndexes[0], 10);
                                      multipleJ = selection.dataCells![multipleI][0];
                                    } else {
                                      // start point
                                      setSelection({
                                        startType: SelectionStartType.Normal,
                                        type: SelectionType.Range,
                                        range: {
                                          si: i,
                                          sj: visiblePropertyIndex,
                                          ei: i,
                                          ej: visiblePropertyIndex,
                                        },
                                      });
                                      return;
                                    }
                                  }
                                }
                                console.log(selection, multipleI, multipleJ, i, visiblePropertyIndex);
                                const si = multipleI == -1 ? selection.range!.si : multipleI;
                                const sj = multipleJ == -1 ? selection.range!.sj : multipleJ;
                                const newSelection = {
                                  startType: SelectionStartType.Normal,
                                  type: SelectionType.Range,
                                  range: {
                                    si,
                                    sj,
                                    ei: i,
                                    ej: visiblePropertyIndex,
                                  },
                                };
                                setSelection(newSelection);
                                break;
                              }
                            }
                          }}
                          selected={selected}
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
                          requireDeletion={() => {
                            if (selectedValueKeysRef.current.length <= 1) {
                              return true;
                            } else {
                              console.log('bulk deleting', selectedValueKeysRef.current);
                              BApi.data.bulkRemoveDataValues({
                                keys: selectedValueKeysRef.current,
                              }).then(a => {
                                if (!a.code) {
                                  const ds: IListData[] = [];
                                  for (const key of selectedValueKeysRef.current) {
                                    const d = data.find(d => d.id == key.dataId);
                                    if (d) {
                                      const idx = d.values.findIndex(v => v.propertyId == key.propertyId);
                                      if (idx != -1) {
                                        d.values.splice(idx, 1);
                                      }
                                      ds.push(d);
                                    }
                                  }
                                  onBulkDataChange(ds);
                                }
                              });
                              return false;
                            }
                          }}
                        />
                        <div
                          className="crosshair"
                          onMouseDown={e => {
                            if (e.button == 0) {
                              mouseDownRef.current = true;
                              setSelection({
                                startType: SelectionStartType.Crosshair,
                                type: SelectionType.Range,
                                range: {
                                  si: i,
                                  sj: visiblePropertyIndex,
                                  ei: i,
                                  ej: visiblePropertyIndex,
                                },
                              });
                            }
                          }}
                        />
                      </>
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
