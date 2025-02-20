import { BaseRpcClient, createMessageConnection, urlBuilder, type Connection, type MessageConnection } from '@axonivy/jsonrpc';
import type { ConfigEditorActionArgs } from '../editor';
import type {
  DataRequestTypes,
  MetaRequestTypes,
  NotificationTypes,
  RequestTypes,
  SaveDataRequestTypes,
  ValidateRequestTypes
} from './types';

export abstract class ClientJsonRpc extends BaseRpcClient {
  abstract data<K extends keyof DataRequestTypes>(context: DataRequestTypes[K][0]): Promise<DataRequestTypes[K][1]>;
  abstract saveData<K extends keyof SaveDataRequestTypes>(saveData: SaveDataRequestTypes[K][0]): Promise<SaveDataRequestTypes[K][1]>;
  abstract validate<K extends keyof ValidateRequestTypes>(context: ValidateRequestTypes[K][0]): Promise<ValidateRequestTypes[K][1]>;

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  sendRequest<K extends keyof RequestTypes>(command: K, args: RequestTypes[K][0]): Promise<RequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  action(action: ConfigEditorActionArgs): void {
    this.sendNotification('action', action);
  }

  sendNotification<K extends keyof NotificationTypes>(command: K, args: NotificationTypes[K]): Promise<void> {
    return this.connection.sendNotification(command, args);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-config-lsp');
  }

  public static async startClient<C extends ClientJsonRpc>(
    connection: Connection,
    ctor: new (connection: MessageConnection) => C
  ): Promise<ClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer), ctor);
  }

  public static async startMessageClient<C extends ClientJsonRpc>(
    connection: MessageConnection,
    ctor: new (connection: MessageConnection) => C
  ): Promise<ClientJsonRpc> {
    const client = new ctor(connection);
    await client.start();
    return client;
  }
}
