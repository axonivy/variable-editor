import type { useHistoryData } from '@axonivy/ui-components';
import type { Client, ValidationMessages, VariablesEditorDataContext } from '@axonivy/variable-editor-protocol';
import type { RenderHookOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import i18n from 'i18next';
import { type ReactNode } from 'react';
import { initReactI18next } from 'react-i18next';
import { AppProvider } from '../../../../context/AppContext';
import { ClientContextProvider } from '../../../../protocol/ClientContextProvider';
import { QueryProvider } from '../../../../query/QueryProvider';
import { initQueryClient } from '../../../../query/query-client';
import enTrans from '../../../../translation/variable-editor/en.json';
import type { TreePath } from '../../../../utils/tree/types';
import type { Variable } from '../variable';

type ContextHelperProps = {
  client?: Partial<Client>;
  appContext?: {
    context?: VariablesEditorDataContext;
    variables?: Array<Variable>;
    selectedVariable?: TreePath;
    validations?: ValidationMessages;
  };
};

const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['variable-editor'],
    defaultNS: 'variable-editor',
    resources: { en: { 'variable-editor': enTrans } }
  });
};

const ContextHelper = (props: ContextHelperProps & { children: ReactNode }) => {
  const client = (props.client ?? new EmptyClient()) as Client;
  const appContext = {
    context: props.appContext?.context ?? ({} as VariablesEditorDataContext),
    variables: props.appContext?.variables ?? [],
    setVariables: () => {},
    selectedVariable: props.appContext?.selectedVariable ?? [],
    setSelectedVariable: () => {},
    validations: props.appContext?.validations ?? [],
    detail: true,
    setDetail: () => {},
    history: {} as ReturnType<typeof useHistoryData<Array<Variable>>>
  };

  initTranslation();

  return (
    <ClientContextProvider client={client}>
      <QueryProvider client={initQueryClient()}>
        <AppProvider value={appContext}>{props.children}</AppProvider>
      </QueryProvider>
    </ClientContextProvider>
  );
};

export const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { wrapperProps: ContextHelperProps }
) => {
  return renderHook(render, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class EmptyClient implements Partial<Client> {}
