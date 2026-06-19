import type { RootVariable } from '../variable';

export const contentMixed = `Variables:
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
    #   org.glassfish.jersey.apache5.connector.Apache5ConnectorProvider
    connectorProvider: org.glassfish.jersey.client.HttpUrlConnectorProvider
`;

export const rootVariableMixed: RootVariable = {
  name: 'Variables',
  value: '',
  description: '',
  commentAfter: '',
  metadata: { type: '' },
  children: [
    {
      name: 'microsoft-connector',
      value: '',
      description: '',
      metadata: { type: '' },
      children: [
        {
          name: 'appId',
          value: 'MyAppId',
          description: 'Your Azure Application (client) ID',
          metadata: { type: '' },
          children: []
        },
        {
          name: 'secretKey',
          value: 'MySecretKey',
          description: 'Secret key from your applications "certificates & secrets"',
          metadata: { type: 'password' },
          children: []
        },
        {
          name: 'useAppPermissions',
          value: 'false',
          description:
            "work with app permissions rather than in delegate of a user\nset to 'true' if no user consent should be accuired and adjust the 'tenantId' below.",
          metadata: { type: '' },
          children: []
        },
        {
          name: 'tenantId',
          value: 'common',
          description:
            "tenant to use for OAUTH2 request.\nthe default 'common' fits for user delegate requests.\nset the Azure Directory (tenant) ID, for application requests.",
          metadata: { type: '' },
          children: []
        },
        {
          name: 'useUserPassFlow',
          value: '',
          description:
            'use a static user+password authentication to work in the name of technical user.\nmost insecure but valid, if you must work with user permissions, while no real user is able to consent the action.',
          metadata: { type: '' },
          children: [
            {
              name: 'enabled',
              value: 'false',
              description: '',
              metadata: { type: '' },
              children: []
            },
            {
              name: 'user',
              value: 'MyUser',
              description: 'technical user to login',
              metadata: { type: '' },
              children: []
            },
            {
              name: 'pass',
              value: 'MyPass',
              description: 'technical users password',
              metadata: { type: 'password' },
              children: []
            }
          ]
        },
        {
          name: 'permissions',
          value: 'user.read Calendars.ReadWrite mail.readWrite mail.send Tasks.ReadWrite Chat.Read offline_access',
          description:
            'permissions to request access to.\nyou may exclude or add some, as your azure administrator allows or restricts them.\nfor sharepoint-demos, the following must be added: Sites.Read.All Files.ReadWrite',
          metadata: { type: '' },
          children: []
        },
        {
          name: 'connectorProvider',
          value: 'org.glassfish.jersey.client.HttpUrlConnectorProvider',
          description:
            'this property specifies the library used to create and manage HTTP connections for Jersey client. \nit sets the connection provider class for the Jersey client.\nwhile the default provider works well for most methods, if you specifically need to use the PATCH method, consider switching the provider to:\n  org.glassfish.jersey.apache5.connector.Apache5ConnectorProvider',
          metadata: { type: '' },
          children: []
        }
      ]
    }
  ]
};
