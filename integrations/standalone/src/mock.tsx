import { HotkeysProvider, ThemeProvider } from '@axonivy/ui-components';
import { ClientContextProvider, VariableEditor, initQueryClient } from '@axonivy/variable-editor';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { VariablesClientMock } from './mock/variables-client-mock';
import { parameter } from './url-helper';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('rootElement not found');
}
const root = ReactDOM.createRoot(rootElement);
const client = new VariablesClientMock(parameter('virtualize') === 'true');
const queryClient = initQueryClient();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <HotkeysProvider initiallyActiveScopes={['global']}>
            <VariableEditor context={{ app: '', pmv: 'project-name', file: '' }} />
          </HotkeysProvider>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
        </QueryClientProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
