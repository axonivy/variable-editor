import type { VariablesData, VariablesValidationResult } from '@axonivy/variable-editor-protocol';

export const variables: VariablesData = {
  context: { app: '', pmv: '', file: '' },
  data: `Variables:
  microsoft-connector:
    # Your Azure Application (client) ID
    appId: MyAppId
    # Secret key from your applications "certificates & secrets"
    # [password]
    secretKey: MySecretKey
    # work with app permissions rather than in delegate of a user
    # set to 'true' if no user consent should be accuired and adjust the 'tenantId' below.
    useAppPermissions: "false"
    # tenant to use for OAUTH2 request.
    # the default 'common' fits for user delegate requests.
    # set the Azure Directory (tenant) ID, for application requests.
    tenantId: common
    # use a static user+password authentication to work in the name of technical user.
    # most insecure but valid, if you must work with user permissions, while no real user is able to consent the action.
    useUserPassFlow:
      enabled: "false"
      # technical user to login
      user: MyUser
      # technical users password
      # [password]
      pass: MyPass
    # permissions to request access to.
    # you may exclude or add some, as your azure administrator allows or restricts them.
    # for sharepoint-demos, the following must be added: Sites.Read.All Files.ReadWrite
    permissions: user.read Calendars.ReadWrite mail.readWrite mail.send
      Tasks.ReadWrite Chat.Read offline_access
    # this property specifies the library used to create and manage HTTP connections for Jersey client. 
    # it sets the connection provider class for the Jersey client.
    # while the default provider works well for most methods, if you specifically need to use the PATCH method, consider switching the provider to:
    #   org.glassfish.jersey.apache.connector.ApacheConnectorProvider
    connectorProvider: org.glassfish.jersey.client.HttpUrlConnectorProvider
  `,
  helpUrl: 'https://dev.axonivy.com'
};

export const validations: Array<VariablesValidationResult> = [
  {
    message: 'Invalid key',
    path: 'invalidKey',
    property: 'key',
    severity: 'WARNING'
  },
  {
    message: 'Invalid variable 0 key',
    path: 'invalidKey.invalidVariable0',
    property: 'key',
    severity: 'INFO'
  },
  {
    message: 'Invalid variable 0 value warning',
    path: 'invalidKey.invalidVariable0',
    property: 'value',
    severity: 'WARNING'
  },
  {
    message: 'Invalid variable 0 value error',
    path: 'invalidKey.invalidVariable0',
    property: 'value',
    severity: 'ERROR'
  },
  {
    message: 'Invalid variable 1 value',
    path: 'invalidKey.invalidVariable1',
    property: 'value',
    severity: 'INFO'
  }
];
