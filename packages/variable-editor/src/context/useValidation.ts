import type { VariablesValidationResult } from '@axonivy/variable-editor-protocol';
import { getNodesOnPath } from '../utils/tree/tree-data';
import type { TreePath } from '../utils/tree/types';
import { useAppContext } from './AppContext';

export function useValidations(path: TreePath): Array<VariablesValidationResult> {
  const { variables, validations } = useAppContext();
  const key = getNodesOnPath(variables, path)
    .map(variable => variable?.name)
    .join('.');
  return validations.filter(val => val.path === key);
}
