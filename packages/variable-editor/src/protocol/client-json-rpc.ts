import {
  BaseRpcClient,
  Emitter,
  createMessageConnection,
  urlBuilder,
  type Connection,
  type Disposable,
  type MessageConnection
} from '@axonivy/jsonrpc';
import type {
  Client,
  EditorFileContent,
  Event,
  MetaRequestTypes,
  NotificationTypes,
  OnNotificationTypes,
  RequestTypes,
  ValidationMessages,
  VariablesActionArgs,
  VariablesData,
  VariablesEditorDataContext
} from '@axonivy/variable-editor-protocol';

export class ClientJsonRpc extends BaseRpcClient implements Client {
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged: Event<void> = this.onDataChangedEmitter.event;
  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
    this.onNotification('dataChanged', data => this.onDataChangedEmitter.fire(data));
  }

  data(context: VariablesEditorDataContext): Promise<VariablesData> {
    return this.sendRequest('data', context);
  }

  saveData(saveData: VariablesData): Promise<EditorFileContent> {
    return this.sendRequest('saveData', saveData);
  }

  validate(context: VariablesEditorDataContext): Promise<ValidationMessages> {
    return this.sendRequest('validate', context);
  }

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  action(action: VariablesActionArgs): void {
    this.sendNotification('action', action);
  }

  sendRequest<K extends keyof RequestTypes>(command: K, args: RequestTypes[K][0]): Promise<RequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  sendNotification<K extends keyof NotificationTypes>(command: K, args: NotificationTypes[K]): Promise<void> {
    return this.connection.sendNotification(command, args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNotification<K extends keyof OnNotificationTypes>(kind: K, listener: (args: OnNotificationTypes[K]) => any): Disposable {
    return this.connection.onNotification(kind, listener);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-variables-lsp');
  }

  public static async startClient(connection: Connection): Promise<ClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<ClientJsonRpc> {
    const client = new ClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
