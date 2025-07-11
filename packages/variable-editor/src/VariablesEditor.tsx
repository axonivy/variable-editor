import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, Spinner, useHistoryData } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { EditorProps, VariablesData, VariablesEditorDataContext } from '@axonivy/variable-editor-protocol';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RootVariable, Variable } from './components/variables/data/variable';
import { toContent, toVariables } from './components/variables/data/variable-utils';
import { Detail } from './components/variables/detail/Detail';
import { VariablesMasterContent } from './components/variables/master/VariablesMasterContent';
import { VariablesMasterToolbar } from './components/variables/master/VariablesMasterToolbar';
import { AppProvider } from './context/AppContext';
import { useClient } from './protocol/ClientContextProvider';
import { genQueryKey } from './query/query-client';
import type { Unary } from './utils/lambda/lambda';
import type { TreePath } from './utils/tree/types';
import './VariablesEditor.css';

function VariableEditor(props: EditorProps) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState(true);
  const [context, setContext] = useState(props.context);
  const [directSave, setDirectSave] = useState(props.directSave);
  useEffect(() => {
    setContext(props.context);
    setDirectSave(props.directSave);
  }, [props]);
  const [selectedVariable, setSelectedVariable] = useState<TreePath>([]);
  const history = useHistoryData<Array<Variable>>();

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(
    () => ({
      data: (context: VariablesEditorDataContext) => genQueryKey('data', context),
      saveData: (context: VariablesEditorDataContext) => genQueryKey('saveData', context),
      validate: (context: VariablesEditorDataContext) => genQueryKey('validate', context)
    }),
    []
  );

  const { data, isPending, isError, isSuccess, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: async () => {
      const content = await client.data(context);
      const root = toVariables(content.data);
      history.push(root.children);
      return { ...content, root };
    },
    structuralSharing: false
  });

  const validations = useQuery({
    queryKey: queryKeys.validate(context),
    queryFn: async () => await client.validate(context),
    initialData: [],
    enabled: isSuccess
  }).data;

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(context),
    mutationFn: async (updateData: Unary<Array<Variable>>) => {
      const saveData = queryClient.setQueryData<VariablesData & { root: RootVariable }>(queryKeys.data(context), prevData => {
        if (prevData) {
          prevData.root.children = updateData(prevData.root.children);
          return prevData;
        }
        return;
      });
      if (saveData) {
        return await client.saveData({ context, data: toContent(saveData.root), directSave });
      }
      return Promise.resolve();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.validate(context) })
  });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('common.message.errorOccured', { message: error.message })} />;
  }

  return (
    <AppProvider
      value={{
        variables: data.root.children,
        setVariables: mutation.mutate,
        selectedVariable,
        setSelectedVariable,
        validations,
        context,
        detail,
        setDetail,
        history
      }}
    >
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={75} minSize={50} className='variables-editor-main-panel'>
          <Flex className='variables-editor-panel-content' direction='column'>
            <VariablesMasterToolbar />
            <VariablesMasterContent />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10}>
              <Detail helpUrl={data.helpUrl} />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default VariableEditor;
