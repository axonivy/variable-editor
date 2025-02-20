import type { VariablesValidationResult } from '@axonivy/variable-editor-protocol';
import { customRenderHook } from '../components/variables/data/test-utils/test-utils';
import type { Variable } from '../components/variables/data/variable';
import type { TreePath } from '../utils/tree/types';
import { useValidations } from './useValidation';

test('useValidations', () => {
  expect(renderValidations([]).result.current).toEqual([]);
  expect(renderValidations([0]).result.current).toEqual([validations[0]]);
  expect(renderValidations([0, 0]).result.current).toEqual([validations[1], validations[2], validations[3]]);
  expect(renderValidations([0, 0, 0]).result.current).toEqual([]);
  expect(renderValidations([0, 0, 1]).result.current).toEqual([validations[4]]);
});

const renderValidations = (path: TreePath) => {
  return customRenderHook(() => useValidations(path), { wrapperProps: { appContext: { variables, validations } } });
};

const variables = [
  { name: 'Amazon', children: [{ name: 'Comprehend', children: [{ name: 'SecretKey' }, { name: 'AccessKey' }] }] }
] as Array<Variable>;

const validations = [
  { message: 'message0', path: 'Amazon', severity: 'INFO' },
  { message: 'message1', path: 'Amazon.Comprehend', severity: 'INFO' },
  { message: 'message2', path: 'Amazon.Comprehend', severity: 'WARNING' },
  { message: 'message3', path: 'Amazon.Comprehend', severity: 'ERROR' },
  { message: 'message4', path: 'Amazon.Comprehend.AccessKey', severity: 'INFO' }
] as Array<VariablesValidationResult>;
