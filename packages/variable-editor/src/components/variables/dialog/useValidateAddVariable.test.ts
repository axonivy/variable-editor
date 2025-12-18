import { setupVariable } from '../data/test-utils/setup';
import { customRenderHook } from '../data/test-utils/test-utils';
import { useValidateAddVariable } from './useValidateAddVariable';

const variables = [
  setupVariable('NameNode0', []),
  setupVariable('NameNode1', [setupVariable('NameNode10', []), setupVariable('NameNode11', [setupVariable('NameNode110', [])])])
];

const validate = (name: string, namespace: string) => {
  const { result } = customRenderHook(() => useValidateAddVariable(name, namespace, variables));
  return result.current;
};

describe('validateName', () => {
  test('valid', () => {
    expect(validate('Name', '').nameValidationMessage).toBeUndefined();
    expect(validate('Name', 'NameNode0').nameValidationMessage).toBeUndefined();
    expect(validate('Name', 'NameNode1').nameValidationMessage).toBeUndefined();
  });

  describe('invalid', () => {
    describe('blank', () => {
      test('empty', () => {
        expect(validate('', '').nameValidationMessage).toEqual({ message: 'Name cannot be empty.', variant: 'error' });
      });

      test('whitespace', () => {
        expect(validate('   ', '').nameValidationMessage).toEqual({ message: 'Name cannot be empty.', variant: 'error' });
      });
    });

    test('taken', () => {
      const error = { message: 'Name is already present in this Namespace.', variant: 'error' };
      expect(validate('NameNode0', '').nameValidationMessage).toEqual(error);
      expect(validate('NameNode10', 'NameNode1').nameValidationMessage).toEqual(error);
    });

    test('containsDot', () => {
      expect(validate('New.Name', '').nameValidationMessage).toEqual({ message: "Character '.' is not allowed.", variant: 'error' });
    });
  });
});

describe('validateNamespace', () => {
  describe('valid', () => {
    test('empty', () => {
      expect(validate('', '').namespaceValidationMessage).toBeUndefined();
    });

    test('completelyNew', () => {
      expect(validate('', 'New.Namespace').namespaceValidationMessage).toBeUndefined();
    });

    test('partiallyNew', () => {
      expect(validate('', 'NameNode1.New.Namespace').namespaceValidationMessage).toBeUndefined();
    });
  });

  describe('invalid', () => {
    test('firstPartIsNotAFolder', () => {
      expect(validate('', 'NameNode0.New.Namespace').namespaceValidationMessage).toEqual({
        message: "Namespace 'NameNode0' is not a folder, you cannot add a child to it.",
        variant: 'error'
      });
    });

    test('middlePartIsNotAFolder', () => {
      expect(validate('', 'NameNode1.NameNode10.New.Namespace').namespaceValidationMessage).toEqual({
        message: "Namespace 'NameNode1.NameNode10' is not a folder, you cannot add a child to it.",
        variant: 'error'
      });
    });

    test('lastPartIsNotAFolder', () => {
      expect(validate('', 'NameNode1.NameNode11.NameNode110').namespaceValidationMessage).toEqual({
        message: "Namespace 'NameNode1.NameNode11.NameNode110' is not a folder, you cannot add a child to it.",
        variant: 'error'
      });
    });
  });
});
