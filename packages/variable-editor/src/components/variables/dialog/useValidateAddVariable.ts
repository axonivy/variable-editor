import type { MessageData } from '@axonivy/ui-components';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { hasChildren } from '../../../utils/tree/tree-data';
import type { Variable } from '../data/variable';

export const useValidateAddVariable = (name: string, namespace: string, variables: Array<Variable>) => {
  const { t } = useTranslation();

  const variablesOfNamespace = useCallback(
    (namespace: string, variables: Array<Variable>) => {
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
          throw new Error(t('message.namespaceIsNotFolder', { variable: keyParts.slice(0, index + 1).join('.') }));
        }
        currentVariables = nextVariable.children;
      }
      return currentVariables;
    },
    [t]
  );

  const nameValidationMessage = useMemo<MessageData | undefined>(() => {
    if (name.trim() === '') {
      return toErrorMessage(t('message.emptyName'));
    }
    if (name.includes('.')) {
      return toErrorMessage(t('message.notAllowedChar'));
    }
    let takenNames: Array<string> = [];
    try {
      takenNames = variablesOfNamespace(namespace, variables).map(variable => variable.name);
    } catch {
      // handled by validateNamespace
    }
    if (takenNames.includes(name)) {
      return toErrorMessage(t('message.variableAlreadyExists'));
    }
    return;
  }, [name, t, variablesOfNamespace, namespace, variables]);

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
