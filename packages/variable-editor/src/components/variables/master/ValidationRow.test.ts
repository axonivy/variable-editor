import type { VariablesValidationResult } from '@axonivy/variable-editor-protocol';
import { rowClass } from './ValidationRow';

test('rowClass', () => {
  expect(rowClass([])).toEqual('');
  expect(rowClass([{ severity: 'INFO' }] as Array<VariablesValidationResult>)).toEqual('');
  expect(rowClass([{ severity: 'INFO' }, { severity: 'WARNING' }] as Array<VariablesValidationResult>)).toEqual('variables-editor-row-warning');
  expect(rowClass([{ severity: 'INFO' }, { severity: 'WARNING' }, { severity: 'ERROR' }] as Array<VariablesValidationResult>)).toEqual('variables-editor-row-error');
});
