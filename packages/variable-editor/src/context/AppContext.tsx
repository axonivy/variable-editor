import { createContext, useContext } from 'react';
import type { Variable } from '../components/variables/data/variable';
import type { VariablesEditorDataContext, VariablesValidationResult } from '@axonivy/variable-editor-protocol';
import type { TreePath } from '../utils/tree/types';
import type { UpdateConsumer } from '../utils/lambda/lambda';
import type { useHistoryData } from '@axonivy/ui-components';

type AppContext = {
  variables: Array<Variable>;
  setVariables: UpdateConsumer<Array<Variable>>;
  selectedVariable: TreePath;
  setSelectedVariable: (path: TreePath) => void;
  validations: Array<VariablesValidationResult>;
  context: VariablesEditorDataContext;
  detail: boolean;
  setDetail: (visible: boolean) => void;
  history: ReturnType<typeof useHistoryData<Array<Variable>>>;
};

const appContext = createContext<AppContext>({
  variables: [],
  setVariables: () => {},
  selectedVariable: [],
  setSelectedVariable: () => {},
  validations: [],
  context: { app: '', pmv: '', file: '' },
  detail: true,
  setDetail: () => {},
  history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false }
});

export const AppProvider = appContext.Provider;

export const useAppContext = (): AppContext & { setUnhistorisedVariables: UpdateConsumer<Array<Variable>> } => {
  const context = useContext(appContext);
  return {
    ...context,
    setVariables: updateVars => {
      context.setVariables(old => {
        const newData = updateVars(old);
        context.history.push(newData);
        return newData;
      });
    },
    setUnhistorisedVariables: context.setVariables
  };
};
