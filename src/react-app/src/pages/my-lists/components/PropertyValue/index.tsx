import { convertDataValue, renderPropertyValue } from '../utils';
import { IList, IListData, IListDataValue, IListProperty } from '../models';
import React, { useEffect, useState } from 'react';
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
  onValueComputed: (value: any) => any;
}

export default (props: IProps) => {
  const {
    allDataForComputing,
    lists,
    dataForComputing,
    property,
    onUpdated,
    onEditing,
    onValueComputed,
  } = props;

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<any>();
  const [copied, setCopied] = useState(false);
  const [successHighlighting, setSuccessHighlighting] = useState(false);

  useEffect(() => {
    onEditing(editing);
  }, [editing]);

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
                dataId: dataForComputing.id,
                propertyId: property.id,
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
      dataId: dataForComputing.id,
      propertyId: property.id,
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
        case ListPropertyType.Select:
        case ListPropertyType.Date:
        case ListPropertyType.Text:
        case ListPropertyType.External:
        case ListPropertyType.Computed:
          valueComponent = text;
          break;
        case ListPropertyType.Image:
          valueComponent = (
            <Balloon
              closable={false}
              triggerType={'hover'}
              trigger={(
                <img
                  src={`http://localhost:5077${text}`}
                  style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                />
              )}
              align={'t'}
              autoFocus={false}
            >
              <Button
                warning
                type={'normal'}
                onClick={async () => {
                  const rsp = await BApi.data.putListDataValue({
                    dataId: dataForComputing.id,
                    propertyId: property.id,
                    value: undefined,
                  });
                  if (!rsp.code) {
                    highlight();
                    setEditing(false);
                    if (onUpdated) {
                      onUpdated(convertDataValue(rsp.data!));
                    }
                  }
                }}
              >
                Delete
              </Button>
            </Balloon>
          );
          break;
        case ListPropertyType.File:
          valueComponent = text.split('/').last();
          break;
      }
    }

    return (
      <div
        className={`property-value ${error ? 'error' : ''} ${successHighlighting ? 'success' : ''}`}
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
        <Balloon
          triggerType={'hover'}
          trigger={valueComponent}
          closable={false}
          autoFocus={false}
          align={'t'}
        >
          {copied ? 'Copied' : (
            <Button
              type={'primary'}
              text
              onClick={(e) => {
                if (text != undefined && !copied) {
                  e.preventDefault();
                  navigator.clipboard.writeText(text).then(() => {
                    setCopied(true);
                    highlight(() => {
                      setCopied(false);
                    });
                  });
                }
              }}
            >
              Copy
            </Button>
          )}
        </Balloon>
      </div>
    );

    // console.log(v?.value, property);
  }
};
