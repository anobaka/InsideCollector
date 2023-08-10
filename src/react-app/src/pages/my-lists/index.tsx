import React, { useCallback, useEffect, useState } from 'react';
import BApi from '@/sdk/BApi';
import { Button, Dialog, Icon, Input } from '@alifd/next';
import { Link } from 'ice';
import './index.scss';

export default () => {
  const [data, setData] = useState<any[]>([]);

  const initialize = useCallback(async () => {
    const myLists = (await BApi.myLists.getAllMyLists()).data || [];
    setData(myLists);
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  const showDetail = useCallback((d?: any) => {
    let name = d?.name;
    Dialog.show({
      v2: true,
      width: 'auto',
      title: 'Add MyLists',
      content: (
        <Input onChange={v => name = v} defaultValue={name} />
      ),
      onOk: async () => {
        await BApi.myLists.putMyLists({
          name,
          id: d?.id,
        });
        await initialize();
      },
      closeMode: ['esc', 'mask', 'close'],
    });
  }, []);

  return (
    <div className={'all-my-lists-page'}>
      <Button
        type={'normal'}
        onClick={() => {
          showDetail();
        }}
      >
        Add
      </Button>
      {data.map(d => {
        return (
          <Link to={`/my-lists/${d.id}/list`} key={d.id}>
            <Button type={'normal'}>{d.name}
              <Icon
                type={'edit'}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  showDetail(d);
                }}
              />
              <Icon
                type={'ashbin'}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  Dialog.confirm({
                    title: 'Delete',
                    content: 'Are you sure to delete this item?',
                    onOk: async () => {
                      await BApi.myLists.deleteMyLists(d.id);
                      await initialize();
                    },
                    v2: true,
                    closeMode: ['esc', 'mask', 'close'],
                  });
                }}
              />
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
