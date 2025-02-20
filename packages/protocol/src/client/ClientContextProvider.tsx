import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { ClientContext } from './types';
import type { ClientJsonRpc } from './client-json-rpc';

const ClientContextInstance = createContext<ClientContext | undefined>(undefined);

export const useClient = (): ClientJsonRpc => {
  const context = useContext(ClientContextInstance);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientContext');
  }
  return context.client;
};

export const ClientContextProvider = ({ client, children }: { client: ClientJsonRpc; children: ReactNode }) => {
  return <ClientContextInstance.Provider value={{ client }}>{children}</ClientContextInstance.Provider>;
};
