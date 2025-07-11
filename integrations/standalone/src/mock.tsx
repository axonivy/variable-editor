import { HotkeysProvider, ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import { ClientContextProvider, QueryProvider, VariableEditor, initQueryClient } from '@axonivy/variable-editor';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { VariablesClientMock } from './mock/variables-client-mock';
import { parameter, readonlyParam } from './url-helper';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('rootElement not found');
}
const root = ReactDOM.createRoot(rootElement);
const client = new VariablesClientMock(parameter('virtualize') === 'true');
const readonly = readonlyParam();
const queryClient = initQueryClient();
initTranslation();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryProvider client={queryClient}>
          <ReadonlyProvider readonly={readonly}>
            <HotkeysProvider initiallyActiveScopes={['global']}>
              <VariableEditor context={{ app: '', pmv: 'project-name', file: '' }} />
            </HotkeysProvider>
          </ReadonlyProvider>
        </QueryProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
