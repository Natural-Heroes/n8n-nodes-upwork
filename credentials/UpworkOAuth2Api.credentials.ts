import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class UpworkOAuth2Api implements ICredentialType {
  name = 'upworkOAuth2Api';
  extends = ['oAuth2Api'];
  displayName = 'Upwork OAuth2 API';
  documentationUrl = 'https://www.upwork.com/developer/documentation/graphql/api/docs/index.html';

  properties: INodeProperties[] = [
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: 'https://www.upwork.com/ab/account-security/oauth2/authorize',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: 'https://www.upwork.com/api/v3/oauth2/token',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
    },
    {
      displayName: 'Organization ID',
      name: 'organizationId',
      type: 'string',
      default: '',
      required: true,
      description:
        'The Organization ID (Tenant ID) for your Upwork organization. This is required for API requests.',
      placeholder: 'e.g., 1234567890',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-Upwork-API-TenantId': '={{$credentials.organizationId}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.upwork.com/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{ __typename }',
      }),
    },
  };
}


