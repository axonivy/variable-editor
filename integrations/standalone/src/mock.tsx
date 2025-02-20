import type { MessageConnection } from '@axonivy/jsonrpc';
import { HotkeysProvider, ThemeProvider } from '@axonivy/ui-components';
import { VariableEditor } from '@axonivy/variable-editor';
import { ClientContextProvider, initQueryClient, QueryProvider } from '@axonivy/variable-editor-protocol';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { VariablesClientMock } from './mock/variables-client-mock';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('rootElement not found');
}
const root = ReactDOM.createRoot(rootElement);
const client = new VariablesClientMock({} as MessageConnection);
const queryClient = initQueryClient();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryProvider client={queryClient}>
          <HotkeysProvider initiallyActiveScopes={['global']}>
            <VariableEditor context={{ app: '', pmv: 'project-name', file: '' }} />
          </HotkeysProvider>
        </QueryProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
