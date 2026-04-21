import type { ValidationMessages } from '@axonivy/variable-editor-protocol';
import { getNodesOnPath } from '../utils/tree/tree-data';
import type { TreePath } from '../utils/tree/types';
import { useAppContext } from './AppContext';

export function useValidations(path: TreePath): ValidationMessages {
  const { variables, validations } = useAppContext();
  const key = getNodesOnPath(variables, path)
    .map(variable => variable?.name)
    .join('.');
  return validations.filter(val => val.path.split('.').slice(0, -1).join('.') === key);
}
