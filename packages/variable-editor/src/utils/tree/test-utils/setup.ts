import { dataTreeHelper } from '@axonivy/ui-components';
import { useTable } from '@tanstack/react-table';
import { renderHook } from '@testing-library/react';

type TestNode = {
  name: string;
  value: string;
  children: Array<TestNode>;
};

const { tableOptions } = dataTreeHelper<TestNode>();

export const setupData = () => {
  return [
    { name: 'NameNode0', value: 'ValueNode0', children: [] },
    {
      name: 'NameNode1',
      value: 'ValueNode1',
      children: [
        { name: 'NameNode10', value: 'ValueNode10', children: [] },
        {
          name: 'NameNode11',
          value: 'ValueNode11',
          children: [
            {
              name: 'NameNode110',
              value: 'ValueNode110',
              children: [{ name: 'NameNode1100', value: 'ValueNode1100', children: [] }]
            }
          ]
        }
      ]
    }
  ];
};

export const setupTable = () => {
  const data = setupData();
  const { result } = renderHook(() =>
    useTable({
      ...tableOptions,
      columns: [],
      data
    })
  );
  return { data, table: result.current };
};

export const setupSearchData = () => {
  return [
    { name: 'SearchForParentName', value: '', children: [{ name: 'SearchForChildName', value: 'SearchForChildValue', children: [] }] }
  ];
};
