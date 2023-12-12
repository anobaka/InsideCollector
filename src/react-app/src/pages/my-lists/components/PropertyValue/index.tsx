import { convertDataValue, renderPropertyValue } from '../utils';
import { IList, IListData, IListDataValue, IListProperty } from '../models';
import React, { useEffect, useRef, useState } from 'react';
import { ListPropertyTag, ListPropertyType } from '@/sdk/constants';
import { Balloon, Button, DatePicker2, Input, NumberPicker, Select, TimePicker2, Upload } from '@alifd/next';
import BApi from '@/sdk/BApi';
import './index.scss';

interface IProps {
  allDataForComputing: Record<number, IListData[]>;
  lists: IList[];
  dataForComputing: IListData;
  property: IListProperty;
  onUpdated: (value: IListDataValue) => any;
  onEditing: (editing: boolean) => any;
  // onValueComputed: (value: any) => any;
  onSelect: () => any;
  selected?: boolean;
  /*
  * If return value is false, the deletion will be stopped.
  *  */
  requireDeletion: () => boolean;
}

export default (props: IProps) => {
  const {
    allDataForComputing,
    lists,
    dataForComputing,
    property,
    onUpdated,
    onEditing,
    // onValueComputed,
    onSelect,
    selected: propsSelected,
    requireDeletion = () => true,
  } = props;

  const domRef = useRef<any>();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<any>();
  const [successHighlighting, setSuccessHighlighting] = useState(false);
  const [selected, setSelected] = useState(propsSelected ?? false);

  useEffect(() => {
    onEditing(editing);
  }, [editing]);

  useEffect(() => {
    if (propsSelected != undefined) {
      setSelected(propsSelected);
    }
  }, [propsSelected]);

  const renderEditingComponent = () => {
    switch (property.type) {
      case ListPropertyType.Text:
        return (<Input.TextArea
          composition
          value={value}
          autoHeight={{
            minRows: 3,
            maxRows: 10,
          }}
          onChange={v => {
            setValue(v.length == 0 ? undefined : v);
          }}
          trim
          autoFocus
        />);
      case ListPropertyType.Date:
        return (<DatePicker2
          hasClear
          value={value}
          onChange={v => {
            setValue(v.format('YYYY-MM-DD'));
          }}
          autoFocus
        />);
      case ListPropertyType.Number:
        return (<NumberPicker
          precision={10}
          value={value}
          onChange={setValue}
          autoFocus
        />);
      case ListPropertyType.Input:
        return (<Input
          hasClear
          autoFocus
          value={value}
          onChange={v => {
            setValue(v.length == 0 ? undefined : v);
          }}
          trim
        />);
      case ListPropertyType.DateTime:
        return (<DatePicker2
          autoFocus
          showTime
          hasClear
          value={value}
          onChange={v => {
            setValue(v.format('YYYY-MM-DD HH:mm:ss'));
          }}
        />);
      case ListPropertyType.TimeSpan:
        return (<TimePicker2
          autoFocus
          hasClear
          value={value}
          onChange={v => {
            setValue(v.format('HH:mm:ss'));
          }}
        />);
      case ListPropertyType.Select:
        return (
          <Select
            autoFocus
            mode={property.tags?.includes(ListPropertyTag.Multiple) ? 'multiple' : 'single'}
            hasClear
            dataSource={property.options?.map(o => ({
              label: o.label,
              value: o.value,
            })) ?? []}
            value={value}
            onChange={setValue}
          />
        );
      case ListPropertyType.External:
        const externalListData = allDataForComputing[property.externalListId!];
        if (externalListData) {
          const dataSource = externalListData.map(d => {
            const label = d.name;
            return {
              label,
              value: d.id,
            };
          });
          return (
            <Select
              showSearch
              value={value}
              onChange={setValue}
              autoFocus
              hasClear
              dataSource={dataSource}
              mode={property.tags?.includes(ListPropertyTag.Multiple) ? 'multiple' : 'single'}
            />
          );
        }
        return;
      case ListPropertyType.Image:
      case ListPropertyType.File:
        return (
          <Upload
            limit={1}
            action="http://localhost:5077/data/file"
            // beforeUpload={beforeUpload}/*  */
            // onChange={onChange}
            onSuccess={async (file, value) => {
              const { url } = file.response;
              const rsp = await BApi.data.putListDataValue({
                key: {
                  dataId: dataForComputing.id,
                  propertyId: property.id,
                },
                value: url == undefined ? undefined : JSON.stringify(url),
              });
              if (!rsp.code) {
                highlight();
                setEditing(false);
                if (onUpdated) {
                  onUpdated(convertDataValue(rsp.data!));
                }
              }
            }}
            onError={e => {
              highlight();
              setEditing(false);
            }}
            multiple
            formatter={(res, file) => {
              // 函数里面根据当前服务器返回的响应数据
              // 重新拼装符合组件要求的数据格式
              return {
                success: res.code === 0,
                url: res.data,
              };
            }}
            // style={style}
          >
            <Button
              text
              type="primary"
              onBlur={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onKeyDown={e => {
                console.log(e);

                e.stopPropagation();
                e.preventDefault();
              }}
            >
              Upload File
            </Button>
          </Upload>
        );
      case ListPropertyType.Computed:
      default:
        return;
    }
  };

  const save = async () => {
    const rsp = await BApi.data.putListDataValue({
      key: {
        dataId: dataForComputing.id,
        propertyId: property.id,
      },
      value: value == undefined ? undefined : JSON.stringify(value),
    });
    if (!rsp.code) {
      highlight();
      setEditing(false);
      if (onUpdated) {
        onUpdated(convertDataValue(rsp.data!));
      }
    }
  };

  const highlight = (cb?: any) => {
    setSuccessHighlighting(true);
    setTimeout(() => {
      setSuccessHighlighting(false);
      cb && cb();
    }, 1500);
  };

  if (editing) {
    return (
      <div
        className={'property-value'}
        onBlur={save}
        onKeyDown={e => {
          console.log(e);
          if (e.key == 'Enter') {
            save();
          }
        }}
      >
        {renderEditingComponent()}
      </div>
    );
  } else {
    let value: any;
    let error: string | undefined;
    const rawValue = dataForComputing?.values.find(a => a.propertyId == property.id);
    try {
      value = renderPropertyValue(dataForComputing, rawValue?.value, property, lists, allDataForComputing);
    } catch (e) {
      error = e.message;
    }

    const text = error ?? value;
    // console.log(text);

    let valueComponent;
    if (value) {
      switch (property.type) {
        case ListPropertyType.Number:
        case ListPropertyType.Input:
        case ListPropertyType.DateTime:
        case ListPropertyType.TimeSpan:
        case ListPropertyType.Date:
        case ListPropertyType.Text:
        case ListPropertyType.External:
        case ListPropertyType.Computed:
          valueComponent = text;
          break;
        case ListPropertyType.Select:
          valueComponent = property.options?.find(o => o.value == text)?.label;
          break;
        case ListPropertyType.Image:
          valueComponent = (
            <img
              src={`http://localhost:5077${text}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          );
          break;
        case ListPropertyType.File:
          valueComponent = text.split('/').last();
          break;
      }
    }

    return (
      <div
        ref={domRef}
        tabIndex={0}
        onPaste={e => {
          for (const item of e.clipboardData.items) {
            console.log(item.type);
          }
          let item = Array.from(e.clipboardData.items).find(x => /^image\//.test(x.type));
          if (item != undefined) {
            if (property.type == ListPropertyType.Image) {
              let blob = item.getAsFile();
              if (blob) {
                BApi.file.uploadFile({ file: blob }).then(rsp => {
                  if (!rsp.code) {
                    BApi.data.putListDataValue({
                      key: {
                        dataId: dataForComputing.id,
                        propertyId: property.id,
                      },
                      value: rsp.data == undefined ? undefined : JSON.stringify(rsp.data),
                    }).then(r => {
                      if (!r.code) {
                        highlight();
                        setEditing(false);
                        if (onUpdated) {
                          console.log('on updated', convertDataValue(r.data!));
                          onUpdated(convertDataValue(r.data!));
                        }
                      }
                    });
                  }
                });
              }
            }
          }
        }}
        onMouseDown={e => {
          // console.log(propsSelected, 'ppp');
          if (e.button == 0) {
            if (!selected) {
              domRef.current.focus();
              if (propsSelected == undefined) {
                setSelected(true);
              }
            } else {
              domRef.current.blur();
            }
            if (onSelect) {
              onSelect();
            }
          }
        }}
        onKeyDown={async e => {
          if (e.key == 'Delete') {
            if (requireDeletion()) {
              const rsp = await BApi.data.putListDataValue({
                key: {
                  dataId: dataForComputing.id,
                  propertyId: property.id,
                },
                value: undefined,
              });
              if (!rsp.code) {
                highlight();
                setEditing(false);
                if (onUpdated) {
                  onUpdated(convertDataValue(rsp.data!));
                }
              }
            }
          }
        }}
        className={`property-value ${error ? 'error' : ''} ${successHighlighting ? 'success' : ''} ${selected ? 'selected' : ''}`}
        onDoubleClick={e => {
          e.preventDefault();
          e.stopPropagation();
          switch (property.type) {
            case ListPropertyType.Number:
            case ListPropertyType.Input:
            case ListPropertyType.DateTime:
            case ListPropertyType.TimeSpan:
            case ListPropertyType.Select:
            case ListPropertyType.Date:
            case ListPropertyType.Text:
            case ListPropertyType.Image:
            case ListPropertyType.File:
            case ListPropertyType.External:
              setValue(rawValue?.value);
              setEditing(true);
              break;
            case ListPropertyType.Computed:
              break;
          }
        }}
      >
        {valueComponent}
      </div>
    );

    // console.log(v?.value, property);
  }
};
