import type { DataTableFeatures } from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';
import type { Variable } from '../variable';

type DeepPartial<T> = T extends Array<infer U> ? Array<DeepPartial<U>> : { [A in keyof T]?: DeepPartial<T[A]> };

export const setupRow = (name: string, parentName: string): DeepPartial<Row<DataTableFeatures, Variable>> => {
  return {
    original: {
      name: name
    },
    getParentRows: () => [
      {
        original: {
          name: parentName
        }
      }
    ]
  };
};

export const setupVariable = (name: string, children: Array<Variable>) => {
  return { name: name, children: children } as Variable;
};
