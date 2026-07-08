export const environment = {
  production: false,
  apiUrl: 'http://localhost:5287/api',
  facebookAppId: '1440151514798843',
  facebookApiVersion: 'v25.0',
  whatsAppEmbeddedSignupConfigId: '1019962214247615'
};
// Served at https://waslx-dev.com:4300 (see angular.json "serve.host") — Meta rejects a bare
// "localhost" App Domain / JS SDK domain, so local WhatsApp Embedded Signup testing uses this
// hosts-file-mapped domain instead. Update App:FrontendBaseUrl on the backend to match.
