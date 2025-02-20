import { webSocketConnection, type Connection } from '@axonivy/jsonrpc';
import { Flex, HotkeysProvider, ReadonlyProvider, Spinner, ThemeProvider, toast, Toaster } from '@axonivy/ui-components';
import { VariableEditor, VariablesClient } from '@axonivy/variable-editor';
import { ClientContextProvider, initQueryClient, QueryProvider } from '@axonivy/variable-editor-protocol';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { appParam, directSaveParam, pmvParam, readonlyParam, themeParam, webSocketBaseParam } from './url-helper';

export async function start(): Promise<void> {
  const server = webSocketBaseParam();
  const app = appParam();
  const pmv = pmvParam();
  const theme = themeParam();
  const readonly = readonlyParam();
  const directSave = directSaveParam();
  const queryClient = initQueryClient();
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('rootElement not found');
  }
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <Flex style={{ height: '100%' }} justifyContent='center' alignItems='center'>
          <Spinner size='large' />
        </Flex>
        <Toaster closeButton={true} position='bottom-left' />
      </ThemeProvider>
    </React.StrictMode>
  );

  const initialize = async (connection: Connection) => {
    const client = await VariablesClient.startClient(connection, VariablesClient);
    root.render(
      <React.StrictMode>
        <ThemeProvider defaultTheme={theme}>
          <ClientContextProvider client={client}>
            <QueryProvider client={queryClient}>
              <ReadonlyProvider readonly={readonly}>
                <HotkeysProvider initiallyActiveScopes={['global']}>
                  <VariableEditor context={{ app, pmv, file: 'config/variables.yaml' }} directSave={directSave} />
                </HotkeysProvider>
              </ReadonlyProvider>
            </QueryProvider>
          </ClientContextProvider>
          <Toaster closeButton={true} position='bottom-left' />
        </ThemeProvider>
      </React.StrictMode>
    );
    return client;
  };

  const reconnect = async (connection: Connection, oldClient: VariablesClient) => {
    await oldClient.stop();
    return initialize(connection);
  };

  webSocketConnection<VariablesClient>(VariablesClient.webSocketUrl(server)).listen({
    onConnection: initialize,
    onReconnect: reconnect,
    logger: { log: console.log, info: toast.info, warn: toast.warning, error: toast.error }
  });
}

start();
