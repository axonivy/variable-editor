import type { ValidationMessages, VariablesData } from '@axonivy/variable-editor-protocol';

export const variables: VariablesData = {
  context: { app: '', pmv: '', file: '' },
  data: `Variables:
  MicrosoftConnector:
    # Your Azure Application (client) ID
    AppId: MyAppId
    # Secret key from your applications "certificates & secrets"
    # [password]
    SecretKey: MySecretKey
    # Work with app permissions rather than in delegate of a user.
    # Set to 'true' if no user consent should be accuired and adjust the 'tenantId' below.
    UseAppPermissions: "false"
    # Tenant to use for OAUTH2 request.
    # The default 'common' fits for user delegate requests.
    # Set the Azure Directory (tenant) ID, for application requests.
    TenantId: common
    # Use a static user+password authentication to work in the name of technical user.
    # Most insecure but valid, if you must work with user permissions, while no real user is able to consent the action.
    UseUserPassFlow:
      Enabled: "false"
      # Technical user to login
      User: MyUser
      # Technical users password
      # [password]
      Pass: MyPass
    # Permissions to request access to.
    # You may exclude or add some, as your azure administrator allows or restricts them.
    # For sharepoint-demos, the following must be added: Sites.Read.All Files.ReadWrite
    Permissions: user.read Calendars.ReadWrite mail.readWrite mail.send Tasks.ReadWrite Chat.Read offline_access
    # This property specifies the library used to create and manage HTTP connections for Jersey client. 
    # It sets the connection provider class for the Jersey client.
    # While the default provider works well for most methods, if you specifically need to use the PATCH method, consider switching the provider to:
    #   org.glassfish.jersey.apache.connector.ApacheConnectorProvider
    ConnectorProvider: org.glassfish.jersey.client.HttpUrlConnectorProvider
  `,
  helpUrl: 'https://dev.axonivy.com'
};

export const virtualizedVariables = `
  more-variables:
    a1: 1
    a2: 2
    a3: 3
    a4: 4
    a5: 5
    a6: 6
    a7: 7
    a8: 8
    a9: 9
    a10: 10
    a11: 11
    a12: 12
    a13: 13
    a14: 14
    a15: 15
    a16: 16
    a17: 17
    a18: 18
    a19: 19
    a20: 20
    a21: 21
    a22: 22
    a23: 23
    a24: 24
    a25: 25
    a26: 26
    a27: 27
    a28: 28
    a29: 29
    a30: 30
    a31: 31
    a32: 32
    a33: 33
    a34: 34
    a35: 35
    a36: 36
    a37: 37
    a38: 38
    a39: 39
    a40: 40
    a41: 41
    a42: 42
    a43: 43
    a44: 44
    a45: 45
    a46: 46
    a47: 47
    a48: 48
    a49: 49
    a50: 50
`;

export const validations: ValidationMessages = [
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
