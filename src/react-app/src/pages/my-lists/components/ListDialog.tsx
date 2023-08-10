import { Dialog, Form, Input, NumberPicker } from '@alifd/next';
import React, { useCallback, useState } from 'react';
import { createPortalOfComponent } from '@/components/utils';
import { v4 as uuidv4 } from 'uuid';
import { IList } from './models';
import AceEditor from 'react-ace';

interface IProps {
  value?: IList;
  onSubmit: (c: IList) => any;
}

function ListDialog(props: IProps) {
  const { onSubmit, value } = props;
  const [visible, setVisible] = useState(true);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <Dialog
      visible={visible}
      closeMode={['close', 'mask', 'esc']}
      onClose={close}
      onCancel={close}
      footer={false}
    >
      <Form value={value}>
        <Form.Item label={'#'} name={'id'}>
          <Input disabled />
        </Form.Item>
        <Form.Item label={'Variable name'} name={'variableName'} required>
          <Input />
        </Form.Item>
        <Form.Item label={'Name'} name={'name'} required>
          <Input />
        </Form.Item>
        <Form.Item label={'Data name convention'} name={'dataNameConvention'}>
          <AceEditor
            // markers={markers}
            mode="typescript"
            theme="monokai"
            name={'dataNameConvention'}
            width={'700px'}
            defaultValue={value?.dataNameConvention ?? ''}
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
        <Form.Item label={'Width'} name={'width'}>
          <NumberPicker innerAfter="%" precision={0} step={1} />
        </Form.Item>
        <Form.Submit
          onClick={value => {
            onSubmit(value);
            close();
          }}
        >
          Submit
        </Form.Submit>
      </Form>
    </Dialog>
  );
}


ListDialog.show = (props: IProps) => createPortalOfComponent(ListDialog, props);

export default ListDialog;
