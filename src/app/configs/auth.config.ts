import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin + '/auth-callback',
  clientId: '343060699496-jjh4qrfv58g6ddkncqv75ssdm4r7u0ut.apps.googleusercontent.com',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
  useSilentRefresh: true,
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  timeoutFactor: 0.75, // np. odświeżenie 25% przed końcem
};
