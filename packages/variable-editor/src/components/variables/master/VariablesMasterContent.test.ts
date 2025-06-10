import type { ValidationMessages } from '@axonivy/variable-editor-protocol';
import type { Variable } from '../data/variable';
import { rowHeight, variablesWithValidations } from './VariablesMasterContent';

test('variablesWithValidations', () => {
  const originalVariables: Array<Variable> = [
    {
      name: 'name0',
      value: '',
      description: '',
      metadata: { type: '' },
      validations: [{ message: 'Existing validation 0' }] as ValidationMessages,
      children: []
    },
    {
      name: 'name1',
      value: '',
      description: '',
      metadata: { type: '' },
      validations: [],
      children: [
        {
          name: 'name10',
          value: '',
          description: '',
          metadata: { type: '' },
          validations: [],
          children: []
        },
        {
          name: 'name11',
          value: '',
          description: '',
          metadata: { type: '' },
          validations: [{ message: 'Existing validation 11' }] as ValidationMessages,
          children: []
        }
      ]
    }
  ];
  const validations = [
    { message: 'Validation 0', path: 'name0' },
    { message: 'Validation 1a', path: 'name1' },
    { message: 'Validation 1b', path: 'name1' },
    { message: 'Validation 10', path: 'name1.name10' }
  ] as ValidationMessages;
  const variables = variablesWithValidations(originalVariables, validations);
  expect(variables[0].validations).toEqual([validations[0]]);
  expect(variables[1].validations).toEqual([validations[1], validations[2]]);
  expect(variables[1].children[0].validations).toEqual([validations[3]]);
  expect(variables[1].children[1].validations).toEqual([]);
});

test('rowHeight', () => {
  expect(rowHeight(undefined)).toEqual(32);
  expect(rowHeight([])).toEqual(32);
  expect(rowHeight([{}] as ValidationMessages)).toEqual(64);
  expect(rowHeight([{}, {}, {}] as ValidationMessages)).toEqual(128);
});
