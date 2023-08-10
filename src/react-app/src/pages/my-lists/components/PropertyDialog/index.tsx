import React, { useCallback, useState } from 'react';
import { Button, Dialog, Form, Input, List, NumberPicker, Select } from '@alifd/next';
import { createPortalOfComponent } from '@/components/utils';
import { listPropertyTags, ListPropertyType, listPropertyTypes } from '@/sdk/constants';
import { useUpdate } from 'react-use';
import merge from 'deepmerge';
import BApi from '@/sdk/BApi';
import { IList, IListProperty } from '../models';
import './index.scss';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

interface IProps {
  property?: IListProperty;
  afterClose?: () => void;
  onSubmitted: (property: IListProperty) => any;
  list: IList;
  lists: IList[];
}

const formItemLayout = {
  labelCol: {
    fixedSpan: 8,
  },
  wrapperCol: {
    span: 14,
  },
};

function Index(props: IProps) {
  const {
    property,
    afterClose,
    onSubmitted,
    list,
    lists = [],
  } = props;

  console.log(props);

  const forceUpdate = useUpdate();

  const [visible, setVisible] = useState(true);
  const [form, setForm] = useState<IListProperty>(merge({}, property || {}));

  const currentListPropertyIds = list.properties?.map(p => p.id) || [];
  const occupiedByExternalListVariableNames = lists.filter(l => l != list && l.properties?.some(p => p.externalListId && currentListPropertyIds.includes(p.externalListId))).map(l => l.variableName);
  const occupiedByCurrentListVariableNames = list.properties?.filter(p => p.id != property?.id).map(p => p.variableName) || [];
  const occupiedVariableNames = occupiedByExternalListVariableNames.concat(occupiedByCurrentListVariableNames);

  const propertyGroups = (list.properties || []).map(p => p.group).filter(a => a != undefined && a.length > 0) as string[];

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const renderOptions = () => {
    switch (form.type) {
      case ListPropertyType.Date:
        break;
      case ListPropertyType.Text:
        break;
      case ListPropertyType.Image:
        break;
      case ListPropertyType.File:
        break;
      case ListPropertyType.Number:
        break;
      case ListPropertyType.Input:
        break;
      case ListPropertyType.DateTime:
        break;
      case ListPropertyType.TimeSpan:
        break;
      case ListPropertyType.Select:
        return (
          <List>
            {form.options?.map((o, i) => {
              return (
                <List.Item title={i + 1}>
                  <Input
                    value={o.label}
                    onChange={v => {
                      o.label = v;
                      forceUpdate();
                    }}
                  />
                </List.Item>
              );
            })}
            <List.Item title={<Button
              type={'normal'}
              onClick={() => {
                const newOptions = form.options || [];
                newOptions.push({ label: '', value: newOptions.length + 1, propertyId: form.id, order: newOptions.length });
                setForm({
                  ...form,
                  options: newOptions,
                });
              }}
            >Add</Button>}
            />
          </List>
        );
      case ListPropertyType.External:
        return (
          <Form.Item required label={'External list'} name={'externalListId'}>
            <Select dataSource={lists.map(l => ({ label: l.name, value: l.id }))} />
          </Form.Item>
        );
      case ListPropertyType.Computed:
        const markers = [
          {
            startRow: 3,
            type: 'text',
            className: 'test-marker',
          },
        ];
        return (
          <Form.Item required label={'Function'} name={'function'}>
            <AceEditor
              // markers={markers}
              mode="typescript"
              theme="monokai"
              name={'function'}
              width={'700px'}
              defaultValue={form.function ?? ''}
              // onChange={v => { console.log(v); }}
              // name="asdasasdassa"
              // showGutter
              // editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                // enableSnippets: true,
              }}
            />
          </Form.Item>
        );
    }
    return;
  };

  return (
    <Dialog
      visible={visible}
      afterClose={afterClose}
      v2
      width={'auto'}
      onClose={close}
      onCancel={close}
      footer={false}
      title={'Property'}
      closeMode={['close', 'esc', 'mask']}
      className={'property-dialog'}
    >
      <Form
        fullWidth
        style={{ minWidth: 1200 }}
        {...formItemLayout}
        value={form}
        onChange={f => {
          console.log('Form changes');
          setForm({ ...f });
        }}
      >
        <Form.Item label={'Group'} name={'group'}>
          <Select.AutoComplete dataSource={(propertyGroups).map(g => ({ label: g, value: g }))} />
        </Form.Item>
        <Form.Item required label={'Name'} name={'name'}>
          <Input />
        </Form.Item>
        <Form.Item label={'Occupied variable names'}>
          <div>{occupiedVariableNames.join(', ')}</div>
        </Form.Item>
        <Form.Item label={'Variable name'} name={'variableName'} required>
          <Input />
        </Form.Item>
        <Form.Item label={'Description'} name={'description'}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item required label={'Type'} name={'type'}>
          <Select dataSource={listPropertyTypes} />
        </Form.Item>
        {renderOptions()}
        <Form.Item required label={'Tags'} name={'tags'}>
          <Select dataSource={listPropertyTags} mode={'multiple'} />
        </Form.Item>
        <Form.Item label={'Width'} name={'width'}>
          <NumberPicker innerAfter="%" precision={0} step={1} />
        </Form.Item>
        <Form.Submit onClick={async v => {
          await BApi.property.putListProperty({
            ...v,
            listId: list.id,
            tags: v.tags?.reduce((a, b) => a | b, 0) ?? 0,
          });
          onSubmitted(v);
          close();
        }}
        >
          Submit
        </Form.Submit>
      </Form>
    </Dialog>
  );
}

Index.show = (props: IProps) => createPortalOfComponent(Index, props);

export default Index;
