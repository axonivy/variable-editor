import {
  Button,
  Flex,
  PanelMessage,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  SidebarHeader,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHistoryData,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  useClient,
  type VariablesData,
  type VariablesEditorDataContext,
  type VariablesValidationResult
} from '@axonivy/variable-editor-protocol';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import type { RootVariable, Variable } from './components/variables/data/variable';
import { toContent, toVariables } from './components/variables/data/variable-utils';
import { VariablesDetailContent } from './components/variables/detail/DetailContent';
import { VariablesMasterContent } from './components/variables/master/VariablesMasterContent';
import { VariablesMasterToolbar } from './components/variables/master/VariablesMasterToolbar';
import { AppProvider } from './context/AppContext';
import { useAction } from './context/useAction';
import { useKnownHotkeys } from './utils/hotkeys';
import type { Unary } from './utils/lambda/lambda';
import { getNode } from './utils/tree/tree-data';
import type { TreePath } from './utils/tree/types';
import './VariablesEditor.css';

type VariableEditorProps = {
  context: VariablesEditorDataContext;
  directSave?: boolean;
};

function VariableEditor(props: VariableEditorProps) {
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
      data: (context: VariablesEditorDataContext) => ['variables/data', context],
      saveData: (context: VariablesEditorDataContext) => ['variables/saveData', context],
      validate: (context: VariablesEditorDataContext) => ['variables/validate', context]
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
      return Promise.resolve([]);
    },
    onSuccess: (data: Array<VariablesValidationResult>) => queryClient.setQueryData(queryKeys.validate(context), data)
  });

  const openUrl = useAction('openUrl');
  const { openHelp: helpText } = useKnownHotkeys();
  useHotkeys(helpText.hotkey, () => openUrl(data?.helpUrl), { scopes: ['global'] });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={`An error has occurred: ${error.message}`} />;
  }

  const title = `Variables - ${context.pmv}`;
  let detailTitle = title;
  const variable = getNode(data.root.children, selectedVariable);
  if (variable) {
    detailTitle += ' - ' + variable.name;
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
            <VariablesMasterToolbar title={title} />
            <VariablesMasterContent />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10}>
              <Flex direction='column' className='variables-editor-panel-content variables-editor-detail-panel'>
                <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} className='variables-editor-detail-header' tabIndex={-1}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button icon={IvyIcons.Help} onClick={() => openUrl(data.helpUrl)} aria-label={helpText.label} />
                      </TooltipTrigger>
                      <TooltipContent className='variables-editor-help-tooltip-content'>{helpText.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarHeader>
                <VariablesDetailContent />
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default VariableEditor;
