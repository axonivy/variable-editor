import type { VariablesEditorDataContext } from '@axonivy/variable-editor-protocol';
import { customRenderHook } from '../components/variables/data/test-utils/test-utils';
import { rootVariable } from '../components/variables/data/test-utils/variables';
import { useHeaderTitles } from './useHeaderTitles';

test('empty', () => {
  const { result } = customRenderHook(() => useHeaderTitles());
  expect(result.current.mainTitle).toEqual('Variables - ');
  expect(result.current.detailTitle).toEqual('Variables - ');
});

test('project', () => {
  const context = { pmv: 'test-project' } as VariablesEditorDataContext;
  const { result } = customRenderHook(() => useHeaderTitles(), { wrapperProps: { appContext: { context } } });
  expect(result.current.mainTitle).toEqual('Variables - test-project');
  expect(result.current.detailTitle).toEqual('Variables - test-project');
});

test('variable', () => {
  const { result } = customRenderHook(() => useHeaderTitles(), {
    wrapperProps: { appContext: { variables: rootVariable.children, selectedVariable: [1] } }
  });
  expect(result.current.mainTitle).toEqual('Variables - ');
  expect(result.current.detailTitle).toEqual('Variable - number');
});
