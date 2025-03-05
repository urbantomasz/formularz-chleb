import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin + '/auth-callback',
  clientId: '343060699496-jjh4qrfv58g6ddkncqv75ssdm4r7u0ut.apps.googleusercontent.com',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
  sessionChecksEnabled: true, // ✅ Synchronizacja sesji Google
  showDebugInformation: true, // ✅ Debugowanie logowania
  useSilentRefresh: true,
};
