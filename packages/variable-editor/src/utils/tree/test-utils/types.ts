import type { TreeNodeFactory } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TestTreeNodeFactory: TreeNodeFactory<{ name: string; value: string; children: Array<any> }> = (name: string) => {
  return {
    name: name,
    value: '',
    children: []
  };
};
