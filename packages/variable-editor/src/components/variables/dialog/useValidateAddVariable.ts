import type { MessageData } from '@axonivy/ui-components';
import { useCallback, useMemo } from 'react';
import { hasChildren } from '../../../utils/tree/tree-data';
import type { Variable } from '../data/variable';

export const useValidateAddVariable = (name: string, namespace: string, variables: Array<Variable>) => {
  const variablesOfNamespace = useCallback((namespace: string, variables: Array<Variable>) => {
    const keyParts = namespace.split('.');
    let currentVariables = variables;
    for (const [index, keyPart] of keyParts.entries()) {
      if (keyPart === '') {
        return currentVariables;
      }
      const nextVariable = currentVariables.find(variable => variable.name === keyPart);
      if (nextVariable === undefined) {
        return [];
      }
      if (!hasChildren(nextVariable)) {
        throw new Error(`Namespace '${keyParts.slice(0, index + 1).join('.')}' is not a folder, you cannot add a child to it.`);
      }
      currentVariables = nextVariable.children;
    }
    return currentVariables;
  }, []);

  const nameValidationMessage = useMemo<MessageData | undefined>(() => {
    if (name.trim() === '') {
      return toErrorMessage('Name cannot be empty.');
    }
    if (name.includes('.')) {
      return toErrorMessage("Character '.' is not allowed.");
    }
    let takenNames: Array<string> = [];
    try {
      takenNames = variablesOfNamespace(namespace, variables).map(variable => variable.name);
    } catch {
      // handled by validateNamespace
    }
    if (takenNames.includes(name)) {
      return toErrorMessage('Name is already present in this Namespace.');
    }
    return;
  }, [name, variablesOfNamespace, namespace, variables]);

  const namespaceValidationMessage = useMemo<MessageData | undefined>(() => {
    try {
      variablesOfNamespace(namespace, variables);
    } catch (e) {
      if (e instanceof Error) {
        return toErrorMessage(e.message);
      }
    }
    return;
  }, [namespace, variablesOfNamespace, variables]);

  return { nameValidationMessage, namespaceValidationMessage };
};

const toErrorMessage = (message: string): MessageData => ({ message: message, variant: 'error' });
